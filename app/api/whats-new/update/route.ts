import { NextResponse } from "next/server";
import { updateWhatsNew } from "@/lib/whats-new-db";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

export const runtime = "nodejs";

async function saveUpload(file: File | null, folder: string) {
  if (!file || !file.size) return null;
  const originalName = file.name || "file";
  const extFromName = path.extname(originalName).toLowerCase();
  const mime = file.type || "";
  const extFromMime =
    mime === "image/jpeg"
      ? ".jpg"
      : mime === "image/png"
        ? ".png"
        : mime === "image/webp"
          ? ".webp"
          : mime === "image/gif"
            ? ".gif"
            : "";
  const ext =
    extFromName && extFromName !== ".bin" ? extFromName : extFromMime;
  const safeBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "");
  const filename = `${safeBase || "file"}-${Date.now()}-${Math.floor(
    Math.random() * 10000,
  )}${ext || ".bin"}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), fileBuffer);
  return `/uploads/${folder}/${filename}`;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const contentText = String(formData.get("contentText") || "").trim();
  const publishDateRaw = String(formData.get("publishDate") || "").trim();
  const isHighlight = String(formData.get("isHighlight") || "").trim() === "1";
  const redirectTo = String(
    formData.get("redirect") || "/dashboard_karyawan/whats-new",
  );
  const imageFile = formData.get("image");

  const employeeId = await readEmployeeSessionId();
  if (!employeeId) {
    return NextResponse.redirect(new URL("/login_karyawan", request.url), 303);
  }
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { role: { select: { name: true } } },
  });
  const roleName = employee?.role.name.toLowerCase();
  if (!employee || roleName !== "marketing") {
    return NextResponse.redirect(
      new URL(`${redirectTo}?error=forbidden`, request.url),
      303,
    );
  }

  if (!id || !title || !category || !summary || !publishDateRaw) {
    return NextResponse.redirect(new URL(`${redirectTo}?error=1`, request.url), 303);
  }

  const publishDate = new Date(publishDateRaw);
  if (Number.isNaN(publishDate.getTime())) {
    return NextResponse.redirect(new URL(`${redirectTo}?error=1`, request.url), 303);
  }

  try {
    const imageUpload =
      imageFile && typeof imageFile !== "string" ? imageFile : null;
    const imageUrl = await saveUpload(imageUpload, "whats-new");
    const existing =
      imageUrl === null
        ? await prisma.whatsNew.findUnique({
            where: { id },
            select: { imageUrl: true },
          })
        : null;
    await updateWhatsNew({
      id,
      title,
      category,
      summary,
      contentText: contentText || null,
      imageUrl: imageUrl ?? existing?.imageUrl ?? null,
      isHighlight,
      publishDate,
    });
  } catch (error) {
    console.error("Failed to update whats new:", error);
    return NextResponse.redirect(
      new URL(`${redirectTo}?error=1`, request.url),
      303,
    );
  }

  return NextResponse.redirect(new URL(redirectTo, request.url), 303);
}

