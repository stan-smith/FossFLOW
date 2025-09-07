import { Connector } from 'src/types';
import { produce } from 'immer';
import { getItemByIdOrThrow, getConnectorPath } from 'src/utils';
import { State, ViewReducerContext } from './types';

export const deleteConnector = (
  id: string,
  { viewId, state }: ViewReducerContext
): State => {
  const view = getItemByIdOrThrow(state.model.views, viewId);
  const connector = getItemByIdOrThrow(view.value.connectors ?? [], id);

  const newState = produce(state, (draft) => {
    draft.model.views[view.index].connectors?.splice(connector.index, 1);
    delete draft.scene.connectors[id];
  });

  return newState;
};

export const syncConnector = (
  id: string,
  { viewId, state }: ViewReducerContext
) => {
  const newState = produce(state, (draft) => {
    const view = getItemByIdOrThrow(draft.model.views, viewId);
    const connector = getItemByIdOrThrow(view.value.connectors ?? [], id);
    
    // Skip validation - allow all connectors regardless of position
    try {
      const path = getConnectorPath({
        anchors: connector.value.anchors,
        view: view.value
      });

      draft.scene.connectors[connector.value.id] = { path };
    } catch (error) {
      // Even if we can't get the path, keep the connector with an empty path
      draft.scene.connectors[connector.value.id] = { 
        path: { 
          tiles: [], 
          rectangle: { 
            from: { x: 0, y: 0 }, 
            to: { x: 0, y: 0 } 
          } 
        } 
      };
    }
  });

  return newState;
};

export const updateConnector = (
  { id, ...updates }: { id: string } & Partial<Connector>,
  { state, viewId }: ViewReducerContext
): State => {
  const newState = produce(state, (draft) => {
    const view = getItemByIdOrThrow(draft.model.views, viewId);
    const { connectors } = draft.model.views[view.index];

    if (!connectors) return;

    const connector = getItemByIdOrThrow(connectors, id);
    const newConnector = { ...connector.value, ...updates };
    connectors[connector.index] = newConnector;

    if (updates.anchors) {
      const stateAfterSync = syncConnector(newConnector.id, {
        viewId,
        state: draft
      });

      draft.model = stateAfterSync.model;
      draft.scene = stateAfterSync.scene;
    }
  });

  return newState;
};

export const createConnector = (
  newConnector: Connector,
  { state, viewId }: ViewReducerContext
): State => {
  const newState = produce(state, (draft) => {
    const view = getItemByIdOrThrow(draft.model.views, viewId);
    const { connectors } = draft.model.views[view.index];

    if (!connectors) {
      draft.model.views[view.index].connectors = [newConnector];
    } else {
      draft.model.views[view.index].connectors?.unshift(newConnector);
    }

    const stateAfterSync = syncConnector(newConnector.id, {
      viewId,
      state: draft
    });

    draft.model = stateAfterSync.model;
    draft.scene = stateAfterSync.scene;
  });

  return newState;
};
