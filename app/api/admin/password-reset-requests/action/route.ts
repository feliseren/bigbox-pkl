import { NextResponse } from "next/server";
import {
  approvePasswordResetRequest,
  rejectPasswordResetRequest,
} from "@/lib/password-reset-requests";
import { readCurrentEmployee } from "@/lib/employee-session";
import { normalizeEmployeeRole } from "@/lib/employee-role";

export async function POST(request: Request) {
  const employee = await readCurrentEmployee();
  const roleName = normalizeEmployeeRole(employee?.role);

  if (!employee || roleName !== "admin") {
    return NextResponse.redirect(
      new URL("/dashboard_karyawan?error=forbidden", request.url),
    );
  }

  const formData = await request.formData();
  const requestId = String(formData.get("requestId") || "").trim();
  const actionType = String(formData.get("actionType") || "").trim();

  if (!requestId || (actionType !== "approve" && actionType !== "reject")) {
    return NextResponse.redirect(
      new URL("/dashboard_karyawan/kelola-akun", request.url),
    );
  }

  if (actionType === "approve") {
    await approvePasswordResetRequest(requestId, employee.id);
  } else {
    await rejectPasswordResetRequest(requestId, employee.id);
  }

  return NextResponse.redirect(
    new URL("/dashboard_karyawan/kelola-akun", request.url),
  );
}
