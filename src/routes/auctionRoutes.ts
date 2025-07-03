import express from 'express';
import {
  createAuctionItem,
  getAllItems,
  getItemById,
  searchItems,
  updateAuctionItem,
  deleteAuctionItem,
} from '../controllers/auctionController';

import { apiKeyAuth } from '../middleware/apiKeyAuth';
import { validateBody } from '../middleware/validate';
import { auctionItemSchema } from '../validation/auctionSchemas';

const router = express.Router();

// Public routes (no API key)
router.get('/search', searchItems);
router.get('/items', getAllItems);
router.get('/items/:id', getItemById);

// Protected routes (require API key) and validate request using zod
router.post('/items', apiKeyAuth, validateBody(auctionItemSchema), createAuctionItem);
router.put('/items/:id', apiKeyAuth, validateBody(auctionItemSchema), updateAuctionItem);
router.delete('/items/:id', apiKeyAuth, deleteAuctionItem);

export default router;
