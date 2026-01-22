"use client";

import { useEffect } from "react";

type NewsViewTrackerProps = {
  newsId: string;
};

export default function NewsViewTracker({ newsId }: NewsViewTrackerProps) {
  useEffect(() => {
    if (!newsId) return;
    const key = `news-viewed:${newsId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch("/api/news/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newsId }),
    }).catch((error) => {
      console.error("Failed to track view:", error);
    });
  }, [newsId]);

  return null;
}
