import { ModelItem, ViewItem } from '../../../../types';
export type NodeUpdates = {
    model: Partial<ModelItem>;
    view: Partial<ViewItem>;
};
interface Props {
    node: ViewItem;
    onModelItemUpdated: (updates: Partial<ModelItem>) => void;
    onViewItemUpdated: (updates: Partial<ViewItem>) => void;
    onDeleted: () => void;
}
export declare const NodeSettings: ({ node, onModelItemUpdated, onViewItemUpdated, onDeleted }: Props) => import("react/jsx-runtime").JSX.Element | null;
export {};
