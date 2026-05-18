import { NextResponse } from "next/server";
import { deleteNews } from "@/lib/news-db";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const id = String(formData.get("newsId") || "").trim();
  const redirectTo = String(
    formData.get("redirect") || "/dashboard_karyawan/daftar-berita",
  );

  const employeeId = await readEmployeeSessionId();
  if (!employeeId) {
    return NextResponse.redirect(new URL("/login_karyawan", request.url), 303);
  }
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { role: { select: { name: true } } },
  });
  const roleName = employee?.role.name.toLowerCase();
  if (
    !employee ||
    (roleName !== "project manager" && roleName !== "project_management")
  ) {
    return NextResponse.redirect(new URL(`${redirectTo}?error=forbidden`, request.url), 303);
  }

  if (!id) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 303);
  }

  await deleteNews(id);

  return NextResponse.redirect(new URL(redirectTo, request.url), 303);
}

