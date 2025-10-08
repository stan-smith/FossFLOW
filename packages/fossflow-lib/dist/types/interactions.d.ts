import { ModelStore, UiStateStore, Size } from '../types';
import { useScene } from '../hooks/useScene';
export interface State {
    model: ModelStore;
    scene: ReturnType<typeof useScene>;
    uiState: UiStateStore;
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
