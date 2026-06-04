import { redirect } from "next/navigation";
import { EmployeeProfileMenu } from "@/components/employee-profile-menu";
import { EmployeeSidebar } from "@/components/employee-sidebar";
import { readCurrentEmployee } from "@/lib/employee-session";
import { normalizeEmployeeRole } from "@/lib/employee-role";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type KelolaAkunPageProps = {
  searchParams?: Promise<{ success?: string; error?: string }>;
};

export default async function KelolaAkunPage({
  searchParams,
}: KelolaAkunPageProps) {
  const allowedRoleIds = ["01", "02", "2"];
  const employee = await readCurrentEmployee();
  const roleName = normalizeEmployeeRole(employee?.role);
  const params = (await searchParams) ?? {};

  if (!employee) {
    redirect("/login_karyawan");
  }
  if (roleName !== "admin") {
    redirect("/dashboard_karyawan");
  }

  const roles = await prisma.role.findMany({
    orderBy: [{ name: "asc" }],
    where: {
      id: {
        in: allowedRoleIds,
      },
    },
  });
  const requests = await prisma.passwordResetRequest.findMany({
    include: {
      user: { select: { fullName: true, email: true } },
      employee: { select: { id: true, fullName: true } },
      approvedBy: { select: { fullName: true } },
    },
    orderBy: [{ createdAt: "desc" }],
    take: 50,
  });

  const pendingRequests = requests.filter((item) => item.status === "pending");
  const historyRequests = requests.filter((item) => item.status !== "pending");

  const describeAccount = (item: (typeof requests)[number]) => {
    if (item.accountType === "customer") {
      return {
        type: "Customer",
        identifier: item.user?.email ?? "-",
        name: item.user?.fullName ?? "-",
      };
    }
    return {
      type: "Karyawan",
      identifier: item.employee?.id ?? "-",
      name: item.employee?.fullName ?? "-",
    };
  };

  const formatDate = (value: Date | null) =>
    value
      ? new Intl.DateTimeFormat("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(value)
      : "-";

  const roleLabel = (value: string) =>
    value
      .split(/[_\s]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");

  return (
    <div className="project-layout">
      <div className="project-shell">
        <EmployeeSidebar active="akun" />

        <div className="project-main">
          <header className="project-header">
            <div>
              <h1 className="project-title">Kelola Akun</h1>
              <p className="project-subtitle">
                Setujui atau tolak permintaan reset password customer dan karyawan.
              </p>
            </div>
            <EmployeeProfileMenu
              fullName={employee.fullName}
              employeeId={employee.id}
            />
          </header>

          <main className="project-content space-y-6">
            <section className="project-card">
              {params.success === "employee_created" ? (
                <p className="profile-message success">
                  Akun karyawan berhasil dibuat dengan password awal `test`.
                </p>
              ) : null}
              {params.error === "employee_exists" ? (
                <p className="profile-message error">
                  ID karyawan sudah digunakan.
                </p>
              ) : null}
              {params.error === "invalid_role" ? (
                <p className="profile-message error">
                  Role yang dipilih tidak valid.
                </p>
              ) : null}
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-[#1f2430]">
                  Tambah Akun Karyawan
                </h2>
                <p className="mt-1 text-sm text-[#667085]">
                  Password awal akan di-set ke <strong>`test`</strong> dan karyawan wajib
                  menggantinya saat login pertama.
                </p>
              </div>
              <form
                className="profile-password-form"
                method="post"
                action="/api/admin/employees/create"
              >
                <label>
                  ID Karyawan
                  <input name="employeeId" type="text" required />
                </label>
                <label>
                  Nama Lengkap
                  <input name="fullName" type="text" required />
                </label>
                <label>
                  Role
                  <select name="roleId" required defaultValue="">
                    <option value="" disabled>
                      Pilih role
                    </option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {roleLabel(role.name)}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="profile-password-actions">
                  <button type="submit">Tambah Karyawan</button>
                </div>
              </form>
            </section>

            <section className="project-card">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-[#1f2430]">
                  Permintaan Menunggu Persetujuan
                </h2>
              </div>
              <div className="project-table">
                <div className="project-table-header">
                  <span>TIPE</span>
                  <span>IDENTITAS</span>
                  <span>NAMA</span>
                  <span>DIAJUKAN</span>
                  <span className="align-right">AKSI</span>
                </div>
                {pendingRequests.length ? (
                  pendingRequests.map((item) => {
                    const account = describeAccount(item);
                    return (
                      <div key={item.id} className="project-table-row">
                        <span>{account.type}</span>
                        <span>{account.identifier}</span>
                        <span>{account.name}</span>
                        <span>{formatDate(item.createdAt)}</span>
                        <span className="align-right actions">
                          <form
                            method="post"
                            action="/api/admin/password-reset-requests/action"
                          >
                            <input type="hidden" name="requestId" value={item.id} />
                            <input type="hidden" name="actionType" value="approve" />
                            <button className="btn-edit" type="submit">
                              Setujui
                            </button>
                          </form>
                          <form
                            method="post"
                            action="/api/admin/password-reset-requests/action"
                          >
                            <input type="hidden" name="requestId" value={item.id} />
                            <input type="hidden" name="actionType" value="reject" />
                            <button className="btn-delete" type="submit">
                              Tolak
                            </button>
                          </form>
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="project-table-empty">
                    Tidak ada permintaan reset password yang menunggu.
                  </div>
                )}
              </div>
            </section>

            <section className="project-card">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-[#1f2430]">
                  Riwayat Permintaan
                </h2>
              </div>
              <div className="project-table">
                <div className="project-table-header">
                  <span>TIPE</span>
                  <span>IDENTITAS</span>
                  <span>STATUS</span>
                  <span>DIPROSES OLEH</span>
                  <span>WAKTU</span>
                </div>
                {historyRequests.length ? (
                  historyRequests.map((item) => {
                    const account = describeAccount(item);
                    const processedAt =
                      item.status === "rejected"
                        ? item.rejectedAt
                        : item.status === "completed"
                          ? item.usedAt
                          : item.approvedAt;
                    return (
                      <div key={item.id} className="project-table-row">
                        <span>{account.type}</span>
                        <span>{account.identifier}</span>
                        <span className="bold uppercase">{item.status}</span>
                        <span>{item.approvedBy?.fullName ?? "-"}</span>
                        <span>{formatDate(processedAt)}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="project-table-empty">
                    Belum ada riwayat permintaan reset password.
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
