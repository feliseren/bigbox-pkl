"use client";

import Image from "next/image";
import { useState } from "react";

type Feature = {
  title: string;
  desc: string;
  icon?: string;
};

type FeatureSliderProps = {
  features: Feature[];
};

export function FeatureSlider({ features }: FeatureSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const total = features.length;

  function goPrev() {
    setDirection("left");
    setActiveIndex((current) => (current - 1 + total) % total);
  }

  function goNext() {
    setDirection("right");
    setActiveIndex((current) => (current + 1) % total);
  }

  const feature = features[activeIndex];

  return (
    <div className="relative mx-auto max-w-[1237px] px-6 pb-12">
      <button
        aria-label="Slide left"
        className="absolute left-0 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-[#121a5b] text-white shadow-[0_10px_22px_rgba(0,0,0,0.2)]"
        type="button"
        onClick={goPrev}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div
        key={`${activeIndex}-${direction}`}
        className={`mx-auto max-w-[820px] rounded-[22px] border border-[#7c62ff] bg-white px-6 py-8 text-center shadow-[0_12px_26px_rgba(0,0,0,0.08)] feature-slide feature-slide-${direction}`}
      >
        <div className="mx-auto flex max-w-[640px] flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center text-[#9a9a9a]">
              {feature.icon ? (
                <Image
                  src={feature.icon}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              ) : (
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 6h6M4 12h6M4 18h6" />
                  <rect x="13" y="4" width="7" height="6" rx="1.5" />
                  <rect x="13" y="14" width="7" height="6" rx="1.5" />
                </svg>
              )}
            </div>
            <p className="text-lg font-semibold text-[#1f2355]">
              {feature.title}
            </p>
          </div>
          <p className="text-sm text-[#7a7a7a]">{feature.desc}</p>
        </div>
      </div>

      <button
        aria-label="Slide right"
        className="absolute right-0 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-[#121a5b] text-white shadow-[0_10px_22px_rgba(0,0,0,0.2)]"
        type="button"
        onClick={goNext}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
