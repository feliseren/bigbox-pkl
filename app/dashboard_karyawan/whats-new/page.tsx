import Image from "next/image";
import { readEmployeeSessionId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmployeeProfileMenu } from "@/components/employee-profile-menu";
import { EmployeeSidebar } from "@/components/employee-sidebar";
import { fetchWhatsNew } from "@/lib/whats-new-db";
import WhatsNewForm from "@/components/whats-new-form";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";

export const dynamic = "force-dynamic";

const categories = ["Produk", "Fitur", "Update Sistem"];

const sanitizeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "");
const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
const resolveImageUrl = (value?: string | null) => {
  if (!value) return "/bg-karyawan.jpeg";
  if (value.toLowerCase().endsWith(".bin")) return "/bg-karyawan.jpeg";
  return value;
};

export default async function WhatsNewDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string | string[]; category?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const employeeId = await readEmployeeSessionId();
  const employee = employeeId
    ? await prisma.employee.findUnique({ where: { id: employeeId }, include: { role: true } })
    : null;
  const employeeName = employee?.fullName ?? "Karyawan";
  const canManage = employee?.role.name.toLowerCase() === "marketing";
  const rawQuery = resolvedSearchParams?.q;
  const rawCategory = resolvedSearchParams?.category;
  const query =
    (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery)?.trim() ?? "";
  const categoryFilter =
    (Array.isArray(rawCategory) ? rawCategory[0] : rawCategory)?.trim() ?? "";
  const normalizedCategory = categories.includes(categoryFilter)
    ? categoryFilter
    : "";
  const selectedCategory = normalizedCategory || "Semua";
  const buildTabHref = (category?: string) => {
    const params = new URLSearchParams();
    if (query) {
      params.set("q", query);
    }
    if (category && category !== "Semua") {
      params.set("category", category);
    }
    const queryString = params.toString();
    return `/dashboard_karyawan/whats-new${queryString ? `?${queryString}` : ""}`;
  };
  const where =
    query || normalizedCategory
      ? {
          AND: [
            ...(query
              ? [
                  {
                    OR: [
                      { title: { contains: query } },
                      { summary: { contains: query } },
                      { contentText: { contains: query } },
                    ],
                  },
                ]
              : []),
            ...(normalizedCategory ? [{ category: normalizedCategory }] : []),
          ],
        }
      : undefined;
  const updates = await fetchWhatsNew({
    query,
    category: normalizedCategory || undefined,
  });
  const totalUpdates = await prisma.whatsNew.count({ where });

  return (
    <div className="project-layout">
      <div className="project-shell">
        <EmployeeSidebar active="whats-new" />

        <div className="project-main">
          <header className="project-header">
            <div>
              <h1 className="project-title">Daftar Pembaruan</h1>
              <p className="project-subtitle">
                Kelola update produk, fitur, event, dan sistem.
              </p>
            </div>
            <EmployeeProfileMenu
              fullName={employeeName}
              employeeId={employee?.id ?? "-"}
            />
          </header>

          <main className="project-content">
            <section className="project-card">
              <div className="project-toolbar whats-new-toolbar dashboard-toolbar">
                <div className="whats-new-left">
                  {canManage ? <WhatsNewForm categories={categories} /> : null}
                  <div className="project-tabs">
                    {["Semua", ...categories].map((category) => (
                      <a
                        key={category}
                        className={`project-tab${
                          selectedCategory === category ? " active" : ""
                        }`}
                        href={buildTabHref(category)}
                      >
                        {category}
                      </a>
                    ))}
                  </div>
                </div>
                <form
                  className="project-search"
                  method="get"
                  action="/dashboard_karyawan/whats-new"
                  suppressHydrationWarning
                >
                  {normalizedCategory ? (
                    <input type="hidden" name="category" value={normalizedCategory} />
                  ) : null}
                  <input
                    name="q"
                    placeholder="Search update"
                    defaultValue={query}
                    suppressHydrationWarning
                  />
                  <button
                    className="project-search-icon"
                    type="submit"
                    suppressHydrationWarning
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <line x1="16.65" y1="16.65" x2="21" y2="21" />
                    </svg>
                    <span className="sr-only">Search</span>
                  </button>
                </form>
              </div>

              <div className="project-table">
                <div className="project-table-header">
                  <span>JUDUL</span>
                  <span>KATEGORI</span>
                  <span>TANGGAL</span>
                  <span>PENULIS</span>
                  <span>HIGHLIGHT</span>
                  <span className="align-right">AKSI</span>
                </div>
                {updates.length ? (
                  updates.map((item) => (
                    <div key={item.id} className="project-table-row">
                      <span className="bold">{item.title}</span>
                      <span>{item.category}</span>
                      <span>{formatDate(item.publishDate)}</span>
                      <span>{item.employee.fullName}</span>
                      <span>{item.isHighlight ? "Ya" : "Tidak"}</span>
                      <span className="align-right actions">
                        <a
                          className="news-review-btn"
                          href={`#detail-${sanitizeId(item.id)}`}
                        >
                          Detail
                        </a>
                        {canManage ? (
                          <div className="actions">
                            <a
                              className="btn-edit"
                              href={`#edit-${sanitizeId(item.id)}`}
                            >
                              Edit
                            </a>
                            <form method="post" action="/api/whats-new/delete">
                              <input type="hidden" name="id" value={item.id} />
                              <input
                                type="hidden"
                                name="redirect"
                                value="/dashboard_karyawan/whats-new"
                              />
                              <ConfirmDeleteButton
                                className="btn-delete"
                                label="Hapus"
                              />
                            </form>
                          </div>
                        ) : null}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="project-table-empty">
                    {query ? "Tidak ada hasil pencarian." : "Belum ada data update."}
                  </div>
                )}
              </div>

              <div className="project-footer">
                <div className="project-showing">
                  <span>Showing</span>
                  <button className="select" type="button" suppressHydrationWarning>
                    {updates.length} <span className="caret">v</span>
                  </button>
                  <span>of {totalUpdates}</span>
                </div>
              </div>
            </section>

            {updates.map((item) => (
              <div
                key={`detail-${item.id}`}
                id={`detail-${sanitizeId(item.id)}`}
                className="project-modal"
              >
                <div className="project-modal-card">
                  <div className="project-modal-header">
                    <h2>Detail Update</h2>
                    <a className="project-modal-close" href="#">
                      x
                    </a>
                  </div>
                  <div className="space-y-3 text-sm text-[#4a4f60]">
                    <img
                      className="proof-image"
                      src={resolveImageUrl(item.imageUrl)}
                      alt={item.title}
                    />
                    <p>
                      <strong>Judul:</strong> {item.title}
                    </p>
                    <p>
                      <strong>Kategori:</strong> {item.category}
                    </p>
                    <p>
                      <strong>Tanggal:</strong> {formatDate(item.publishDate)}
                    </p>
                    <p>
                      <strong>Ringkasan:</strong> {item.summary}
                    </p>
                    {item.contentText ? (
                      <p className="whitespace-pre-line">
                        <strong>Detail:</strong> {item.contentText}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}

            {canManage
              ? updates.map((item) => (
                  <div
                    key={`edit-${item.id}`}
                    id={`edit-${sanitizeId(item.id)}`}
                    className="project-modal"
                  >
                    <div className="project-modal-card">
                      <div className="project-modal-header">
                        <h2>Edit Update</h2>
                        <a className="project-modal-close" href="#">
                          x
                        </a>
                      </div>
                      <form
                        className="project-form"
                        method="post"
                        action="/api/whats-new/update"
                        encType="multipart/form-data"
                      >
                        <input type="hidden" name="id" value={item.id} />
                        <input
                          type="hidden"
                          name="redirect"
                          value="/dashboard_karyawan/whats-new"
                        />
                        <label>
                          Judul
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
                          Tanggal Publikasi
                          <input
                            type="date"
                            name="publishDate"
                            defaultValue={item.publishDate.toISOString().slice(0, 10)}
                            required
                          />
                        </label>
                        <label>
                          Ringkasan
                          <textarea
                            name="summary"
                            rows={4}
                            defaultValue={item.summary}
                          />
                        </label>
                        <label>
                          Detail (opsional)
                          <textarea
                            name="contentText"
                            rows={4}
                            defaultValue={item.contentText ?? ""}
                          />
                        </label>
                        <label>
                          Upload Gambar (opsional)
                          <input type="file" name="image" accept="image/*" />
                        </label>
                        <label>
                          Jadikan Highlight
                          <select
                            name="isHighlight"
                            defaultValue={item.isHighlight ? "1" : "0"}
                          >
                            <option value="0">Tidak</option>
                            <option value="1">Ya</option>
                          </select>
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
                ))
              : null}
          </main>
        </div>
      </div>
    </div>
  );
}

