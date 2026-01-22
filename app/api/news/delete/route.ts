import { NextResponse } from "next/server";
import { deleteNews } from "@/lib/news-db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const id = String(formData.get("newsId") || "").trim();
  const redirectTo = String(
    formData.get("redirect") || "/dashboard_karyawan/daftar-berita",
  );

  if (!id) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 303);
  }

  await deleteNews(id);

  return NextResponse.redirect(new URL(redirectTo, request.url), 303);
}
