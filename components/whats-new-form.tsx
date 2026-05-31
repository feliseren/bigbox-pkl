"use client";

import { useState } from "react";

type WhatsNewFormProps = {
  categories: string[];
};

export default function WhatsNewForm({ categories }: WhatsNewFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="project-new-button"
        onClick={() => setIsOpen(true)}
      >
        Tambah Pembaruan
      </button>
      {isOpen ? (
        <div className="project-modal is-open">
          <div className="project-modal-card">
            <div className="project-modal-header">
              <h2>Tambahkan Pembaruan</h2>
              <button
                type="button"
                className="project-modal-close"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup"
              >
                x
              </button>
            </div>
            <form
              className="project-form compact-whats-new-form"
              method="post"
              action="/api/whats-new"
              encType="multipart/form-data"
              suppressHydrationWarning
            >
              <input
                type="hidden"
                name="redirect"
                value="/dashboard_karyawan/whats-new"
              />
              <label>
                Judul Update
                <input name="title" placeholder="Judul update..." required />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  Kategori
                  <select name="category" defaultValue="" required>
                    <option value="" disabled>
                      Pilih kategori
                    </option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Tanggal Publikasi
                  <input type="date" name="publishDate" required />
                </label>
              </div>
              <label>
                Ringkasan Singkat
                <textarea
                  name="summary"
                  rows={3}
                  placeholder="Ringkasan singkat update..."
                  required
                />
              </label>
              <label>
                Detail (opsional)
                <textarea
                  name="contentText"
                  rows={3}
                  placeholder="Detail update..."
                />
              </label>
              <label>
                Upload Gambar (opsional)
                <input type="file" name="image" accept="image/*" />
              </label>
              <fieldset>
                <legend className="mb-2 block text-sm font-semibold text-[#1f1f1f]">
                  Jadikan Highlight
                </legend>
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm">
                    <input
                      type="radio"
                      name="isHighlight"
                      value="0"
                      defaultChecked
                      className="h-4 w-4 accent-[#2a3ad7]"
                    />
                    <span>Tidak</span>
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm">
                    <input
                      type="radio"
                      name="isHighlight"
                      value="1"
                      className="h-4 w-4 accent-[#2a3ad7]"
                    />
                    <span>Ya</span>
                  </label>
                </div>
              </fieldset>
              <div className="project-form-actions">
                <button type="submit">Simpan</button>
                <button
                  type="button"
                  className="ghost"
                  onClick={() => setIsOpen(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
