import { z } from 'zod';
import { INITIAL_DATA } from '../config';
import { constrainedStrings } from './common';
import { modelItemsSchema } from './modelItems';
import { viewsSchema } from './views';
import { validateModel } from './validation';
import { iconsSchema } from './icons';
import { colorsSchema } from './colors';

export const modelSchema = z
  .object({
    version: z.string().max(10).optional(),
    title: constrainedStrings.name,
    description: constrainedStrings.description.optional(),
    items: modelItemsSchema,
    views: viewsSchema,
    icons: iconsSchema,
    colors: colorsSchema
  })
  .superRefine((model, ctx) => {
    const issues = validateModel({ ...INITIAL_DATA, ...model });

    issues.forEach((issue) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: issue.params,
        message: issue.message
      });
    });
  });
