import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSessionUserId } from "@/lib/auth";

export default async function ProfilePage() {
  const userId = await readSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#f4f3f6] px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-[0_20px_40px_rgba(18,16,29,0.12)]">
        <h1 className="text-2xl font-semibold text-[#1f1f1f]">
          Detail Profil
        </h1>
        <div className="mt-6 space-y-4 text-sm text-[#4a4a4a]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8a8a8a]">
              Nama Lengkap
            </p>
            <p className="text-base font-semibold text-[#1f1f1f]">
              {user.fullName}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8a8a8a]">
              Email
            </p>
            <p className="text-base font-semibold text-[#1f1f1f]">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
