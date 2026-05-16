import { prisma } from "@/lib/prisma";

export type WhatsNewFilters = {
  query?: string;
  category?: string;
};

export async function fetchWhatsNew(filters: WhatsNewFilters = {}) {
  const query = filters.query?.trim();
  const category = filters.category?.trim();
  const where =
    query || category
      ? {
          AND: [
            ...(query
              ? [
                  {
                    OR: [
                      { title: { contains: query } },
                      { summary: { contains: query } },
                      { contentText: { contains: query } },
                    ],
                  },
                ]
              : []),
            ...(category ? [{ category }] : []),
          ],
        }
      : undefined;

  return prisma.whatsNew.findMany({
    where,
    include: { employee: { select: { fullName: true } } },
    orderBy: [{ publishDate: "desc" }, { createdAt: "desc" }],
  });
}

export async function fetchWhatsNewHighlight() {
  return prisma.whatsNew.findFirst({
    where: { isHighlight: true },
    include: { employee: { select: { fullName: true } } },
    orderBy: [{ publishDate: "desc" }, { createdAt: "desc" }],
  });
}

export async function createWhatsNew(data: {
  title: string;
  category: string;
  summary: string;
  contentText: string | null;
  imageUrl: string | null;
  isHighlight: boolean;
  publishDate: Date;
  employeeId: string;
}) {
  return prisma.whatsNew.create({ data });
}

export async function updateWhatsNew(data: {
  id: string;
  title: string;
  category: string;
  summary: string;
  contentText: string | null;
  imageUrl?: string | null;
  isHighlight: boolean;
  publishDate: Date;
}) {
  const { id, ...rest } = data;
  return prisma.whatsNew.update({ where: { id }, data: rest });
}

export async function deleteWhatsNew(id: string, deletedBy?: string | null) {
  const existing = await prisma.whatsNew.findUnique({ where: { id } });
  if (!existing) return null;
  return prisma.$transaction([
    prisma.archivedWhatsNew.create({
      data: {
        originalId: existing.id,
        title: existing.title,
        category: existing.category,
        summary: existing.summary,
        contentText: existing.contentText,
        imageUrl: existing.imageUrl,
        isHighlight: existing.isHighlight,
        publishDate: existing.publishDate,
        employeeId: existing.employeeId,
        createdAt: existing.createdAt,
        updatedAt: existing.updatedAt,
        deletedAt: new Date(),
        deletedBy: deletedBy ?? null,
      },
    }),
    prisma.whatsNew.delete({ where: { id } }),
  ]);
}
