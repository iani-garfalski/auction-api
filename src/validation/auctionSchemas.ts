import { z } from 'zod';

// Schema to validate auction item data using Zod
export const auctionItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(5),
  category: z.string().min(2),
  estimatedValue: z.number().positive(),
  status: z.enum(['upcoming', 'live', 'closed']),
});
