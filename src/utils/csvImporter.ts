import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function importCSV() {
  const csv = fs.readFileSync('sample_data.csv');

  // Parse the CSV content into an array of objects, one per row
  const records = parse(csv, { columns: true, skip_empty_lines: true });

  // Map CSV rows to the shape expected by Prisma's auctionItem model
  const data = records.map((record: any) => ({
    title: record.Title,
    description: record.Description,
    category: record.Category,
    estimatedValue: parseFloat(record.Price),
    status: record.Status.toLowerCase(),
  }));

  // Bulk insert the mapped data into the database, ignore duplicates
  await prisma.auctionItem.createMany({ data, skipDuplicates: true });
}
