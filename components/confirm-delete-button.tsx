"use client";

import { useRef, useState } from "react";

type ConfirmDeleteButtonProps = {
  className?: string;
  label?: string;
  confirmMessage?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  formAction?: string;
  type?: "submit" | "button";
};

export function ConfirmDeleteButton({
  className,
  label = "Hapus",
  confirmMessage = "Apakah anda yakin ingin menghapus?",
  confirmLabel = "Ya, hapus",
  cancelLabel = "Batal",
  formAction,
  type = "submit",
}: ConfirmDeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleConfirm = () => {
    setIsOpen(false);
    const button = buttonRef.current;
    const form = button?.form ?? null;
    if (form) {
      form.requestSubmit(button ?? undefined);
      return;
    }
    button?.click();
  };

  return (
    <>
      <button
        ref={buttonRef}
        className={className}
        type={type}
        formAction={formAction}
        onClick={(event) => {
          event.preventDefault();
          setIsOpen(true);
        }}
      >
        {label}
      </button>
      {isOpen ? (
        <div className="product-alert-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="product-alert-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="product-alert-icon">!</div>
            <h3 className="product-alert-title">Peringatan</h3>
            <p className="product-alert-body">{confirmMessage}</p>
            <div className="product-alert-actions">
              <button
                className="product-alert-button secondary"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                {cancelLabel}
              </button>
              <button
                className="product-alert-button"
                type="button"
                onClick={handleConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
