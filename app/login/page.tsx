import Image from "next/image";

type LoginPageProps = {
  searchParams?: Promise<{ error?: string; reset?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const hasError = Boolean(params.error);
  const reset = params.reset ?? "";

  return (
    <div className="min-h-screen bg-[#14121d] px-6 py-12">
      <div className="mx-auto flex min-h-[720px] max-w-6xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_40px_80px_rgba(20,18,29,0.45)] lg:flex-row">
        <div className="flex w-full flex-col justify-between px-10 py-10 lg:w-[46%]">
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

            <h1 className="text-3xl font-semibold text-[#111111]">
              Welcome Back!
            </h1>
            <p className="mt-1 text-sm text-[#6b6b6b]">
              We are very happy to see you back!
            </p>

            <form
              className="mt-8 space-y-5"
              method="post"
              action="/api/login"
              suppressHydrationWarning
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
                  placeholder="xxxxx@gmail.com"
                  suppressHydrationWarning
                  type="email"
                />
              </div>

              <div>
                <label
                  className="text-sm font-semibold text-[#3a3a3a]"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="mt-2 w-full rounded-lg border border-[#d6d6d6] px-4 py-2 text-sm text-[#111111] outline-none focus:border-[#6a64ff] focus:ring-2 focus:ring-[#c6c3ff]"
                  id="password"
                  name="password"
                  placeholder="************"
                  suppressHydrationWarning
                  type="password"
                />
              </div>

              {hasError && (
                <p className="text-sm font-semibold text-[#c0392b]">
                  Email atau password salah.
                </p>
              )}
              {reset === "1" && (
                <p className="text-sm font-semibold text-[#2d7a4f]">
                  Link reset sudah dikirim ke email Anda.
                </p>
              )}
              {reset === "2" && (
                <p className="text-sm font-semibold text-[#2d7a4f]">
                  Password berhasil diubah. Silakan login.
                </p>
              )}

              <div className="flex items-center gap-2 text-sm text-[#6b6b6b]">
                <input
                  className="h-4 w-4 rounded border-[#cfcfcf]"
                  id="remember"
                  name="remember"
                  type="checkbox"
                  value="1"
                />
                <label htmlFor="remember">Remember me</label>
              </div>

              <a className="text-sm font-semibold text-[#3f4ce0]" href="/forgot-password">
                Forgot Password?
              </a>

              <button
                className="mt-2 w-full rounded-lg bg-[#151a5b] py-2 text-sm font-semibold text-white"
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
                  Login
                </span>
              </button>

              <div className="flex items-center gap-3 text-xs text-[#8a8a8a]">
                <div className="h-px w-full bg-[#dedede]" />
                OR
                <div className="h-px w-full bg-[#dedede]" />
              </div>

              <a
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#dedede] py-2 text-sm font-semibold text-[#4a4a4a]"
                href="/api/auth/google"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#ea4335]">
                  G
                </span>
                Login with Google
              </a>

              <p className="text-center text-sm text-[#6b6b6b]">
                Don't have account?{" "}
                <a className="font-semibold text-[#3f4ce0]" href="/signup">
                  Sign Up here!
                </a>
              </p>
            </form>
          </div>

          <a
            className="mt-8 block w-full rounded-lg bg-[#151a5b] py-3 text-center text-sm font-semibold text-white"
            href="/login_karyawan"
          >
            Login Sebagai Karyawan
          </a>
        </div>

        <div className="relative hidden w-full bg-[url('/samping-bg.png')] bg-cover bg-center lg:flex lg:w-[54%]" />
      </div>
    </div>
  );
}
