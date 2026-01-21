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
    subtitle: "Kementrian Perhubungan",
    image: "/1371542_6424.jpg",
    tags: ["AI BigOne", "AI BigVision"],
    category: "Legal Analytic",
    title: "Kementerian Perhubungan: Mengotomatiskan Analisis Dokumen Hukum (Legal Analytic)",
    studyCase: "Studi Kasus: Kemenub",
    studyCaseDescription: `Kementerian Perhubungan (Kemenhub) Indonesia telah mengambil langkah besar dalam transformasi digital dengan mengimplementasikan Sistem Informasi Hukum yang inovatif. Sistem ini didukung oleh produk BIGONE dan BIGVISION, bertujuan untuk mengotomatiskan analisis dan rekapitulasi dokumen untuk meningkatkan kualitas produk hukum di kementerian Perhubungan.

Kemenhub, sebagai salah satu kementerian terbesar di Indonesia dengan berbagai tanggungjawab atas pengelolaan regulasi di sektor transportasi, masuk dalam kategori organisasi dengan lebih dari 1.000 karyawan. Proyek ini dilaksanakan untuk membantu teknologi modern dapat mereevolusi proses pemerintahan.`,
    backgroundTitle: "Latar Belakang Proyek",
    backgroundDescription: `Kemenhub, sebagai salah satu kementerian terbesar di Indonesia, bertanggung jawab atas pengelolaan regulasi di sektor transportasi. Dengan proyek ini, Kemenhub memanfaatkan teknologi AI dan big data untuk mengotomatiskan berbagai aspek pengelolaan dokumen hukum. Proses manual dalam menganalisis dan merekapitulasi dokumen-dokumen ini sering kali memakan waktu berminggu-minggu, rentan terhadap kesalahan manusia, dan sulit untuk memastikami konsistensi dengan peraturan yang sudah ada. Untuk mengatasi tantangan ini, Kemenhub bekerja sama dengan penyedia solusi teknologi untuk menemukan kembali cara mereka mengelola dokumen-dokumen ini siring kali melakon waktu berminggu-minggu, rentan terhadap kesalahan manusia, dan sulit untuk memastikan konsistensi dengan peraturan yang sudah ada. Untuk mengatasi tantangan ini, Kemenhub berkerja sama dengan penyedia solusi teknologi untuk menemukan kembali cara mereka mengelola dokumen hukum.`,
    solutionTitle: "Solusi yang Diterapkan",
    solutions: [
      {
        title: "Analisis Dokumen Otomatis",
        description: "Sistem ini menggunakan AI untuk menganalisis ribuan dokumen hukum secara otomatis, mengidentifikasi pola penting, potensi masalah dalam draf peraturan yang ada.",
      },
      {
        title: "Rekapitulasi Cepat",
        description: "Dengan kemampuan memanfaatkan AI, sistem ini dapat menghasilkan laporan rekapitulasi dalam hitungan jam, bukan minggu.",
      },
      {
        title: "Peningkatan Kualitas",
        description: "Sistem memastikan konsistensi dan kualitas regulasi dengan membandingkan draft peraturan yang ada, meningkatkan risiko inkonsistensi hukum.",
      },
      {
        title: "Antarmuka Pengguna yang Intuitif",
        description: "Sistem dirancang untuk mudah digunakan oleh pegawai Kemenhub, bahkan bagi mereka yang tidak memiliki latar belakang teknis.",
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
