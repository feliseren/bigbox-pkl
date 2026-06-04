import { readEmployeeSessionId } from "@/lib/auth";
import { normalizeEmployeeRole } from "@/lib/employee-role";
import { prisma } from "@/lib/prisma";

export async function readCurrentEmployee() {
  const employeeId = await readEmployeeSessionId();
  if (!employeeId) return null;
  return prisma.employee.findUnique({ where: { id: employeeId } });
}

export async function isCurrentEmployeeAdmin() {
  const employee = await readCurrentEmployee();
  return normalizeEmployeeRole(employee?.role) === "admin";
}
