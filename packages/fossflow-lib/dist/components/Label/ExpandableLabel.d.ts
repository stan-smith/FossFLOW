import { Props as LabelProps } from './Label';
type Props = Omit<LabelProps, 'maxHeight'> & {
    onToggleExpand?: (isExpanded: boolean) => void;
};
export declare const ExpandableLabel: ({ children, onToggleExpand, ...rest }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
