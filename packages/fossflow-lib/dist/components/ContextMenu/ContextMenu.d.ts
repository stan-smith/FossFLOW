interface MenuItemI {
    label: string;
    onClick: () => void;
}
interface Props {
    onClose: () => void;
    anchorEl?: HTMLElement | null;
    menuItems: MenuItemI[];
}
export declare const ContextMenu: ({ onClose, anchorEl, menuItems }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
