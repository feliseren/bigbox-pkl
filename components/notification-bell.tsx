"use client";

import { useEffect, useRef, useState } from "react";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
};

type NotificationBellProps = {
  items: NotificationItem[];
};

export function NotificationBell({ items }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") {
      return new Set();
    }
    try {
      const raw = window.localStorage.getItem("bb_read_notifications");
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return new Set();
      return new Set(parsed.filter((value) => typeof value === "string"));
    } catch {
      return new Set();
    }
  });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const unreadItems = items.filter((item) => !readIds.has(item.id));
  const count = unreadItems.length;

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "bb_read_notifications",
        JSON.stringify(Array.from(readIds)),
      );
    } catch {
      // Ignore local storage write errors.
    }
  }, [readIds]);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleToggle() {
    setOpen((value) => {
      const next = !value;
      if (next && items.length > 0) {
        setReadIds((prev) => {
          const nextSet = new Set(prev);
          items.forEach((item) => nextSet.add(item.id));
          return nextSet;
        });
      }
      return next;
    });
  }

  return (
    <div className="notification-bell" ref={containerRef}>
      <button
        className="notification-bell-button"
        type="button"
        onClick={handleToggle}
        aria-label="Notifikasi"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path
            d="M15.5 18a3.5 3.5 0 0 1-7 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M18 10a6 6 0 1 0-12 0c0 3.1-.7 4.8-1.7 6h15.4C18.7 14.8 18 13.1 18 10Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        {count > 0 ? <span className="notification-badge">{count}</span> : null}
      </button>
      {open ? (
        <div className="notification-dropdown">
          <div className="notification-header">Notifikasi</div>
          <div className="notification-list">
            {items.length === 0 ? (
              <div className="notification-empty">Tidak ada notifikasi.</div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="notification-item">
                  <div className="notification-title">{item.title}</div>
                  <div className="notification-message">{item.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
