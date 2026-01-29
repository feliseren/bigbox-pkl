import Image from "next/image";

type EmployeeSidebarProps = {
  active?:
    | "dashboard"
    | "produk"
    | "projek"
    | "success"
    | "berita"
    | "whats-new"
    | "pemesanan"
    | "kontak";
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
    label: "Daftar Projek",
    href: "/dashboard_karyawan/daftar-projek",
  },
  {
    key: "success",
    label: "Success History",
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
] as const;

export function EmployeeSidebar({ active }: EmployeeSidebarProps) {
  return (
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
        {menuItems.map((item) => (
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
          Logout
        </button>
      </form>
    </aside>
  );
}
