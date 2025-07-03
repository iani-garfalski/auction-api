import { PrismaClient } from '@prisma/client';
import { importCSV } from '../utils/csvImporter';
import { redis, clearItemsCache, clearSearchCache } from '../utils/cache';

const prisma = new PrismaClient();

/**
 * CLI script to import auction items from a CSV file into the database.
 * After import, it clears the relevant Redis caches to keep data fresh.
 * Finally, it gracefully disconnects from Prisma and Redis to free resources.
 */
importCSV()
  .then(async () => {
    console.log('CSV import completed.');

    await clearItemsCache();
    await clearSearchCache();
    console.log('Cache cleared after import');
  })
  .catch((err) => {
    console.error('CSV import failed:', err);
  })
  .finally(() => {
    //Shutdown the connections to prisma and redis after finishing the cli command
    prisma.$disconnect();
    redis.disconnect();
  });
