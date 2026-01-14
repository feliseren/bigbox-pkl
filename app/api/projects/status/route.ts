import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const projectId = String(body.projectId || "").trim();
  const status = String(body.status || "").trim();

  if (!projectId || (status !== "Process" && status !== "Done")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { status },
  });

  return NextResponse.json({ ok: true });
}
