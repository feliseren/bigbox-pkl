import Image from "next/image";
import { readEmployeeSessionId } from "@/lib/auth";
import ChipsInput from "@/components/chips-input";
import { prisma } from "@/lib/prisma";
import { EmployeeProfileMenu } from "@/components/employee-profile-menu";
import { EmployeeSidebar } from "@/components/employee-sidebar";
import SuccessHistoryEditor from "@/components/success-history-editor";
import { SuccessImageUpload } from "@/components/success-image-upload";

export const dynamic = "force-dynamic";

export default async function SuccessHistoryPage() {
  const employeeId = await readEmployeeSessionId();
  const employee = employeeId
    ? await prisma.employee.findUnique({ where: { id: employeeId } })
    : null;
  const employeeName = employee?.fullName ?? "Karyawan";
  const roleName = employee?.role.toLowerCase();
  const canManageNews =
    roleName === "project manager" || roleName === "project_management";

  return (
    <div className="project-layout">
      <div className="project-shell">
        <EmployeeSidebar active="success" />

        <div className="project-main">
          <header className="project-header">
            <div>
              <h1 className="project-title">Tambah Berita Baru</h1>
              <p className="project-subtitle">Publikasikan success story pelanggan.</p>
            </div>
            <EmployeeProfileMenu
              fullName={employeeName}
              employeeId={employee?.id ?? "-"}
            />
          </header>

          <main className="project-content">
            <section className="project-card success-card">
              {canManageNews ? (
                <form
                  className="success-form"
                  method="post"
                  action="/api/news"
                  encType="multipart/form-data"
                  suppressHydrationWarning
                >
                  <input
                    type="hidden"
                    name="redirect"
                    value="/dashboard_karyawan/daftar-berita"
                  />
                  <div className="success-row">
                    <div className="success-label">
                      <span className="success-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                          <path
                            d="M4 6h16M4 12h10M4 18h8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <span>Judul Berita</span>
                    </div>
                    <input
                      className="success-input"
                      type="text"
                      name="title"
                      placeholder="Masukkan Judul Berita..."
                      required
                      suppressHydrationWarning
                    />
                  </div>

                <div className="success-row">
                  <div className="success-label">
                    <span className="success-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                        <path
                          d="M4 7h16M7 7v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 11h6M9 15h6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span>Kategori</span>
                  </div>
                  <select
                    className="success-input"
                    name="category"
                    defaultValue=""
                    required
                    suppressHydrationWarning
                  >
                    <option value="" disabled>
                      Pilih Kategori
                    </option>
                    <option value="Big Vision">Big Vision</option>
                    <option value="Big Assistant">Big Assistant</option>
                    <option value="Big Social">Big Social</option>
                    <option value="Big Legal">Big Legal</option>
                  </select>
                </div>

                <div className="success-row align-top">
                  <div className="success-label">
                    <span className="success-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                        <path
                          d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M12 4v10m0 0 4-4m-4 4-4-4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>Upload Gambar</span>
                  </div>
                  <SuccessImageUpload />
                </div>

                <div className="success-row align-top">
                  <div className="success-label">
                    <span className="success-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                        <path
                          d="M5 4h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 12h8M8 16h8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span>Isi Berita</span>
                  </div>
                  <div className="success-upload-group">
                    <label className="success-upload-file">
                      <span className="success-upload-title">Upload PDF</span>
                      <input
                        className="success-input-file"
                        type="file"
                        name="storyFile"
                        accept="application/pdf"
                      />
                    </label>
                    <div className="success-summary">
                      <p className="success-summary-title">Tulis Manual</p>
                      <SuccessHistoryEditor name="contentText" />
                    </div>
                    <div className="success-summary">
                      <p className="success-summary-title">Ringkasan Berita</p>
                      <div className="success-summary-grid">
                        <textarea
                          className="success-summary-text"
                          name="summaryPart1"
                          placeholder="Ringkasan bagian 1..."
                        />
                        <textarea
                          className="success-summary-text"
                          name="summaryPart2"
                          placeholder="Ringkasan bagian 2..."
                        />
                        <textarea
                          className="success-summary-text"
                          name="summaryPart3"
                          placeholder="Ringkasan bagian 3..."
                        />
                      </div>
                    </div>
                    <div className="success-customer-card">
                      <div className="success-customer-header">
                        <div>
                          <p className="success-customer-title">Informasi Pelanggan</p>
                          <p className="success-customer-subtitle">
                            Data pelanggan yang tampil di detail cerita
                          </p>
                        </div>
                        <span className="success-customer-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" width="18" height="18">
                            <path
                              d="M7 7a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-3 9a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2H4v-2Zm12-9h5v10h-5V7Zm1.5 1.5v7h2V8.5h-2Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </div>
                      <div className="success-customer-grid">
                        <label>
                          Pelanggan
                          <input name="customerName" suppressHydrationWarning />
                        </label>
                        <label>
                          Industri
                          <input name="customerIndustry" suppressHydrationWarning />
                        </label>
                        <label>
                          Ukuran Organisasi
                          <input name="customerSize" suppressHydrationWarning />
                        </label>
                        <label>
                          Lokasi
                          <input name="customerLocation" suppressHydrationWarning />
                        </label>
                      </div>
                      <label className="success-customer-products">
                        Produk
                        <ChipsInput
                          name="customerProducts"
                          placeholder="Ketik produk lalu Enter"
                        />
                        <span className="success-customer-hint">
                          Tekan Enter atau koma untuk menambah chip.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                  <div className="success-actions">
                    <button
                      className="success-submit"
                      type="submit"
                      suppressHydrationWarning
                    >
                      Publikasikan
                    </button>
                  </div>
                </form>
              ) : (
                <div className="project-table-empty">
                  Yang dapat menambahkan berita baru hanya role project management.
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
