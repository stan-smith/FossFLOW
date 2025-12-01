import { Coords, TileOrigin, Connector, Size, Scroll, Mouse, ConnectorAnchor, ItemReference, Rect, ProjectionOrientationEnum, BoundingBox, TextBox, SlimMouseEvent, View, AnchorPosition, PerspectiveMode } from '../types';
import { useScene } from '../hooks/useScene';
interface ScreenToIso {
    mouse: Coords;
    zoom: number;
    scroll: Scroll;
    rendererSize: Size;
    perspectiveMode?: PerspectiveMode;
}
export declare const screenToIso: ({ mouse, zoom, scroll, rendererSize, perspectiveMode }: ScreenToIso) => {
    x: number;
    y: number;
};
interface GetTilePosition {
    tile: Coords;
    origin?: TileOrigin;
    perspectiveMode?: PerspectiveMode;
}
export declare const getTilePosition: ({ tile, origin, perspectiveMode }: GetTilePosition) => Coords;
type IsoToScreen = GetTilePosition & {
    rendererSize: Size;
};
export declare const isoToScreen: ({ tile, origin, rendererSize, perspectiveMode }: IsoToScreen) => {
    x: number;
    y: number;
};
export declare const sortByPosition: (tiles: Coords[]) => {
    byX: Coords[];
    byY: Coords[];
    highest: {
        byX: Coords;
        byY: Coords;
    };
    lowest: {
        byX: Coords;
        byY: Coords;
    };
    lowX: number;
    lowY: number;
    highX: number;
    highY: number;
};
export declare const getGridSubset: (tiles: Coords[]) => {
    x: number;
    y: number;
}[];
export declare const isWithinBounds: (tile: Coords, bounds: Coords[]) => boolean;
export declare const getBoundingBox: (tiles: Coords[], offset?: Coords) => BoundingBox;
export declare const getBoundingBoxSize: (boundingBox: Coords[]) => Size;
export declare const getIsoMatrix: (orientation?: keyof typeof ProjectionOrientationEnum) => number[];
export declare const getIsoProjectionCss: (orientation?: keyof typeof ProjectionOrientationEnum) => string;
export declare const getProjectionCss: (perspectiveMode: PerspectiveMode, orientation?: keyof typeof ProjectionOrientationEnum) => string;
export declare const getTranslateCSS: (translate?: Coords) => string;
export declare const incrementZoom: (zoom: number) => number;
export declare const decrementZoom: (zoom: number) => number;
interface GetMouse {
    interactiveElement: HTMLElement;
    zoom: number;
    scroll: Scroll;
    lastMouse: Mouse;
    mouseEvent: SlimMouseEvent;
    rendererSize: Size;
    perspectiveMode?: PerspectiveMode;
}
export declare const getMouse: ({ interactiveElement, zoom, scroll, lastMouse, mouseEvent, rendererSize, perspectiveMode }: GetMouse) => Mouse;
export declare const getAllAnchors: (connectors: Connector[]) => {
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
export declare const getAnchorTile: (anchor: ConnectorAnchor, view: View) => Coords;
interface NormalisePositionFromOrigin {
    position: Coords;
    origin: Coords;
}
export declare const normalisePositionFromOrigin: ({ position, origin }: NormalisePositionFromOrigin) => Coords;
interface GetConnectorPath {
    anchors: ConnectorAnchor[];
    view: View;
}
export declare const getConnectorPath: ({ anchors, view }: GetConnectorPath) => {
    tiles: Coords[];
    rectangle: Rect;
};
type GetRectangleFromSize = (from: Coords, size: Size) => {
    from: Coords;
    to: Coords;
};
export declare const getRectangleFromSize: GetRectangleFromSize;
export declare const hasMovedTile: (mouse: Mouse) => boolean;
export declare const connectorPathTileToGlobal: (tile: Coords, origin: Coords) => Coords;
export declare const getTextBoxEndTile: (textBox: TextBox, size: Size) => Coords;
interface GetItemAtTile {
    tile: Coords;
    scene: ReturnType<typeof useScene>;
}
export declare const getItemAtTile: ({ tile, scene }: GetItemAtTile) => ItemReference | null;
interface FontProps {
    fontWeight: number | string;
    fontSize: number;
    fontFamily: string;
}
export declare const getTextWidth: (text: string, fontProps: FontProps) => number;
export declare const getTextBoxDimensions: (textBox: TextBox) => Size;
export declare const outermostCornerPositions: TileOrigin[];
export declare const convertBoundsToNamedAnchors: (boundingBox: BoundingBox) => { [key in AnchorPosition]: Coords; };
export declare const getAnchorAtTile: (tile: Coords, anchors: ConnectorAnchor[]) => {
    id: string;
    ref: {
        item?: string | undefined;
        anchor?: string | undefined;
        tile?: {
            x: number;
            y: number;
        } | undefined;
    };
} | undefined;
export declare const getAnchorParent: (anchorId: string, connectors: Connector[]) => {
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
};
export declare const getTileScrollPosition: (tile: Coords, origin?: TileOrigin) => Coords;
export declare const getConnectorsByViewItem: (viewItemId: string, connectors: Connector[]) => {
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
}[];
export declare const getConnectorDirectionIcon: (connectorTiles: Coords[]) => {
    x: number;
    y: number;
    rotation: number | undefined;
} | null;
export declare const getProjectBounds: (view: View, padding?: number) => Coords[];
export declare const getVisualBounds: (view: View, padding?: number) => {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare const getUnprojectedBounds: (view: View) => {
    width: number;
    height: number;
    x: number;
    y: number;
};
export declare const getFitToViewParams: (view: View, viewportSize: Size) => {
    zoom: number;
    scroll: Coords;
};
export {};
