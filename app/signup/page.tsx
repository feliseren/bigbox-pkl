import Image from "next/image";

type SignupPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = (await searchParams) ?? {};
  const error = params.error;

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
              Welcome to BigBox
            </h1>
            <p className="mt-1 text-[10px] text-[#667085] sm:text-[11px]">
              Kindly fill in your details below to create an account
            </p>

            <form className="mt-4 space-y-2 sm:space-y-2.5" method="post" action="/api/signup">
              <div>
                <label
                  className="text-[10px] font-semibold text-[#334155] sm:text-[11px]"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-[#d7ddea] px-3.5 py-1.5 text-sm text-[#111827] outline-none focus:border-[#2f2f6f] focus:ring-2 focus:ring-[#c6c9ff]"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  type="text"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label
                  className="text-[10px] font-semibold text-[#334155] sm:text-[11px]"
                  htmlFor="email"
                >
                  Email Address*
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-[#d7ddea] px-3.5 py-1.5 text-sm text-[#111827] outline-none focus:border-[#2f2f6f] focus:ring-2 focus:ring-[#c6c9ff]"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  type="email"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label
                  className="text-[10px] font-semibold text-[#334155] sm:text-[11px]"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-[#d7ddea] px-3.5 py-1.5 text-sm text-[#111827] outline-none focus:border-[#2f2f6f] focus:ring-2 focus:ring-[#c6c9ff]"
                  id="password"
                  name="password"
                  placeholder="Input Password"
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

              <label className="flex items-center gap-2 text-[10px] text-[#6b6b6b] sm:text-[11px]">
                <input className="h-4 w-4 rounded border-[#cfcfcf]" type="checkbox" />
                I agree to terms & conditions
              </label>

              <button
                className="mt-1 w-full rounded-lg bg-[#151a5b] py-1.5 text-sm font-semibold text-white"
                type="submit"
                suppressHydrationWarning
              >
                Register Account
              </button>

              <div className="flex items-center gap-3 text-[9px] text-[#8a8a8a] sm:text-[10px]">
                <div className="h-px w-full bg-[#dedede]" />
                Or
                <div className="h-px w-full bg-[#dedede]" />
              </div>

              <a
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#e3e7ef] py-1.5 text-sm font-semibold text-[#475569]"
                href="/api/auth/google"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#ea4335]">
                  G
                </span>
                Register with Google
              </a>

              <p className="text-[10px] text-[#6b6b6b] sm:text-[11px]">
                Already have an account?{" "}
                <a className="font-semibold text-[#3f4ce0]" href="/login">
                  Log in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
