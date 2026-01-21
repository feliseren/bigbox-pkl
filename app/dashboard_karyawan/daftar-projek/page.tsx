import Image from "next/image";
import type { Prisma, Project } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";
import { ProjectStatusSelect } from "@/components/project-status-select";

export const dynamic = "force-dynamic";

export default async function DaftarProjekPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string | string[]; status?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const employeeId = await readEmployeeSessionId();
  const employee = employeeId
    ? await prisma.employee.findUnique({ where: { id: employeeId } })
    : null;
  const rawQuery = resolvedSearchParams?.q;
  const rawStatus = resolvedSearchParams?.status;
  const query =
    (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery)?.trim() ?? "";
  const statusFilter = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus;
  const normalizedStatus =
    statusFilter === "Process" || statusFilter === "Done" ? statusFilter : undefined;
  const buildTabHref = (status?: "Process" | "Done") => {
    const params = new URLSearchParams();
    if (query) {
      params.set("q", query);
    }
    if (status) {
      params.set("status", status);
    }
    const queryString = params.toString();
    return `/dashboard_karyawan/daftar-projek${queryString ? `?${queryString}` : ""}`;
  };
  const where: Prisma.ProjectWhereInput | undefined =
    query || normalizedStatus
      ? {
          AND: [
            ...(query
              ? [
                  {
                    OR: [
                      { id: { contains: query } },
                      { startLabel: { contains: query } },
                      { targetLabel: { contains: query } },
                      { owner: { contains: query } },
                      { status: { contains: query } },
                    ],
                  },
                ]
              : []),
            ...(normalizedStatus ? [{ status: normalizedStatus }] : []),
          ],
        }
      : undefined;
  const projects: Project[] = await prisma.project.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  const totalProjects = await prisma.project.count({ where });
  const hasProjects = projects.length > 0;
  const sanitizeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "");

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
            <a className="project-link active" href="/dashboard_karyawan/daftar-projek">
              Daftar Projek
            </a>
            <a className="project-link" href="#">
              Success History
            </a>
            <a className="project-link" href="/dashboard_karyawan/daftar-pemesanan">
              Daftar Pemesanan
            </a>
            <a className="project-link" href="/dashboard_karyawan/kontak-pelanggan">
              Kontak Pelanggan
            </a>
          </nav>
        </aside>

        <div className="project-main">
          <header className="project-header">
            <h1 className="project-title">Daftar Project</h1>
            <div className="project-user">
              <span>{employee?.fullName ?? "Karyawan"}</span>
              <span className="project-avatar" />
              <span className="project-bell" />
            </div>
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
                      normalizedStatus === "Process" ? " active" : ""
                    }`}
                    href={buildTabHref("Process")}
                  >
                    Process
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
                  action="/dashboard_karyawan/daftar-projek"
                >
                  {normalizedStatus ? (
                    <input type="hidden" name="status" value={normalizedStatus} />
                  ) : null}
                  <input
                    name="q"
                    placeholder="Search project"
                    defaultValue={query}
                  />
                  <button className="project-search-icon" type="submit">
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
                  <span>PROJECT ID</span>
                  <span>TANGGAL MULAI</span>
                  <span>TARGET SELESAI</span>
                  <span>PENANGGUNG JAWAB</span>
                  <span>STATUS</span>
                  <span className="align-right">AKSI</span>
                </div>
                {hasProjects ? (
                  projects.map((project) => (
                    <div key={project.id} className="project-table-row">
                      <span className="bold">{project.id}</span>
                      <span>{project.startLabel}</span>
                      <span className="bold">{project.targetLabel}</span>
                      <span>{project.owner}</span>
                      <span>
                        <ProjectStatusSelect
                          projectId={project.id}
                          initialStatus={
                            project.status === "Done" ? "Done" : "Process"
                          }
                        />
                      </span>
                      <span className="align-right actions">
                        <a
                          className="btn-edit"
                          href={`#edit-${sanitizeId(project.id)}`}
                        >
                          Edit
                        </a>
                        <form method="post" action="/api/projects/delete">
                          <input
                            type="hidden"
                            name="projectId"
                            value={project.id}
                          />
                          <button className="btn-delete" type="submit">
                            Delete
                          </button>
                        </form>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="project-table-empty">
                    {query
                      ? "Tidak ada hasil pencarian."
                      : "Belum ada data project."}
                  </div>
                )}
              </div>

              <div className="project-footer">
                <div className="project-showing">
                  <span>Showing</span>
                  <button className="select" type="button">
                    {projects.length} <span className="caret">v</span>
                  </button>
                  <span>of {totalProjects}</span>
                </div>
              </div>

              <div className="project-new">
                <a className="project-new-button" href="#new-project">
                  New Project
                </a>
              </div>
            </section>

            <div id="new-project" className="project-modal">
              <div className="project-modal-card">
                <div className="project-modal-header">
                  <h2>Tambah Project</h2>
                  <a className="project-modal-close" href="#">
                    x
                  </a>
                </div>
                <form className="project-form" method="post" action="/api/projects">
                  <label>
                    Project ID
                    <input name="projectId" placeholder="#6548" required />
                  </label>
                  <label>
                    Tanggal Mulai
                    <input name="startLabel" type="date" required />
                  </label>
                  <label>
                    Target Selesai
                    <input name="targetLabel" type="date" required />
                  </label>
                  <label>
                    Penanggung Jawab
                    <input name="owner" placeholder="Joseph Wheeler" required />
                  </label>
                  <label>
                    Status
                    <select name="status" defaultValue="Process" required>
                      <option value="Process">Process</option>
                      <option value="Done">Done</option>
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

            {projects.map((project) => {
              const modalId = `edit-${sanitizeId(project.id)}`;
              return (
                <div key={`${project.id}-modal`} id={modalId} className="project-modal">
                  <div className="project-modal-card">
                    <div className="project-modal-header">
                      <h2>Edit Project</h2>
                      <a className="project-modal-close" href="#">
                        x
                      </a>
                    </div>
                    <form
                      className="project-form"
                      method="post"
                      action="/api/projects/update"
                    >
                      <input type="hidden" name="projectId" value={project.id} />
                      <label>
                        Project ID
                        <input value={project.id} disabled />
                      </label>
                      <label>
                        Tanggal Mulai
                        <input
                          name="startLabel"
                          type="date"
                          defaultValue={project.startLabel}
                          required
                        />
                      </label>
                      <label>
                        Target Selesai
                        <input
                          name="targetLabel"
                          type="date"
                          defaultValue={project.targetLabel}
                          required
                        />
                      </label>
                      <label>
                        Penanggung Jawab
                        <input
                          name="owner"
                          defaultValue={project.owner}
                          required
                        />
                      </label>
                      <label>
                        Status
                        <select name="status" defaultValue={project.status}>
                          <option value="Process">Process</option>
                          <option value="Done">Done</option>
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
              );
            })}
          </main>
        </div>
      </div>
    </div>
  );
}





