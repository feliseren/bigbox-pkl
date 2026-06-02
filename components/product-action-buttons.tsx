"use client";

import { useState } from "react";

type ProductActionButtonsProps = {
  canManage: boolean;
  editHref: string;
};

const cannotEditMessage = "yang dapat mengedit produk hanya admin dan marketing";
const cannotDeleteMessage =
  "yang dapat menghapus produk hanya admin dan marketing";

export function ProductActionButtons({
  canManage,
  editHref,
}: ProductActionButtonsProps) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <>
      <a
        className="btn-edit"
        href={canManage ? editHref : "#"}
        onClick={(event) => {
          if (canManage) return;
          event.preventDefault();
          setMessage(cannotEditMessage);
        }}
      >
        Ubah
      </a>
      <button
        className="btn-delete"
        type="button"
        onClick={() => {
          if (canManage) return;
          setMessage(cannotDeleteMessage);
        }}
      >
        Hapus
      </button>
      {message ? (
        <div
          className="product-alert-overlay"
          onClick={() => setMessage(null)}
        >
          <div
            className="product-alert-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="product-alert-icon">!</div>
            <h3 className="product-alert-title">Peringatan</h3>
            <p className="product-alert-body">{message}</p>
            <div className="product-alert-actions">
              <button
                className="product-alert-button"
                type="button"
                onClick={() => setMessage(null)}
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
