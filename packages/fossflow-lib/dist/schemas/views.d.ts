import { z } from 'zod';
export declare const viewItemSchema: z.ZodObject<{
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
    labelHeight: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    tile: {
        x: number;
        y: number;
    };
    labelHeight?: number | undefined;
}, {
    id: string;
    tile: {
        x: number;
        y: number;
    };
    labelHeight?: number | undefined;
}>;
export declare const viewSchema: z.ZodObject<{
    id: z.ZodString;
    lastUpdated: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    items: z.ZodArray<z.ZodObject<{
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
        labelHeight: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        tile: {
            x: number;
            y: number;
        };
        labelHeight?: number | undefined;
    }, {
        id: string;
        tile: {
            x: number;
            y: number;
        };
        labelHeight?: number | undefined;
    }>, "many">;
    rectangles: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
    }>, "many">>;
    connectors: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
    }>, "many">>;
    textBoxes: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    items: {
        id: string;
        tile: {
            x: number;
            y: number;
        };
        labelHeight?: number | undefined;
    }[];
    description?: string | undefined;
    lastUpdated?: string | undefined;
    rectangles?: {
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
    }[] | undefined;
    connectors?: {
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
    }[] | undefined;
    textBoxes?: {
        id: string;
        tile: {
            x: number;
            y: number;
        };
        content: string;
        fontSize?: number | undefined;
        orientation?: "X" | "Y" | undefined;
    }[] | undefined;
}, {
    id: string;
    name: string;
    items: {
        id: string;
        tile: {
            x: number;
            y: number;
        };
        labelHeight?: number | undefined;
    }[];
    description?: string | undefined;
    lastUpdated?: string | undefined;
    rectangles?: {
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
    }[] | undefined;
    connectors?: {
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
    }[] | undefined;
    textBoxes?: {
        id: string;
        tile: {
            x: number;
            y: number;
        };
        content: string;
        fontSize?: number | undefined;
        orientation?: "X" | "Y" | undefined;
    }[] | undefined;
}>;
export declare const viewsSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    lastUpdated: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    items: z.ZodArray<z.ZodObject<{
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
        labelHeight: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        tile: {
            x: number;
            y: number;
        };
        labelHeight?: number | undefined;
    }, {
        id: string;
        tile: {
            x: number;
            y: number;
        };
        labelHeight?: number | undefined;
    }>, "many">;
    rectangles: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
    }>, "many">>;
    connectors: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
    }>, "many">>;
    textBoxes: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    items: {
        id: string;
        tile: {
            x: number;
            y: number;
        };
        labelHeight?: number | undefined;
    }[];
    description?: string | undefined;
    lastUpdated?: string | undefined;
    rectangles?: {
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
    }[] | undefined;
    connectors?: {
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
    }[] | undefined;
    textBoxes?: {
        id: string;
        tile: {
            x: number;
            y: number;
        };
        content: string;
        fontSize?: number | undefined;
        orientation?: "X" | "Y" | undefined;
    }[] | undefined;
}, {
    id: string;
    name: string;
    items: {
        id: string;
        tile: {
            x: number;
            y: number;
        };
        labelHeight?: number | undefined;
    }[];
    description?: string | undefined;
    lastUpdated?: string | undefined;
    rectangles?: {
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
    }[] | undefined;
    connectors?: {
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
    }[] | undefined;
    textBoxes?: {
        id: string;
        tile: {
            x: number;
            y: number;
        };
        content: string;
        fontSize?: number | undefined;
        orientation?: "X" | "Y" | undefined;
    }[] | undefined;
}>, "many">;
