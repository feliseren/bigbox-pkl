"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function HubungiKamiPage() {
  const [industry, setIndustry] = useState("");
  const [isValid, setIsValid] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "1";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eef3ff,_#f8faff_46%,_#ffffff_100%)] px-4 py-4 text-[#111111] sm:px-5 sm:py-5">
      <div className="mx-auto max-w-[980px]">
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-[#c7d2fe] bg-white px-3.5 py-2 text-xs font-semibold text-[#2a3ad7] shadow-sm transition hover:border-[#2a3ad7] hover:bg-[#f8faff]"
          href="/"
        >
          Kembali
        </Link>

        <div className="mt-3 grid gap-3 lg:grid-cols-[0.78fr_1.22fr]">
          <section className="overflow-hidden rounded-[20px] border border-[#dce2ff] bg-[linear-gradient(160deg,#2033b8_0%,#2f53e0_45%,#7c95ff_100%)] p-4 text-white shadow-[0_14px_32px_rgba(42,58,215,0.16)] sm:p-5">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
              Hubungi BigBox
            </span>
            <h1 className="mt-2.5 text-lg font-semibold leading-tight sm:text-[22px]">
              Ceritakan kebutuhan bisnis Anda, kami bantu siapkan solusinya.
            </h1>
            <p className="mt-2 text-[13px] leading-5 text-white/85">
              Isi formulir berikut untuk berdiskusi tentang produk, integrasi,
              atau kebutuhan implementasi. Tim BigBox akan meninjau informasi
              Anda dan menghubungi Anda secepatnya.
            </p>

            <div className="mt-4 grid gap-2.5">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
                  Yang kami butuhkan
                </p>
                <p className="mt-1 text-[13px] leading-5 text-white">
                  Informasi kontak, profil perusahaan, dan kebutuhan utama yang
                  ingin Anda diskusikan.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
                  Tindak lanjut
                </p>
                <p className="mt-1 text-[13px] leading-5 text-white">
                  Kami akan menghubungi Anda melalui email atau nomor telepon
                  yang Anda masukkan pada formulir ini.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[20px] border border-[#dce2ff] bg-white p-3.5 shadow-[0_14px_32px_rgba(42,58,215,0.07)] sm:p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#edf1ff] pb-3">
              <div>
                <h2 className="text-base font-semibold text-[#172554] sm:text-[20px]">
                  Formulir Kontak
                </h2>
                <p className="mt-0.5 text-[13px] leading-5 text-[#5a6075]">
                  Lengkapi data berikut agar tim kami dapat memahami kebutuhan
                  Anda dengan konteks yang tepat.
                </p>
              </div>
              <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-[11px] font-semibold text-[#2a3ad7]">
                Wajib diisi
              </span>
            </div>

            {isSuccess ? (
              <div className="mt-4 rounded-[20px] border border-[#c9d1ff] bg-[linear-gradient(180deg,#eef2ff_0%,#ffffff_100%)] px-4 py-5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#dfe6ff] text-lg text-[#1f2ac8]">
                  ✓
                </div>
                <h3 className="mt-2.5 text-base font-semibold text-[#1f2ac8]">
                  Formulir berhasil dikirim
                </h3>
                <p className="mt-1.5 text-[13px] leading-5 text-[#3b3f4d]">
                  Tim BigBox akan meninjau kebutuhan Anda dan segera
                  menghubungi Anda melalui kontak yang telah Anda isi.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                  <Link
                    className="inline-flex items-center justify-center rounded-xl bg-[#5c7cfa] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(92,124,250,0.28)] transition hover:bg-[#4768ee]"
                    href="/hubungi-kami"
                  >
                    Isi Formulir Lagi
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-xl border border-[#5c7cfa] px-4 py-2.5 text-sm font-semibold text-[#1f2ac8] transition hover:bg-[#eef2ff]"
                    href="/"
                  >
                    Kembali ke Beranda
                  </Link>
                </div>
              </div>
            ) : (
              <form
                ref={formRef}
                className="mt-4 space-y-4"
                method="post"
                action="/api/contacts"
                onChange={() => setIsValid(formRef.current?.checkValidity() ?? false)}
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="space-y-1.5 text-sm font-medium text-[#1f2430]">
                    <span>Nama Lengkap</span>
                    <input
                      className="w-full rounded-xl border border-[#cfd7f6] bg-[#fbfcff] px-3.5 py-2 text-sm shadow-sm outline-none transition focus:border-[#1f2ac8] focus:bg-white focus:ring-4 focus:ring-[#dbe2ff]"
                      placeholder="Jane Purna Dharma"
                      type="text"
                      name="fullName"
                      required
                    />
                  </label>
                  <label className="space-y-1.5 text-sm font-medium text-[#1f2430]">
                    <span>Nomor Handphone</span>
                    <div className="flex rounded-xl border border-[#cfd7f6] bg-[#fbfcff] shadow-sm transition focus-within:border-[#1f2ac8] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#dbe2ff]">
                      <select
                        className="rounded-l-xl border-r border-[#d9def7] bg-transparent px-3 py-2 text-sm outline-none"
                        name="phoneCode"
                        defaultValue="+62"
                      >
                        <option value="+62">+62</option>
                        <option value="+60">+60</option>
                        <option value="+65">+65</option>
                        <option value="+81">+81</option>
                      </select>
                      <input
                        className="w-full rounded-r-xl bg-transparent px-3.5 py-2 text-sm outline-none"
                        placeholder="812 3456 789"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]+"
                        name="phoneNumber"
                        required
                      />
                    </div>
                  </label>
                  <label className="space-y-1.5 text-sm font-medium text-[#1f2430]">
                    <span>Nama Perusahaan</span>
                    <input
                      className="w-full rounded-xl border border-[#cfd7f6] bg-[#fbfcff] px-3.5 py-2 text-sm shadow-sm outline-none transition focus:border-[#1f2ac8] focus:bg-white focus:ring-4 focus:ring-[#dbe2ff]"
                      placeholder="Telkom Indonesia"
                      type="text"
                      name="companyName"
                      required
                    />
                  </label>
                  <label className="space-y-1.5 text-sm font-medium text-[#1f2430]">
                    <span>Industri</span>
                    <select
                      className="w-full rounded-xl border border-[#cfd7f6] bg-[#fbfcff] px-3.5 py-2 text-sm shadow-sm outline-none transition focus:border-[#1f2ac8] focus:bg-white focus:ring-4 focus:ring-[#dbe2ff]"
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
                    <label className="space-y-1.5 text-sm font-medium text-[#1f2430] md:col-span-2">
                      <span>Industri Lainnya</span>
                      <input
                        className="w-full rounded-xl border border-[#cfd7f6] bg-[#fbfcff] px-3.5 py-2 text-sm shadow-sm outline-none transition focus:border-[#1f2ac8] focus:bg-white focus:ring-4 focus:ring-[#dbe2ff]"
                        placeholder="Masukkan industri perusahaan"
                        type="text"
                        name="industryOther"
                        required
                      />
                    </label>
                  ) : null}
                  <label className="space-y-1.5 text-sm font-medium text-[#1f2430]">
                    <span>Email Perusahaan</span>
                    <input
                      className="w-full rounded-xl border border-[#cfd7f6] bg-[#fbfcff] px-3.5 py-2 text-sm shadow-sm outline-none transition focus:border-[#1f2ac8] focus:bg-white focus:ring-4 focus:ring-[#dbe2ff]"
                      placeholder="jane@company.com"
                      type="email"
                      name="companyEmail"
                      required
                    />
                  </label>
                  <label className="space-y-1.5 text-sm font-medium text-[#1f2430]">
                    <span>Skala Perusahaan</span>
                    <select
                      className="w-full rounded-xl border border-[#cfd7f6] bg-[#fbfcff] px-3.5 py-2 text-sm shadow-sm outline-none transition focus:border-[#1f2ac8] focus:bg-white focus:ring-4 focus:ring-[#dbe2ff]"
                      name="companyScale"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Pilih skala perusahaan
                      </option>
                      <option value="1-10">1-10 karyawan</option>
                      <option value="11-50">11-50 karyawan</option>
                      <option value="51-200">51-200 karyawan</option>
                      <option value="201-500">201-500 karyawan</option>
                      <option value="500+">500+ karyawan</option>
                    </select>
                  </label>
                </div>

                <label className="block space-y-1.5 text-sm font-medium text-[#1f2430]">
                  <span>Pesan</span>
                  <textarea
                    className="min-h-[88px] w-full rounded-xl border border-[#cfd7f6] bg-[#fbfcff] px-3.5 py-2 text-sm shadow-sm outline-none transition focus:border-[#1f2ac8] focus:bg-white focus:ring-4 focus:ring-[#dbe2ff]"
                    name="message"
                    placeholder="Misal: Perusahaan saya bergerak di bidang cloud yang sudah melayani 1.000 perusahaan, dan kami ingin berdiskusi mengenai solusi BigBox yang paling sesuai."
                    required
                  />
                </label>

                <label className="flex items-start gap-3 rounded-xl border border-[#e4e8fb] bg-[#f8faff] p-3 text-sm leading-5 text-[#3b3f4d]">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                    name="agreement"
                    required
                  />
                  <span>
                    Saya telah membaca dan menyetujui{" "}
                    <Link
                      className="font-semibold text-[#2a3ad7] hover:underline"
                      href="/syarat-ketentuan"
                    >
                      Syarat &amp; Ketentuan
                    </Link>{" "}
                    dari BigBox.
                  </span>
                </label>

                <div className="flex flex-col gap-2.5 border-t border-[#edf1ff] pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#7a8092]">
                    Dengan mengirim formulir ini, Anda membantu kami memahami
                    kebutuhan Anda dengan lebih tepat.
                  </p>
                  <button
                    className={`min-w-[144px] rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
                      isValid
                        ? "bg-[#2a3ad7] shadow-[0_12px_24px_rgba(42,58,215,0.24)] hover:bg-[#2332ba]"
                        : "bg-[#8ea1f4] opacity-60"
                    }`}
                    type="submit"
                    disabled={!isValid}
                  >
                    Kirim Formulir
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
