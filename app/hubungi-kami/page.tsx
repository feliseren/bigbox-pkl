"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function HubungiKamiPage() {
  const [industry, setIndustry] = useState("");
  const [isValid, setIsValid] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "1";

  return (
    <div className="min-h-screen bg-white px-6 py-6 text-[#111111]">
      <div className="mx-auto max-w-4xl">
        <a className="text-sm font-semibold text-[#2a3ad7]" href="/">
          {"<"} Kembali
        </a>
        <h1 className="mt-4 text-2xl font-semibold">
          Informasikan Kebutuhan Anda di Sini
        </h1>

        {isSuccess ? (
          <div className="mt-6 rounded-2xl border border-[#c9d1ff] bg-[#eef2ff] px-6 py-8 text-center">
            <h2 className="text-lg font-semibold text-[#1f2ac8]">
              Form telah terkirim
            </h2>
            <p className="mt-2 text-sm text-[#3b3f4d]">
              Anda segera dihubungi oleh pihak BigBox.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                className="inline-flex items-center justify-center rounded-lg bg-[#5c7cfa] px-5 py-2 text-sm font-semibold text-white"
                href="/hubungi-kami"
              >
                Isi Form Lagi
              </a>
              <a
                className="inline-flex items-center justify-center rounded-lg border border-[#5c7cfa] px-5 py-2 text-sm font-semibold text-[#1f2ac8]"
                href="/"
              >
                Kembali ke Beranda
              </a>
            </div>
          </div>
        ) : (
          <form
            ref={formRef}
            className="mt-6 space-y-4"
            method="post"
            action="/api/contacts"
            onChange={() => setIsValid(formRef.current?.checkValidity() ?? false)}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium">
                <span>Nama Lengkap</span>
                <input
                  className="w-full rounded-lg border-2 border-slate-400 px-4 py-3 text-sm outline-none focus:border-[#1f2ac8] focus:ring-2 focus:ring-[#c9d1ff]"
                  placeholder="Jane Purna Dharma"
                  type="text"
                  name="fullName"
                  required
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>Nomor Handphone</span>
                <div className="flex rounded-lg border-2 border-slate-400 focus-within:border-[#1f2ac8] focus-within:ring-2 focus-within:ring-[#c9d1ff]">
                  <select
                    className="rounded-l-lg border-r border-slate-400 bg-white px-3 py-3 text-sm outline-none"
                    name="phoneCode"
                    defaultValue="+62"
                  >
                    <option value="+62">+62</option>
                    <option value="+60">+60</option>
                    <option value="+65">+65</option>
                    <option value="+81">+81</option>
                  </select>
                  <input
                    className="w-full rounded-r-lg px-4 py-3 text-sm outline-none"
                    placeholder="812 3456 789"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]+"
                    name="phoneNumber"
                    required
                  />
                </div>
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>Nama Perusahaan</span>
                <input
                  className="w-full rounded-lg border-2 border-slate-400 px-4 py-3 text-sm outline-none focus:border-[#1f2ac8] focus:ring-2 focus:ring-[#c9d1ff]"
                  placeholder="Telkom Indonesia"
                  type="text"
                  name="companyName"
                  required
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>Industri</span>
                <select
                  className="w-full rounded-lg border-2 border-slate-400 bg-white px-4 py-3 text-sm outline-none focus:border-[#1f2ac8] focus:ring-2 focus:ring-[#c9d1ff]"
                  name="industry"
                  value={industry}
                  onChange={(event) => setIndustry(event.target.value)}
                  required
                >
                  <option value="" disabled>
                    Pilih industri
                  </option>
                  <option value="technology">Teknologi</option>
                  <option value="finance">Keuangan</option>
                  <option value="telecom">Telekomunikasi</option>
                  <option value="retail">Ritel</option>
                  <option value="government">Pemerintahan</option>
                  <option value="other">Lainnya</option>
                </select>
              </label>
              {industry === "other" ? (
                <label className="space-y-2 text-sm font-medium">
                  <span>Industri Lainnya</span>
                  <input
                    className="w-full rounded-lg border-2 border-slate-400 px-4 py-3 text-sm outline-none focus:border-[#1f2ac8] focus:ring-2 focus:ring-[#c9d1ff]"
                    placeholder="Masukkan industri perusahaan"
                    type="text"
                    name="industryOther"
                    required
                  />
                </label>
              ) : null}
              <label className="space-y-2 text-sm font-medium">
                <span>Email Perusahaan</span>
                <input
                  className="w-full rounded-lg border-2 border-slate-400 px-4 py-3 text-sm outline-none focus:border-[#1f2ac8] focus:ring-2 focus:ring-[#c9d1ff]"
                  placeholder="jane@company.com"
                  type="email"
                  name="companyEmail"
                  required
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>Skala Perusahaan</span>
                <select
                  className="w-full rounded-lg border-2 border-slate-400 bg-white px-4 py-3 text-sm outline-none focus:border-[#1f2ac8] focus:ring-2 focus:ring-[#c9d1ff]"
                  name="companyScale"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Pilih Skala Perusahaan
                  </option>
                  <option value="1-10">1-10 karyawan</option>
                  <option value="11-50">11-50 karyawan</option>
                  <option value="51-200">51-200 karyawan</option>
                  <option value="201-500">201-500 karyawan</option>
                  <option value="500+">500+ karyawan</option>
                </select>
              </label>
            </div>

            <label className="space-y-2 text-sm font-medium">
              <span>Pesan</span>
              <textarea
                className="min-h-[120px] w-full rounded-lg border-2 border-slate-400 px-4 py-3 text-sm outline-none focus:border-[#1f2ac8] focus:ring-2 focus:ring-[#c9d1ff]"
                name="message"
                placeholder="Misal: Perusahaan saya bergerak di bidang cloud yang sudah melayani 1.000 perusahaan, saya berharap dapat menjadi cloud partner untuk BigBox"
                required
              />
            </label>

            <label className="flex items-start gap-3 text-sm text-[#3b3f4d]">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300"
                name="agreement"
                required
              />
              <span>
                Saya telah membaca dan menyetujui{" "}
                <a
                  className="font-semibold text-[#2a3ad7]"
                  href="/syarat-ketentuan"
                >
                  Syarat &amp; Ketentuan
                </a>{" "}
                dari BigBox
              </span>
            </label>

            <div className="flex justify-center">
              <button
                className={`rounded-lg px-6 py-2 text-sm font-semibold text-white ${
                  isValid ? "bg-[#5c7cfa]" : "bg-[#8ea1f4] opacity-60"
                }`}
                type="submit"
                disabled={!isValid}
              >
                Kirim
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
