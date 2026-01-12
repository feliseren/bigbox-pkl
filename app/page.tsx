import { prisma } from "@/lib/prisma";

export default async function Home() {
  const testCount = await prisma.test.count();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="w-full max-w-3xl rounded-2xl bg-white p-10 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Prisma + MySQL sudah terhubung
        </h1>
        <p className="mt-4 text-zinc-700">
          Total data pada tabel <span className="font-mono">Test</span>:{" "}
          <span className="font-semibold">{testCount}</span>
        </p>
      </main>
    </div>
  );
}
