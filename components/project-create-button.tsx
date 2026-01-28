"use client";

import { useState } from "react";

type ProjectCreateButtonProps = {
  canManage: boolean;
};

const cannotCreateMessage =
  "yang dapat menambahkan projek hanya project management";

export function ProjectCreateButton({ canManage }: ProjectCreateButtonProps) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <>
      <a
        className="project-new-button"
        href={canManage ? "#new-project" : "#"}
        onClick={(event) => {
          if (canManage) return;
          event.preventDefault();
          setMessage(cannotCreateMessage);
        }}
      >
        New Project
      </a>
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
