import { Size, Coords } from '../types';
export declare const useDiagramUtils: () => {
    getUnprojectedBounds: () => Size & Coords;
    getVisualBounds: () => Size & Coords;
    fitToView: () => Promise<void>;
    getFitToViewParams: (viewportSize: Size) => {
        zoom: number;
        scroll: Coords;
    };
};
