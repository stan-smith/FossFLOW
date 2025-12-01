export interface AiDiagramContext {
  readonly diagramId?: string;
  readonly summary?: string;
  // Extend with additional fields as needed (nodes, edges, etc.)
  // readonly nodes?: unknown;
  // readonly edges?: unknown;
}

export interface AiQueryOptions {
  readonly stream?: boolean;
  // Placeholder for future LightRAG-specific options
  // readonly maxTokens?: number;
}

export interface AiQueryRequest {
  readonly query: string;
  readonly diagramContext?: AiDiagramContext;
  readonly options?: AiQueryOptions;
}

export interface AiQueryResponse {
  readonly answer: string;
  readonly raw?: readonly string[];
}

const AI_ENDPOINT = '/api/ai/query';

function getBackendBaseUrl(): string {
  const isDevelopment =
    window.location.hostname === 'localhost' &&
    window.location.port === '3000';

  // In development, the backend is on port 3001. In production (Docker / nginx),
  // the backend is proxied so we can use a relative path.
  return isDevelopment ? 'http://localhost:3001' : '';
}

export async function queryAi(
  payload: AiQueryRequest
): Promise<AiQueryResponse> {
  if (!payload.query || payload.query.trim().length === 0) {
    throw new Error('AI query must be a non-empty string');
  }

  const baseUrl = getBackendBaseUrl();
  const url = `${baseUrl}${AI_ENDPOINT}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
    // Match or exceed the backend LightRAG timeout so the browser does not
    // give up before the server finishes long-running queries.
    signal: AbortSignal.timeout(90000)
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `AI request failed with status ${response.status}: ${errorText}`
    );
  }

  const data = (await response.json()) as AiQueryResponse;

  return data;
}


