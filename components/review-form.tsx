"use client";

import { useRef, useState } from "react";

type ReviewFormProps = {
  newsId: string;
  redirect: string;
  avatarLetter: string;
};

export default function ReviewForm({ newsId, redirect, avatarLetter }: ReviewFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const ratingInputRef = useRef<HTMLInputElement | null>(null);
  const commentRef = useRef<HTMLTextAreaElement | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSavingRating, setIsSavingRating] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [ratingOnlySaved, setRatingOnlySaved] = useState(false);
  const defaultRating = 0;

  const submitRating = async (value: number) => {
    if (!formRef.current || isSavingRating || isSubmittingComment || ratingOnlySaved) return;
    const commentValue = commentRef.current?.value?.trim() ?? "";
    setSelectedRating(value);
    if (commentValue) {
      return;
    }
    const formData = new FormData(formRef.current);
    formData.set("rating", String(value));
    setIsSavingRating(true);
    try {
      await fetch("/api/news/review", {
        method: "POST",
        body: formData,
      });
      setRatingOnlySaved(true);
    } finally {
      setIsSavingRating(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (isSubmittingComment) {
      event.preventDefault();
      return;
    }
    const ratingToSend = selectedRating ?? defaultRating;
    if (ratingInputRef.current) {
      ratingInputRef.current.value = String(ratingToSend);
    }
    setIsSubmittingComment(true);
  };

  const handleCommentInput = () => {
    if (ratingOnlySaved && (commentRef.current?.value?.trim() ?? "").length === 0) {
      return;
    }
    setRatingOnlySaved(false);
  };

  const activeRating = hoverRating ?? selectedRating ?? 0;

  return (
    <form
      ref={formRef}
      className="review-form"
      method="post"
      action="/api/news/review"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="newsId" value={newsId} />
      <input type="hidden" name="redirect" value={redirect} />
      <input
        ref={ratingInputRef}
        type="hidden"
        name="rating"
        value={selectedRating ?? defaultRating}
      />
      <div className="review-input-row">
        <span className="review-avatar">{avatarLetter}</span>
        <textarea
          ref={commentRef}
          name="comment"
          rows={2}
          placeholder="Tambahkan komentar..."
          onChange={handleCommentInput}
        />
      </div>
      <div className="review-actions">
        <span className="review-rating-label">Rating</span>
        <div className="review-rating" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => {
            const inputId = `rating-${newsId}-${value}`;
            const isActive = value <= activeRating;
            return (
              <span key={value} className="review-star">
                <input
                  id={inputId}
                  type="radio"
                  name="ratingChoice"
                  value={value}
                  checked={selectedRating === value}
                  onChange={() => submitRating(value)}
                  disabled={isSavingRating || isSubmittingComment}
                />
                <label
                  htmlFor={inputId}
                  aria-label={`Rating ${value}`}
                  className={isActive ? "active" : ""}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(null)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 3.5 14.8 9l6 .9-4.4 4.1 1 6-5.4-2.9-5.4 2.9 1-6L3.2 9.9l6-.9L12 3.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </label>
              </span>
            );
          })}
        </div>
        <button type="submit" disabled={isSubmittingComment}>
          Kirim
        </button>
      </div>
    </form>
  );
}
