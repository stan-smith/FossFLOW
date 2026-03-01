/**
 * System prompt and response parsing for AI-generated FossFLOW diagram JSON.
 * We ask the model to return the "compact" format so it's easy to generate and parse.
 */

export const DIAGRAM_SYSTEM_PROMPT = `You are a diagram generator for FossFLOW, an isometric diagramming tool. Given a user description, you must respond with a single valid JSON object and nothing else (no markdown, no explanation).

Use the COMPACT format below. All field names and structure must be exact.

Compact format:
{
  "t": "Diagram title (short string)",
  "i": [
    ["Item name", "icon_id", "optional short description"],
    ...
  ],
  "v": [
    [
      [[item_index, x, y], ...],
      [[from_item_index, to_item_index], ...]
    ],
    ...
  ],
  "_": { "f": "compact", "v": "1.0" }
}

Rules:
- "t": title, string, max ~40 chars.
- "i": array of items. Each item is [name, icon_id, description]. Use icon_id from: block, storage, server, database, cloud, user, office, lock, key, api, globe, cpu, code, chart, box. Keep names and descriptions short.
- "v": array of views. Each view is [positions, connections]. positions: array of [item_index, x, y] (item_index is 0-based from "i"). connections: array of [from_index, to_index]. Use small grid coordinates e.g. x,y from 0 to 8.
- Always include "_": { "f": "compact", "v": "1.0" }.
- Output only the JSON object, no \`\`\`json or other wrapping.`;

/**
 * Extracts a JSON object from model output (handles markdown code blocks and trailing text).
 */
export function extractJsonFromResponse(response: string): unknown {
  const trimmed = response.trim();
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = codeBlockMatch ? codeBlockMatch[1].trim() : trimmed;
  const start = raw.indexOf('{');
  if (start === -1) throw new Error('No JSON object found in response');
  let depth = 0;
  let end = -1;
  for (let i = start; i < raw.length; i++) {
    if (raw[i] === '{') depth++;
    if (raw[i] === '}') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) throw new Error('Invalid JSON: unclosed object');
  const jsonStr = raw.slice(start, end + 1);
  return JSON.parse(jsonStr);
}

/**
 * Returns true if the parsed value looks like the compact diagram format.
 */
export function isCompactFormat(obj: unknown): obj is { t?: string; i?: unknown[]; v?: unknown[]; _?: { f?: string } } {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return Array.isArray(o.i) && Array.isArray(o.v) && o._ && (o._ as Record<string, unknown>).f === 'compact';
}
