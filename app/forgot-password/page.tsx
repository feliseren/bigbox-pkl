type ForgotPasswordPageProps = {
  searchParams?: Promise<{ error?: string; status?: string }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const params = (await searchParams) ?? {};
  const error = params.error ?? "";
  const status = params.status ?? "";

  return (
    <div className="min-h-screen bg-[#14121d] px-6 py-12">
      <div className="mx-auto w-full max-w-lg rounded-[24px] bg-white px-8 py-10 shadow-[0_30px_60px_rgba(20,18,29,0.35)]">
        <h1 className="text-2xl font-semibold text-[#111111]">
          Lupa Password
        </h1>
        <p className="mt-2 text-sm text-[#6b6b6b]">
          Masukkan email Anda untuk mengajukan reset password ke admin.
        </p>

        {error === "1" && (
          <p className="mt-4 text-sm font-semibold text-[#c0392b]">
            Email tidak ditemukan atau tidak valid.
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
        {status === "rejected_requested" && (
          <p className="mt-4 text-sm font-semibold text-[#8a6d1d]">
            Pengajuan reset sebelumnya ditolak. Permintaan baru sudah diajukan ke admin.
          </p>
        )}

        <form
          className="mt-6 space-y-4"
          method="post"
          action="/api/password-reset/request"
        >
          <div>
            <label
              className="text-sm font-semibold text-[#3a3a3a]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="mt-2 w-full rounded-lg border border-[#d6d6d6] px-4 py-2 text-sm text-[#111111] outline-none focus:border-[#6a64ff] focus:ring-2 focus:ring-[#c6c3ff]"
              id="email"
              name="email"
              placeholder="nama@email.com"
              type="email"
              required
            />
          </div>

          <button
            className="mt-2 w-full rounded-lg bg-[#151a5b] py-2 text-sm font-semibold text-white"
            type="submit"
          >
            Kirim Link Reset
          </button>
        </form>
      </div>
    </div>
  );
}
