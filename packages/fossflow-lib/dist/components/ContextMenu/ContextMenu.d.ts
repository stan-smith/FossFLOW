import { Coords } from '../../types';
interface MenuItemI {
    label: string;
    onClick: () => void;
}
interface Props {
    onClose: () => void;
    position: Coords;
    anchorEl?: HTMLElement;
    menuItems: MenuItemI[];
}
export declare const ContextMenu: ({ onClose, position, anchorEl, menuItems }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
