/**
 * Service layer for AuctionItem database operations.
 *
 * This module abstracts all direct Prisma Client calls related to auction items,
 * including create, read (single & paginated), update, delete, and full-text search.
 *
 * Keeping DB logic here helps keep controllers clean and makes it easier to maintain
 * and test the data access logic separately from the HTTP request handling.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createItem(data: {
  title: string;
  description: string;
  category: string;
  estimatedValue: number;
  status: 'upcoming' | 'live' | 'closed';
}) {
  return prisma.auctionItem.create({ data });
}

export async function getItemsWithPagination(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.auctionItem.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.auctionItem.count(),
  ]);

  return { total, page, limit, items };
}

export async function getItem(id: number) {
  return prisma.auctionItem.findUnique({ where: { id } });
}

export async function updateItem(id: number, data: {
  title: string;
  description: string;
  category: string;
  estimatedValue: number;
  status: 'upcoming' | 'live' | 'closed';
}) {
  return prisma.auctionItem.update({
    where: { id },
    data,
  });
}

export async function deleteItem(id: number) {
  return prisma.auctionItem.delete({ where: { id } });
}

export async function searchAuctionItems(query: string) {
  // Directly use tagged template to avoid SQL injection
  return prisma.$queryRaw`
    SELECT *
    FROM "AuctionItem"
    WHERE to_tsvector('english', coalesce("title", '') || ' ' || coalesce("description", '') || ' ' || coalesce("category", '')) @@ plainto_tsquery('english', ${query})
    ORDER BY "createdAt" DESC
    LIMIT 50;
  `;
}
