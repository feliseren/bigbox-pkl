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

  const rating = Number(ratingValue);
  if (!newsId || !comment || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 303);
  }

  try {
    await prisma.$transaction([
      prisma.review.create({
        data: {
          newsStoryId: newsId,
          userId,
          rating,
          comment,
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
