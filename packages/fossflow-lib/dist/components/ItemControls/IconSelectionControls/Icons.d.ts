import { IconCollectionStateWithIcons, Icon } from '../../../types';
interface Props {
    iconCategories: IconCollectionStateWithIcons[];
    onClick?: (icon: Icon) => void;
    onMouseDown?: (icon: Icon) => void;
}
export declare const Icons: ({ iconCategories, onClick, onMouseDown }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
