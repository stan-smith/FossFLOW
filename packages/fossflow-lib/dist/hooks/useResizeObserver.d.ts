import { Size } from '../types';
export declare const useResizeObserver: (el?: HTMLElement | null) => {
    size: Size;
    disconnect: () => void;
    observe: (element: HTMLElement) => void;
};
