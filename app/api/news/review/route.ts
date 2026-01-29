import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionUserId } from "@/lib/auth";

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
      new URL(`/login?redirect=${encodeURIComponent(redirectTo)}`, request.url),
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
    return NextResponse.redirect(new URL(redirectTo, request.url), 303);
  }

  if (!comment && ratingFromInput === null) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 303);
  }

  try {
    const rating = ratingFromInput ?? 0;
    const safeComment = comment || "";

    if (safeComment) {
      await prisma.$transaction([
        prisma.review.create({
          data: {
            newsStoryId: newsId,
            userId,
            rating,
            comment: safeComment,
          },
        }),
        prisma.newsStory.update({
          where: { id: newsId },
          data: {
            commentCount: {
              increment: 1,
            },
          },
        }),
      ]);
    } else {
      const existingRatingOnly = await prisma.review.findFirst({
        where: {
          newsStoryId: newsId,
          userId,
          comment: "",
        },
        orderBy: { createdAt: "desc" },
      });
      if (existingRatingOnly) {
        await prisma.review.update({
          where: { id: existingRatingOnly.id },
          data: { rating },
        });
      } else {
        await prisma.review.create({
          data: {
            newsStoryId: newsId,
            userId,
            rating,
            comment: "",
          },
        });
      }
    }
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.redirect(
      new URL(`${redirectTo}?review=error`, request.url),
      303,
    );
  }

  return NextResponse.redirect(
    new URL(`${redirectTo}?review=success`, request.url),
    303,
  );
}
