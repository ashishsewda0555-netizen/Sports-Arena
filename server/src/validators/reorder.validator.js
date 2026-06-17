import { z } from 'zod';

/**
 * Shared reorder schema — accepts an array of { id, displayOrder } pairs.
 * Used by PATCH .../reorder endpoints for coaches, gallery, pricing, etc.
 */
export const reorderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1, 'Item ID is required'),
        displayOrder: z.number().int().min(0),
      })
    )
    .min(1, 'At least one item is required'),
});
