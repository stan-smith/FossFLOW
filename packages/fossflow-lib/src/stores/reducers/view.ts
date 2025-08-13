import { produce } from 'immer';
import { View } from 'src/types';
import { getItemByIdOrThrow } from 'src/utils';
import { VIEW_DEFAULTS, INITIAL_SCENE_STATE } from 'src/config';
import type { ViewReducerContext, State, ViewReducerParams } from './types';
import { syncConnector } from './connector';
import { syncTextBox } from './textBox';
import * as viewItemReducers from './viewItem';
import * as connectorReducers from './connector';
import * as textBoxReducers from './textBox';
import * as rectangleReducers from './rectangle';
import * as layerOrderingReducers from './layerOrdering';

export const updateViewTimestamp = (ctx: ViewReducerContext): State => {
  const now = new Date().toISOString();

  const newState = produce(ctx.state, (draft) => {
    const view = getItemByIdOrThrow(draft.model.views, ctx.viewId);

    view.value.lastUpdated = now;
  });

  return newState;
};

export const syncScene = ({ viewId, state }: ViewReducerContext): State => {
  const view = getItemByIdOrThrow(state.model.views, viewId);

  const startingState: State = {
    model: state.model,
    scene: INITIAL_SCENE_STATE
  };

  const stateAfterConnectorsSynced = [
    ...(view.value.connectors ?? [])
  ].reduce<State>((acc, connector) => {
    return syncConnector(connector.id, { viewId, state: acc });
  }, startingState);

  const stateAfterTextBoxesSynced = [
    ...(view.value.textBoxes ?? [])
  ].reduce<State>((acc, textBox) => {
    return syncTextBox(textBox.id, { viewId, state: acc });
  }, stateAfterConnectorsSynced);

  return stateAfterTextBoxesSynced;
};

export const deleteView = (ctx: ViewReducerContext): State => {
  const newState = produce(ctx.state, (draft) => {
    const view = getItemByIdOrThrow(draft.model.views, ctx.viewId);

    draft.model.views.splice(view.index, 1);
  });

  return newState;
};

export const updateView = (
  updates: Partial<Pick<View, 'name'>>,
  ctx: ViewReducerContext
): State => {
  const newState = produce(ctx.state, (draft) => {
    const view = getItemByIdOrThrow(draft.model.views, ctx.viewId);
    view.value = { ...view.value, ...updates };
  });

  return newState;
};

export const createView = (
  newView: Partial<View>,
  ctx: ViewReducerContext
): State => {
  const newState = produce(ctx.state, (draft) => {
    draft.model.views.push({
      ...VIEW_DEFAULTS,
      id: ctx.viewId,
      ...newView
    });
  });

  return newState;
};

export const view = ({ action, payload, ctx }: ViewReducerParams) => {
  let newState: State;

  switch (action) {
    case 'SYNC_SCENE':
      newState = syncScene(ctx);
      break;
    case 'CREATE_VIEW':
      newState = createView(payload, ctx);
      break;
    case 'UPDATE_VIEW':
      newState = updateView(payload, ctx);
      break;
    case 'DELETE_VIEW':
      newState = deleteView(ctx);
      break;
    case 'CREATE_VIEWITEM':
      newState = viewItemReducers.createViewItem(payload, ctx);
      break;
    case 'UPDATE_VIEWITEM':
      newState = viewItemReducers.updateViewItem(payload, ctx);
      break;
    case 'DELETE_VIEWITEM':
      newState = viewItemReducers.deleteViewItem(payload, ctx);
      break;
    case 'CREATE_CONNECTOR':
      newState = connectorReducers.createConnector(payload, ctx);
      break;
    case 'UPDATE_CONNECTOR':
      newState = connectorReducers.updateConnector(payload, ctx);
      break;
    case 'SYNC_CONNECTOR':
      newState = connectorReducers.syncConnector(payload, ctx);
      break;
    case 'DELETE_CONNECTOR':
      newState = connectorReducers.deleteConnector(payload, ctx);
      break;
    case 'CREATE_TEXTBOX':
      newState = textBoxReducers.createTextBox(payload, ctx);
      break;
    case 'UPDATE_TEXTBOX':
      newState = textBoxReducers.updateTextBox(payload, ctx);
      break;
    case 'DELETE_TEXTBOX':
      newState = textBoxReducers.deleteTextBox(payload, ctx);
      break;
    case 'CREATE_RECTANGLE':
      newState = rectangleReducers.createRectangle(payload, ctx);
      break;
    case 'UPDATE_RECTANGLE':
      newState = rectangleReducers.updateRectangle(payload, ctx);
      break;
    case 'DELETE_RECTANGLE':
      newState = rectangleReducers.deleteRectangle(payload, ctx);
      break;
    case 'CHANGE_LAYER_ORDER':
      newState = layerOrderingReducers.changeLayerOrder(payload, ctx);
      break;
    default:
      throw new Error('Invalid action.');
  }

  switch (action) {
    case 'SYNC_SCENE':
    case 'DELETE_VIEW':
      return newState;
    default:
      return updateViewTimestamp({
        state: newState,
        viewId: ctx.viewId
      });
  }
};
