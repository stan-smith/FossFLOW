import { ModelStore, UiStateStore, Size } from 'src/types';
import { useScene } from 'src/hooks/useScene';
import { useHistory } from 'src/hooks/useHistory';

export interface State {
  model: ModelStore;
  scene: ReturnType<typeof useScene>;
  uiState: UiStateStore;
  history: Pick<
    ReturnType<typeof useHistory>,
    'beginGesture' | 'endGesture' | 'cancelGesture' | 'isGestureInProgress'
  >;
  rendererRef: HTMLElement;
  rendererSize: Size;
  isRendererInteraction: boolean;
}

export type ModeActionsAction = (state: State) => void;

export type ModeActions = {
  entry?: ModeActionsAction;
  exit?: ModeActionsAction;
  mousemove?: ModeActionsAction;
  mousedown?: ModeActionsAction;
  mouseup?: ModeActionsAction;
};
