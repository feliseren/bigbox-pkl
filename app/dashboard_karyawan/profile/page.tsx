import Image from "next/image";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";
import { EmployeeSidebar } from "@/components/employee-sidebar";

type ProfileSearchParams = {
  error?: string | string[];
  success?: string | string[];
};

function normalizeParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EmployeeProfilePage({
  searchParams,
}: {
  searchParams?: Promise<ProfileSearchParams>;
}) {
  const employeeId = await readEmployeeSessionId();
  if (!employeeId) {
    redirect("/login_karyawan");
  }

  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) {
    redirect("/login_karyawan");
  }

  const resolvedSearchParams = await searchParams;
  const error = normalizeParam(resolvedSearchParams?.error);
  const success = normalizeParam(resolvedSearchParams?.success);
  const message =
    success === "1"
      ? "Password berhasil diubah."
      : error === "1"
        ? "Lengkapi semua field password."
        : error === "2"
          ? "Konfirmasi password tidak sama."
          : error === "3"
            ? "Password lama salah."
            : null;

  return (
    <div className="project-layout">
      <div className="project-shell">
        <EmployeeSidebar />

        <div className="project-main">
          <header className="project-header">
            <div>
              <h1 className="project-title">Profil Karyawan</h1>
              <p className="project-subtitle">Lihat data akun dan ubah password.</p>
            </div>
            <div className="project-user">
              <span>{employee.fullName}</span>
              <span className="project-avatar" />
              <span className="project-bell" />
            </div>
          </header>

          <main className="project-content">
            <section className="project-card">
              {message ? (
                <p
                  className={`profile-message ${
                    success === "1" ? "success" : "error"
                  }`}
                >
                  {message}
                </p>
              ) : null}
              <div className="mt-4 space-y-3 text-sm text-[#4a4f60]">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9aa0b4]">
                    Nama
                  </p>
                  <p className="text-base font-semibold text-[#1f2430]">
                    {employee.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9aa0b4]">
                    ID Karyawan
                  </p>
                  <p className="text-base font-semibold text-[#1f2430]">
                    {employee.id}
                  </p>
                </div>
              </div>
              <form
                className="profile-password-form"
                method="post"
                action="/api/employee/password"
              >
                <h2 className="text-sm font-semibold text-[#1f1f1f]">
                  Ubah Password
                </h2>
                <label>
                  Password Lama
                  <input name="currentPassword" type="password" required />
                </label>
                <label>
                  Password Baru
                  <input name="newPassword" type="password" required />
                </label>
                <label>
                  Konfirmasi Password Baru
                  <input name="confirmPassword" type="password" required />
                </label>
                <div className="profile-password-actions">
                  <button type="submit">Ubah Password</button>
                </div>
              </form>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
