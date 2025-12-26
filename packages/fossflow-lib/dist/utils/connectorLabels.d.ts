import { Connector, ConnectorLabel } from '../types';
/**
 * Migrates legacy connector labels (description, startLabel, endLabel)
 * to the new flexible labels array format
 */
export declare const migrateLegacyLabels: (connector: Connector) => ConnectorLabel[];
/**
 * Gets all labels for a connector, migrating legacy labels if needed
 */
export declare const getConnectorLabels: (connector: Connector) => ConnectorLabel[];
/**
 * Calculates the actual tile position along the connector path for a given percentage
 */
export declare const getLabelTileIndex: (pathLength: number, position: number) => number;
