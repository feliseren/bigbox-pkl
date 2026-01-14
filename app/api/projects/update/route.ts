import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  const projectId = String(formData.get("projectId") || "").trim();
  const startLabel = String(formData.get("startLabel") || "").trim();
  const targetLabel = String(formData.get("targetLabel") || "").trim();
  const owner = String(formData.get("owner") || "").trim();
  const status = String(formData.get("status") || "").trim();

  if (!projectId || !startLabel || !targetLabel || !owner || !status) {
    return NextResponse.redirect(
      new URL("/dashboard_karyawan/daftar-projek?error=1", request.url),
    );
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      startLabel,
      targetLabel,
      owner,
      status,
    },
  });

  return NextResponse.redirect(new URL("/dashboard_karyawan/daftar-projek", request.url));
}
