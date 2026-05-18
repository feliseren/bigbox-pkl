import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const orderId = String(formData.get("orderId") || "").trim();
  const employeeId = await readEmployeeSessionId();

  if (!employeeId) {
    return NextResponse.redirect(new URL("/login_karyawan", request.url));
  }

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { role: { select: { name: true } } },
  });
  const roleName = employee?.role.name.toLowerCase();
  if (!employee || roleName !== "admin") {
    return NextResponse.redirect(
      new URL("/dashboard_karyawan/daftar-pemesanan?error=forbidden", request.url),
    );
  }

  if (!orderId) {
    return NextResponse.redirect(
      new URL("/dashboard_karyawan/daftar-pemesanan?error=1", request.url),
    );
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { statusPesanan: "Done" },
  });

  return NextResponse.redirect(
    new URL("/dashboard_karyawan/daftar-pemesanan", request.url),
  );
}
