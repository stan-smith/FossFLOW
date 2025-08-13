import { z } from 'zod';
import { id, coords } from './common';

export const rectangleSchema = z.object({
  id,
  color: id.optional(),
  from: coords,
  to: coords
});
