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

  await prisma.order.update({
    where: { id: orderId },
    data: { statusPesanan: "Done" },
  });

  return NextResponse.redirect(
    toAppUrl("/dashboard_karyawan/daftar-pemesanan", request.url),
  );
}
