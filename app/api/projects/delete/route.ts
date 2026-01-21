import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  const projectId = String(formData.get("projectId") || "").trim();

  if (!projectId) {
    return NextResponse.redirect(
      new URL("/dashboard_karyawan/daftar-projek?error=1", request.url),
    );
  }

  await prisma.project.delete({ where: { id: projectId } });

  return NextResponse.redirect(new URL("/dashboard_karyawan/daftar-projek", request.url));
}
