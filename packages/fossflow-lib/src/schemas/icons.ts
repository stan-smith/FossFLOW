import { z } from 'zod';
import { id, constrainedStrings } from './common';

export const iconSchema = z.object({
  id,
  name: constrainedStrings.name,
  url: z.string(),
  collection: constrainedStrings.name.optional(),
  isIsometric: z.boolean().optional()
});

export const iconsSchema = z.array(iconSchema);
