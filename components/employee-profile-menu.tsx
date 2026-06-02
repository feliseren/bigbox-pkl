"use client";

import { useEffect, useRef, useState } from "react";

type EmployeeProfileMenuProps = {
  fullName: string;
  employeeId: string;
};

export function EmployeeProfileMenu({
  fullName,
  employeeId,
}: EmployeeProfileMenuProps) {
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
        className="project-user border-0 bg-transparent p-0"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{fullName}</span>
        <span className="project-avatar" />
        <span className="project-bell" />
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-52 rounded-lg border border-[#e6e9f5] bg-white p-3 text-sm shadow-lg">
          <div className="text-xs text-[#6b7185]">Nama</div>
          <div className="font-semibold text-[#1f2430]">{fullName}</div>
          <div className="mt-2 text-xs text-[#6b7185]">ID Karyawan</div>
          <div className="font-semibold text-[#1f2430]">{employeeId}</div>
          <div className="mt-3 border-t border-[#eef0f6] pt-2">
            <a
              className="block rounded-md px-2 py-2 text-[#3a3a3a] hover:bg-[#f5f5f5]"
              href="/dashboard_karyawan/profile"
            >
              Ubah Password
            </a>
            <form action="/api/logout_karyawan" method="post">
              <button
                className="mt-1 w-full rounded-md px-2 py-2 text-left text-[#d84b4b] hover:bg-[#f5f5f5]"
                type="submit"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
