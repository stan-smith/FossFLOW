import { StoreApi } from 'zustand';
import type { Coords, Rect, Size } from './common';
export declare const tileOriginOptions: {
    readonly CENTER: "CENTER";
    readonly TOP: "TOP";
    readonly BOTTOM: "BOTTOM";
    readonly LEFT: "LEFT";
    readonly RIGHT: "RIGHT";
};
export type TileOrigin = keyof typeof tileOriginOptions;
export declare const ItemReferenceTypeOptions: {
    readonly ITEM: "ITEM";
    readonly CONNECTOR: "CONNECTOR";
    readonly CONNECTOR_ANCHOR: "CONNECTOR_ANCHOR";
    readonly TEXTBOX: "TEXTBOX";
    readonly RECTANGLE: "RECTANGLE";
};
export type ItemReferenceType = keyof typeof ItemReferenceTypeOptions;
export type ItemReference = {
    type: ItemReferenceType;
    id: string;
};
export type ConnectorPath = {
    tiles: Coords[];
    rectangle: Rect;
};
export interface SceneConnector {
    path: ConnectorPath;
}
export interface SceneTextBox {
    size: Size;
}
export interface Group {
    id: string;
    name: string;
    itemIds: string[];
}
export interface Scene {
    connectors: {
        [key: string]: SceneConnector;
    };
    textBoxes: {
        [key: string]: SceneTextBox;
    };
    groups: {
        [key: string]: Group;
    };
}
export type SceneStore = Scene & {
    actions: {
        get: StoreApi<SceneStore>['getState'];
        set: StoreApi<SceneStore>['setState'];
    };
};
