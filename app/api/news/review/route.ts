import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionUserId } from "@/lib/auth";
import { toAppUrl } from "@/lib/app-url";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const newsId = String(formData.get("newsId") || "").trim();
  const ratingValue = String(formData.get("rating") || "").trim();
  const comment = String(formData.get("comment") || "").trim();
  const redirectTo = String(
    formData.get("redirect") || `/cerita-kami/${newsId}`,
  );

  const userId = await readSessionUserId();
  if (!userId) {
    return NextResponse.redirect(
      toAppUrl(`/login?redirect=${encodeURIComponent(redirectTo)}`, request.url),
      303,
    );
  }

  const parsedRating = Number(ratingValue);
  const ratingFromInput =
    Number.isInteger(parsedRating) && parsedRating >= 1 && parsedRating <= 5
      ? parsedRating
      : parsedRating === 0
        ? 0
        : null;

  if (!newsId) {
    return NextResponse.redirect(toAppUrl(redirectTo, request.url), 303);
  }

  if (!comment && ratingFromInput === null) {
    return NextResponse.redirect(toAppUrl(redirectTo, request.url), 303);
  }

  try {
    const existingNews = await prisma.newsStory.findFirst({
      where: { id: newsId, deletedAt: null },
      select: { id: true },
    });
    if (!existingNews) {
      return NextResponse.redirect(toAppUrl(redirectTo, request.url), 303);
    }
    const rating = ratingFromInput ?? 0;
    const safeComment = comment || "";

    if (safeComment) {
      await prisma.$transaction([
        prisma.newsReview.create({
          data: {
            newsStoryId: newsId,
            userId,
            rating,
            comment: safeComment,
            deletedAt: null,
          },
        }),
        prisma.newsStory.updateMany({
          where: { id: newsId, deletedAt: null },
          data: {
            commentCount: {
              increment: 1,
            },
          },
        }),
      ]);
    } else {
      const existingRatingOnly = await prisma.newsReview.findFirst({
        where: {
          newsStoryId: newsId,
          userId,
          comment: "",
          deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
      });
      if (existingRatingOnly) {
        await prisma.newsReview.update({
          where: { id: existingRatingOnly.id },
          data: { rating },
        });
      } else {
        await prisma.newsReview.create({
          data: {
            newsStoryId: newsId,
            userId,
            rating,
            comment: "",
            deletedAt: null,
          },
        });
      }
    }
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.redirect(
      toAppUrl(`${redirectTo}?review=error`, request.url),
      303,
    );
  }

  return NextResponse.redirect(
    toAppUrl(`${redirectTo}?review=success`, request.url),
    303,
  );
}
