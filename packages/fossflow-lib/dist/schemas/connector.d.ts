import { z } from 'zod';
export declare const connectorStyleOptions: readonly ["SOLID", "DOTTED", "DASHED"];
export declare const connectorLineTypeOptions: readonly ["SINGLE", "DOUBLE", "DOUBLE_WITH_CIRCLE"];
export declare const connectorLabelSchema: z.ZodObject<{
    id: z.ZodString;
    text: z.ZodString;
    position: z.ZodNumber;
    height: z.ZodOptional<z.ZodNumber>;
    line: z.ZodOptional<z.ZodEnum<["1", "2"]>>;
    showLine: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    text: string;
    position: number;
    height?: number | undefined;
    line?: "1" | "2" | undefined;
    showLine?: boolean | undefined;
}, {
    id: string;
    text: string;
    position: number;
    height?: number | undefined;
    line?: "1" | "2" | undefined;
    showLine?: boolean | undefined;
}>;
export declare const anchorSchema: z.ZodObject<{
    id: z.ZodString;
    ref: z.ZodObject<{
        item: z.ZodOptional<z.ZodString>;
        anchor: z.ZodOptional<z.ZodString>;
        tile: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        item?: string | undefined;
        anchor?: string | undefined;
        tile?: {
            x: number;
            y: number;
        } | undefined;
    }, {
        item?: string | undefined;
        anchor?: string | undefined;
        tile?: {
            x: number;
            y: number;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    ref: {
        item?: string | undefined;
        anchor?: string | undefined;
        tile?: {
            x: number;
            y: number;
        } | undefined;
    };
}, {
    id: string;
    ref: {
        item?: string | undefined;
        anchor?: string | undefined;
        tile?: {
            x: number;
            y: number;
        } | undefined;
    };
}>;
export declare const connectorSchema: z.ZodObject<{
    id: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    startLabel: z.ZodOptional<z.ZodString>;
    endLabel: z.ZodOptional<z.ZodString>;
    startLabelHeight: z.ZodOptional<z.ZodNumber>;
    centerLabelHeight: z.ZodOptional<z.ZodNumber>;
    endLabelHeight: z.ZodOptional<z.ZodNumber>;
    labels: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        text: z.ZodString;
        position: z.ZodNumber;
        height: z.ZodOptional<z.ZodNumber>;
        line: z.ZodOptional<z.ZodEnum<["1", "2"]>>;
        showLine: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        text: string;
        position: number;
        height?: number | undefined;
        line?: "1" | "2" | undefined;
        showLine?: boolean | undefined;
    }, {
        id: string;
        text: string;
        position: number;
        height?: number | undefined;
        line?: "1" | "2" | undefined;
        showLine?: boolean | undefined;
    }>, "many">>;
    color: z.ZodOptional<z.ZodString>;
    customColor: z.ZodOptional<z.ZodString>;
    width: z.ZodOptional<z.ZodNumber>;
    style: z.ZodOptional<z.ZodEnum<["SOLID", "DOTTED", "DASHED"]>>;
    lineType: z.ZodOptional<z.ZodEnum<["SINGLE", "DOUBLE", "DOUBLE_WITH_CIRCLE"]>>;
    showArrow: z.ZodOptional<z.ZodBoolean>;
    anchors: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        ref: z.ZodObject<{
            item: z.ZodOptional<z.ZodString>;
            anchor: z.ZodOptional<z.ZodString>;
            tile: z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>;
        }, "strip", z.ZodTypeAny, {
            item?: string | undefined;
            anchor?: string | undefined;
            tile?: {
                x: number;
                y: number;
            } | undefined;
        }, {
            item?: string | undefined;
            anchor?: string | undefined;
            tile?: {
                x: number;
                y: number;
            } | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        ref: {
            item?: string | undefined;
            anchor?: string | undefined;
            tile?: {
                x: number;
                y: number;
            } | undefined;
        };
    }, {
        id: string;
        ref: {
            item?: string | undefined;
            anchor?: string | undefined;
            tile?: {
                x: number;
                y: number;
            } | undefined;
        };
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    anchors: {
        id: string;
        ref: {
            item?: string | undefined;
            anchor?: string | undefined;
            tile?: {
                x: number;
                y: number;
            } | undefined;
        };
    }[];
    description?: string | undefined;
    color?: string | undefined;
    customColor?: string | undefined;
    startLabel?: string | undefined;
    endLabel?: string | undefined;
    startLabelHeight?: number | undefined;
    centerLabelHeight?: number | undefined;
    endLabelHeight?: number | undefined;
    labels?: {
        id: string;
        text: string;
        position: number;
        height?: number | undefined;
        line?: "1" | "2" | undefined;
        showLine?: boolean | undefined;
    }[] | undefined;
    width?: number | undefined;
    style?: "SOLID" | "DOTTED" | "DASHED" | undefined;
    lineType?: "SINGLE" | "DOUBLE" | "DOUBLE_WITH_CIRCLE" | undefined;
    showArrow?: boolean | undefined;
}, {
    id: string;
    anchors: {
        id: string;
        ref: {
            item?: string | undefined;
            anchor?: string | undefined;
            tile?: {
                x: number;
                y: number;
            } | undefined;
        };
    }[];
    description?: string | undefined;
    color?: string | undefined;
    customColor?: string | undefined;
    startLabel?: string | undefined;
    endLabel?: string | undefined;
    startLabelHeight?: number | undefined;
    centerLabelHeight?: number | undefined;
    endLabelHeight?: number | undefined;
    labels?: {
        id: string;
        text: string;
        position: number;
        height?: number | undefined;
        line?: "1" | "2" | undefined;
        showLine?: boolean | undefined;
    }[] | undefined;
    width?: number | undefined;
    style?: "SOLID" | "DOTTED" | "DASHED" | undefined;
    lineType?: "SINGLE" | "DOUBLE" | "DOUBLE_WITH_CIRCLE" | undefined;
    showArrow?: boolean | undefined;
}>;
