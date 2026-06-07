import { NextResponse } from "next/server";
import { readEmployeeSessionId } from "@/lib/auth";
import { createNews } from "@/lib/news-db";
import { toAppUrl } from "@/lib/app-url";
import { prisma } from "@/lib/prisma";
import { normalizeEmployeeRole } from "@/lib/employee-role";
import { saveUpload } from "@/lib/upload";
import pdfParse from "pdf-parse";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return NextResponse.redirect(
    toAppUrl("/dashboard_karyawan/daftar-berita", request.url),
    303,
  );
}

export async function POST(request: Request) {
  const formData = await request.formData();
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

  if (!title || !category) {
    return NextResponse.redirect(toAppUrl(redirectTo, request.url), 303);
  }

  try {
    const imageUpload =
      imageFile && typeof imageFile !== "string" ? imageFile : null;
    const documentUpload =
      documentFile && typeof documentFile !== "string" ? documentFile : null;
  const imageUrl = await saveUpload(imageUpload, "news-images", "image");
  let documentUrl: string | null = null;
  let contentText: string | null = manualContent || null;
  if (!contentText && documentUpload) {
    const docBuffer = Buffer.from(await documentUpload.arrayBuffer());
    documentUrl = await saveUpload(documentUpload, "news-docs", "pdf");
    try {
      const parsed = await pdfParse(docBuffer);
      contentText = parsed.text?.trim() || null;
    } catch (pdfError) {
      console.error("Failed to parse PDF text:", pdfError);
    }
  }

    const authorName = employeeId ? "Karyawan" : "Admin";

    await createNews({
      title,
      category,
      authorName,
      imageUrl,
      documentUrl,
      contentText,
      summaryPart1: summaryPart1 || null,
      summaryPart2: summaryPart2 || null,
      summaryPart3: summaryPart3 || null,
      customerName: customerName || null,
      customerIndustry: customerIndustry || null,
      customerSize: customerSize || null,
      customerLocation: customerLocation || null,
      customerProducts: customerProducts || null,
    });
  } catch (error) {
    console.error("Failed to create news story:", error);
    return NextResponse.redirect(
      toAppUrl(`${redirectTo}?error=1`, request.url),
      303,
    );
  }

  return NextResponse.redirect(toAppUrl(redirectTo, request.url), 303);
}
