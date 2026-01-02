import { z } from 'zod';
export declare const colorSchema: z.ZodObject<{
    id: z.ZodString;
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: string;
    id: string;
}, {
    value: string;
    id: string;
}>;
export declare const colorsSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: string;
    id: string;
}, {
    value: string;
    id: string;
}>, "many">;
