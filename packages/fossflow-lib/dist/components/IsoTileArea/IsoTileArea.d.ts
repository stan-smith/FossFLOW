import { Coords } from '../../types';
interface Props {
    from: Coords;
    to: Coords;
    origin?: Coords;
    fill?: string;
    cornerRadius?: number;
    stroke?: {
        width: number;
        color: string;
        dashArray?: string;
    };
}
export declare const IsoTileArea: ({ from, to, fill, cornerRadius, stroke }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
