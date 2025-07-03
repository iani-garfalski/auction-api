/**
 * Redis Cache Storage & Multiple Deletes Explained:
 *
 * - Redis stores cache entries as simple key-value pairs where the value is JSON-stringified data.
 * - Keys are namespaced with prefixes to differentiate cached data types:
 *    - 'item:{id}' caches individual auction items by their unique ID.
 *    - 'items:page={page}:limit={limit}' caches paginated item lists for quick retrieval.
 *    - 'search:{query}' caches search results for specific search queries.
 *
 * - Multiple cache deletes are necessary to keep data consistent and fresh:
 *    - When an item changes (create/update/delete), we must invalidate:
 *       1. The individual item cache ('item:{id}') to avoid stale detail views.
 *       2. All paginated lists ('items:*') because the changed item could appear on any page.
 *       3. All search result caches ('search:*') because the change may affect search results.
 *
 * - This strategy balances performance (caching) with data correctness (cache invalidation).
 * - While this may cause some extra cache clearing, it ensures clients always receive up-to-date info.
 */

import Redis from 'ioredis';

export const redis = new Redis({ host: 'redis', port: 6379 });

// Try to get from cache
export async function cacheGet<T>(key: string): Promise<T | null> {
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
}

// Set cache with optional TTL (default: 60s)
export async function cacheSet(key: string, data: any, ttl = 60): Promise<void> {
  await redis.set(key, JSON.stringify(data), 'EX', ttl);
}

// Delete a specific cache key
export async function cacheDel(key: string): Promise<void> {
  await redis.del(key);
}

// Clear all search result caches
export async function clearSearchCache(): Promise<void> {
  const keys = await redis.keys('search:*');
  if (keys.length > 0) await redis.del(...keys);
}

// Clear all paginated/listing caches
export async function clearItemsCache(): Promise<void> {
  const keys = await redis.keys('items:*');
  if (keys.length > 0) await redis.del(...keys);
}