import Image from "next/image";

type LoginPageProps = {
  searchParams?: Promise<{ error?: string; reset?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const error = params.error ?? "";
  const reset = params.reset ?? "";
  const errorMessage =
    error === "1"
      ? "Email atau kata sandi salah."
      : error === "google_email"
        ? "Akun Google harus menggunakan email yang valid dan terverifikasi."
          : error === "google_config"
            ? "Masuk dengan Google belum dikonfigurasi."
          : error === "db"
            ? "Database belum siap. Silakan coba lagi setelah beberapa saat."
          : error === "google_state" || error === "google_token" || error === "google"
            ? "Masuk dengan Google gagal. Silakan coba lagi."
            : "";

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-[#f6f8ff] via-white to-[#eef2ff] px-3 py-3 lg:flex lg:items-center lg:justify-center">
      <div className="mx-auto flex min-h-[calc(100vh-24px)] w-full max-w-6xl flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_30px_70px_rgba(37,44,90,0.18)] lg:min-h-0 lg:h-[min(600px,calc(100vh-24px))] lg:flex-row">
        <div className="flex w-full flex-col justify-between gap-4 px-6 py-5 sm:px-8 sm:py-6 lg:w-[45%] lg:py-8">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <Image
                src="/bigbox_logo-removebg-preview.png"
                alt="BigBox logo"
                width={179}
                height={56}
                className="h-10 w-auto"
                priority
              />
            </div>

            <h1 className="text-[22px] font-semibold text-[#0f172a] sm:text-[24px] lg:text-[26px]">
              Selamat Datang Kembali!
            </h1>
            <p className="mt-1 text-[10px] text-[#667085] sm:text-[11px]">
              Kami senang Anda kembali.
            </p>

            <form
              className="mt-4 space-y-2 sm:space-y-2.5"
              method="post"
              action="/api/login"
              suppressHydrationWarning
            >
              <div>
                <label
                  className="text-[10px] font-semibold text-[#334155] sm:text-[11px]"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-[#d7ddea] px-3.5 py-1.5 text-sm text-[#111827] outline-none focus:border-[#2f2f6f] focus:ring-2 focus:ring-[#c6c9ff]"
                  id="email"
                  name="email"
                  placeholder="xxxxx@gmail.com"
                  suppressHydrationWarning
                  type="email"
                />
              </div>

              <div>
                <label
                  className="text-[10px] font-semibold text-[#334155] sm:text-[11px]"
                  htmlFor="password"
                >
                  Kata Sandi
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-[#d7ddea] px-3.5 py-1.5 text-sm text-[#111827] outline-none focus:border-[#2f2f6f] focus:ring-2 focus:ring-[#c6c9ff]"
                  id="password"
                  name="password"
                  placeholder="************"
                  suppressHydrationWarning
                  type="password"
                />
              </div>

              {errorMessage ? (
                <p className="text-sm font-semibold text-[#c0392b]">
                  {errorMessage}
                </p>
              ) : null}
              {reset === "1" && (
                <p className="text-sm font-semibold text-[#2d7a4f]">
                  Link reset sudah dikirim ke email Anda.
                </p>
              )}
              {reset === "2" && (
                <p className="text-sm font-semibold text-[#2d7a4f]">
                  Kata sandi berhasil diubah. Silakan masuk.
                </p>
              )}

              <div className="flex items-center gap-2 text-[10px] text-[#6b6b6b] sm:text-[11px]">
                <input
                  className="h-4 w-4 rounded border-[#cfcfcf]"
                  id="remember"
                  name="remember"
                  type="checkbox"
                  value="1"
                />
                <label htmlFor="remember">Ingat saya</label>
              </div>

              <a className="text-[10px] font-semibold text-[#3f4ce0] sm:text-[11px]" href="/forgot-password">
                Lupa Kata Sandi?
              </a>

              <button
                className="mt-1 w-full rounded-lg bg-[#151a5b] py-1.5 text-sm font-semibold text-white"
                suppressHydrationWarning
                type="submit"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M16.5 17a4.5 4.5 0 0 0-9 0"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.6"
                    />
                    <circle
                      cx="12"
                      cy="10"
                      r="2.3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                  Masuk
                </span>
              </button>

              <div className="flex items-center gap-3 text-[9px] text-[#8a8a8a] sm:text-[10px]">
                <div className="h-px w-full bg-[#dedede]" />
                ATAU
                <div className="h-px w-full bg-[#dedede]" />
              </div>

              <a
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#e3e7ef] py-1.5 text-sm font-semibold text-[#475569]"
                href="/api/auth/google"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#ea4335]">
                  G
                </span>
                Masuk dengan Google
              </a>

              <p className="text-center text-[10px] text-[#6b6b6b] sm:text-[11px]">
                Belum punya akun?{" "}
                <a className="font-semibold text-[#3f4ce0]" href="/signup">
                  Daftar di sini!
                </a>
              </p>
            </form>
          </div>

          <a
            className="mt-3 block w-full rounded-lg bg-[#151a5b] py-1.5 text-center text-sm font-semibold text-white"
            href="/login_karyawan"
          >
            Masuk Sebagai Karyawan
          </a>
        </div>

        <div className="relative hidden w-full bg-[url('/samping-bg.png')] bg-cover bg-center lg:flex lg:w-[55%]">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
          <div className="absolute right-10 top-8 flex items-center gap-2 text-[#3a3a3a]">
            <Image
              src="/bigbox_logo-removebg-preview.png"
              alt="BigBox logo"
              width={120}
              height={38}
              className="h-8 w-auto opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
