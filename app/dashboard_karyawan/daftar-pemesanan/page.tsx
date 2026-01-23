import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";
import { EmployeeProfileMenu } from "@/components/employee-profile-menu";

export const dynamic = "force-dynamic";

type OrderStatus = "Pending" | "Done";

type OrderItem = {
  id: string;
  item: string;
  total: string;
  customer: string;
  status: OrderStatus;
  paymentType: string;
  paymentProof: string;
};

export default async function DaftarPemesananPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string | string[]; status?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const employeeId = await readEmployeeSessionId();
  const employee = employeeId
    ? await prisma.employee.findUnique({ where: { id: employeeId } })
    : null;
  const [orders, bigAssistant, bigLegal, bigSocial, bigVision] = await Promise.all(
    [
      prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.bigAssistant.findMany(),
      prisma.bigLegal.findMany(),
      prisma.bigSocial.findMany(),
      prisma.bigVision.findMany(),
    ],
  );
  const productMaps: Record<
    "BIG_ASSISTANT" | "BIG_LEGAL" | "BIG_SOCIAL" | "BIG_VISION",
    Map<string, string>
  > = {
    BIG_ASSISTANT: new Map(bigAssistant.map((item) => [item.id, item.namaProduk])),
    BIG_LEGAL: new Map(bigLegal.map((item) => [item.id, item.namaProduk])),
    BIG_SOCIAL: new Map(bigSocial.map((item) => [item.id, item.namaProduk])),
    BIG_VISION: new Map(bigVision.map((item) => [item.id, item.namaProduk])),
  };
  const orderItems: OrderItem[] = orders.map((order) => ({
    id: order.id,
    item:
      productMaps[order.productType].get(order.productId) ??
      order.productId,
    total: order.totalPesanan,
    customer: order.namaCustomer,
    status: order.statusPesanan as OrderStatus,
    paymentType: order.jenisPembayaran,
    paymentProof: order.buktiPembayaran,
  }));
  const rawQuery = resolvedSearchParams?.q;
  const rawStatus = resolvedSearchParams?.status;
  const query =
    (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery)?.trim() ?? "";
  const statusFilter = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus;
  const normalizedStatus: OrderStatus | undefined =
    statusFilter === "Pending" || statusFilter === "Done"
      ? statusFilter
      : undefined;
  const buildTabHref = (status?: OrderStatus) => {
    const params = new URLSearchParams();
    if (query) {
      params.set("q", query);
    }
    if (status) {
      params.set("status", status);
    }
    const queryString = params.toString();
    return `/dashboard_karyawan/daftar-pemesanan${queryString ? `?${queryString}` : ""}`;
  };
  const queryLower = query.toLowerCase();
  const filteredOrders = orderItems.filter((order) => {
    if (normalizedStatus && order.status !== normalizedStatus) {
      return false;
    }
    if (!queryLower) {
      return true;
    }
    return (
      order.id.toLowerCase().includes(queryLower) ||
      order.item.toLowerCase().includes(queryLower) ||
      order.total.toLowerCase().includes(queryLower) ||
      order.customer.toLowerCase().includes(queryLower) ||
      order.status.toLowerCase().includes(queryLower)
    );
  });
  const hasOrders = filteredOrders.length > 0;
  const totalOrders = orderItems.length;
  const sanitizeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "");
  const resolveProofUrl = (value: string) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    if (value.startsWith("/")) return value;
    return `/uploads/${value}`;
  };

  return (
    <div className="project-layout">
      <div className="project-shell">
        <aside className="project-sidebar">
          <div className="project-brand">
            <Image
              src="/bigbox_logo-removebg-preview.png"
              alt="BigBox logo"
              width={160}
              height={52}
              className="project-logo"
            />
          </div>
          <p className="project-menu-label">Menu</p>
          <nav className="project-nav">
            <a className="project-link" href="/dashboard_karyawan">
              Dashboard
            </a>
            <a className="project-link" href="/dashboard_karyawan/daftar-produk">
              Daftar Produk
            </a>
            <a className="project-link" href="/dashboard_karyawan/daftar-projek">
              Daftar Projek
            </a>
            <a className="project-link" href="/dashboard_karyawan/success-history">
              Success History
            </a>
            <a className="project-link" href="/dashboard_karyawan/daftar-berita">
              Daftar Berita
            </a>
            <a
              className="project-link active"
              href="/dashboard_karyawan/daftar-pemesanan"
            >
              Daftar Pemesanan
            </a>
            <a className="project-link" href="/dashboard_karyawan/kontak-pelanggan">
              Kontak Pelanggan
            </a>
          </nav>
          <form
            className="project-logout-form"
            method="post"
            action="/api/logout_karyawan"
          >
            <button className="project-logout" type="submit">
              Logout
            </button>
          </form>
        </aside>

        <div className="project-main">
          <header className="project-header">
            <h1 className="project-title">Daftar Pemesanan</h1>
            <EmployeeProfileMenu
              fullName={employee?.fullName ?? "Karyawan"}
              employeeId={employee?.id ?? "-"}
            />
          </header>

          <main className="project-content">
            <section className="project-card">
              <div className="project-toolbar">
                <div className="project-tabs">
                  <a
                    className={`project-tab${!normalizedStatus ? " active" : ""}`}
                    href={buildTabHref()}
                  >
                    Show All
                  </a>
                  <a
                    className={`project-tab${
                      normalizedStatus === "Pending" ? " active" : ""
                    }`}
                    href={buildTabHref("Pending")}
                  >
                    Pending
                  </a>
                  <a
                    className={`project-tab${
                      normalizedStatus === "Done" ? " active" : ""
                    }`}
                    href={buildTabHref("Done")}
                  >
                    Done
                  </a>
                </div>
                <form
                  className="project-search"
                  method="get"
                  action="/dashboard_karyawan/daftar-pemesanan"
                >
                  {normalizedStatus ? (
                    <input type="hidden" name="status" value={normalizedStatus} />
                  ) : null}
                  <input
                    name="q"
                    placeholder="Search order"
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

              <div className="project-table order-table">
                <div className="project-table-header">
                  <span>ORDER ID</span>
                  <span>NAMA CUSTOMER</span>
                  <span>JENIS PEMBAYARAN</span>
                  <span>DAFTAR PESANAN</span>
                  <span>TOTAL PESANAN</span>
                  <span>STATUS</span>
                  <span className="align-right">AKSI</span>
                </div>
                {hasOrders ? (
                  filteredOrders.map((order) => (
                    <div key={order.id} className="project-table-row">
                      <span className="bold">{order.id}</span>
                      <span>{order.customer}</span>
                      <span className="order-payment">{order.paymentType}</span>
                      <span>{order.item}</span>
                      <span className="bold">{order.total}</span>
                      <span>
                        <span
                          className={`status-pill ${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </span>
                      <span className="align-right actions">
                        <a
                          className="btn-detail"
                          href={`#manage-${sanitizeId(order.id)}`}
                        >
                          Kelola
                        </a>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="project-table-empty">
                    {query || normalizedStatus
                      ? "Tidak ada data pesanan."
                      : "Belum ada pesanan."}
                  </div>
                )}
              </div>

              {filteredOrders.map((order) => (
                <div
                  key={`${order.id}-manage`}
                  id={`manage-${sanitizeId(order.id)}`}
                  className="project-modal"
                >
                  <div className="project-modal-card">
                    <div className="project-modal-header">
                      <h2>Detail Pesanan</h2>
                      <a className="project-modal-close" href="#">
                        x
                      </a>
                    </div>
                    <div className="project-form">
                      <label>
                        Order ID
                        <input value={order.id} readOnly />
                      </label>
                      <label>
                        Daftar Pesanan
                        <input value={order.item} readOnly />
                      </label>
                      <label>
                        Total Pesanan
                        <input value={order.total} readOnly />
                      </label>
                      <label>
                        Nama Customer
                        <input value={order.customer} readOnly />
                      </label>
                      <label>
                        Jenis Pembayaran
                        <input value={order.paymentType} readOnly />
                      </label>
                      <label>
                        Bukti Transaksi
                        {order.paymentProof ? (
                          resolveProofUrl(order.paymentProof)
                            .toLowerCase()
                            .endsWith(".pdf") ? (
                            <a
                              className="proof-link"
                              href={resolveProofUrl(order.paymentProof)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Lihat Bukti (PDF)
                            </a>
                          ) : (
                            <a
                              className="proof-link"
                              href={resolveProofUrl(order.paymentProof)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                className="proof-image"
                                src={resolveProofUrl(order.paymentProof)}
                                alt={`Bukti ${order.id}`}
                              />
                              Buka Bukti
                            </a>
                          )
                        ) : (
                          <input value="-" readOnly />
                        )}
                      </label>
                      <label>
                        Status
                        <input value={order.status} readOnly />
                      </label>
                      <div className="project-form-actions">
                        <form method="post" action="/api/orders/confirm">
                          <input type="hidden" name="orderId" value={order.id} />
                          <button className="btn-confirm" type="submit">
                            Konfirmasi Pembayaran
                          </button>
                        </form>
                        <a href="#" className="ghost">
                          Tutup
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="project-footer">
                <div className="project-showing">
                  <span>Showing</span>
                  <button className="select" type="button" suppressHydrationWarning>
                    {filteredOrders.length} <span className="caret">v</span>
                  </button>
                  <span>of {totalOrders}</span>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
