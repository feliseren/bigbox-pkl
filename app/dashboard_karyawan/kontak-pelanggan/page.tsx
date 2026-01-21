import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";

const TIME_ZONE = "Asia/Jakarta";

function formatDate(value: Date) {
  const parts = new Intl.DateTimeFormat("id-ID", {
    timeZone: TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(value);
  const lookup: Record<string, string> = {};
  parts.forEach((part) => {
    if (part.type !== "literal") {
      lookup[part.type] = part.value;
    }
  });
  return `${lookup.day}-${lookup.month}-${lookup.year}`;
}

const sanitizeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "");
const sanitizePhone = (value: string) => value.replace(/[^0-9]/g, "");
const buildWhatsappLink = (code: string, number: string) => {
  const full = `${sanitizePhone(code)}${sanitizePhone(number)}`;
  return `https://wa.me/${full}`;
};

export default async function KontakPelangganPage() {
  const employeeId = await readEmployeeSessionId();
  const employee = employeeId
    ? await prisma.employee.findUnique({ where: { id: employeeId } })
    : null;
  const contacts = await prisma.customerContact.findMany({
    orderBy: { createdAt: "desc" },
  });
  const hasContacts = contacts.length > 0;

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
            <a className="project-link" href="#">
              Success History
            </a>
            <a className="project-link" href="/dashboard_karyawan/daftar-pemesanan">
              Daftar Pemesanan
            </a>
            <a className="project-link active" href="/dashboard_karyawan/kontak-pelanggan">
              Kontak Pelanggan
            </a>
          </nav>
        </aside>

        <div className="project-main">
          <header className="project-header">
            <h1 className="project-title">Kontak Pelanggan</h1>
            <div className="project-user">
              <span>{employee?.fullName ?? "Karyawan"}</span>
              <span className="project-avatar" />
              <span className="project-bell" />
            </div>
          </header>

          <main className="project-content">
            <section className="project-card">
              <div className="project-table contact-table">
                <div className="project-table-header">
                  <span>TANGGAL</span>
                  <span>NAMA</span>
                  <span>PERUSAHAAN</span>
                  <span>EMAIL</span>
                  <span>HANDPHONE</span>
                  <span>INDUSTRI</span>
                  <span>PESAN</span>
                  <span className="align-right">AKSI</span>
                </div>
                {hasContacts ? (
                  contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="project-table-row"
                    >
                      <span className="bold">{formatDate(contact.createdAt)}</span>
                      <span className="truncate" title={contact.fullName}>
                        {contact.fullName}
                      </span>
                      <span className="truncate" title={contact.companyName}>
                        {contact.companyName}
                      </span>
                      <span className="truncate" title={contact.companyEmail}>
                        {contact.companyEmail}
                      </span>
                      <span>
                        {contact.phoneCode} {contact.phoneNumber}
                      </span>
                      <span className="truncate" title={contact.industryOther || contact.industry}>
                        {contact.industry === "other"
                          ? contact.industryOther || "Lainnya"
                          : contact.industry}
                      </span>
                      <span className="truncate" title={contact.message}>
                        {contact.message}
                      </span>
                      <span className="align-right">
                        <a
                          className="btn-detail"
                          href={`#contact-${sanitizeId(contact.id)}`}
                        >
                          Detail
                        </a>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="project-table-empty">
                    Belum ada request pelanggan.
                  </div>
                )}
              </div>
              {contacts.map((contact) => (
                <div
                  key={`contact-${contact.id}`}
                  id={`contact-${sanitizeId(contact.id)}`}
                  className="project-modal"
                >
                  <div className="project-modal-card">
                    <div className="project-modal-header">
                      <h2>Detail Request</h2>
                      <a className="project-modal-close" href="#">
                        x
                      </a>
                    </div>
                    <div className="project-form">
                      <label>
                        Tanggal
                        <input value={formatDate(contact.createdAt)} readOnly />
                      </label>
                      <label>
                        Nama
                        <input value={contact.fullName} readOnly />
                      </label>
                      <label>
                        Perusahaan
                        <input value={contact.companyName} readOnly />
                      </label>
                      <label>
                        Email
                        <input value={contact.companyEmail} readOnly />
                      </label>
                      <label>
                        Handphone
                        <input
                          value={`${contact.phoneCode} ${contact.phoneNumber}`}
                          readOnly
                        />
                      </label>
                      <div className="project-form-actions">
                        <a
                          className="btn-detail btn-wa"
                          href={buildWhatsappLink(contact.phoneCode, contact.phoneNumber)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Hubungi via WhatsApp
                        </a>
                      </div>
                      <label>
                        Industri
                        <input
                          value={
                            contact.industry === "other"
                              ? contact.industryOther || "Lainnya"
                              : contact.industry
                          }
                          readOnly
                        />
                      </label>
                      <label>
                        Pesan
                        <textarea value={contact.message} rows={4} readOnly />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
