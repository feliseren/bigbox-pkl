import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { readSessionUserId } from "@/lib/auth";
import { ProfileMenu } from "@/components/profile-menu";
import { NotificationBell } from "@/components/notification-bell";
import { getUserNotifications } from "@/lib/notifications";

const sections = [
  { id: "definisi", label: "Definisi" },
  { id: "akun", label: "Penggunaan Akun dan Perilaku" },
  { id: "hak", label: "Hak Kekayaan Intelektual" },
  { id: "pembayaran", label: "Metode Pembayaran" },
  { id: "larangan", label: "Larangan dan Batasan" },
  {
    id: "jaminan",
    label: "Jaminan TELKOM dan Pembatasan Tanggung Jawab TELKOM secara Umum",
  },
  { id: "kritik", label: "Kritik dan/ atau Saran" },
  { id: "force-majeure", label: "Force Majeure" },
  { id: "perselisihan", label: "Penyelesaian Perselisihan" },
  { id: "hukum", label: "Hukum yang Berlaku" },
  { id: "penutup", label: "Ketentuan Penutup" },
];

export default async function SyaratKetentuanPage() {
  const userId = await readSessionUserId();
  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;
  const notifications = userId ? await getUserNotifications(userId) : [];
  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <header className="sticky top-0 z-30 bg-[#93898f]">
        <div className="mx-auto flex h-[60px] max-w-[1237px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/bigbox_logo-removebg-preview.png"
              alt="BigBox logo"
              width={179}
              height={56}
              className="h-10 w-auto"
              priority
            />
          </div>
          <nav className="hidden items-center gap-10 text-sm font-semibold text-[var(--accent)] md:flex">
            <a className="nav-link" href="/">
              Beranda
            </a>
            <a className="nav-link" href="/produk">
              Produk
            </a>
            <a className="nav-link" href="#">
              Cerita Kami
            </a>
          </nav>
          {user ? (
            <div className="flex items-center gap-3">
              <NotificationBell items={notifications} />
              <ProfileMenu fullName={user.fullName} />
            </div>
          ) : (
            <a
              className="flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#524a4e]"
              href="/login"
            >
              <span className="inline-block h-4 w-4 rounded-full border border-[#524a4e]" />
              Login
            </a>
          )}
        </div>
      </header>

      <main>
      <section className="bg-[#dfe9fb]">
        <div className="mx-auto max-w-[1100px] px-6 py-12">
          <a className="text-sm font-semibold text-[#2a3ad7]" href="/">
            {"<"} Kembali
          </a>
          <h1 className="text-4xl font-semibold text-[#2a3ad7]">
            Syarat dan Ketentuan
          </h1>
          <p className="mt-6 text-base leading-7">
            <strong>DTP BigBox</strong> (selanjutnya disebut "DTP BigBox" atau
            "Kami") merupakan platform yang berisikan informasi terkait produk
            BigBox untuk memudahkan pengguna memahami produk serta melakukan
            trial maupun pembayaran produk, yang dikelola oleh PT
            Telekomunikasi Indonesia Tbk (selanjutnya disebut "TELKOM").
          </p>
          <p className="mt-4 text-base leading-7">
            Saat menggunakan <strong>DTP BigBox</strong>, pengguna (selanjutnya
            disebut "Anda" atau "Pengguna") tunduk pada pedoman, aturan, atau
            ketentuan yang berlaku, yang dapat diperbarui dari waktu ke waktu
            (termasuk dan tidak terbatas pada Kebijakan Privasi DTP BigBox).
          </p>
          <p className="mt-4 text-base leading-7">
            Dengan mendaftar dan/atau menggunakan situs ini maka Anda dianggap
            telah membaca, mengerti, memahami, dan menyetujui semua isi Syarat
            dan Ketentuan ini. Jika Anda tidak menerima dan menyetujui salah
            satu, sebagian, atau seluruh isi Syarat dan Ketentuan ini, maka
            Anda tidak dapat menggunakan DTP BigBox.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <aside className="text-sm text-[#6b7185]">
            <p className="mb-4 font-semibold text-[#9aa0b4]">Content</p>
            <nav>
              <ul className="space-y-3">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a className="block text-[#2a3ad7]" href={`#${section.id}`}>
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="space-y-10 text-base leading-7">
            <section id="definisi">
              <h2 className="text-xl font-semibold">1. Definisi</h2>
              <p className="mt-4">
                Istilah yang dimuat dalam Syarat dan Ketentuan ini merujuk
                kepada definisi sebagai berikut:
              </p>
              <ol className="mt-4 list-[lower-alpha] space-y-3 pl-6">
                <li>
                  Akun adalah akun yang telah didaftarkan oleh Pengguna pada
                  DTP BigBox.
                </li>
                <li>
                  Data Pribadi adalah data tentang orang perorangan yang
                  teridentifikasi atau dapat diidentifikasi secara tersendiri
                  atau dikombinasi dengan informasi lainnya baik secara langsung
                  maupun tidak langsung melalui sistem elektronik atau
                  nonelektronik. Data tersebut termasuk namun tidak terbatas
                  pada nama seseorang, nomor identitas, nomor handphone, lokasi,
                  identitas dalam jaringan sistem elektronik, dan hal-hal lain
                  yang berkaitan dengan individu tersebut.
                </li>
                <li>
                  Data Profil adalah data yang terdapat pada halaman profil bagi
                  Pengguna.
                </li>
                <li>
                  Layanan adalah akses ke berbagai fitur produk BigBox yang
                  terdiri dari namun tidak terbatas pada:
                  <ol className="mt-2 list-[lower-roman] space-y-2 pl-6">
                    <li>
                      BigSocial (Social Media Analytics), merupakan platform
                      media sosial analytics untuk mengukur analisis yang tepat
                      terkait tren, merek, isu sosial politik dan ekonomi,
                      personal brand, dan lainnya di media sosial dan media
                      online dengan lebih mudah dan efektif yang disajikan dalam
                      satu dashboard. BigSocial membantu untuk mengetahui
                      bagaimana audiens memandang industri, produk, atau
                      layanan.
                    </li>
                    <li>
                      BigVision (Video Analytics &amp; eKYC), merupakan layanan
                      yang membantu para developer dan perusahaan dalam membantu
                      implementasi teknologi AI sebagai solusi bisnisnya.
                      BigVision menghadirkan tiga layanan sesuai dengan
                      kebutuhan Anda seperti Optical Character Recognition, Face
                      Recognition, dan Object Detection.
                    </li>
                    <li>
                      BigLegal (Legal Analytics), merupakan produk digital
                      berbentuk website yang dibuat dengan tujuan untuk
                      mempermudah pengguna dalam pencarian dokumen hukum dan
                      analisis dokumen hukum.
                    </li>
                    <li>
                      BigAssistant, merupakan produk digital dengan sistem
                      Generative AI yang dibuat untuk dapat mempermudah pengguna
                      dalam mencari informasi yang disesuaikan dengan kebutuhan
                      pengguna melalui dashboard ataupun chatbot whatsapp,
                      sehingga dapat membantu pengguna dalam meningkatkan hasil
                      kinerja ataupun keuntungan bisnis.
                    </li>
                  </ol>
                </li>
                <li>
                  Pengguna adalah corporate customer dan government yang sudah
                  mendaftarkan Akun dan/atau menggunakan DTP BigBox.
                </li>
                <li>Situs adalah https://bigbox.ai</li>
              </ol>
            </section>

            <section id="akun">
              <h2 className="text-xl font-semibold">2. Penggunaan Akun dan Perilaku</h2>
              <ol className="mt-4 list-[lower-alpha] space-y-3 pl-6">
                <li>
                  Hanya Pengguna yang memiliki Akun yang dapat menggunakan layanan DTP BigBox.
                </li>
                <li>
                  Untuk membuat Akun DTP BigBox, Anda dapat diminta untuk memberikan beberapa informasi dan Data Pribadi Anda. Sehubungan dengan pembuatan Akun DTP BigBox dan penggunaan Layanan DTP BigBox, Anda setuju untuk memberikan informasi dan data pribadi Anda secara benar, jelas, akurat, dan lengkap kepada DTP BigBox ketika diminta, sekurang-kurangnya berupa:
                  <ol className="mt-2 list-[lower-roman] space-y-2 pl-6">
                    <li>
                      Nama Lengkap;
                    </li>
                    <li>
                      Email; 
                    </li>
                    <li>
                      No Telepon
                    </li>
                  </ol>
                </li>
                <li>
                  Pengguna bertanggung jawab untuk menjaga kerahasiaan dan keamanan Akun dan password Pengguna.
                </li>
                <li>
                  Layanan DTP BigBox pada dasarnya tidak ditujukan untuk digunakan oleh Pengguna di bawah umur, yaitu setiap orang yang belum mencapai batas usia dewasa atau usia cakap menurut yurisdiksi
                </li>
                <li>
                  DTP BigBox berhak menganggap dan memperlakukan seluruh aktivitas yang dilakukan melalui Akun DTP BigBox sebagai aktivitas yang telah dilakukan oleh Pengguna.
                </li>
                <li>
                  Pengguna bertanggung jawab atas segala kerugian dan akibat hukum yang timbul dari kesalahan atau kelalaian Pengguna dalam menjaga kerahasiaan password dan akun Pengguna.
                </li>
                <li>
                  Pengguna menyetujui untuk segera memberitahukan DTP BigBox mengenai setiap dugaan atau aktivitas penggunaan Akun DTP BigBox atau password secara tidak berwenang atau pelanggaran keamanan lainnya yang berkaitan dengan Akun Pengguna secepat mungkin.
                </li>
              </ol>
            </section>

            <section id="hak">
              <h2 className="text-xl font-semibold">3. Hak Kekayaan Intelektual</h2>
              <p className="mt-4">
                Hak Atas Kekayaan Intelektual terkait dengan DTP BigBox dan Layanan, termasuk namun tidak terbatas pada, nama, logo, kode program, desain, merek dagang, teknologi, basis data, proses dan model bisnis, dilindungi oleh hak cipta, merek, paten dan hak kekayaan intelektual lainnya yang tersedia berdasarkan hukum Republik Indonesia yang terdaftar atas nama TELKOM.
              </p>
              <p className="mt-4">
                Tidak ada hak atau izin yang diberikan baik secara langsung atau tidak langsung kepada Pengguna atau pihak mana pun yang mengakses Situs untuk menggunakan dan/atau memperbanyak Kekayaan Intelektual, dan tidak ada pihak yang dapat mengklaim hak atas, kepemilikan atau kepentingan apapun di dalamnya.
              </p>
              <p className="mt-4">
                Anda tidak diperbolehkan untuk mengubah salinan dalam bentuk kertas maupun digital dari materi apapun. Apabila Anda menemukan terdapat pelanggaran hak kekayaan intelektual, dapat melaporkan ke DTP BigBox dengan menghubungi kontak yang tersedia.
              </p>
            </section>

            <section id="pembayaran">
              <h2 className="text-xl font-semibold">4. Metode Pembayaran</h2>
              <ol className="mt-4 list-[lower-alpha] space-y-3 pl-6">
                <li>
                  DTP BigBox menyediakan free trial untuk seluruh Layanan dengan batas penggunaan maksimal 3 (tiga) hari.
                </li>
                <li>
                  Untuk berlangganan (subscription) Layanan DTP BigBox, Pengguna dapat memilih mekanisme pembayaran yang akan digunakan, antara lain:
                  <ol className="mt-2 list-[lower-roman] space-y-2 pl-6">
                    <li>
                      Bulanan;
                    </li>
                    <li>
                      Tahunan dengan Tagihan per Bulan;
                    </li>
                    <li>
                      Tahunan dengan Tagihan di Awal
                    </li>
                  </ol>
                </li>
                <li>
                  Pengguna setuju untuk membayar segala Layanan yang berbayar terkait produk Bigbox.
                </li>
                <li>
                  Pengguna setuju bahwa DTP BigBox melakukan transaksi terkait produk Bigbox dengan menggunakan beberapa metode pembayaran yang tersedia, yaitu:
                  <ol className="mt=2 list-[lower-roman] space-y-2 pl-6">
                    <li>
                      Virtual Account;
                    </li>
                    <li>
                      Kartu Kredit;
                    </li>
                    <li>
                      Kartu Debit
                    </li>
                  </ol>
                </li>
                <li>
                  Kami bekerja sama dengan pihak ketiga sebagaimana tersebut pada poin 5.b. di atas terkait proses pembayaran hanya untuk keperluan menyediakan metode pembayaran yang paling nyaman dan aman.
                </li>
                <li>
                  DTP BigBox tidak bertanggung jawab dalam hal pengembalian pembayaran apabila terjadi pelanggaran terhadap Syarat dan Ketentuan.
                </li>
              </ol>
            </section>

            <section id="larangan">
              <h2 className="text-xl font-semibold">5. Larangan dan Batasan</h2>
              <p className="mt-4">
                Tidak ada seorangpun yang diperbolehkan melakukan upaya dan/atau yang dapat dianggap upaya untuk mengumpulkan, mengolah dan/atau mengungkapkan data yang terkandung dalam sistem elektronik DTP BigBox untuk tujuan yang melanggar peraturan perundang-undangan.
              </p>
              <p className="mt-4">
                Tidak ada seorangpun yang diperbolehkan menggunakan situs DTP BigBox untuk melanggar keamanan atau integritas jaringan, komputer atau sistem komunikasi apa pun, aplikasi perangkat lunak, atau jaringan atau perangkat komputasi (masing-masing, 'Sistem').
              </p>
              <p className="mt-4">
                Kegiatan yang dilarang termasuk mengakses atau menggunakan Sistem apa pun tanpa izin, termasuk mencoba menyelidiki, memindai, atau menguji kerentanan Sistem atau untuk melanggar segala tindakan keamanan atau otentikasi yang digunakan oleh suatu Sistem.
              </p>
              <p className="mt-4">
                DTP BigBox dan TELKOM tidak bertanggung jawab atas pengumpulan, pengolahan dan/atau pengungkapan yang dilakukan di luar sistem elektronik DTP BigBox.
              </p>
            </section>

            <section id="jaminan">
              <h2 className="text-xl font-semibold">6. Jaminan TELKOM dan Pembatasan Tanggung Jawab TELKOM secara Umum</h2>
              <ol className="mt-4 list-[lower-alpha] space-y-3 pl-6">
                <li>
                  Pengguna setuju bahwa Pengguna memanfaatkan DTP BigBox atas keinginan sendiri dan Layanan DTP BigBox diberikan kepada Pengguna pada 'SEBAGAIMANA ADANYA' dan 'SEBAGAIMANA TERSEDIA'.
                </li>
                <li>
                  Sejauh diizinkan oleh hukum yang berlaku, TELKOM (termasuk TELKOM Group, direktur, dan karyawan) tidak bertanggung jawab, dan Pengguna setuju untuk tidak menuntut TELKOM bertanggung jawab, atas segala kerusakan atau kerugian (termasuk namun tidak terbatas pada hilangnya uang, reputasi, keuntungan, atau kerugian tak berwujud lainnya) yang diakibatkan secara langsung atau tidak langsung dari :
                  <ol className="mt=2 list-[lower-roman] space-y-2 pl-6">
                    <li>
                      Penggunaan atau ketidakmampuan Pengguna dalam menggunakan Layanan DTP BigBox;
                    </li>
                    <li>
                      Keterlambatan atau gangguan dalam Situs;
                    </li>
                    <li>
                      Kelalaian dan kerugian yang ditimbulkan oleh masing-masing Pengguna;
                    </li>
                    <li>
                      Pelanggaran Hak atas Kekayaan Intelektual;
                    </li>
                    <li>
                      Perselisihan antar Pengguna;
                    </li>
                    <li>
                      Pencemaran nama baik pihak lain;
                    </li>
                    <li>
                      Kerugian akibat pembayaran tidak resmi kepada pihak lain dengan cara apapun mengatasnamakan TELKOM ataupun kelalaian penulisan rekening dan/atau informasi lainnya dan/atau kelalaian pihak bank;
                    </li>
                    <li>
                      Virus atau perangkat lunak berbahaya lainnya (bot, script, automation tool, hacking tool) yang diperoleh dengan mengakses, atau menghubungkan ke Layanan DTP BigBox;
                    </li>
                    <li>
                      Gangguan, bug, kesalahan atau ketidakakuratan apapun dalam Layanan DTP BigBox;
                    </li>
                    <li>
                      Kerusakan pada perangkat keras Pengguna dari penggunaan setiap LayananDTP BigBox;
                    </li>
                    <li>
                      Adanya tindakan peretasan yang dilakukan oleh pihak ketiga kepada akun Pengguna;
                    </li>
                    <li>
                      Force Majeure.
                    </li>
                  </ol>
                </li>
              </ol>
            </section>

            <section id="kritik">
              <h2 className="text-xl font-semibold">7. Kritik dan/ atau Saran</h2>
              <ol className="mt-4 list-[lower-alpha] space-y-3 pl-6">
                <li>
                  Dalam hal terdapat pertanyaan, keluhan dan/ atau pengaduan sehubungan dengan penggunaan DTP BigBox, maka Pengguna dapat mengajukan pertanyaan, keluhan dan/atau pengaduan dengan melampirkan identitas Pengguna ke:
                  <ol className="mt=2 list-[lower-roman] space-y-2 pl-6">
                    <li>
                      Secara tertulis melalui: email support@bigbox.co.id atau WhatsApp ke +62811-1720-231
                    </li>
                    <li>
                      Langsung ke alamat lengkap: Telkom Kebayoran, 6th Floor, Jl. Sisingamangaraja No.4, Kebayoran Baru, Jakarta Selatan.
                    </li>
                  </ol>
                </li>
                <li>
                  Dalam hal adanya penambahan, pengurangan dan/atau perubahan channel pengaduan akan diinformasikan kemudian melalui Situs.
                </li>
                <li>
                  DTP BigBox akan melakukan verifikasi data Pengguna dengan berpedoman pada data Pengguna yang tersimpan pada sistem DTP BigBox
                </li>
                <li>
                  DTP BigBox akan melakukan pemeriksaan dan/ atau investigasi atas pengaduan Pengguna DTP BigBox serta memberikan jawaban
                </li>
              </ol>
            </section>

            <section id="force-majeure">
              <h2 className="text-xl font-semibold">8. Force Majeure</h2>
              <ol className="mt-4 list-[lower-alpha] space-y-3 pl-6">
                <li>
                  DTP BigBox dan TELKOM tidak dapat diminta pertanggungjawaban untuk keterlambatan dan/atau kegagalan dalam memenuhi kewajiban yang disebabkan oleh kejadian-kejadian di luar kemampuan TELKOM (selanjutnya disebut Force Majeure). Kejadian-kejadian yang dapat dikategorikan Force Majeure adalah termasuk segala keadaan atau peristiwa yang terjadi di luar kekuasaan Para Pihak, termasuk akan tetapi tidak terbatas pada huru-hara, epidemi, kebakaran, banjir, gempa bumi, pemogokan umum, perang, sabotase, dan berlaku efektifnya suatu ketentuan Perundang-undangan Republik Indonesia yang membatasi maupun mengakibatkan masing-masing pihak tidak dapat melaksanakan kewajibannya menurut Syarat dan Ketentuan ini.
                </li>
                <li>
                  Dalam hal terjadinya salah satu atau beberapa kejadian dan/atau peristiwa sebagaimana dimaksud, DTP BigBox dan TELKOM berkewajiban untuk memberitahukan secara tertulis melalui email, Situs, dan/ atau Aplikasi kepada Pengguna selambat-lambatnya 7 (tujuh) hari kalender sejak terjadinya peristiwa tersebut.
                </li>
              </ol>
            </section>

            <section id="perselisihan">
              <h2 className="text-xl font-semibold">9. Penyelesaian Perselisihan</h2>
              <ol className="mt-4 list-[lower-alpha] space-y-3 pl-6">
                <li>
                  Para Pihak sepakat untuk menyelesaikan perselisihan dalam pelaksanaan Syarat dan Ketentuan ini secara musyawarah dan mufakat.
                </li>
                <li>
                  Apabila musyawarah dan mufakat tidak tercapai dalam waktu 30 (tiga puluh) hari kalender atau suatu jangka waktu lainnya sebagaimana disepakati Para Pihak terhitung sejak timbulnya Perselisihan, maka Para Pihak sepakat bahwa penyelesaian Perselisihan tersebut akan diteruskan ke BANI (Badan Arbitrase Nasional Indonesia) yang bertempat di Jakarta dan menyetujui keputusan BANI tersebut bersifat final, sehingga tidak dapat dimintakan putusan pada tingkat yang lebih tinggi dan mengikat Para Pihak.
                </li>
              </ol>
            </section>
            <section id="hukum">
              <h2 className="text-xl font-semibold">10. Hukum yang Berlaku</h2>
              <p className="mt-4">
                Syarat dan Ketentuan ini tunduk pada Hukum Negara Republik Indonesia, hal-hal yang tidak atau belum diatur dalam Syarat dan Ketentuan ini tunduk pada ketentuan hukum yang berlaku bagi Perjanjian, termasuk namun tidak hanya terbatas pada Hukum Perjanjian yang termuat dalam Buku III, Kitab Undang-Undang Hukum Perdata (KUHPerdata).
              </p>
            </section>
            <section id="penutup">
              <h2 className="text-xl font-semibold">11. Ketentuan Penutup</h2>
              <p className="mt-4">
                Ketentuan ini mulai berlaku pada saat ditetapkan oleh Pihak DTP BigBox pada tanggal .....              </p>
            </section>
          </div>
        </div>
      </section>
      </main>

      <footer className="bg-[#93898f] py-10 text-sm text-white">
        <div className="mx-auto grid max-w-[1237px] gap-6 px-6 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <Image
              src="/bigbox_logo-removebg-preview.png"
              alt="BigBox logo"
              width={215}
              height={68}
              className="h-12 w-auto"
            />
            <p className="text-[14px] font-medium leading-[164%] text-white">
              Telkom Kebayoran, 4th Floor, Jl. Sisingamangaraja No.4, Kebayoran
              Baru, Jakarta Selatan.
            </p>
            <p className="text-[14px] font-medium text-white">
              Ac 2025 BigBox. All Rights Reserved. Privacy Policy | Terms &
              Conditions
            </p>
          </div>
          <div className="space-y-2 text-right md:justify-self-end">
            <p className="text-[14px] font-semibold uppercase tracking-[0.06em] text-white">
              Tentang Kami
            </p>
            <p className="text-[14px] font-semibold uppercase tracking-[0.06em] text-white">
              Kebijakan Privasi
            </p>
            <a
              className="text-[14px] font-semibold uppercase tracking-[0.06em] text-white"
              href="/syarat-ketentuan"
            >
              Syarat & Ketentuan
            </a>
            <p className="text-[14px] font-medium leading-[118%] text-white">
              Telkom Kebayoran, 4th Floor, Jl. Sisingamangaraja No.4, Kebayoran
              Baru, Jakarta Selatan.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
