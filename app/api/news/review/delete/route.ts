import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionUserId } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const reviewId = String(formData.get("reviewId") || "").trim();
  const newsId = String(formData.get("newsId") || "").trim();
  const redirectTo = String(
    formData.get("redirect") || (newsId ? `/cerita-kami/${newsId}` : "/cerita-kami"),
  );

  const userId = await readSessionUserId();
  if (!userId) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(redirectTo)}`, request.url),
      303,
    );
  }

  if (!reviewId || !newsId) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 303);
  }

  const review = await prisma.review.findFirst({
    where: { id: reviewId, deletedAt: null },
    select: { userId: true, newsStoryId: true, comment: true },
  });
  if (!review || review.userId !== userId || review.newsStoryId !== newsId) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 303);
  }

  try {
    if (review.comment) {
      await prisma.$transaction([
        prisma.review.update({
          where: { id: reviewId },
          data: { deletedAt: new Date() },
        }),
        prisma.newsStory.updateMany({
          where: { id: newsId, deletedAt: null },
          data: { commentCount: { decrement: 1 } },
        }),
      ]);
    } else {
      await prisma.review.update({
        where: { id: reviewId },
        data: { deletedAt: new Date() },
      });
    }
  } catch (error) {
    console.error("Failed to delete review:", error);
    return NextResponse.redirect(
      new URL(`${redirectTo}?review=error`, request.url),
      303,
    );
  }

  return NextResponse.redirect(
    new URL(`${redirectTo}?review=deleted`, request.url),
    303,
  );
}
