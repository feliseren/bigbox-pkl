import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { toAppUrl } from "@/lib/app-url";
import { isCreatableEmployeeRoleId } from "@/lib/employee-create-role";
import { normalizeEmployeeRole } from "@/lib/employee-role";
import { readCurrentEmployee } from "@/lib/employee-session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const currentEmployee = await readCurrentEmployee();
  const roleName = normalizeEmployeeRole(currentEmployee?.role);

  if (!currentEmployee || roleName !== "admin") {
    return NextResponse.redirect(
      toAppUrl("/dashboard_karyawan?error=forbidden", request.url),
    );
  }

  const formData = await request.formData();
  const employeeId = String(formData.get("employeeId") || "").trim();
  const fullName = String(formData.get("fullName") || "").trim();
  const roleId = String(formData.get("roleId") || "").trim();

  if (!employeeId || !fullName || !roleId) {
    return NextResponse.redirect(
      toAppUrl("/dashboard_karyawan/kelola-akun?error=invalid_role", request.url),
    );
  }

  if (!isCreatableEmployeeRoleId(roleId)) {
    return NextResponse.redirect(
      toAppUrl("/dashboard_karyawan/kelola-akun?error=invalid_role", request.url),
    );
  }

  const [existingEmployee, role] = await Promise.all([
    prisma.employee.findUnique({ where: { id: employeeId } }),
    prisma.role.findUnique({ where: { id: roleId } }),
  ]);

  if (existingEmployee) {
    return NextResponse.redirect(
      toAppUrl("/dashboard_karyawan/kelola-akun?error=employee_exists", request.url),
    );
  }

  if (!role) {
    return NextResponse.redirect(
      toAppUrl("/dashboard_karyawan/kelola-akun?error=invalid_role", request.url),
    );
  }

  const hashedPassword = await hashPassword("test");
  await prisma.employee.create({
    data: {
      id: employeeId,
      fullName,
      role: role.id,
      password: hashedPassword,
      mustChangePassword: true,
    },
  });

  return NextResponse.redirect(
    toAppUrl("/dashboard_karyawan/kelola-akun?success=employee_created", request.url),
  );
}
