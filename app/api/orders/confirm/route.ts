import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";
import { toAppUrl } from "@/lib/app-url";
import { normalizeEmployeeRole } from "@/lib/employee-role";

export async function POST(request: Request) {
  const formData = await request.formData();
  const orderId = String(formData.get("orderId") || "").trim();
  const employeeId = await readEmployeeSessionId();

  if (!employeeId) {
    return NextResponse.redirect(toAppUrl("/login_karyawan", request.url));
  }

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId }, select: { role: true },
  });
  const roleName = normalizeEmployeeRole(employee?.role);
  if (!employee || roleName !== "admin") {
    return NextResponse.redirect(
      toAppUrl("/dashboard_karyawan/daftar-pemesanan?error=forbidden", request.url),
    );
  }

  if (!orderId) {
    return NextResponse.redirect(
      toAppUrl("/dashboard_karyawan/daftar-pemesanan?error=1", request.url),
    );
  }

  const confirmResult = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.updateMany({
      where: {
        id: orderId,
        statusPesanan: { not: "Done" },
      },
      data: { statusPesanan: "Done" },
    });

    if (updatedOrder.count === 0) {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: { id: true },
      });

      return order ? "already-confirmed" : "not-found";
    }

    await tx.payment.updateMany({
      where: { orderId },
      data: {
        confirmedBy: employeeId,
        confirmedAt: new Date(),
        statusPembayaran: "Confirmed",
      },
    });

    return "confirmed";
  });

  if (confirmResult === "not-found") {
    return NextResponse.redirect(
      toAppUrl("/dashboard_karyawan/daftar-pemesanan?error=1", request.url),
    );
  }

  if (confirmResult === "already-confirmed") {
    return NextResponse.redirect(
      toAppUrl("/dashboard_karyawan/daftar-pemesanan?error=confirmed", request.url),
    );
  }

  return NextResponse.redirect(
    toAppUrl("/dashboard_karyawan/daftar-pemesanan", request.url),
  );
}
