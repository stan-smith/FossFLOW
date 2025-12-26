import { Icon } from '../../../types';
interface Props {
    onIconSelected: (icon: Icon) => void;
    onClose?: () => void;
    currentIconId?: string;
}
export declare const QuickIconSelector: ({ onIconSelected, onClose, currentIconId }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
