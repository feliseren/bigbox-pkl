import Image from "next/image";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeEmployeeRole } from "@/lib/employee-role";
import { readEmployeeSessionId } from "@/lib/auth";
import { ProjectStatusSelect } from "@/components/project-status-select";
import { EmployeeProfileMenu } from "@/components/employee-profile-menu";
import { ProjectActionButtons } from "@/components/project-action-buttons";
import { ProjectCreateButton } from "@/components/project-create-button";
import { EmployeeSidebar } from "@/components/employee-sidebar";

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
  const roleName = normalizeEmployeeRole(employee?.role);
  const canManageProjects =
    roleName === "project manager" || roleName === "project_management";
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
                      { employee: { fullName: { contains: query } } },
                      { status: { contains: query } },
                    ],
                  },
                ]
              : []),
            ...(normalizedStatus ? [{ status: normalizedStatus }] : []),
          ],
        }
      : undefined;
  const projects = await prisma.project.findMany({
    where,
    include: { employee: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
  });
  const totalProjects = await prisma.project.count({ where });
  const hasProjects = projects.length > 0;
  const sanitizeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <div className="project-layout">
      <div className="project-shell">
        <EmployeeSidebar active="projek" />

        <div className="project-main">
          <header className="project-header">
            <div>
              <h1 className="project-title">Daftar Proyek</h1>
              <p className="project-subtitle">Pantau status dan progres proyek berjalan.</p>
            </div>
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
                    Semua
                  </a>
                  <a
                    className={`project-tab${
                      normalizedStatus === "Process" ? " active" : ""
                    }`}
                    href={buildTabHref("Process")}
                  >
                    Sedang Berlangsung
                  </a>
                  <a
                    className={`project-tab${
                      normalizedStatus === "Done" ? " active" : ""
                    }`}
                    href={buildTabHref("Done")}
                  >
                    Selesai
                  </a>
                </div>
                <form
                  className="project-search"
                  method="get"
                  action="/dashboard_karyawan/daftar-projek"
                  suppressHydrationWarning
                >
                  {normalizedStatus ? (
                    <input type="hidden" name="status" value={normalizedStatus} />
                  ) : null}
                  <input
                    name="q"
                    placeholder="Cari proyek"
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
                      <span>{project.employee.fullName}</span>
                      <span>
                        <ProjectStatusSelect
                          projectId={project.id}
                          initialStatus={
                            project.status === "Done" ? "Done" : "Process"
                          }
                          canManage={canManageProjects}
                        />
                      </span>
                      <span className="align-right actions">
                        <ProjectActionButtons
                          canManage={canManageProjects}
                          editHref={`#edit-${sanitizeId(project.id)}`}
                          projectId={project.id}
                        />
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="project-table-empty">
                    {query
                      ? "Tidak ada hasil pencarian."
                      : "Belum ada data proyek."}
                  </div>
                )}
              </div>

              <div className="project-footer">
                <div className="project-showing">
                  <span>Menampilkan</span>
                  <button className="select" type="button" suppressHydrationWarning>
                    {projects.length} <span className="caret">v</span>
                  </button>
                  <span>of {totalProjects}</span>
                </div>
              </div>

              <div className="project-new">
                <ProjectCreateButton canManage={canManageProjects} />
              </div>
            </section>

            {canManageProjects ? (
              <div id="new-project" className="project-modal">
                <div className="project-modal-card">
                  <div className="project-modal-header">
                    <h2>Tambah Proyek</h2>
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
                    <input type="hidden" name="owner" value={employee?.fullName ?? ""} />
                    <label>
                      Status
                      <select name="status" defaultValue="Process" required>
                        <option value="Process">Sedang Berlangsung</option>
                        <option value="Done">Selesai</option>
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
            ) : null}

            {canManageProjects
              ? projects.map((project) => {
                  const modalId = `edit-${sanitizeId(project.id)}`;
                  return (
                    <div
                      key={`${project.id}-modal`}
                      id={modalId}
                      className="project-modal"
                    >
                      <div className="project-modal-card">
                        <div className="project-modal-header">
                          <h2>Ubah Proyek</h2>
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
                          <input
                            type="hidden"
                            name="owner"
                            value={project.employee.fullName}
                          />
                          <label>
                            Status
                            <select name="status" defaultValue={project.status}>
                              <option value="Process">Sedang Berlangsung</option>
                              <option value="Done">Selesai</option>
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
                })
              : null}
          </main>
        </div>
      </div>
    </div>
  );
}






