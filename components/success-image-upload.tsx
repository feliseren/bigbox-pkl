"use client";

import { useState } from "react";

export function SuccessImageUpload() {
  const [fileName, setFileName] = useState("");

  return (
    <label className="success-upload">
      <input
        className="success-upload-input"
        type="file"
        name="image"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          setFileName(file?.name ?? "");
        }}
      />
      <div className="success-upload-body">
        <div className="success-upload-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path
              d="M12 16V6m0 0 4 4m-4-4-4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 18v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p>Klik atau drag untuk upload gambar</p>
        {fileName ? (
          <span className="success-upload-filename">{fileName}</span>
        ) : null}
      </div>
    </label>
  );
}
