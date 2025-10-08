import { SlimMouseEvent } from '../types';
export declare const usePanHandlers: () => {
    handleMouseDown: (e: SlimMouseEvent) => boolean;
    handleMouseUp: (e: SlimMouseEvent) => boolean;
    isPanning: boolean;
};
