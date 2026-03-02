import { z } from 'zod';
import { id, constrainedStrings } from './common';

export const iconSchema = z.object({
  id,
  name: constrainedStrings.name,
  url: z.string().optional(),
  icon_id: z.string().optional(),
  collection: constrainedStrings.name.optional(),
  isIsometric: z.boolean().optional(),
  scale: z.number().min(0.1).max(3).optional()
}).refine((icon) => {
  return Boolean(icon.url || icon.icon_id);
}, {
  message: 'Either "url" or "icon_id" is required',
  path: ['url']
});

export const iconsSchema = z.array(iconSchema);
