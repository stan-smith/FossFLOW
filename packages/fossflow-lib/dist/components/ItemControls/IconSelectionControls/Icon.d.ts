import { Icon as IconI } from '../../../types';
interface Props {
    icon: IconI;
    onClick?: () => void;
    onMouseDown?: () => void;
    onDoubleClick?: () => void;
}
export declare const Icon: ({ icon, onClick, onMouseDown, onDoubleClick }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
