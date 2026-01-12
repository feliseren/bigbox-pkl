import Image from "next/image";

type SignupPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = (await searchParams) ?? {};
  const error = params.error;

  return (
    <div className="min-h-screen bg-[#eef1ff]">
      <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col lg:flex-row">
        <div className="hidden w-full bg-[url('/samping-sign.png')] bg-cover bg-center lg:block lg:w-[52%]" />

        <div className="flex w-full items-center justify-center px-8 py-12 lg:w-[48%]">
          <div className="w-full max-w-md">
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

            <h1 className="text-3xl font-semibold text-[#1f1f1f]">
              Welcome to BigBox <span className="text-2xl">👋</span>
            </h1>
            <p className="mt-2 text-sm text-[#7a7a7a]">
              Kindly fill in your details below to create an account
            </p>

            <form className="mt-8 space-y-5" method="post" action="/api/signup">
              <div>
                <label
                  className="text-sm font-semibold text-[#5f5f7a]"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  className="mt-2 w-full rounded-lg border border-[#9a97b8] px-4 py-3 text-sm text-[#1f1f1f] outline-none focus:border-[#5b57d6] focus:ring-2 focus:ring-[#c6c3ff]"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  type="text"
                />
              </div>

              <div>
                <label
                  className="text-sm font-semibold text-[#5f5f7a]"
                  htmlFor="email"
                >
                  Email Address*
                </label>
                <input
                  className="mt-2 w-full rounded-lg border border-[#9a97b8] px-4 py-3 text-sm text-[#1f1f1f] outline-none focus:border-[#5b57d6] focus:ring-2 focus:ring-[#c6c3ff]"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  type="email"
                />
              </div>

              <div>
                <label
                  className="text-sm font-semibold text-[#5f5f7a]"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="mt-2 w-full rounded-lg border border-[#9a97b8] px-4 py-3 text-sm text-[#1f1f1f] outline-none focus:border-[#5b57d6] focus:ring-2 focus:ring-[#c6c3ff]"
                  id="password"
                  name="password"
                  placeholder="Input Password"
                  type="password"
                />
              </div>

              {error === "exists" && (
                <p className="text-sm font-semibold text-[#c0392b]">
                  Email sudah terdaftar.
                </p>
              )}
              {error === "1" && (
                <p className="text-sm font-semibold text-[#c0392b]">
                  Lengkapi semua data terlebih dahulu.
                </p>
              )}

              <label className="flex items-center gap-3 text-sm text-[#8a88a8]">
                <input
                  className="h-4 w-4 rounded border-[#9a97b8]"
                  type="checkbox"
                />
                I agree to terms & conditions
              </label>

              <button
                className="mt-2 w-full rounded-lg bg-[#151a5b] py-3 text-sm font-semibold text-white"
                type="submit"
              >
                Register Account
              </button>

              <div className="flex items-center gap-3 text-xs text-[#b2b0c5]">
                <div className="h-px w-full bg-[#cfcde2]" />
                Or
                <div className="h-px w-full bg-[#cfcde2]" />
              </div>

              <button
                className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#151a5b] py-3 text-sm font-semibold text-white"
                type="button"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#ea4335]">
                  G
                </span>
                Register with Google
              </button>

              <p className="text-sm text-[#5f5f7a]">
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
