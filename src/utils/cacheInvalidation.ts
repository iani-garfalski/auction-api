import { cacheDel, clearItemsCache, clearSearchCache } from './cache';
import { getItemKey } from './cacheKeys';

// Called after updating or deleting an item
export async function invalidateAllCachesForItem(id: number) {
  await cacheDel(getItemKey(id));
  await clearItemsCache();
  await clearSearchCache();
}

// Called after creating a new item
export async function invalidateCachesAfterCreate() {
  await clearItemsCache();
  await clearSearchCache();
}