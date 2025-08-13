import { produce } from 'immer';
import { Rectangle } from 'src/types';
import { getItemByIdOrThrow } from 'src/utils';
import { State, ViewReducerContext } from './types';

export const updateRectangle = (
  { id, ...updates }: { id: string } & Partial<Rectangle>,
  { viewId, state }: ViewReducerContext
): State => {
  const view = getItemByIdOrThrow(state.model.views, viewId);

  const newState = produce(state, (draft) => {
    const { rectangles } = draft.model.views[view.index];

    if (!rectangles) return;

    const rectangle = getItemByIdOrThrow(rectangles, id);
    const newRectangle = { ...rectangle.value, ...updates };
    rectangles[rectangle.index] = newRectangle;
  });

  return newState;
};

export const createRectangle = (
  newRectangle: Rectangle,
  { viewId, state }: ViewReducerContext
): State => {
  const view = getItemByIdOrThrow(state.model.views, viewId);

  const newState = produce(state, (draft) => {
    const { rectangles } = draft.model.views[view.index];

    if (!rectangles) {
      draft.model.views[view.index].rectangles = [newRectangle];
    } else {
      draft.model.views[view.index].rectangles?.unshift(newRectangle);
    }
  });

  return updateRectangle(newRectangle, {
    viewId,
    state: newState
  });
};

export const deleteRectangle = (
  id: string,
  { viewId, state }: ViewReducerContext
): State => {
  const view = getItemByIdOrThrow(state.model.views, viewId);
  const rectangle = getItemByIdOrThrow(view.value.rectangles ?? [], id);

  const newState = produce(state, (draft) => {
    draft.model.views[view.index].rectangles?.splice(rectangle.index, 1);
  });

  return newState;
};
