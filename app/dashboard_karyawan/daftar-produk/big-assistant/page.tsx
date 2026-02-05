import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";
import { ProductActionButtons } from "@/components/product-action-buttons";
import { EmployeeSidebar } from "@/components/employee-sidebar";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";

export const dynamic = "force-dynamic";

type ProductRow = {
  id: string;
  name: string;
  price: string;
  soldTo: string;
  description: string;
  duration: string;
};

const sanitizeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "");

export default async function BigAssistantPage() {
  const employeeId = await readEmployeeSessionId();
  const employee = employeeId
    ? await prisma.employee.findUnique({ where: { id: employeeId } })
    : null;
  const canManageProducts =
    employee?.role === "ADMIN" || employee?.role === "MARKETING";
  const [products, orders] = await Promise.all([
    prisma.bigAssistant.findMany({ orderBy: { id: "desc" } }),
    prisma.order.findMany({
      where: { productType: "BIG_ASSISTANT", statusPesanan: "Done" },
    }),
  ]);
  const orderCounts = new Map<string, number>();
  orders.forEach((order) => {
    orderCounts.set(order.productId, (orderCounts.get(order.productId) ?? 0) + 1);
  });
  const rows: ProductRow[] = products.map((item) => ({
    id: item.id,
    name: item.namaProduk,
    price: item.hargaProduk,
    soldTo: String(orderCounts.get(item.id) ?? 0),
    description: item.deskripsiProduk,
    duration: item.durasiProduk,
  }));

  return (
    <div className="project-layout">
      <div className="project-shell">
        <EmployeeSidebar active="produk" />

        <div className="project-main">
          <header className="project-header product-detail-header">
            <div className="product-detail-title">
              <a className="product-back" href="/dashboard_karyawan/daftar-produk">
                &lt; Back
              </a>
              <h1>BIG ASSISTANT</h1>
            </div>
            <div className="product-detail-user">
              <span>{employee?.fullName ?? "Karyawan"}</span>
              <span className="project-avatar" />
              <span className="project-bell" />
            </div>
          </header>

          <main className="project-content">
            <section className="product-detail-card">
              {canManageProducts ? (
                <a className="product-new-btn" href="#new-product">
                  New Product
                </a>
              ) : null}
              <div className="product-detail-table">
                <div className="product-detail-header-row">
                  <span>NAMA PRODUK</span>
                  <span>HARGA PRODUK</span>
                  <span>TERJUAL</span>
                  <span className="align-right">AKSI</span>
                </div>
                {rows.map((row) => (
                  <div key={row.id} className="product-detail-row">
                    <span>{row.name}</span>
                    <span>{row.price}</span>
                    <span>{row.soldTo}</span>
                    <span className="align-right product-actions">
                      <a
                        className="btn-detail"
                        href={`#detail-product-${sanitizeId(row.id)}`}
                      >
                        Detail
                      </a>
                      <ProductActionButtons
                        canManage={canManageProducts}
                        editHref={`#edit-product-${sanitizeId(row.id)}`}
                      />
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {canManageProducts ? (
              <div id="new-product" className="project-modal">
                <div className="product-form-card">
                  <div className="product-form-header">
                    <a className="product-back" href="#">
                      &lt; Back
                    </a>
                    <h2>BIG ASSISTANT</h2>
                  </div>
                  <form className="product-form" method="post" action="/api/products">
                    <input type="hidden" name="productType" value="big-assistant" />
                    <input
                      type="hidden"
                      name="redirect"
                      value="/dashboard_karyawan/daftar-produk/big-assistant"
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
                        <input name="duration" placeholder="per bulan" required />
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

            {rows.map((row) => (
              <div
                key={`detail-${row.id}`}
                id={`detail-product-${sanitizeId(row.id)}`}
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
                      <input value={row.name} readOnly />
                    </label>
                    <label>
                      Harga Produk
                      <input value={row.price} readOnly />
                    </label>
                    <label>
                      Deskripsi Produk
                      <input value={row.description} readOnly />
                    </label>
                    <label>
                      Total Penjualan
                      <input value={row.soldTo} readOnly />
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
              ? rows.map((row) => (
                  <div
                    key={`edit-${row.id}`}
                    id={`edit-product-${sanitizeId(row.id)}`}
                    className="project-modal"
                  >
                    <div className="product-form-card">
                      <div className="product-form-header">
                        <a className="product-back" href="#">
                          &lt; Back
                        </a>
                        <h2>BIG ASSISTANT</h2>
                      </div>
                      <form
                        className="product-form"
                        method="post"
                        action="/api/products/update"
                      >
                        <input type="hidden" name="productType" value="big-assistant" />
                        <input type="hidden" name="productId" value={row.id} />
                        <input
                          type="hidden"
                          name="redirect"
                          value="/dashboard_karyawan/daftar-produk/big-assistant"
                        />
                        <div className="product-form-row">
                          <label>
                            Nama Produk
                            <input name="name" defaultValue={row.name} required />
                          </label>
                          <label>
                            Harga Produk
                            <input name="price" defaultValue={row.price} required />
                          </label>
                          <label>
                            Durasi
                            <input
                              name="duration"
                              defaultValue={row.duration}
                              required
                            />
                          </label>
                        </div>
                        <label className="product-form-full">
                          Deskripsi Produk
                          <textarea
                            name="description"
                            rows={4}
                            defaultValue={row.description}
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
          </main>
        </div>
      </div>
    </div>
  );
}
