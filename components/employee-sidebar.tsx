import Image from "next/image";
import { redirect } from "next/navigation";
import { readCurrentEmployee } from "@/lib/employee-session";
import { normalizeEmployeeRole } from "@/lib/employee-role";

type EmployeeSidebarProps = {
  active?:
    | "dashboard"
    | "produk"
    | "projek"
    | "profile"
    | "success"
    | "berita"
    | "whats-new"
    | "pemesanan"
    | "kontak"
    | "akun";
};

const menuItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard_karyawan",
  },
  {
    key: "produk",
    label: "Daftar Produk",
    href: "/dashboard_karyawan/daftar-produk",
  },
  {
    key: "projek",
    label: "Daftar Proyek",
    href: "/dashboard_karyawan/daftar-projek",
  },
  {
    key: "success",
    label: "Cerita Sukses",
    href: "/dashboard_karyawan/success-history",
  },
  {
    key: "berita",
    label: "Daftar Berita",
    href: "/dashboard_karyawan/daftar-berita",
  },
  {
    key: "whats-new",
    label: "Daftar Pembaruan",
    href: "/dashboard_karyawan/whats-new",
  },
  {
    key: "pemesanan",
    label: "Daftar Pemesanan",
    href: "/dashboard_karyawan/daftar-pemesanan",
  },
  {
    key: "kontak",
    label: "Kontak Pelanggan",
    href: "/dashboard_karyawan/kontak-pelanggan",
  },
  {
    key: "akun",
    label: "Kelola Akun",
    href: "/dashboard_karyawan/kelola-akun",
  },
] as const;

export async function EmployeeSidebar({ active }: EmployeeSidebarProps) {
  const employee = await readCurrentEmployee();
  if (employee?.mustChangePassword && active !== "profile") {
    redirect("/dashboard_karyawan/profile?forceReset=1");
  }
  const isAdmin = normalizeEmployeeRole(employee?.role) === "admin";
  const visibleMenuItems = menuItems.filter(
    (item) => item.key !== "akun" || isAdmin,
  );

  return (
    <>
      <div className="project-mobile-nav">
        <details className="project-mobile-nav-details">
          <summary className="project-mobile-nav-summary">
            <span>Menu Dashboard</span>
            <span aria-hidden="true">+</span>
          </summary>
          <div className="project-mobile-nav-panel">
            <div className="project-mobile-brand">
              <Image
                src="/bigbox_logo-removebg-preview.png"
                alt="BigBox logo"
                width={160}
                height={52}
                className="project-logo"
              />
            </div>
            <nav className="project-mobile-links">
              {visibleMenuItems.map((item) => (
                <a
                  key={item.key}
                  className={`project-link${active === item.key ? " active" : ""}`}
                  href={item.href}
                >
                  <span className="project-link-label">{item.label}</span>
                </a>
              ))}
            </nav>
            <form
              className="project-logout-form"
              method="post"
              action="/api/logout_karyawan"
            >
              <button className="project-logout" type="submit">
                Keluar
              </button>
            </form>
          </div>
        </details>
      </div>

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
          {visibleMenuItems.map((item) => (
            <a
              key={item.key}
              className={`project-link${active === item.key ? " active" : ""}`}
              href={item.href}
            >
              <span className="project-link-label">{item.label}</span>
            </a>
          ))}
        </nav>
        <form
          className="project-logout-form"
          method="post"
          action="/api/logout_karyawan"
        >
          <button className="project-logout" type="submit">
            Keluar
          </button>
        </form>
      </aside>
    </>
  );
}
