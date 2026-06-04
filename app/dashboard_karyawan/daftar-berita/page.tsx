import { fetchNewsWithReviews } from "@/lib/news-db";
import { readEmployeeSessionId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeEmployeeRole } from "@/lib/employee-role";
import { EmployeeProfileMenu } from "@/components/employee-profile-menu";
import { EmployeeSidebar } from "@/components/employee-sidebar";
import { NewsActionButtons } from "@/components/news-action-buttons";
import { NewsReviewIndicator } from "@/components/news-review-indicator";

export const dynamic = "force-dynamic";

type NewsItem = Awaited<ReturnType<typeof fetchNewsWithReviews>>[number];
type NewsReview = NewsItem["reviews"][number];

const categories = [
  "Big Vision",
  "Big Assistant",
  "Big Social",
  "Big Legal",
];

const sanitizeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "");
const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
const resolveImageUrl = (value?: string | null) => {
  if (!value) return "/bg-karyawan.jpeg";
  if (value.toLowerCase().endsWith(".bin")) return "/bg-karyawan.jpeg";
  return value;
};
const errorMessages: Record<string, string> = {
  "1": "Terjadi kesalahan saat menyimpan berita. Periksa koneksi database dan pastikan file yang diunggah valid.",
  forbidden: "Anda tidak memiliki akses untuk mengelola berita.",
};

