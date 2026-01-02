export declare const useConnector: (id: string) => {
    path: import("../types").ConnectorPath;
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
    description: string;
    color?: string | undefined;
    customColor: string;
    startLabel: string;
    endLabel: string;
    startLabelHeight: number;
    centerLabelHeight: number;
    endLabelHeight: number;
    labels: {
        id: string;
        text: string;
        position: number;
        height?: number | undefined;
        line?: "1" | "2" | undefined;
        showLine?: boolean | undefined;
    }[];
    width: number;
    style: "SOLID" | "DOTTED" | "DASHED";
    lineType: "SINGLE" | "DOUBLE" | "DOUBLE_WITH_CIRCLE";
    showArrow: boolean;
} | null;
