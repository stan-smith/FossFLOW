import { z } from 'zod';
export declare const iconSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    url: z.ZodString;
    collection: z.ZodOptional<z.ZodString>;
    isIsometric: z.ZodOptional<z.ZodBoolean>;
    scale: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    url: string;
    collection?: string | undefined;
    isIsometric?: boolean | undefined;
    scale?: number | undefined;
}, {
    id: string;
    name: string;
    url: string;
    collection?: string | undefined;
    isIsometric?: boolean | undefined;
    scale?: number | undefined;
}>;
export declare const iconsSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    url: z.ZodString;
    collection: z.ZodOptional<z.ZodString>;
    isIsometric: z.ZodOptional<z.ZodBoolean>;
    scale: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    url: string;
    collection?: string | undefined;
    isIsometric?: boolean | undefined;
    scale?: number | undefined;
}, {
    id: string;
    name: string;
    url: string;
    collection?: string | undefined;
    isIsometric?: boolean | undefined;
    scale?: number | undefined;
}>, "many">;
