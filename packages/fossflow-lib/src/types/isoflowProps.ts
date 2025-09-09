import type { EditorModeEnum, MainMenuOptions } from './common';
import type { Model } from './model';
import type { RendererProps } from './rendererProps';

export type InitialData = Model & {
  fitToView?: boolean;
  view?: string;
};

export interface LocaleProps {
  common: {
    exampleText: string;
  };
  mainMenu: {
    undo: string;
    redo: string;
    open: string;
    exportJson: string;
    exportCompactJson: string;
    exportImage: string;
    clearCanvas: string;
    settings: string;
    gitHub: string;
  };
  // other namespaces can be added here
}

export interface IsoflowProps {
  initialData?: InitialData;
  mainMenuOptions?: MainMenuOptions;
  onModelUpdated?: (Model: Model) => void;
  width?: number | string;
  height?: number | string;
  enableDebugTools?: boolean;
  editorMode?: keyof typeof EditorModeEnum;
  renderer?: RendererProps;
  locale?: LocaleProps;
}
