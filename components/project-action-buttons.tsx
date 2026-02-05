"use client";

import { useState } from "react";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";

type ProjectActionButtonsProps = {
  canManage: boolean;
  editHref: string;
  projectId: string;
};

const cannotEditMessage = "yang dapat mengedit projek hanya project management";
const cannotDeleteMessage = "yang dapat menghapus projek hanya project management";

export function ProjectActionButtons({
  canManage,
  editHref,
  projectId,
}: ProjectActionButtonsProps) {
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
        Edit
      </a>
      {canManage ? (
        <form method="post" action="/api/projects/delete">
          <input type="hidden" name="projectId" value={projectId} />
          <ConfirmDeleteButton className="btn-delete" />
        </form>
      ) : (
        <button
          className="btn-delete"
          type="button"
          onClick={() => setMessage(cannotDeleteMessage)}
        >
          Delete
        </button>
      )}
      {message ? (
        <div className="product-alert-overlay" onClick={() => setMessage(null)}>
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
