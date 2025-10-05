import { Connector, ConnectorLabel } from 'src/types';
import { generateId } from './common';

/**
 * Migrates legacy connector labels (description, startLabel, endLabel)
 * to the new flexible labels array format
 */
export const migrateLegacyLabels = (connector: Connector): ConnectorLabel[] => {
  const labels: ConnectorLabel[] = [];

  // Convert startLabel to 10% position
  if (connector.startLabel) {
    labels.push({
      id: generateId(),
      text: connector.startLabel,
      position: 10,
      height: connector.startLabelHeight,
      line: '1'
    });
  }

  // Convert description (center label) to 50% position
  if (connector.description) {
    labels.push({
      id: generateId(),
      text: connector.description,
      position: 50,
      height: connector.centerLabelHeight,
      line: '1'
    });
  }

  // Convert endLabel to 90% position
  if (connector.endLabel) {
    labels.push({
      id: generateId(),
      text: connector.endLabel,
      position: 90,
      height: connector.endLabelHeight,
      line: '1'
    });
  }

  return labels;
};

/**
 * Gets all labels for a connector, migrating legacy labels if needed
 */
export const getConnectorLabels = (connector: Connector): ConnectorLabel[] => {
  // If connector already has new-style labels, use them
  if (connector.labels && connector.labels.length > 0) {
    return connector.labels;
  }

  // Otherwise, migrate legacy labels
  return migrateLegacyLabels(connector);
};

/**
 * Calculates the actual tile position along the connector path for a given percentage
 */
export const getLabelTileIndex = (
  pathLength: number,
  position: number
): number => {
  if (pathLength === 0) return 0;

  const index = Math.round((position / 100) * (pathLength - 1));
  return Math.max(0, Math.min(index, pathLength - 1));
};
