import { NextResponse } from "next/server";
import { deleteNews } from "@/lib/news-db";
import { toAppUrl } from "@/lib/app-url";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";
import { normalizeEmployeeRole } from "@/lib/employee-role";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const id = String(formData.get("newsId") || "").trim();
  const redirectTo = String(
    formData.get("redirect") || "/dashboard_karyawan/daftar-berita",
  );

  const employeeId = await readEmployeeSessionId();
  if (!employeeId) {
    return NextResponse.redirect(toAppUrl("/login_karyawan", request.url), 303);
  }
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId }, select: { role: true },
  });
  const roleName = normalizeEmployeeRole(employee?.role);
  if (
    !employee ||
    (roleName !== "project manager" && roleName !== "project_management")
  ) {
    return NextResponse.redirect(toAppUrl(`${redirectTo}?error=forbidden`, request.url), 303);
  }

  if (!id) {
    return NextResponse.redirect(toAppUrl(redirectTo, request.url), 303);
  }

  await deleteNews(id);

  return NextResponse.redirect(toAppUrl(redirectTo, request.url), 303);
}

