import { z } from 'zod';
export declare const modelItemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    customProperties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    description?: string | undefined;
    icon?: string | undefined;
    tags?: string[] | undefined;
    customProperties?: Record<string, string> | undefined;
}, {
    id: string;
    name: string;
    description?: string | undefined;
    icon?: string | undefined;
    tags?: string[] | undefined;
    customProperties?: Record<string, string> | undefined;
}>;
export declare const modelItemsSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    customProperties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    description?: string | undefined;
    icon?: string | undefined;
    tags?: string[] | undefined;
    customProperties?: Record<string, string> | undefined;
}, {
    id: string;
    name: string;
    description?: string | undefined;
    icon?: string | undefined;
    tags?: string[] | undefined;
    customProperties?: Record<string, string> | undefined;
}>, "many">;
