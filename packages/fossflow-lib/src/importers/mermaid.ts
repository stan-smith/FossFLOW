import { InitialData, ViewItem, Connector, ModelItem } from '../types';
import { generateId } from '../utils';
import { DEFAULT_ICON, INITIAL_DATA, VIEW_DEFAULTS, DEFAULT_COLOR } from '../config';

export type MermaidDirection = 'TD' | 'LR' | 'TB' | 'BT' | 'RL';

interface MermaidNode {
  id: string;
  label: string;
}

interface MermaidEdge {
  from: string;
  to: string;
  label?: string;
}

export const parseMermaid = (text: string) => {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const nodes: Map<string, MermaidNode> = new Map();
  const edges: MermaidEdge[] = [];
  let direction: MermaidDirection = 'TD';

  for (const line of lines) {
    // Header check
    const graphMatch = line.match(/^(?:graph|flowchart)\s+(TD|LR|TB|BT|RL)/i);
    if (graphMatch) {
      direction = graphMatch[1].toUpperCase() as MermaidDirection;
      if (direction === 'TB') direction = 'TD';
      continue;
    }

    // Node definition regex: captures ID and labels in various bracket types
    const nodeDefRegex = /(\w+)(?:\[(.*?)\]|\((.*?)\)|\{(.*?)\}|\(\((.*?)\)\)|\{\{(.*?)\}\})/g;
    let match;
    while ((match = nodeDefRegex.exec(line)) !== null) {
      const id = match[1];
      const label = match[2] || match[3] || match[4] || match[5] || match[6] || id;
      nodes.set(id, { id, label });
    }

    // Edge regex: captures from, arrow, label, and to
    // Supports many arrow types like -->, -.->, ==>, --o, etc.
    // Group 1: from, Group 2: arrow type, Group 3: label, Group 4: to
    const edgeRegex = /(\w+)(?:\[.*?\]|\(.*?\)|{.*?}|\(\(.*?\)\)|\{\{.*?\}\})?\s*([-.=>]+>?)\s*(?:\|(.*?)\|)?\s*(\w+)(?:\[.*?\]|\(.*?\)|{.*?}|\(\(.*?\)\)|\{\{.*?\}\})?/g;
    let edgeMatch;
    while ((edgeMatch = edgeRegex.exec(line)) !== null) {
      const from = edgeMatch[1];
      // const arrow = edgeMatch[2];
      const label = edgeMatch[3]; 
      const to = edgeMatch[4];
      edges.push({ from, to, label });
      
      if (!nodes.has(from)) nodes.set(from, { id: from, label: from });
      if (!nodes.has(to)) nodes.set(to, { id: to, label: to });
    }
  }

  return { nodes: Array.from(nodes.values()), edges, direction };
};

export const importMermaid = (text: string): InitialData => {
  console.log('[MermaidImport] Starting import...');
  const { nodes, edges, direction } = parseMermaid(text);
  
  console.log(`[MermaidImport] Parsed ${nodes.length} nodes and ${edges.length} edges.`);
  console.log('[MermaidImport] Nodes:', nodes);
  console.log('[MermaidImport] Edges:', edges);

  const modelItems: ModelItem[] = nodes.map((node) => ({
    id: node.id,
    name: node.label,
    icon: 'default'
  }));

  const adj = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  nodes.forEach(n => {
    adj.set(n.id, []);
    inDegree.set(n.id, 0);
  });
  edges.forEach(e => {
    adj.get(e.from)?.push(e.to);
    inDegree.set(e.to, (inDegree.get(e.to) || 0) + 1);
  });

  const layers: Map<string, number> = new Map();
  const queue: [string, number][] = Array.from(inDegree.entries())
    .filter(([, degree]) => degree === 0)
    .map(([id]) => [id, 0]);

  if (queue.length === 0 && nodes.length > 0) {
    queue.push([nodes[0].id, 0]);
  }

  while (queue.length > 0) {
    const [curr, layer] = queue.shift()!;
    if (layers.has(curr) && layers.get(curr)! >= layer) continue;
    layers.set(curr, layer);
    
    adj.get(curr)?.forEach(next => {
      queue.push([next, layer + 1]);
    });
    
    if (layers.size > nodes.length * 5) break; 
  }

  const layerCounts: Map<number, number> = new Map();
  const viewItems: ViewItem[] = nodes.map((node) => {
    const layer = layers.get(node.id) || 0;
    const indexInLayer = layerCounts.get(layer) || 0;
    layerCounts.set(layer, indexInLayer + 1);

    const x = direction === 'TD' ? indexInLayer * 3 : layer * 3;
    const y = direction === 'TD' ? layer * 3 : indexInLayer * 3;

    return {
      id: node.id,
      tile: { x, y }
    };
  });

  const connectors: Connector[] = edges.map((edge) => ({
    id: generateId(),
    anchors: [
      { id: generateId(), ref: { item: edge.from } },
      { id: generateId(), ref: { item: edge.to } }
    ],
    labels: edge.label ? [{ id: generateId(), text: edge.label, position: 50 }] : []
  }));

  const viewId = generateId();

  const finalData: InitialData = {
    version: '1.0',
    title: 'Mermaid Import',
    icons: [DEFAULT_ICON],
    colors: [DEFAULT_COLOR],
    items: modelItems,
    views: [
      {
        ...VIEW_DEFAULTS,
        id: viewId,
        name: 'Main View',
        items: viewItems,
        connectors: connectors
      }
    ],
    view: viewId,
    fitToView: true
  };

  console.log('[MermaidImport] Final Model Data:', finalData);
  return finalData;
};
