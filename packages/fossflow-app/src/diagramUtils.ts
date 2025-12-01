// Utility functions for handling diagram data

export interface DiagramData {
  title: string;
  version?: string;
  description?: string;
  icons: any[];
  colors: any[];
  items: any[];
  views: any[];
  fitToScreen?: boolean;
}

export interface DiagramNodeSummary {
  id: string;
  label?: string;
  type?: string;
}

export interface DiagramEdgeSummary {
  id: string;
  sourceId?: string;
  targetId?: string;
  label?: string;
}

export interface DiagramContextPayload {
  diagramId?: string;
  title?: string;
  description?: string;
  nodeCount: number;
  edgeCount: number;
  nodes: DiagramNodeSummary[];
  edges: DiagramEdgeSummary[];
}

// Deep merge two objects, with special handling for arrays
export function mergeDiagramData(base: DiagramData, update: Partial<DiagramData>): DiagramData {
  return {
    title: update.title !== undefined ? update.title : base.title,
    version: update.version !== undefined ? update.version : base.version,
    description: update.description !== undefined ? update.description : base.description,
    // For arrays, completely replace if provided, otherwise keep base
    icons: update.icons !== undefined ? update.icons : base.icons,
    colors: update.colors !== undefined ? update.colors : base.colors,
    items: update.items !== undefined ? update.items : base.items,
    views: update.views !== undefined ? update.views : base.views,
    fitToScreen: update.fitToScreen !== undefined ? update.fitToScreen : base.fitToScreen
  };
}

// Extract only the data that should be saved/exported
export function extractSavableData(fullData: DiagramData): DiagramData {
  return {
    title: fullData.title,
    version: fullData.version,
    description: fullData.description,
    // Only include non-empty arrays
    icons: fullData.icons || [],
    colors: fullData.colors || [],
    items: fullData.items || [],
    views: fullData.views || [],
    fitToScreen: fullData.fitToScreen !== false
  };
}

export function buildDiagramContextPayload(
  diagram: DiagramData,
  diagramId?: string
): DiagramContextPayload {
  // In the FossFLOW model, top-level `items` are nodes/entities, while
  // relationships are represented as connectors inside each view.
  // We treat every top-level item as a node and derive edges from view connectors.

  const nodes: DiagramNodeSummary[] = (diagram.items || []).map(
    (item: any) => {
      return {
        id: String(item.id ?? ''),
        label: item.name ?? item.title ?? String(item.id ?? ''),
        // Try to infer a lightweight "type" from tags / customProperties if present
        type:
          (Array.isArray(item.tags) && item.tags.length > 0
            ? String(item.tags[0])
            : undefined) ??
          (item.customProperties && typeof item.customProperties === 'object'
            ? Object.keys(item.customProperties)[0]
            : undefined)
      };
    }
  );

  // Build a quick lookup of node IDs for validation
  const nodeIdSet = new Set(
    nodes
      .map((node) => {
        return node.id;
      })
      .filter((id) => {
        return id.length > 0;
      })
  );

  // Derive edges from connectors in all views.
  // For now we support simple two-end connectors (first and last anchor).
  const edges: DiagramEdgeSummary[] = [];

  (diagram.views || []).forEach((view: any) => {
    const connectors = (view && Array.isArray(view.connectors)
      ? view.connectors
      : []) as any[];

    connectors.forEach((connector: any) => {
      const anchors = Array.isArray(connector.anchors)
        ? connector.anchors
        : [];

      if (anchors.length < 2) {
        return;
      }

      const firstAnchor = anchors[0];
      const lastAnchor = anchors[anchors.length - 1];

      const sourceIdRaw =
        firstAnchor?.ref?.item ??
        firstAnchor?.ref?.id ??
        firstAnchor?.item ??
        firstAnchor?.id;
      const targetIdRaw =
        lastAnchor?.ref?.item ??
        lastAnchor?.ref?.id ??
        lastAnchor?.item ??
        lastAnchor?.id;

      const sourceId = sourceIdRaw ? String(sourceIdRaw) : undefined;
      const targetId = targetIdRaw ? String(targetIdRaw) : undefined;

      // Skip edges that do not connect two actual nodes
      if (!sourceId || !targetId) {
        return;
      }
      if (!nodeIdSet.has(sourceId) || !nodeIdSet.has(targetId)) {
        return;
      }

      edges.push({
        id: String(connector.id ?? `${sourceId}->${targetId}`),
        sourceId,
        targetId,
        label:
          connector.description ??
          connector.name ??
          connector.title ??
          undefined
      });
    });
  });

  return {
    diagramId,
    title: diagram.title,
    description: diagram.description,
    nodeCount: nodes.length,
    edgeCount: edges.length,
    nodes,
    edges
  };
}

// Validate diagram data structure
export function validateDiagramData(data: any): data is DiagramData {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(data.icons) &&
    Array.isArray(data.colors) &&
    Array.isArray(data.items) &&
    Array.isArray(data.views)
  );
}