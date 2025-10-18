import { Size, InitialData, MainMenuOptions, Icon, Connector, TextBox, ViewItem, View, Rectangle, Colors } from './types';
export declare const UNPROJECTED_TILE_SIZE = 100;
export declare const TILE_PROJECTION_MULTIPLIERS: Size;
export declare const PROJECTED_TILE_SIZE: {
    width: number;
    height: number;
};
export declare const DEFAULT_COLOR: Colors[0];
export declare const DEFAULT_FONT_FAMILY = "Roboto, Arial, sans-serif";
export declare const VIEW_DEFAULTS: Required<Omit<View, 'id' | 'description' | 'lastUpdated'>>;
export declare const VIEW_ITEM_DEFAULTS: Required<Omit<ViewItem, 'id' | 'tile'>>;
export declare const CONNECTOR_DEFAULTS: Required<Omit<Connector, 'id' | 'color'>>;
export declare const CONNECTOR_SEARCH_OFFSET: {
    x: number;
    y: number;
};
export declare const TEXTBOX_DEFAULTS: Required<Omit<TextBox, 'id' | 'tile'>>;
export declare const TEXTBOX_PADDING = 0.2;
export declare const TEXTBOX_FONT_WEIGHT = "bold";
export declare const RECTANGLE_DEFAULTS: Required<Omit<Rectangle, 'id' | 'from' | 'to' | 'color'>>;
export declare const ZOOM_INCREMENT = 0.2;
export declare const MIN_ZOOM = 0.2;
export declare const MAX_ZOOM = 1;
export declare const TRANSFORM_ANCHOR_SIZE = 30;
export declare const TRANSFORM_CONTROLS_COLOR = "#0392ff";
export declare const INITIAL_DATA: InitialData;
export declare const INITIAL_UI_STATE: {
    zoom: number;
    scroll: {
        position: {
            x: number;
            y: number;
        };
        offset: {
            x: number;
            y: number;
        };
    };
};
export declare const INITIAL_SCENE_STATE: {
    connectors: {};
    textBoxes: {};
};
export declare const MAIN_MENU_OPTIONS: MainMenuOptions;
export declare const DEFAULT_ICON: Icon;
export declare const DEFAULT_LABEL_HEIGHT = 20;
export declare const PROJECT_BOUNDING_BOX_PADDING = 3;
export declare const MARKDOWN_EMPTY_VALUE = "<p><br></p>";
