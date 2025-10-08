export interface Coords {
    x: number;
    y: number;
}
export interface Size {
    width: number;
    height: number;
}
export interface Rect {
    from: Coords;
    to: Coords;
}
export declare const ProjectionOrientationEnum: {
    readonly X: "X";
    readonly Y: "Y";
};
export type BoundingBox = [Coords, Coords, Coords, Coords];
export type SlimMouseEvent = Pick<MouseEvent, 'clientX' | 'clientY' | 'target' | 'type' | 'preventDefault' | 'button' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>;
export declare const EditorModeEnum: {
    readonly NON_INTERACTIVE: "NON_INTERACTIVE";
    readonly EXPLORABLE_READONLY: "EXPLORABLE_READONLY";
    readonly EDITABLE: "EDITABLE";
};
export declare const MainMenuOptionsEnum: {
    readonly 'ACTION.OPEN': "ACTION.OPEN";
    readonly 'EXPORT.JSON': "EXPORT.JSON";
    readonly 'EXPORT.PNG': "EXPORT.PNG";
    readonly 'ACTION.CLEAR_CANVAS': "ACTION.CLEAR_CANVAS";
    readonly 'LINK.GITHUB': "LINK.GITHUB";
    readonly 'LINK.DISCORD': "LINK.DISCORD";
    readonly VERSION: "VERSION";
};
export type MainMenuOptions = (keyof typeof MainMenuOptionsEnum)[];
