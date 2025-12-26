import { ModelItem, ViewItem, Connector, TextBox, Rectangle } from '../types';
import type { State } from '../stores/reducers/types';
export declare const useScene: () => {
    items: {
        id: string;
        tile: {
            x: number;
            y: number;
        };
        labelHeight?: number | undefined;
    }[];
    connectors: {
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
    }[];
    colors: {
        value: string;
        id: string;
    }[];
    rectangles: {
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
        customColor: string;
    }[];
    textBoxes: {
        size: import("../types").Size;
        id: string;
        tile: {
            x: number;
            y: number;
        };
        content: string;
        fontSize: number;
        orientation: "X" | "Y";
    }[];
    currentView: {
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
    };
    createModelItem: (newModelItem: ModelItem) => State;
    updateModelItem: (id: string, updates: Partial<ModelItem>) => void;
    deleteModelItem: (id: string) => void;
    createViewItem: (newViewItem: ViewItem, currentState?: State) => State | undefined;
    updateViewItem: (id: string, updates: Partial<ViewItem>, currentState?: State) => State;
    deleteViewItem: (id: string) => void;
    createConnector: (newConnector: Connector) => void;
    updateConnector: (id: string, updates: Partial<Connector>) => void;
    deleteConnector: (id: string) => void;
    createTextBox: (newTextBox: TextBox) => void;
    updateTextBox: (id: string, updates: Partial<TextBox>) => void;
    deleteTextBox: (id: string) => void;
    createRectangle: (newRectangle: Rectangle) => void;
    updateRectangle: (id: string, updates: Partial<Rectangle>) => void;
    deleteRectangle: (id: string) => void;
    transaction: (operations: () => void) => void;
    placeIcon: (params: {
        modelItem: ModelItem;
        viewItem: ViewItem;
    }) => void;
};
