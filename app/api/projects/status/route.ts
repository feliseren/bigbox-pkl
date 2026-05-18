import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const projectId = String(body.projectId || "").trim();
  const status = String(body.status || "").trim();

  const employeeId = await readEmployeeSessionId();
  if (!employeeId) {
    return NextResponse.json({ ok: false }, { status: 401 });
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
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  if (!projectId || (status !== "Process" && status !== "Done")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { status },
  });

  return NextResponse.json({ ok: true });
}


