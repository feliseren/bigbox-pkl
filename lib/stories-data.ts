export interface Story {
  id: number;
  client: string;
  subtitle: string;
  image: string;
  tags: string[];
  category: string;
  title: string;
  studyCase: string;
  studyCaseDescription: string;
  backgroundTitle: string;
  backgroundDescription: string;
  solutionTitle: string;
  solutions: Array<{
    title: string;
    description: string;
  }>;
  organization: {
    name: string;
    industry: string;
    size: string;
    location: string;
    products: string[];
  };
  ctaText?: string;
}

export const allStories: Story[] = [
  {
    id: 1,
    client: "KEMENHUB",
    subtitle: "Kementerian Perhubungan",
    image: "/1371542_6424.jpg",
    tags: ["AI BigOne", "AI BigVision"],
    category: "Legal Analytic",
    title:
      "Kementerian Perhubungan: Mengotomatiskan Analisis Dokumen Hukum (Legal Analytic)",
    studyCase: "Studi Kasus: Kemenhub",
    studyCaseDescription: `Studi ini menunjukkan bagaimana Sistem Informasi Hukum mengotomatiskan analisis dan rekapitulasi dokumen untuk meningkatkan kualitas produk hukum di Kementerian Perhubungan.

Kementerian Perhubungan (Kemenhub) Indonesia menjalankan transformasi digital dengan mengimplementasikan sistem yang didukung AI BigOne dan AI BigVision. Inisiatif ini mempercepat proses review dokumen, meminimalkan risiko inkonsistensi, serta memastikan kualitas regulasi tetap terjaga.`,
    backgroundTitle: "Latar Belakang Proyek",
    backgroundDescription: `Kemenhub mengelola regulasi di sektor transportasi darat, laut, udara, dan kereta api. Setiap tahun ribuan dokumen hukum seperti peraturan menteri, keputusan, dan pedoman teknis diterbitkan. Proses manual untuk menganalisis dan merekapitulasi dokumen sering memakan waktu berminggu-minggu, rentan terhadap kesalahan manusia, dan sulit menjaga konsistensi dengan peraturan yang sudah ada.

Untuk mengatasi tantangan tersebut, Kemenhub bekerja sama dengan BigBox agar sistem informasi hukum dapat memanfaatkan AI dan big data, sehingga proses analisis lebih cepat, akurat, dan mudah dipakai oleh tim internal.`,
    solutionTitle: "Solusi yang Diterapkan",
    solutions: [
      {
        title: "Analisis Dokumen Otomatis",
        description:
          "AI menganalisis ribuan dokumen hukum secara otomatis untuk mengidentifikasi pola, inkonsistensi, dan potensi masalah pada draf peraturan.",
      },
      {
        title: "Peningkatan Kualitas Produk Hukum",
        description:
          "Sistem memastikan konsistensi regulasi dengan membandingkan draf baru terhadap peraturan yang ada sehingga kualitas produk hukum meningkat.",
      },
      {
        title: "Menghemat Waktu",
        description:
          "Rekapitulasi dokumen yang sebelumnya memakan waktu minggu kini bisa selesai dalam hitungan jam.",
      },
      {
        title: "Antarmuka Pengguna yang Intuitif",
        description:
          "Antarmuka dibuat sederhana agar mudah dipakai pegawai Kemenhub tanpa membutuhkan latar belakang teknis.",
      },
    ],
    organization: {
      name: "Kemenhub",
      industry: "Pemerintah",
      size: "1000+ Karyawan",
      location: "Jakarta, Indonesia",
      products: ["AI BigOne", "AI BigVision"],
    },
  },
  {
    id: 2,
    client: "KEMENHUB",
    subtitle: "Kementrian Perhubungan",
    image: "/concentrated-man-using-laptop-computer-home.jpg",
    tags: ["AI BigOne", "AI BigVision"],
    category: "Chatbot AI Assitant",
    title: "Kemenhub: Implementasi Chatbot AI untuk Customer Service",
    studyCase: "Studi Kasus: Chatbot Pelayanan",
    studyCaseDescription: `Kemenhub mengimplementasikan solusi chatbot AI yang canggih untuk meningkatkan layanan pelanggan dan mempercepat respons terhadap pertanyaan publik mengenai layanan transportasi dan regulasi perhubungan.`,
    backgroundTitle: "Latar Belakang Implementasi",
    backgroundDescription: `Dengan meningkatnya volume pertanyaan dari publik, Kemenhub membutuhkan solusi otomasi untuk menangani inquiry secara real-time tanpa mengurangi kualitas layanan.`,
    solutionTitle: "Solusi AI Chatbot",
    solutions: [
      {
        title: "Chatbot Berbasis AI",
        description: "Menggunakan teknologi NLP terkini untuk memahami dan merespons pertanyaan pelanggan secara akurat.",
      },
      {
        title: "Integrasi Omnichannel",
        description: "Tersedia di berbagai platform: website, WhatsApp, dan media sosial.",
      },
      {
        title: "Pembelajaran Berkelanjutan",
        description: "Sistem terus belajar dari interaksi untuk meningkatkan akurasi respons.",
      },
      {
        title: "Eskalasi Cerdas",
        description: "Pertanyaan kompleks secara otomatis diteruskan ke agen manusia.",
      },
    ],
    organization: {
      name: "Kemenhub",
      industry: "Pemerintah",
      size: "1000+ Karyawan",
      location: "Jakarta, Indonesia",
      products: ["AI BigOne", "AI BigVision"],
    },
  },
  {
    id: 3,
    client: "KEMENHUB",
    subtitle: "Kementrian Perhubungan",
    image: "/Screenshot_9-1-2026_9924_www.freepik.com.jpeg",
    tags: ["AI BigOne", "AI BigVision"],
    category: "Social Media Analytic",
    title: "Kemenhub: Analytics Media Sosial untuk Sentiment Analysis",
    studyCase: "Studi Kasus: Social Media Monitoring",
    studyCaseDescription: `Kemenhub memanfaatkan platform analytics media sosial berbasis AI untuk memantau sentimen publik terhadap regulasi dan layanan transportasi.`,
    backgroundTitle: "Tantangan Media Sosial",
    backgroundDescription: `Pemerintah perlu memahami opini publik di media sosial untuk membuat kebijakan yang responsif. Namun, volume data yang besar membuat analisis manual tidak efisien.`,
    solutionTitle: "Solusi Analytics Media Sosial",
    solutions: [
      {
        title: "Sentiment Analysis Real-time",
        description: "Analisis otomatis sentimen positif, negatif, dan netral dari jutaan postingan.",
      },
      {
        title: "Deteksi Tren",
        description: "Mengidentifikasi topik yang trending dan perhatian publik.",
      },
      {
        title: "Insights Komprehensif",
        description: "Dashboard interaktif untuk visualisasi data sentimen dan tren.",
      },
      {
        title: "Rekomendasi Strategis",
        description: "Memberikan rekomendasi berdasarkan analisis data untuk kebijakan lebih baik.",
      },
    ],
    organization: {
      name: "Kemenhub",
      industry: "Pemerintah",
      size: "1000+ Karyawan",
      location: "Jakarta, Indonesia",
      products: ["AI BigOne", "AI BigVision"],
    },
  },
];
