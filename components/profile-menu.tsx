"use client";

import { useEffect, useRef, useState } from "react";

type ProfileMenuProps = {
  fullName: string;
};

export function ProfileMenu({ fullName }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#524a4e]"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        Profil
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-[#d6d6d6] bg-white py-2 text-sm shadow-lg">
          <div className="px-3 py-2 text-xs text-[#6b6b6b]">{fullName}</div>
          <a className="block px-3 py-2 text-[#3a3a3a] hover:bg-[#f5f5f5]" href="/profile">
            Detail
          </a>
          <form action="/api/logout" method="post">
            <button
              className="w-full px-3 py-2 text-left text-[#3a3a3a] hover:bg-[#f5f5f5]"
              type="submit"
            >
              Keluar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