export default async function DaftarBeritaPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string | string[];
    category?: string | string[];
    error?: string | string[];
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const employeeId = await readEmployeeSessionId();
  const employee = employeeId
    ? await prisma.employee.findUnique({ where: { id: employeeId } })
    : null;
  const employeeName = employee?.fullName ?? "Karyawan";
  const roleName = normalizeEmployeeRole(employee?.role);
  const canManageNews =
    roleName === "project manager" || roleName === "project_management";
  const rawQuery = resolvedSearchParams?.q;
  const rawCategory = resolvedSearchParams?.category;
  const rawError = resolvedSearchParams?.error;
  const query =
    (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery)?.trim() ?? "";
  const categoryFilter =
    (Array.isArray(rawCategory) ? rawCategory[0] : rawCategory)?.trim() ?? "";
  const errorKey =
    (Array.isArray(rawError) ? rawError[0] : rawError)?.trim() ?? "";
  const errorMessage = errorKey ? errorMessages[errorKey] ?? errorMessages["1"] : "";
  const normalizedCategory = categories.includes(categoryFilter)
    ? categoryFilter
    : "";
  const newsItems = await fetchNewsWithReviews({
    query,
    category: normalizedCategory || undefined,
  });

  return (
    <div className="project-layout">
      <div className="project-shell">
        <EmployeeSidebar active="berita" />

        <div className="project-main">
          <header className="project-header">
            <div>
              <h1 className="project-title">Daftar Berita</h1>
              <p className="project-subtitle">Kelola berita, ringkasan, dan ulasan.</p>
            </div>
            <EmployeeProfileMenu
              fullName={employeeName}
              employeeId={employee?.id ?? "-"}
            />
          </header>

          <main className="project-content">
            {errorMessage ? (
              <div className="news-error" role="alert">
                {errorMessage}
              </div>
            ) : null}

            <section className="news-card">
              <div className="news-toolbar">
                <h2>Daftar Berita</h2>
                <form className="news-filter" method="get" suppressHydrationWarning>
                  <div className="news-search">
                    <span className="news-search-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <circle
                          cx="11"
                          cy="11"
                          r="7"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <line
                          x1="16.65"
                          y1="16.65"
                          x2="21"
                          y2="21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <input
                      name="q"
                      placeholder="Cari berita"
                      defaultValue={query}
                      suppressHydrationWarning
                    />
                  </div>
                  <select
                    name="category"
                    defaultValue={normalizedCategory}
                    suppressHydrationWarning
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button type="submit" suppressHydrationWarning>
                    Cari
                  </button>
                </form>
              </div>

              <div className="news-list">
                {newsItems.map((item: NewsItem) => (
                  <div key={item.id} className="news-item">
                    <div className="news-image">
                      <img
                        src={resolveImageUrl(item.imageUrl)}
                        alt={item.title}
                      />
                    </div>
                    <div className="news-body">
                      <h3>{item.title}</h3>
                      <div className="news-meta">
                        <span className="news-tag">{item.category}</span>
                        <span>
                          {formatDate(item.createdAt)} oleh {item.authorName}
                        </span>
                      </div>
                      <div className="news-stats">
                        <span className="news-stat">
                          <span className="news-stat-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                              <path
                                d="M12 5c5.5 0 9.5 5 9.5 7s-4 7-9.5 7S2.5 14 2.5 12s4-7 9.5-7Zm0 3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                          {item.viewCount} Dilihat
                        </span>
                        <NewsReviewIndicator
                          newsId={item.id}
                          reviewHref={`#review-${sanitizeId(item.id)}`}
                          reviewCount={item.reviews.length}
                          latestReviewId={item.reviews[0]?.id ?? null}
                        />
                      </div>
                    </div>
                    <div className="news-actions">
                        <NewsActionButtons
                          canManage={canManageNews}
                          editHref={`#edit-${sanitizeId(item.id)}`}
                          newsId={item.id}
                        />
                    </div>
                  </div>
                ))}
                {!newsItems.length ? (
                  <p className="news-empty">Tidak ada berita ditemukan.</p>
                ) : null}
              </div>
            </section>

            {canManageNews ? newsItems.map((item: NewsItem) => (
              <div
                key={`edit-${item.id}`}
                id={`edit-${sanitizeId(item.id)}`}
                className="project-modal"
              >
                <div className="project-modal-card news-review-modal">
                  <div className="project-modal-header">
                    <h2>Edit Berita</h2>
                    <a className="project-modal-close" href="#">
                      x
                    </a>
                  </div>
                  <form
                    className="project-form news-form"
                    method="post"
                    action="/api/news/update"
                    encType="multipart/form-data"
                  >
                    <input type="hidden" name="newsId" value={item.id} />
                    <input
                      type="hidden"
                      name="redirect"
                      value="/dashboard_karyawan/daftar-berita"
                    />
                    <label>
                      Judul Berita
                      <input name="title" defaultValue={item.title} required />
                    </label>
                    <label>
                      Kategori
                      <select name="category" defaultValue={item.category}>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Upload Gambar (opsional)
                      <input type="file" name="image" accept="image/*" />
                    </label>
                    <label>
                      Upload PDF (opsional)
                      <input type="file" name="storyFile" accept="application/pdf" />
                    </label>
                    <label>
                      Ringkasan 1
                      <textarea
                        name="summaryPart1"
                        rows={3}
                        defaultValue={item.summaryPart1 ?? ""}
                      />
                    </label>
                    <label>
                      Ringkasan 2
                      <textarea
                        name="summaryPart2"
                        rows={3}
                        defaultValue={item.summaryPart2 ?? ""}
                      />
                    </label>
                    <label>
                      Ringkasan 3
                      <textarea
                        name="summaryPart3"
                        rows={3}
                        defaultValue={item.summaryPart3 ?? ""}
                      />
                    </label>
                    <label>
                      Pelanggan
                      <input
                        name="customerName"
                        defaultValue={item.customerName ?? ""}
                      />
                    </label>
                    <label>
                      Industri
                      <input
                        name="customerIndustry"
                        defaultValue={item.customerIndustry ?? ""}
                      />
                    </label>
                    <label>
                      Ukuran Organisasi
                      <input
                        name="customerSize"
                        defaultValue={item.customerSize ?? ""}
                      />
                    </label>
                    <label>
                      Lokasi
                      <input
                        name="customerLocation"
                        defaultValue={item.customerLocation ?? ""}
                      />
                    </label>
                    <label>
                      Produk
                      <input
                        name="customerProducts"
                        defaultValue={item.customerProducts ?? ""}
                      />
                    </label>
                    <div className="project-form-actions">
                      <button type="submit">Simpan</button>
                      <a href="#" className="ghost">
                        Batal
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            )) : null}

            {newsItems.map((item: NewsItem) => (
              <div
                key={`review-${item.id}`}
                id={`review-${sanitizeId(item.id)}`}
                className="project-modal"
              >
                <div className="project-modal-card news-review-modal">
                  <div className="project-modal-header">
                    <h2>Review {item.title}</h2>
                    <a className="project-modal-close" href="#">
                      x
                    </a>
                  </div>
                  <div className="news-review-list">
                    {item.reviews.length ? (
                      item.reviews.map((review: NewsReview) => (
                        <div key={review.id} className="news-review-item">
                          <div>
                            <strong>{review.user.fullName}</strong>
                            <span className="news-review-stars">
                              {Array.from({ length: review.rating }).map(
                                (_, i) => (
                                  <svg
                                    key={i}
                                    viewBox="0 0 24 24"
                                    width="14"
                                    height="14"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M12 3.5 14.8 9l6 .9-4.4 4.1 1 6-5.4-2.9-5.4 2.9 1-6L3.2 9.9l6-.9L12 3.5Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                ),
                              )}
                            </span>
                          </div>
                          <p>{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="news-empty">
                        Belum ada review dari pelanggan.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
