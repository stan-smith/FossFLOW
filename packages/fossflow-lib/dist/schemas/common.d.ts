import { z } from 'zod';
export declare const coords: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
}, {
    x: number;
    y: number;
}>;
export declare const id: z.ZodString;
export declare const color: z.ZodString;
export declare const constrainedStrings: {
    name: z.ZodString;
    description: z.ZodString;
};
