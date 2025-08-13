import { produce } from 'immer';
import { ItemReference, LayerOrderingAction, View } from 'src/types';
import { getItemByIdOrThrow } from 'src/utils';
import { State, ViewReducerContext } from './types';

export const changeLayerOrder = (
  { action, item }: { action: LayerOrderingAction; item: ItemReference },
  { viewId, state }: ViewReducerContext
): State => {
  const newState = produce(state, (draft) => {
    const view = getItemByIdOrThrow(draft.model.views, viewId);
    let arr: View['rectangles'];

    switch (item.type) {
      case 'RECTANGLE':
        arr = view.value.rectangles ?? [];
        break;
      default:
        throw new Error('Invalid item type');
    }

    const target = getItemByIdOrThrow(arr, item.id);

    if (action === 'SEND_BACKWARD' && target.index < arr.length - 1) {
      arr.splice(target.index, 1);
      arr.splice(target.index + 1, 0, target.value);
    } else if (action === 'SEND_TO_BACK' && target.index !== arr.length - 1) {
      arr.splice(target.index, 1);
      arr.splice(arr.length, 0, target.value);
    } else if (action === 'BRING_FORWARD' && target.index > 0) {
      arr.splice(target.index, 1);
      arr.splice(target.index - 1, 0, target.value);
    } else if (action === 'BRING_TO_FRONT' && target.index !== 0) {
      arr.splice(target.index, 1);
      arr.splice(0, 0, target.value);
    }
  });

  return newState;
};
