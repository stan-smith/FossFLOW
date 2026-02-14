import { StoreApi } from 'zustand';
import type { Coords, Rect, Size } from './common';

export const tileOriginOptions = {
  CENTER: 'CENTER',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
} as const;

export type TileOrigin = keyof typeof tileOriginOptions;

export const ItemReferenceTypeOptions = {
  ITEM: 'ITEM',
  CONNECTOR: 'CONNECTOR',
  CONNECTOR_ANCHOR: 'CONNECTOR_ANCHOR',
  TEXTBOX: 'TEXTBOX',
  RECTANGLE: 'RECTANGLE'
} as const;

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

export interface Scene {
  connectors: {
    [key: string]: SceneConnector;
  };
  textBoxes: {
    [key: string]: SceneTextBox;
  };
}

export type SceneStore = Scene & {
  actions: {
    get: StoreApi<SceneStore>['getState'];
    set: StoreApi<SceneStore>['setState'];
  };
};
