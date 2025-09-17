import { Coords, EditorModeEnum, MainMenuOptions } from './common';
import { Icon } from './model';
import { ItemReference } from './scene';
import { HotkeyProfile } from 'src/config/hotkeys';
import { PanSettings } from 'src/config/panSettings';

interface AddItemControls {
  type: 'ADD_ITEM';
}

export type ItemControls = ItemReference | AddItemControls;

export interface Mouse {
  position: {
    screen: Coords;
    tile: Coords;
  };
  mousedown: {
    screen: Coords;
    tile: Coords;
  } | null;
  delta: {
    screen: Coords;
    tile: Coords;
  } | null;
}

// Mode types
export interface InteractionsDisabled {
  type: 'INTERACTIONS_DISABLED';
  showCursor: boolean;
}

export interface CursorMode {
  type: 'CURSOR';
  showCursor: boolean;
  mousedownItem: ItemReference | null;
}

export interface DragItemsMode {
  type: 'DRAG_ITEMS';
  showCursor: boolean;
  items: ItemReference[];
  isInitialMovement: Boolean;
}

export interface PanMode {
  type: 'PAN';
  showCursor: boolean;
}

export interface PlaceIconMode {
  type: 'PLACE_ICON';
  showCursor: boolean;
  id: string | null;
}

export interface ConnectorMode {
  type: 'CONNECTOR';
  showCursor: boolean;
  id: string | null;
  // For click-based connection mode
  startAnchor?: {
    tile?: Coords;
    itemId?: string;
  };
  isConnecting?: boolean;
}

export interface DrawRectangleMode {
  type: 'RECTANGLE.DRAW';
  showCursor: boolean;
  id: string | null;
}

export const AnchorPositionOptions = {
  BOTTOM_LEFT: 'BOTTOM_LEFT',
  BOTTOM_RIGHT: 'BOTTOM_RIGHT',
  TOP_RIGHT: 'TOP_RIGHT',
  TOP_LEFT: 'TOP_LEFT'
} as const;

export type AnchorPosition = keyof typeof AnchorPositionOptions;

export interface TransformRectangleMode {
  type: 'RECTANGLE.TRANSFORM';
  showCursor: boolean;
  id: string;
  selectedAnchor: AnchorPosition | null;
}

export interface TextBoxMode {
  type: 'TEXTBOX';
  showCursor: boolean;
  id: string | null;
}

export type Mode =
  | InteractionsDisabled
  | CursorMode
  | PanMode
  | PlaceIconMode
  | ConnectorMode
  | DrawRectangleMode
  | TransformRectangleMode
  | DragItemsMode
  | TextBoxMode;
// End mode types

export interface Scroll {
  position: Coords;
  offset: Coords;
}

export interface IconCollectionState {
  id?: string;
  isExpanded: boolean;
}

export type IconCollectionStateWithIcons = IconCollectionState & {
  icons: Icon[];
};

export const DialogTypeEnum = {
  EXPORT_IMAGE: 'EXPORT_IMAGE',
  HELP: 'HELP',
  SETTINGS: 'SETTINGS'
} as const;

export interface ContextMenu {
  type: 'ITEM' | 'EMPTY';
  item?: ItemReference;
  tile: Coords;
}


export type ConnectorInteractionMode = 'click' | 'drag';

export interface UiState {
  view: string;
  mainMenuOptions: MainMenuOptions;
  editorMode: keyof typeof EditorModeEnum;
  iconCategoriesState: IconCollectionState[];
  mode: Mode;
  dialog: keyof typeof DialogTypeEnum | null;
  isMainMenuOpen: boolean;
  itemControls: ItemControls | null;
  contextMenu: ContextMenu | null;
  zoom: number;
  scroll: Scroll;
  mouse: Mouse;
  rendererEl: HTMLDivElement | null;
  enableDebugTools: boolean;
  hotkeyProfile: HotkeyProfile;
  panSettings: PanSettings;
  connectorInteractionMode: ConnectorInteractionMode;

}

export interface UiStateActions {
  setView: (view: string) => void;
  setMainMenuOptions: (options: MainMenuOptions) => void;
  setEditorMode: (mode: keyof typeof EditorModeEnum) => void;
  setIconCategoriesState: (iconCategoriesState: IconCollectionState[]) => void;
  resetUiState: () => void;
  setMode: (mode: Mode) => void;
  incrementZoom: () => void;
  decrementZoom: () => void;
  setIsMainMenuOpen: (isOpen: boolean) => void;
  setDialog: (dialog: keyof typeof DialogTypeEnum | null) => void;
  setZoom: (zoom: number) => void;
  setScroll: (scroll: Scroll) => void;
  setItemControls: (itemControls: ItemControls | null) => void;
  setContextMenu: (contextMenu: ContextMenu | null) => void;
  setMouse: (mouse: Mouse) => void;
  setRendererEl: (el: HTMLDivElement) => void;
  setEnableDebugTools: (enabled: boolean) => void;
  setHotkeyProfile: (profile: HotkeyProfile) => void;
  setPanSettings: (settings: PanSettings) => void;
  setConnectorInteractionMode: (mode: ConnectorInteractionMode) => void;

}

export type UiStateStore = UiState & {
  actions: UiStateActions;
};
