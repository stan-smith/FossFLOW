import { z } from 'zod';
import { id } from './common';

export const colorSchema = z.object({
  id,
  value: z.string().max(7)
});

export const colorsSchema = z.array(colorSchema);
