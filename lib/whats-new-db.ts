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
    orderBy: [{ publishDate: "desc" }, { createdAt: "desc" }],
  });
}

export async function fetchWhatsNewHighlight() {
  return prisma.whatsNew.findFirst({
    where: { isHighlight: true },
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
  authorName: string;
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

export async function deleteWhatsNew(id: string) {
  return prisma.whatsNew.delete({ where: { id } });
}
