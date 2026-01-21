import Image from "next/image";

const WHATSAPP_LINK = "https://wa.me/628111720231";

export function ConsultationCTA() {
  return (
    <section className="mx-auto max-w-[1237px] px-6 py-16">
      <div className="rounded-[20px] bg-gradient-to-r from-[#2d1b3d] via-[#451a4a] to-[#2d1b3d] p-12 text-center">
        <h2 className="mb-4 text-[40px] font-bold text-white">
          Siap Wujudkan{" "}
          <span className="text-[#ff6b3d]">Keputusan Cerdas</span> Bersama
          BigBox?
        </h2>
        <p className="mb-12 text-[18px] text-gray-300">
          Konsultasikan kebutuhan bisnis Anda dengan tim ahli kami untuk menemukan solusi AI dan Big Data yang tepat
        </p>

        {/* Products Grid */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          {/* BIG AI */}
          <div className="rounded-[16px] border-2 border-[#ff6b3d] bg-[#1a0f2e] p-8 transition-all duration-300 hover:scale-105 hover:bg-[#2d1b3d] hover:shadow-lg hover:shadow-[#ff6b3d]/50">
            <div className="mb-4 flex justify-center">
              <Image
                src="/bigAssistant_logo.png"
                alt="BIG AI"
                width={80}
                height={80}
              />
            </div>
            <h3 className="mb-4 text-[24px] font-bold text-white">
              BIG AI
            </h3>
            <p className="mb-6 text-gray-400">
              Solusi AI untuk keputusan bisnis yang lebih cerdas dengan insight berbasis data real-time
            </p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-[8px] bg-[#ff6b3d] py-2 text-center font-semibold text-white transition-colors hover:bg-[#ff5722]"
            >
              Konsultasi Sekarang
            </a>
          </div>

          {/* BIG VISION */}
          <div className="rounded-[16px] border-2 border-[#ff6b3d] bg-[#1a0f2e] p-8 transition-all duration-300 hover:scale-105 hover:bg-[#2d1b3d] hover:shadow-lg hover:shadow-[#ff6b3d]/50">
            <div className="mb-4 flex justify-center">
              <Image
                src="/bigVision-logo.png"
                alt="BIG VISION"
                width={80}
                height={80}
              />
            </div>
            <h3 className="mb-4 text-[24px] font-bold text-white">
              BIG VISION
            </h3>
            <p className="mb-6 text-gray-400">
              Platform analitik visual dengan dashboard real-time dan laporan cerdas untuk pemahaman mendalam
            </p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-[8px] bg-[#ff6b3d] py-2 text-center font-semibold text-white transition-colors hover:bg-[#ff5722]"
            >
              Konsultasi Sekarang
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
