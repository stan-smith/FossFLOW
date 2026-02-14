import { setWindowCursor } from 'src/utils';
import { ModeActions } from 'src/types';

export const TextBox: ModeActions = {
  entry: () => {
    setWindowCursor('crosshair');
  },
  exit: () => {
    setWindowCursor('default');
  },
  mousemove: ({ uiState, scene }) => {
    if (uiState.mode.type !== 'TEXTBOX' || !uiState.mode.id) return;

    scene.updateTextBox(uiState.mode.id, {
      tile: uiState.mouse.position.tile
    });
  },
  mouseup: ({ uiState, scene, isRendererInteraction }) => {
    if (uiState.mode.type !== 'TEXTBOX' || !uiState.mode.id) return;

    if (!isRendererInteraction) {
      scene.deleteTextBox(uiState.mode.id);
    } else {
      uiState.actions.setItemControls({
        type: 'TEXTBOX',
        id: uiState.mode.id
      });
    }

    uiState.actions.setMode({
      type: 'CURSOR',
      showCursor: true,
      mousedownItem: null
    });
  }
};
