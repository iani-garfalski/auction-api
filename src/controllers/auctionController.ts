import { Request, Response } from 'express';
import {
  createItem,
  getItemsWithPagination,
  getItem,
  updateItem,
  deleteItem,
  searchAuctionItems
} from '../services/auctionItemService';

import { cacheGet, cacheSet } from '../utils/cache';
import { getItemKey, getItemsPageKey, getSearchKey } from '../utils/cacheKeys';
import { invalidateAllCachesForItem, invalidateCachesAfterCreate } from '../utils/cacheInvalidation';

// POST /items
export async function createAuctionItem(req: Request, res: Response) {
  try {
    const item = await createItem(req.body);
    await invalidateCachesAfterCreate();

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: 'Error creating item', error });
  }
}

// GET /items
export async function getAllItems(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const cacheKey = getItemsPageKey(page, limit);

  const cached = await cacheGet(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  const result = await getItemsWithPagination(page, limit);
  await cacheSet(cacheKey, result, 60);
  res.json({ ...result, cached: false });
}

// GET /items/:id
export async function getItemById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const cacheKey = getItemKey(id);

  const cached = await cacheGet(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  const item = await getItem(id);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  await cacheSet(cacheKey, item, 60);
  res.json({ ...item, cached: false });
}

// GET /search
export async function searchItems(req: Request, res: Response) {
  const q = (req.query.q as string)?.trim() || '';
  if (!q) return res.json({ items: [], cached: false });

  const cacheKey = getSearchKey(q);
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  const items = await searchAuctionItems(q);
  await cacheSet(cacheKey, items, 60);
  res.json({ items, cached: false });
}

// PUT /items/:id
export async function updateAuctionItem(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  try {
    const updated = await updateItem(id, req.body);
    await invalidateAllCachesForItem(id);

    res.json(updated);
  } catch (error) {
    res.status(404).json({ message: 'Item not found or update failed', error });
  }
}

// DELETE /items/:id
export async function deleteAuctionItem(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  try {
    await deleteItem(id);
    await invalidateAllCachesForItem(id);

    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: 'Item not found or delete failed', error });
  }
}
