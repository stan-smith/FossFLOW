import { z } from 'zod';
export declare const rectangleSchema: z.ZodObject<{
    id: z.ZodString;
    color: z.ZodOptional<z.ZodString>;
    customColor: z.ZodOptional<z.ZodString>;
    from: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>;
    to: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    from: {
        x: number;
        y: number;
    };
    to: {
        x: number;
        y: number;
    };
    color?: string | undefined;
    customColor?: string | undefined;
}, {
    id: string;
    from: {
        x: number;
        y: number;
    };
    to: {
        x: number;
        y: number;
    };
    color?: string | undefined;
    customColor?: string | undefined;
}>;
