import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: { newsId?: string } = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const newsId = String(payload.newsId || "").trim();
  if (!newsId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const existingNews = await prisma.newsStory.findFirst({
      where: { id: newsId, deletedAt: null },
      select: { id: true },
    });
    if (!existingNews) {
      return NextResponse.json({ ok: false }, { status: 404 });
    }
    await prisma.$transaction([
      prisma.newsView.create({
        data: {
          newsStoryId: newsId,
        },
      }),
      prisma.newsStory.update({
        where: { id: newsId },
        data: {
          viewCount: { increment: 1 },
        },
      }),
    ]);
  } catch (error) {
    console.error("Failed to increment view count:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
