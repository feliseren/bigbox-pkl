import Image from "next/image";

export default function LoginKaryawanPage() {
  return (
    <div className="min-h-screen bg-[url('/bg-karyawan.jpeg')] bg-cover bg-center px-6 py-12">
      <div className="mx-auto flex min-h-screen items-center justify-center">
        <div className="w-full max-w-[560px] rounded-[16px] bg-white px-10 py-10 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
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
          <h1 className="text-3xl font-semibold text-[#2b2b2b]">
            Welcome!!
          </h1>
          <p className="mt-2 text-sm text-[#6b6b6b]">
            Masukkan ID Karyawan dan Password
          </p>

          <form className="mt-6 space-y-4" method="post" action="/api/login_karyawan">
            <input
              className="w-full rounded-lg border border-[#d9d9d9] px-4 py-3 text-sm text-[#1f1f1f] outline-none focus:border-[#2f2f6f] focus:ring-2 focus:ring-[#c3c5ff]"
              name="employeeId"
              placeholder="Id Karyawan"
              type="text"
            />
            <input
              className="w-full rounded-lg border border-[#d9d9d9] px-4 py-3 text-sm text-[#1f1f1f] outline-none focus:border-[#2f2f6f] focus:ring-2 focus:ring-[#c3c5ff]"
              name="password"
              placeholder="Password"
              type="password"
            />
            <button
              className="mt-2 w-full rounded-lg bg-[#151a5b] py-3 text-sm font-semibold text-white"
              type="submit"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
