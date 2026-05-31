"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  fallbackHref?: string;
  label?: string;
  className?: string;
};

export function BackButton({
  fallbackHref = "/produk",
  label = "Kembali",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
          return;
        }
        router.push(fallbackHref);
      }}
    >
      {label}
    </button>
  );
}
