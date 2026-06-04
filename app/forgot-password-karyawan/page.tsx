type ForgotPasswordEmployeePageProps = {
  searchParams?: Promise<{ error?: string; status?: string }>;
};

export default async function ForgotPasswordEmployeePage({
  searchParams,
}: ForgotPasswordEmployeePageProps) {
  const params = (await searchParams) ?? {};
  const error = params.error ?? "";
  const status = params.status ?? "";

  return (
    <div className="min-h-screen bg-[url('/bg-karyawan.jpeg')] bg-cover bg-center px-4 py-4 flex items-center justify-center">
      <div className="mx-auto flex items-center justify-center">
        <div className="w-full max-w-[520px] rounded-[16px] bg-white px-6 py-6 sm:px-8 sm:py-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
          <h1 className="text-2xl font-semibold text-[#2b2b2b] sm:text-3xl">
            Reset Password Karyawan
          </h1>
          <p className="mt-2 text-sm text-[#6b6b6b]">
            Masukkan ID karyawan untuk mengajukan reset password ke admin.
          </p>

          {error === "1" && (
            <p className="mt-4 text-sm font-semibold text-[#c0392b]">
              ID karyawan tidak ditemukan.
            </p>
          )}
          {status === "requested" && (
            <p className="mt-4 text-sm font-semibold text-[#2d7a4f]">
              Permintaan reset password sudah diajukan ke admin.
            </p>
          )}
          {status === "pending" && (
            <p className="mt-4 text-sm font-semibold text-[#8a6d1d]">
              Permintaan reset masih menunggu persetujuan admin.
            </p>
          )}

          <form
            className="mt-6 space-y-4"
            method="post"
            action="/api/password-reset/request-employee"
          >
            <div>
              <label
                className="text-sm font-semibold text-[#3a3a3a]"
                htmlFor="employeeId"
              >
                ID Karyawan
              </label>
              <input
                className="mt-2 w-full rounded-lg border border-[#d6d6d6] px-4 py-2 text-sm text-[#111111] outline-none focus:border-[#6a64ff] focus:ring-2 focus:ring-[#c6c3ff]"
                id="employeeId"
                name="employeeId"
                placeholder="Masukkan ID karyawan"
                type="text"
                required
              />
            </div>

            <button
              className="mt-2 w-full rounded-lg bg-[#151a5b] py-2 text-sm font-semibold text-white"
              type="submit"
            >
              Ajukan Reset
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
