import { z } from 'zod';
import { id, constrainedStrings } from './common';

export const modelItemSchema = z.object({
  id,
  name: constrainedStrings.name,
  description: constrainedStrings.description.optional(),
  icon: id.optional(),
  tags: z.array(z.string().max(50)).optional(),
  customProperties: z.record(z.string(), z.string().max(500)).optional()
});

export const modelItemsSchema = z.array(modelItemSchema);
