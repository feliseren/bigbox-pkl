"use client";

import { useState } from "react";
import Link from "next/link";

type ResetRequestLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export function ResetRequestLink({
  href,
  className,
  children,
}: ResetRequestLinkProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={className}
        type="button"
        suppressHydrationWarning
        onClick={() => setIsOpen(true)}
      >
        {children}
      </button>

      {isOpen ? (
        <div className="product-alert-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="product-alert-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="product-alert-icon">!</div>
            <h3 className="product-alert-title">Peringatan</h3>
            <p className="product-alert-body">
              Ajukan reset password ke admin sekarang?
            </p>
            <div className="product-alert-actions">
              <button
                className="product-alert-button secondary"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Batal
              </button>
              <Link
                href={href}
                className="product-alert-button"
                onClick={() => setIsOpen(false)}
              >
                Ya, ajukan
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
