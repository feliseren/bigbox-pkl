"use client";

import { useEffect, useState } from "react";

type NewsReviewIndicatorProps = {
  newsId: string;
  reviewHref: string;
  reviewCount: number;
  latestReviewId: string | null;
};

const STORAGE_KEY = "bb_read_news_reviews";

function readStoredReviews() {
  if (typeof window === "undefined") {
    return {} as Record<string, string>;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] =>
          typeof entry[0] === "string" && typeof entry[1] === "string",
      ),
    );
  } catch {
    return {};
  }
}

function hasReadLatestReview(newsId: string, latestReviewId: string | null) {
  if (!latestReviewId) return true;
  const storedReviews = readStoredReviews();
  return storedReviews[newsId] === latestReviewId;
}

export function NewsReviewIndicator({
  newsId,
  reviewHref,
  reviewCount,
  latestReviewId,
}: NewsReviewIndicatorProps) {
  const [hasRead, setHasRead] = useState(() =>
    hasReadLatestReview(newsId, latestReviewId),
  );

  useEffect(() => {
    setHasRead(hasReadLatestReview(newsId, latestReviewId));
  }, [newsId, latestReviewId]);

  const unreadCount = hasRead ? 0 : reviewCount;

  function handleClick() {
    if (!latestReviewId) return;
    const storedReviews = readStoredReviews();
    storedReviews[newsId] = latestReviewId;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedReviews));
    } catch {
      return;
    }
    setHasRead(true);
  }

  return (
    <>
      <span className="news-stat">
        <span className="news-stat-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              d="M4 6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H9l-5 4v-4a4 4 0 0 1-4-4V6Z"
              fill="currentColor"
            />
          </svg>
        </span>
        {unreadCount}
      </span>
      <a className="news-review-btn" href={reviewHref} onClick={handleClick}>
        Lihat Review
      </a>
    </>
  );
}
