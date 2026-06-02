import Image from "next/image";

type SignupPageProps = {
  searchParams?: Promise<{ error?: string | string[] }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = (await searchParams) ?? {};
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#f6f8ff] via-white to-[#eef2ff] px-3 py-3 lg:flex lg:items-center lg:justify-center">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_30px_70px_rgba(37,44,90,0.18)] lg:h-[min(560px,calc(100vh-24px))] lg:flex-row">
        <div className="hidden w-full bg-[url('/samping-sign.png')] bg-cover bg-center lg:block lg:w-[55%]" />

        <div className="flex w-full items-center justify-center px-6 py-5 sm:px-8 sm:py-6 lg:w-[45%] lg:py-8">
          <div className="w-full max-w-md">
            <div className="mb-5 flex items-center gap-3">
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
              Selamat Datang di BigBox
            </h1>
            <p className="mt-1 text-[10px] text-[#667085] sm:text-[11px]">
              Silakan lengkapi data Anda di bawah ini untuk membuat akun
            </p>

            <form className="mt-4 space-y-2 sm:space-y-2.5" method="post" action="/api/signup">
              <div>
                <label
                  className="text-[10px] font-semibold text-[#334155] sm:text-[11px]"
                  htmlFor="fullName"
                >
                  Nama Lengkap
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-[#d7ddea] px-3.5 py-1.5 text-sm text-[#111827] outline-none focus:border-[#2f2f6f] focus:ring-2 focus:ring-[#c6c9ff]"
                  id="fullName"
                  name="fullName"
                  placeholder="Masukkan nama lengkap"
                  type="text"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label
                  className="text-[10px] font-semibold text-[#334155] sm:text-[11px]"
                  htmlFor="email"
                >
                  Alamat Email*
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-[#d7ddea] px-3.5 py-1.5 text-sm text-[#111827] outline-none focus:border-[#2f2f6f] focus:ring-2 focus:ring-[#c6c9ff]"
                  id="email"
                  name="email"
                  placeholder="Masukkan alamat email"
                  type="email"
                  suppressHydrationWarning
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
                  placeholder="Masukkan kata sandi"
                  type="password"
                  suppressHydrationWarning
                />
              </div>

              {error === "exists" && (
                <p className="text-[11px] font-semibold text-[#c0392b]">
                  Email sudah terdaftar.
                </p>
              )}
              {error === "1" && (
                <p className="text-[11px] font-semibold text-[#c0392b]">
                  Lengkapi semua data terlebih dahulu.
                </p>
              )}
              {error === "terms" && (
                <p className="text-[11px] font-semibold text-[#c0392b]">
                  Setujui syarat dan ketentuan terlebih dahulu.
                </p>
              )}

              <div className="flex items-center gap-2 text-[10px] text-[#6b6b6b] sm:text-[11px]">
                <input
                  className="h-4 w-4 rounded border-[#cfcfcf]"
                  id="agreement"
                  name="agreement"
                  type="checkbox"
                  value="1"
                />
                <label htmlFor="agreement">
                  Saya setuju dengan{" "}
                  <a
                    className="font-semibold text-[#3f4ce0] hover:underline"
                    href="/syarat-ketentuan"
                  >
                    syarat dan ketentuan
                  </a>
                </label>
              </div>

              <button
                className="mt-1 w-full rounded-lg bg-[#151a5b] py-1.5 text-sm font-semibold text-white"
                type="submit"
                suppressHydrationWarning
              >
                Daftar Akun
              </button>

              <div className="flex items-center gap-3 text-[9px] text-[#8a8a8a] sm:text-[10px]">
                <div className="h-px w-full bg-[#dedede]" />
                Atau
                <div className="h-px w-full bg-[#dedede]" />
              </div>

              <a
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#e3e7ef] py-1.5 text-sm font-semibold text-[#475569]"
                href="/api/auth/google"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#ea4335]">
                  G
                </span>
                Daftar dengan Google
              </a>

              <p className="text-[10px] text-[#6b6b6b] sm:text-[11px]">
                Sudah punya akun?{" "}
                <a className="font-semibold text-[#3f4ce0]" href="/login">
                  Masuk
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
