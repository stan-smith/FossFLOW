export declare const useTextBox: (id: string) => {
    size: import("../types").Size;
    id: string;
    tile: {
        x: number;
        y: number;
    };
    content: string;
    fontSize: number;
    orientation: "X" | "Y";
} | null;
