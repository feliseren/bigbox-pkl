import { prisma } from "@/lib/prisma";

export async function fetchNews({
  query,
  category,
}: {
  query?: string;
  category?: string;
}) {
  const normalizedQuery = query?.trim();
  const queryFilters = normalizedQuery
    ? [
        { title: { contains: normalizedQuery } },
        { authorName: { contains: normalizedQuery } },
        { customerName: { contains: normalizedQuery } },
        { customerIndustry: { contains: normalizedQuery } },
        { customerLocation: { contains: normalizedQuery } },
        { customerProducts: { contains: normalizedQuery } },
        { contentText: { contains: normalizedQuery } },
        { summaryPart1: { contains: normalizedQuery } },
        { summaryPart2: { contains: normalizedQuery } },
        { summaryPart3: { contains: normalizedQuery } },
      ]
    : [];
  const where =
    normalizedQuery || category
      ? {
          AND: [
            ...(queryFilters.length ? [{ OR: queryFilters }] : []),
            ...(category ? [{ category }] : []),
          ],
        }
      : undefined;

  return prisma.newsStory.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function fetchNewsWithReviews({
  query,
  category,
}: {
  query?: string;
  category?: string;
}) {
  const normalizedQuery = query?.trim();
  const queryFilters = normalizedQuery
    ? [
        { title: { contains: normalizedQuery } },
        { authorName: { contains: normalizedQuery } },
        { customerName: { contains: normalizedQuery } },
        { customerIndustry: { contains: normalizedQuery } },
        { customerLocation: { contains: normalizedQuery } },
        { customerProducts: { contains: normalizedQuery } },
        { contentText: { contains: normalizedQuery } },
        { summaryPart1: { contains: normalizedQuery } },
        { summaryPart2: { contains: normalizedQuery } },
        { summaryPart3: { contains: normalizedQuery } },
      ]
    : [];
  const where =
    normalizedQuery || category
      ? {
          AND: [
            ...(queryFilters.length ? [{ OR: queryFilters }] : []),
            ...(category ? [{ category }] : []),
          ],
        }
      : undefined;

  return prisma.newsStory.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      reviews: {
        include: {
          user: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function findNewsById(id: string) {
  return prisma.newsStory.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createNews(data: {
  title: string;
  category: string;
  authorName: string;
  imageUrl: string | null;
  documentUrl: string | null;
  contentText: string | null;
  summaryPart1: string | null;
  summaryPart2: string | null;
  summaryPart3: string | null;
  customerName: string | null;
  customerIndustry: string | null;
  customerSize: string | null;
  customerLocation: string | null;
  customerProducts: string | null;
}) {
  return prisma.newsStory.create({
    data,
  });
}

export async function updateNews(data: {
  id: string;
  title: string;
  category: string;
  imageUrl: string | null;
  documentUrl: string | null;
  contentText: string | null;
  summaryPart1: string | null;
  summaryPart2: string | null;
  summaryPart3: string | null;
  customerName: string | null;
  customerIndustry: string | null;
  customerSize: string | null;
  customerLocation: string | null;
  customerProducts: string | null;
}) {
  const { id, ...rest } = data;
  return prisma.newsStory.update({
    where: { id },
    data: rest,
  });
}

export async function deleteNews(id: string) {
  return prisma.newsStory.delete({ where: { id } });
}
