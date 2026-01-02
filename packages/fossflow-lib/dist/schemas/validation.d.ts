import type { Model, ModelItem, Connector, ConnectorAnchor, View, Rectangle } from '../types';
type IssueType = {
    type: 'INVALID_ANCHOR_TO_VIEW_ITEM_REF';
    params: {
        anchor: string;
        viewItem: string;
        view: string;
        connector: string;
    };
} | {
    type: 'INVALID_CONNECTOR_COLOR_REF';
    params: {
        connector: string;
        view: string;
        color: string;
    };
} | {
    type: 'INVALID_RECTANGLE_COLOR_REF';
    params: {
        rectangle: string;
        view: string;
        color: string;
    };
} | {
    type: 'INVALID_ANCHOR_TO_ANCHOR_REF';
    params: {
        srcAnchor: string;
        destAnchor: string;
        view: string;
        connector: string;
    };
} | {
    type: 'INVALID_VIEW_ITEM_TO_MODEL_ITEM_REF';
    params: {
        view: string;
        modelItem: string;
    };
} | {
    type: 'INVALID_ANCHOR_REF';
    params: {
        anchor: string;
        view: string;
        connector: string;
    };
} | {
    type: 'INVALID_MODEL_TO_ICON_REF';
    params: {
        modelItem: string;
        icon: string;
    };
} | {
    type: 'CONNECTOR_TOO_FEW_ANCHORS';
    params: {
        connector: string;
        view: string;
    };
};
type Issue = IssueType & {
    message: string;
};
export declare const validateConnectorAnchor: (anchor: ConnectorAnchor, ctx: {
    view: View;
    connector: Connector;
    allAnchors: ConnectorAnchor[];
}) => Issue[];
export declare const validateConnector: (connector: Connector, ctx: {
    view: View;
    model: Model;
    allAnchors: ConnectorAnchor[];
}) => Issue[];
export declare const validateRectangle: (rectangle: Rectangle, ctx: {
    view: View;
    model: Model;
}) => Issue[];
export declare const validateView: (view: View, ctx: {
    model: Model;
}) => Issue[];
export declare const validateModelItem: (modelItem: ModelItem, ctx: {
    model: Model;
}) => Issue[];
export declare const validateModel: (model: Model) => Issue[];
export {};
