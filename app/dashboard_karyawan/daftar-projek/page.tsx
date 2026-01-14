import Image from "next/image";
import type { Project } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";
import { ProjectStatusSelect } from "@/components/project-status-select";

export const dynamic = "force-dynamic";

export default async function DaftarProjekPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const employeeId = await readEmployeeSessionId();
  const employee = employeeId
    ? await prisma.employee.findUnique({ where: { id: employeeId } })
    : null;
  const rawQuery = resolvedSearchParams?.q;
  const query =
    (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery)?.trim() ?? "";
  const projects: Project[] = await prisma.project.findMany({
    where: query
      ? {
          OR: [
            { id: { contains: query, mode: "insensitive" } },
            { startLabel: { contains: query, mode: "insensitive" } },
            { targetLabel: { contains: query, mode: "insensitive" } },
            { owner: { contains: query, mode: "insensitive" } },
            { status: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });
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
            <a className="project-link" href="#">
              Daftar Produk
            </a>
            <a className="project-link active" href="/dashboard_karyawan/daftar-projek">
              Daftar Projek
            </a>
            <a className="project-link" href="#">
              Success History
            </a>
            <a className="project-link" href="#">
              Daftar Pemesanan
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
                  <button className="project-tab active" type="button">
                    Show All
                  </button>
                  <button className="project-tab" type="button">
                    Process
                  </button>
                  <button className="project-tab" type="button">
                    Done
                  </button>
                </div>
                <form
                  className="project-search"
                  method="get"
                  action="/dashboard_karyawan/daftar-projek"
                >
                  <input
                    name="q"
                    placeholder="Search project"
                    defaultValue={query}
                  />
                  <button className="project-search-icon" type="submit">
                    🔍
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
                    10 <span className="caret">▾</span>
                  </button>
                  <span>of 50</span>
                </div>
                <div className="project-pagination">
                  <button type="button">‹</button>
                  <button className="active" type="button">
                    1
                  </button>
                  <button type="button">2</button>
                  <button type="button">3</button>
                  <button type="button">4</button>
                  <button type="button">5</button>
                  <button type="button">›</button>
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
                    ✕
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
                        ✕
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
