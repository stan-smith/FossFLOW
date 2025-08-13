import { Model, Scene } from 'src/types';
import type * as viewReducers from './view';
import type * as viewItemReducers from './viewItem';
import type * as connectorReducers from './connector';
import type * as textBoxReducers from './textBox';
import type * as rectangleReducers from './rectangle';
import type * as layerOrderingReducers from './layerOrdering';

export interface State {
  model: Model;
  scene: Scene;
}

export interface ViewReducerContext {
  viewId: string;
  state: State;
}

type ViewReducerAction =
  | {
      action: 'SYNC_SCENE';
      payload: undefined;
    }
  | {
      action: 'CREATE_VIEW';
      payload: Parameters<typeof viewReducers.createView>[0];
    }
  | {
      action: 'UPDATE_VIEW';
      payload: Parameters<typeof viewReducers.updateView>[0];
    }
  | {
      action: 'DELETE_VIEW';
      payload: undefined;
    }
  | {
      action: 'CREATE_VIEWITEM';
      payload: Parameters<typeof viewItemReducers.createViewItem>[0];
    }
  | {
      action: 'UPDATE_VIEWITEM';
      payload: Parameters<typeof viewItemReducers.updateViewItem>[0];
    }
  | {
      action: 'DELETE_VIEWITEM';
      payload: Parameters<typeof viewItemReducers.deleteViewItem>[0];
    }
  | {
      action: 'CREATE_CONNECTOR';
      payload: Parameters<typeof connectorReducers.createConnector>[0];
    }
  | {
      action: 'UPDATE_CONNECTOR';
      payload: Parameters<typeof connectorReducers.updateConnector>[0];
    }
  | {
      action: 'DELETE_CONNECTOR';
      payload: Parameters<typeof connectorReducers.deleteConnector>[0];
    }
  | {
      action: 'SYNC_CONNECTOR';
      payload: Parameters<typeof connectorReducers.syncConnector>[0];
    }
  | {
      action: 'CREATE_TEXTBOX';
      payload: Parameters<typeof textBoxReducers.createTextBox>[0];
    }
  | {
      action: 'UPDATE_TEXTBOX';
      payload: Parameters<typeof textBoxReducers.updateTextBox>[0];
    }
  | {
      action: 'DELETE_TEXTBOX';
      payload: Parameters<typeof textBoxReducers.deleteTextBox>[0];
    }
  | {
      action: 'CREATE_RECTANGLE';
      payload: Parameters<typeof rectangleReducers.createRectangle>[0];
    }
  | {
      action: 'UPDATE_RECTANGLE';
      payload: Parameters<typeof rectangleReducers.updateRectangle>[0];
    }
  | {
      action: 'DELETE_RECTANGLE';
      payload: Parameters<typeof rectangleReducers.deleteRectangle>[0];
    }
  | {
      action: 'CHANGE_LAYER_ORDER';
      payload: Parameters<typeof layerOrderingReducers.changeLayerOrder>[0];
    };

export type ViewReducerParams = ViewReducerAction & { ctx: ViewReducerContext };
