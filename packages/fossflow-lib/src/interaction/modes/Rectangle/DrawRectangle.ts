import { ModeActions } from 'src/types';
import { produce } from 'immer';
import { generateId, hasMovedTile, setWindowCursor } from 'src/utils';

export const DrawRectangle: ModeActions = {
  entry: () => {
    setWindowCursor('crosshair');
  },
  exit: () => {
    setWindowCursor('default');
  },
  mousemove: ({ uiState, scene }) => {
    if (
      uiState.mode.type !== 'RECTANGLE.DRAW' ||
      !hasMovedTile(uiState.mouse) ||
      !uiState.mode.id ||
      !uiState.mouse.mousedown
    )
      return;

    scene.updateRectangle(uiState.mode.id, {
      to: uiState.mouse.position.tile
    });
  },
  mousedown: ({ uiState, scene, isRendererInteraction }) => {
    if (uiState.mode.type !== 'RECTANGLE.DRAW' || !isRendererInteraction)
      return;

    const newRectangleId = generateId();

    scene.createRectangle({
      id: newRectangleId,
      color: scene.colors[0].id,
      from: uiState.mouse.position.tile,
      to: uiState.mouse.position.tile
    });

    const newMode = produce(uiState.mode, (draft) => {
      draft.id = newRectangleId;
    });

    uiState.actions.setMode(newMode);
  },
  mouseup: ({ uiState }) => {
    if (uiState.mode.type !== 'RECTANGLE.DRAW' || !uiState.mode.id) return;

    uiState.actions.setMode({
      type: 'CURSOR',
      showCursor: true,
      mousedownItem: null
    });
  }
};
