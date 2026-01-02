import { Coords, Size, ProjectionOrientationEnum } from '../types';
interface Props {
    from: Coords;
    to: Coords;
    originOverride?: Coords;
    orientation?: keyof typeof ProjectionOrientationEnum;
}
export declare const useIsoProjection: ({ from, to, originOverride, orientation }: Props) => {
    css: React.CSSProperties;
    position: Coords;
    gridSize: Size;
    pxSize: Size;
};
export {};
