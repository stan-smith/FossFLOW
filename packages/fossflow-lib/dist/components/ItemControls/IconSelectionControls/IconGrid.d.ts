import { Icon as IconI } from '../../../types';
interface Props {
    icons: IconI[];
    onMouseDown?: (icon: IconI) => void;
    onClick?: (icon: IconI) => void;
    onDoubleClick?: (icon: IconI) => void;
    hoveredIndex?: number;
    onHover?: (index: number) => void;
}
export declare const IconGrid: ({ icons, onMouseDown, onClick, onDoubleClick, hoveredIndex, onHover }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
