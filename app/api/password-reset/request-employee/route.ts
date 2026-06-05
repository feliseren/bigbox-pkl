import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requestEmployeePasswordReset } from "@/lib/password-reset-requests";

export async function POST(request: Request) {
  const formData = await request.formData();
  const employeeId = String(formData.get("employeeId") || "").trim();

  if (!employeeId) {
    return NextResponse.redirect(
      new URL("/forgot-password-karyawan?error=1", request.url),
    );
  }

  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) {
    return NextResponse.redirect(
      new URL("/forgot-password-karyawan?error=1", request.url),
    );
  }

  const result = await requestEmployeePasswordReset(employee.id);
  if (result.kind === "issued") {
    return NextResponse.redirect(
      new URL(
        `/reset-password?token=${result.token}&type=employee&status=approved`,
        request.url,
      ),
    );
  }

  const status =
    result.kind === "pending"
      ? "pending"
      : result.kind === "requested_after_rejected"
        ? "rejected_requested"
        : "requested";
  return NextResponse.redirect(
    new URL(`/forgot-password-karyawan?status=${status}`, request.url),
  );
}
