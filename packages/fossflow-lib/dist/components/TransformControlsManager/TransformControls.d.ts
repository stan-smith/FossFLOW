import { Coords, AnchorPosition } from '../../types';
interface Props {
    from: Coords;
    to: Coords;
    onAnchorMouseDown?: (anchorPosition: AnchorPosition) => void;
}
export declare const TransformControls: ({ from, to, onAnchorMouseDown }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
