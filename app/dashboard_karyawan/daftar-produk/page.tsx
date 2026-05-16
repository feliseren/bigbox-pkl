import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";
import { EmployeeProfileMenu } from "@/components/employee-profile-menu";
import { EmployeeSidebar } from "@/components/employee-sidebar";
import { ProductActionButtons } from "@/components/product-action-buttons";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";

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
    ? await prisma.employee.findUnique({ where: { id: employeeId }, include: { role: true } })
    : null;
  const canManageProducts =
    employee?.role.name === "ADMIN" || employee?.role.name === "MARKETING";
  const [bigAssistant, bigLegal, bigSocial, bigVision, orders] = await Promise.all([
    prisma.product.findMany({ where: { category: { categoryName: "Big Assistant" } }, orderBy: { id: "desc" } }),
    prisma.product.findMany({ where: { category: { categoryName: "Big Legal" } }, orderBy: { id: "desc" } }),
    prisma.product.findMany({ where: { category: { categoryName: "Big Social" } }, orderBy: { id: "desc" } }),
    prisma.product.findMany({ where: { category: { categoryName: "Big Vision" } }, orderBy: { id: "desc" } }),
    prisma.order.findMany({
      where: { statusPesanan: "Done" },
      include: { product: { include: { category: true } } },
    }),
  ]);
  const orderCounts = new Map<string, number>();
  orders.forEach((order) => {
    orderCounts.set(order.productId, (orderCounts.get(order.productId) ?? 0) + 1);
  });
  const productSections: ProductSection[] = [
    {
      title: "Big Assistant",
      items: bigAssistant.map((item) => ({
        id: item.id,
        name: item.namaProduk,
        price: item.hargaProduk,
        soldTo: String(orderCounts.get(item.id) ?? 0),
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
        soldTo: String(orderCounts.get(item.id) ?? 0),
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
        soldTo: String(orderCounts.get(item.id) ?? 0),
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
        soldTo: String(orderCounts.get(item.id) ?? 0),
        description: item.deskripsiProduk,
        duration: item.durasiProduk,
      })),
    },
  ];

  return (
    <div className="project-layout">
      <div className="project-shell">
        <EmployeeSidebar active="produk" />

        <div className="project-main">
          <header className="project-header">
            <div>
              <h1 className="project-title">Daftar Produk</h1>
              <p className="project-subtitle">Kelola katalog, harga, dan detail produk.</p>
            </div>
            <EmployeeProfileMenu
              fullName={employee?.fullName ?? "Karyawan"}
              employeeId={employee?.id ?? "-"}
            />
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
                          <ProductActionButtons
                            canManage={canManageProducts}
                            editHref={`#edit-${productSlugByTitle[section.title]}-${sanitizeId(
                              item.id
                            )}`}
                          />
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
                  {canManageProducts
                    ? section.items.map((item) => (
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
                                <ConfirmDeleteButton
                                  className="btn-delete"
                                  formAction="/api/products/delete"
                                />
                                <button className="btn-update" type="submit">
                                  Update
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      ))
                    : null}
                  {canManageProducts ? (
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
                                  durationPlaceholderByTitle[section.title] ||
                                  "per bulan"
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
                  ) : null}
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}


