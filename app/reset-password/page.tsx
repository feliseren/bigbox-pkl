type ResetPasswordPageProps = {
  searchParams?: Promise<{
    token?: string;
    error?: string;
    type?: string;
    status?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = (await searchParams) ?? {};
  const token = params.token ?? "";
  const error = params.error ?? "";
  const type = params.type ?? "customer";
  const status = params.status ?? "";

  return (
    <div className="min-h-screen bg-[#14121d] px-6 py-12">
      <div className="mx-auto w-full max-w-lg rounded-[24px] bg-white px-8 py-10 shadow-[0_30px_60px_rgba(20,18,29,0.35)]">
        <h1 className="text-2xl font-semibold text-[#111111]">
          Reset Password
        </h1>
        <p className="mt-2 text-sm text-[#6b6b6b]">
          Masukkan password baru Anda.
        </p>

        {error === "1" && (
          <p className="mt-4 text-sm font-semibold text-[#c0392b]">
            Token atau password tidak valid.
          </p>
        )}
        {error === "2" && (
          <p className="mt-4 text-sm font-semibold text-[#c0392b]">
            Token reset sudah kadaluarsa atau sudah digunakan.
          </p>
        )}
        {status === "approved" && (
          <p className="mt-4 text-sm font-semibold text-[#2d7a4f]">
            Pengajuan reset password sudah disetujui. Silakan buat password baru.
          </p>
        )}

        <form
          className="mt-6 space-y-4"
          method="post"
          action="/api/password-reset/confirm"
        >
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="type" value={type} />
          <div>
            <label
              className="text-sm font-semibold text-[#3a3a3a]"
              htmlFor="password"
            >
              Password Baru
            </label>
            <input
              className="mt-2 w-full rounded-lg border border-[#d6d6d6] px-4 py-2 text-sm text-[#111111] outline-none focus:border-[#6a64ff] focus:ring-2 focus:ring-[#c6c3ff]"
              id="password"
              name="password"
              placeholder="Masukkan password baru"
              type="password"
              required
            />
          </div>

          <button
            className="mt-2 w-full rounded-lg bg-[#151a5b] py-2 text-sm font-semibold text-white"
            type="submit"
          >
            Simpan Password
          </button>
        </form>
      </div>
    </div>
  );
}
