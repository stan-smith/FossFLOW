import { z } from 'zod';
export declare const textBoxSchema: z.ZodObject<{
    id: z.ZodString;
    tile: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>;
    content: z.ZodString;
    fontSize: z.ZodOptional<z.ZodNumber>;
    orientation: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"X">, z.ZodLiteral<"Y">]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    tile: {
        x: number;
        y: number;
    };
    content: string;
    fontSize?: number | undefined;
    orientation?: "X" | "Y" | undefined;
}, {
    id: string;
    tile: {
        x: number;
        y: number;
    };
    content: string;
    fontSize?: number | undefined;
    orientation?: "X" | "Y" | undefined;
}>;
