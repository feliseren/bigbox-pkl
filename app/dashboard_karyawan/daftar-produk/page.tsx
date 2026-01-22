import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";

export const dynamic = "force-dynamic";

type ProductItem = {
  id: string;
  name: string;
  price: string;
  soldTo: string;
  description: string;
  duration: string;
};

type ProductSection = {
  title: string;
  items: ProductItem[];
};

const productSlugByTitle: Record<string, string> = {
  "Big Assistant": "big-assistant",
  "Big Legal": "big-legal",
  "Big Social": "big-social",
  "Big Vision": "big-vision",
};

const toUpperTitle = (title: string) => title.toUpperCase();
const sanitizeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "");
const durationPlaceholderByTitle: Record<string, string> = {
  "Big Assistant": "per bulan",
  "Big Legal": "per tahun",
  "Big Social": "per bulan",
  "Big Vision": "per tahun",
};

export default async function DaftarProdukPage() {
  const employeeId = await readEmployeeSessionId();
  const employee = employeeId
    ? await prisma.employee.findUnique({ where: { id: employeeId } })
    : null;
  const [bigAssistant, bigLegal, bigSocial, bigVision, orders] = await Promise.all([
    prisma.bigAssistant.findMany({ orderBy: { id: "desc" } }),
    prisma.bigLegal.findMany({ orderBy: { id: "desc" } }),
    prisma.bigSocial.findMany({ orderBy: { id: "desc" } }),
    prisma.bigVision.findMany({ orderBy: { id: "desc" } }),
    prisma.order.findMany({ where: { statusPesanan: "Done" } }),
  ]);
  const orderCounts = {
    BIG_ASSISTANT: new Map<string, number>(),
    BIG_LEGAL: new Map<string, number>(),
    BIG_SOCIAL: new Map<string, number>(),
    BIG_VISION: new Map<string, number>(),
  };
  orders.forEach((order) => {
    const bucket = orderCounts[order.productType];
    bucket.set(order.productId, (bucket.get(order.productId) ?? 0) + 1);
  });
  const productSections: ProductSection[] = [
    {
      title: "Big Assistant",
      items: bigAssistant.map((item) => ({
        id: item.id,
        name: item.namaProduk,
        price: item.hargaProduk,
        soldTo: String(orderCounts.BIG_ASSISTANT.get(item.id) ?? 0),
        description: item.deskripsiProduk,
        duration: item.durasiProduk,
      })),
    },
    {
      title: "Big Legal",
      items: bigLegal.map((item) => ({
        id: item.id,
        name: item.namaProduk,
        price: item.hargaProduk,
        soldTo: String(orderCounts.BIG_LEGAL.get(item.id) ?? 0),
        description: item.deskripsiProduk,
        duration: item.durasiProduk,
      })),
    },
    {
      title: "Big Social",
      items: bigSocial.map((item) => ({
        id: item.id,
        name: item.namaProduk,
        price: item.hargaProduk,
        soldTo: String(orderCounts.BIG_SOCIAL.get(item.id) ?? 0),
        description: item.deskripsiProduk,
        duration: item.durasiProduk,
      })),
    },
    {
      title: "Big Vision",
      items: bigVision.map((item) => ({
        id: item.id,
        name: item.namaProduk,
        price: item.hargaProduk,
        soldTo: String(orderCounts.BIG_VISION.get(item.id) ?? 0),
        description: item.deskripsiProduk,
        duration: item.durasiProduk,
      })),
    },
  ];

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
            <a
              className="project-link active"
              href="/dashboard_karyawan/daftar-produk"
            >
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
            <a className="project-link" href="/dashboard_karyawan/daftar-pemesanan">
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
            <h1 className="project-title">Daftar Produk</h1>
            <div className="project-user">
              <span>{employee?.fullName ?? "Karyawan"}</span>
              <span className="project-avatar" />
              <span className="project-bell" />
            </div>
          </header>

          <main className="project-content">
            <div className="product-grid">
              {productSections.map((section) => (
                <section key={section.title} className="product-section">
                  <div className="product-section-header">
                    <h2>{section.title}</h2>
                    {productSlugByTitle[section.title] ? (
                      <a
                        className="product-section-icon"
                        href={`/dashboard_karyawan/daftar-produk/${productSlugByTitle[section.title]}`}
                      >
                        &gt;
                      </a>
                    ) : (
                      <span className="product-section-icon">&gt;</span>
                    )}
                  </div>
                  <div className="product-table">
                    <div className="product-table-header">
                      <span>NAMA PRODUK</span>
                      <span>HARGA PRODUK</span>
                      <span>TERJUAL</span>
                      <span className="align-right">AKSI</span>
                    </div>
                    {section.items.map((item) => (
                      <div key={item.id} className="product-row">
                        <span>{item.name}</span>
                        <span>{item.price}</span>
                        <span>{item.soldTo}</span>
                        <span className="align-right product-actions">
                          <a
                            className="btn-detail"
                            href={`#detail-${productSlugByTitle[section.title]}-${sanitizeId(
                              item.id,
                            )}`}
                          >
                            Detail
                          </a>
                          <a
                            className="btn-edit"
                            href={`#edit-${productSlugByTitle[section.title]}-${sanitizeId(
                              item.id
                            )}`}
                          >
                            Edit
                          </a>
                          <button className="btn-delete" type="button">
                            Delete
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="product-footer">
                    {productSlugByTitle[section.title] ? (
                      <a
                        className="product-more"
                        href={`/dashboard_karyawan/daftar-produk/${productSlugByTitle[section.title]}`}
                      >
                        Selengkapnya
                      </a>
                    ) : (
                      <button className="product-more" type="button">
                        Selengkapnya
                      </button>
                    )}
                  </div>
                  {section.items.map((item) => (
                    <div
                      key={`detail-${section.title}-${item.id}`}
                      id={`detail-${productSlugByTitle[section.title]}-${sanitizeId(
                        item.id,
                      )}`}
                      className="project-modal"
                    >
                      <div className="project-modal-card">
                        <div className="project-modal-header">
                          <h2>Detail Produk</h2>
                          <a className="project-modal-close" href="#">
                            x
                          </a>
                        </div>
                        <div className="project-form">
                          <label>
                            Nama Produk
                            <input value={item.name} readOnly />
                          </label>
                          <label>
                            Harga Produk
                            <input value={item.price} readOnly />
                          </label>
                          <label>
                            Deskripsi Produk
                            <input value={item.description} readOnly />
                          </label>
                          <label>
                            Total Penjualan
                            <input value={item.soldTo} readOnly />
                          </label>
                          <div className="project-form-actions">
                            <a href="#" className="ghost">
                              Tutup
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {section.items.map((item) => (
                    <div
                      key={`edit-${section.title}-${item.id}`}
                      id={`edit-${productSlugByTitle[section.title]}-${sanitizeId(
                        item.id
                      )}`}
                      className="project-modal"
                    >
                      <div className="product-form-card">
                        <div className="product-form-header">
                          <a className="product-back" href="#">
                            &lt; Back
                          </a>
                          <h2>{toUpperTitle(section.title)}</h2>
                        </div>
                        <form
                          className="product-form"
                          method="post"
                          action="/api/products/update"
                        >
                          <input
                            type="hidden"
                            name="productType"
                            value={productSlugByTitle[section.title]}
                          />
                          <input type="hidden" name="productId" value={item.id} />
                          <input
                            type="hidden"
                            name="redirect"
                            value="/dashboard_karyawan/daftar-produk"
                          />
                          <div className="product-form-row">
                            <label>
                              Nama Produk
                              <input
                                name="name"
                                defaultValue={item.name}
                                required
                              />
                            </label>
                            <label>
                              Harga Produk
                              <input
                                name="price"
                                defaultValue={item.price}
                                required
                              />
                            </label>
                            <label>
                              Durasi
                              <input
                                name="duration"
                                defaultValue={item.duration}
                                required
                              />
                            </label>
                          </div>
                          <label className="product-form-full">
                            Deskripsi Produk
                            <textarea
                              name="description"
                              rows={4}
                              defaultValue={item.description}
                            />
                          </label>
                          <div className="product-form-actions">
                            <button
                              className="btn-delete"
                              type="submit"
                              formAction="/api/products/delete"
                            >
                              Delete
                            </button>
                            <button className="btn-update" type="submit">
                              Update
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  ))}
                  <div
                    id={`new-${productSlugByTitle[section.title]}`}
                    className="project-modal"
                  >
                    <div className="product-form-card">
                      <div className="product-form-header">
                        <a className="product-back" href="#">
                          &lt; Back
                        </a>
                        <h2>{toUpperTitle(section.title)}</h2>
                      </div>
                      <form
                        className="product-form"
                        method="post"
                        action="/api/products"
                      >
                        <input
                          type="hidden"
                          name="productType"
                          value={productSlugByTitle[section.title]}
                        />
                        <input
                          type="hidden"
                          name="redirect"
                          value="/dashboard_karyawan/daftar-produk"
                        />
                        <div className="product-form-row">
                          <label>
                            Nama Produk
                            <input name="name" placeholder="Nama produk" required />
                          </label>
                          <label>
                            Harga Produk
                            <input name="price" placeholder="Harga produk" required />
                          </label>
                          <label>
                            Durasi
                            <input
                              name="duration"
                              placeholder={
                                durationPlaceholderByTitle[section.title] || "per bulan"
                              }
                              required
                            />
                          </label>
                        </div>
                        <label className="product-form-full">
                          Deskripsi Produk
                          <textarea name="description" rows={4} required />
                        </label>
                        <div className="product-form-actions">
                          <button type="submit">Tambahkan</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
