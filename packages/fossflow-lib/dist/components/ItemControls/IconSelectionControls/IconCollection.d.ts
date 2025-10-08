import { Icon as IconI } from '../../../types';
interface Props {
    id?: string;
    icons: IconI[];
    onClick?: (icon: IconI) => void;
    onMouseDown?: (icon: IconI) => void;
    isExpanded: boolean;
}
export declare const IconCollection: ({ id, icons, onClick, onMouseDown, isExpanded: _isExpanded }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
