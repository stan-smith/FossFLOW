import { z } from 'zod';
import { id, constrainedStrings } from './common';

export const modelItemSchema = z.object({
  id,
  name: constrainedStrings.name,
  description: constrainedStrings.description.optional(),
  icon: id.optional(),
  ipAddress: z.string().max(100).optional(),
  hostname: z.string().max(100).optional(),
  os: z.string().max(100).optional()
});

export const modelItemsSchema = z.array(modelItemSchema);
