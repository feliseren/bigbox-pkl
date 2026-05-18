import { NextResponse } from "next/server";
import { findNewsById, updateNews } from "@/lib/news-db";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";
import pdfParse from "pdf-parse";
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
            : mime === "application/pdf"
              ? ".pdf"
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
  const id = String(formData.get("newsId") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const redirectTo = String(
    formData.get("redirect") || "/dashboard_karyawan/daftar-berita",
  );
  const summaryPart1 = String(formData.get("summaryPart1") || "").trim();
  const summaryPart2 = String(formData.get("summaryPart2") || "").trim();
  const summaryPart3 = String(formData.get("summaryPart3") || "").trim();
  const manualContent = String(formData.get("contentText") || "").trim();
  const customerName = String(formData.get("customerName") || "").trim();
  const customerIndustry = String(formData.get("customerIndustry") || "").trim();
  const customerSize = String(formData.get("customerSize") || "").trim();
  const customerLocation = String(formData.get("customerLocation") || "").trim();
  const customerProducts = String(formData.get("customerProducts") || "").trim();
  const imageFile = formData.get("image");
  const documentFile = formData.get("storyFile");

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

  if (!id || !title || !category) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 303);
  }

  const existing = await findNewsById(id);
  if (!existing) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 303);
  }

  const keepIfEmpty = (value: string, fallback?: string | null) =>
    value.trim() ? value : fallback ?? null;
  const imageUpload =
    imageFile && typeof imageFile !== "string" ? imageFile : null;
  const documentUpload =
    documentFile && typeof documentFile !== "string" ? documentFile : null;
  const imageUrl = await saveUpload(imageUpload, "news-images");
  let documentUrl: string | null = null;
  let contentText: string | null = manualContent || null;
  if (!contentText && documentUpload) {
    const docBuffer = Buffer.from(await documentUpload.arrayBuffer());
    documentUrl = await saveUpload(documentUpload, "news-docs");
    try {
      const parsed = await pdfParse(docBuffer);
      contentText = parsed.text?.trim() || null;
    } catch (pdfError) {
      console.error("Failed to parse PDF text:", pdfError);
    }
  }

  const result = await updateNews({
    id,
    title,
    category,
    imageUrl: imageUrl ?? existing.imageUrl,
    documentUrl: documentUrl ?? existing.documentUrl,
    contentText: contentText ?? existing.contentText,
    summaryPart1: keepIfEmpty(summaryPart1, existing.summaryPart1),
    summaryPart2: keepIfEmpty(summaryPart2, existing.summaryPart2),
    summaryPart3: keepIfEmpty(summaryPart3, existing.summaryPart3),
    customerName: keepIfEmpty(customerName, existing.customerName),
    customerIndustry: keepIfEmpty(customerIndustry, existing.customerIndustry),
    customerSize: keepIfEmpty(customerSize, existing.customerSize),
    customerLocation: keepIfEmpty(customerLocation, existing.customerLocation),
    customerProducts: keepIfEmpty(customerProducts, existing.customerProducts),
  });
  if (result.count === 0) {
    return NextResponse.redirect(new URL(`${redirectTo}?error=1`, request.url), 303);
  }

  return NextResponse.redirect(new URL(redirectTo, request.url), 303);
}

