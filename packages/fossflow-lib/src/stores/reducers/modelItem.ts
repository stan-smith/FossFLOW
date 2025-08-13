import { produce } from 'immer';
import { ModelItem } from 'src/types';
import { getItemByIdOrThrow } from 'src/utils';
import { State } from './types';

export const updateModelItem = (
  id: string,
  updates: Partial<ModelItem>,
  state: State
): State => {
  const modelItem = getItemByIdOrThrow(state.model.items, id);

  const newState = produce(state, (draft) => {
    draft.model.items[modelItem.index] = { ...modelItem.value, ...updates };
  });

  return newState;
};

export const createModelItem = (
  newModelItem: ModelItem,
  state: State
): State => {
  const newState = produce(state, (draft) => {
    draft.model.items.push(newModelItem);
  });

  return updateModelItem(newModelItem.id, newModelItem, newState);
};

export const deleteModelItem = (id: string, state: State): State => {
  const modelItem = getItemByIdOrThrow(state.model.items, id);

  const newState = produce(state, (draft) => {
    delete draft.model.items[modelItem.index];
  });

  return newState;
};
