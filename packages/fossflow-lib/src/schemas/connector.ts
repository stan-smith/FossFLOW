import { z } from 'zod';
import { coords, id, constrainedStrings } from './common';

export const connectorStyleOptions = ['SOLID', 'DOTTED', 'DASHED'] as const;
export const connectorLineTypeOptions = ['SINGLE', 'DOUBLE', 'DOUBLE_WITH_CIRCLE'] as const;

export const anchorSchema = z.object({
  id,
  ref: z
    .object({
      item: id,
      anchor: id,
      tile: coords
    })
    .partial()
});

export const connectorSchema = z.object({
  id,
  description: constrainedStrings.description.optional(),
  startLabel: constrainedStrings.description.optional(),
  endLabel: constrainedStrings.description.optional(),
  startLabelHeight: z.number().optional(),
  centerLabelHeight: z.number().optional(),
  endLabelHeight: z.number().optional(),
  color: id.optional(),
  customColor: z.string().optional(), // For custom RGB colors
  width: z.number().optional(),
  style: z.enum(connectorStyleOptions).optional(),
  lineType: z.enum(connectorLineTypeOptions).optional(),
  showArrow: z.boolean().optional(),
  anchors: z.array(anchorSchema)
});
