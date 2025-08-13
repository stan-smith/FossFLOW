import { produce } from 'immer';
import { ViewItem } from 'src/types';
import { getItemByIdOrThrow, getConnectorsByViewItem } from 'src/utils';
import { validateView } from 'src/schemas/validation';
import { State, ViewReducerContext } from './types';
import * as reducers from './view';

export const updateViewItem = (
  { id, ...updates }: { id: string } & Partial<ViewItem>,
  { viewId, state }: ViewReducerContext
): State => {
  const newState = produce(state, (draft) => {
    const view = getItemByIdOrThrow(draft.model.views, viewId);
    const { items } = view.value;

    if (!items) return;

    const viewItem = getItemByIdOrThrow(items, id);
    const newItem = { ...viewItem.value, ...updates };
    items[viewItem.index] = newItem;

    if (updates.tile) {
      const connectorsToUpdate = getConnectorsByViewItem(
        viewItem.value.id,
        view.value.connectors ?? []
      );

      const updatedConnectors = connectorsToUpdate.reduce((acc, connector) => {
        return reducers.view({
          action: 'UPDATE_CONNECTOR',
          payload: connector,
          ctx: { viewId, state: acc }
        });
      }, draft);

      draft.model.views[view.index].connectors =
        updatedConnectors.model.views[view.index].connectors;

      draft.scene.connectors = updatedConnectors.scene.connectors;
    }
  });

  const newView = getItemByIdOrThrow(newState.model.views, viewId);
  const issues = validateView(newView.value, { model: newState.model });

  if (issues.length > 0) {
    throw new Error(issues[0].message);
  }

  return newState;
};

export const createViewItem = (
  newViewItem: ViewItem,
  ctx: ViewReducerContext
): State => {
  const { state, viewId } = ctx;
  const view = getItemByIdOrThrow(state.model.views, viewId);

  const newState = produce(state, (draft) => {
    const { items } = draft.model.views[view.index];
    items.unshift(newViewItem);
  });

  return updateViewItem(newViewItem, { viewId, state: newState });
};

export const deleteViewItem = (
  id: string,
  { state, viewId }: ViewReducerContext
): State => {
  const newState = produce(state, (draft) => {
    const view = getItemByIdOrThrow(draft.model.views, viewId);
    const viewItem = getItemByIdOrThrow(view.value.items, id);

    draft.model.views[view.index].items.splice(viewItem.index, 1);

    const connectorsToUpdate = getConnectorsByViewItem(
      viewItem.value.id,
      view.value.connectors ?? []
    );

    const updatedConnectors = connectorsToUpdate.reduce((acc, connector) => {
      return reducers.view({
        action: 'SYNC_CONNECTOR',
        payload: connector.id,
        ctx: { viewId, state: acc }
      });
    }, draft);

    draft.model.views[view.index].connectors =
      updatedConnectors.model.views[view.index].connectors;

    draft.scene.connectors = updatedConnectors.scene.connectors;
  });

  return newState;
};
