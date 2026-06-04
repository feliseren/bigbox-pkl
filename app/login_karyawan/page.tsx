import Image from "next/image";
import { ResetRequestLink } from "@/components/reset-request-link";

type LoginKaryawanSearchParams = {
  error?: string | string[];
  reset?: string | string[];
};

function normalizeParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginKaryawanPage({
  searchParams,
}: {
  searchParams?: Promise<LoginKaryawanSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const error = normalizeParam(resolvedSearchParams?.error);
  const reset = normalizeParam(resolvedSearchParams?.reset);
  const message = error === "1" ? "ID karyawan atau kata sandi salah." : null;

  return (
    <div className="min-h-screen bg-[url('/bg-karyawan.jpeg')] bg-cover bg-center px-4 py-4 flex items-center justify-center">
      <div className="mx-auto flex items-center justify-center">
        <div className="w-full max-w-[520px] rounded-[16px] bg-white px-6 py-6 sm:px-8 sm:py-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
          <div className="mb-6 flex items-center gap-3">
            <Image
              src="/bigbox_logo-removebg-preview.png"
              alt="BigBox logo"
              width={170}
              height={54}
              className="h-10 w-auto"
              priority
            />
          </div>
          <h1 className="text-2xl font-semibold text-[#2b2b2b] sm:text-3xl">
            Selamat Datang!
          </h1>
          <p className="mt-1 text-xs text-[#6b6b6b] sm:text-sm">
            Masukkan ID karyawan dan kata sandi
          </p>
          {message ? (
            <p className="profile-message error">{message}</p>
          ) : null}
          {reset === "2" ? (
            <p className="profile-message success">
              Kata sandi berhasil diubah. Silakan masuk kembali.
            </p>
          ) : null}

          <form
            className="mt-5 space-y-3"
            method="post"
            action="/api/login_karyawan"
            suppressHydrationWarning
          >
            <input
              className="w-full rounded-lg border border-[#d9d9d9] px-4 py-2.5 text-sm text-[#1f1f1f] outline-none focus:border-[#2f2f6f] focus:ring-2 focus:ring-[#c3c5ff]"
              name="employeeId"
              placeholder="ID karyawan"
              suppressHydrationWarning
              type="text"
            />
            <input
              className="w-full rounded-lg border border-[#d9d9d9] px-4 py-2.5 text-sm text-[#1f1f1f] outline-none focus:border-[#2f2f6f] focus:ring-2 focus:ring-[#c3c5ff]"
              name="password"
              placeholder="Kata sandi"
              suppressHydrationWarning
              type="password"
            />
            <button
              className="mt-1 w-full rounded-lg bg-[#151a5b] py-2.5 text-sm font-semibold text-white"
              suppressHydrationWarning
              type="submit"
            >
              Masuk
            </button>
            <div className="text-right">
              <ResetRequestLink
                className="text-xs font-semibold text-[#3f4ce0] sm:text-sm"
                href="/forgot-password-karyawan"
              >
                Lupa Kata Sandi?
              </ResetRequestLink>
            </div>
            <p className="text-center text-xs text-[#6b6b6b] sm:text-sm">
              Bukan Karyawan?{" "}
              <a className="font-semibold text-[#3f4ce0]" href="/login">
                masuk di sini
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
