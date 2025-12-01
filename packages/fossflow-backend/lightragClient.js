import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_LIGHTRAG_BASE_URL = 'https://lightrag-latest-xyu3.onrender.com';
const DEFAULT_LIGHTRAG_QUERY_STREAM_PATH = '/query/stream';
const DEFAULT_TIMEOUT_MS = 30000;

const LIGHTRAG_BASE_URL =
  process.env.LIGHTRAG_BASE_URL || DEFAULT_LIGHTRAG_BASE_URL;
const LIGHTRAG_QUERY_STREAM_PATH =
  process.env.LIGHTRAG_QUERY_STREAM_PATH || DEFAULT_LIGHTRAG_QUERY_STREAM_PATH;
const LIGHTRAG_TIMEOUT_MS = Number.parseInt(
  process.env.LIGHTRAG_TIMEOUT_MS ?? '',
  10
) || DEFAULT_TIMEOUT_MS;

const LIGHTRAG_API_KEY = process.env.LIGHTRAG_API_KEY;
const LIGHTRAG_API_KEY_HEADER =
  process.env.LIGHTRAG_API_KEY_HEADER || 'Authorization';
const LIGHTRAG_API_KEY_PREFIX =
  process.env.LIGHTRAG_API_KEY_PREFIX ?? 'Bearer';

/**
 * Normalize a LightRAG configuration snapshot for debugging.
 */
function getLightRagConfigSnapshot() {
  return {
    baseUrl: LIGHTRAG_BASE_URL,
    queryStreamPath: LIGHTRAG_QUERY_STREAM_PATH,
    timeoutMs: LIGHTRAG_TIMEOUT_MS,
    authHeader: LIGHTRAG_API_KEY_HEADER,
    apiKeyConfigured: Boolean(LIGHTRAG_API_KEY)
  };
}

/**
 * Aggregate a streaming HTTP response body into an array of text chunks.
 */
async function readStreamChunks(response) {
  const chunks = [];

  if (!response.body) {
    const text = await response.text();
    chunks.push(text);
    return chunks;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    if (value) {
      chunks.push(decoder.decode(value, { stream: true }));
    }
  }

  return chunks;
}

/**
 * Call the LightRAG `query/stream` API and aggregate the streamed response
 * into a single answer string.
 *
 * Note: although LightRAG provides a streaming endpoint, this helper
 * currently buffers the stream server-side into a single answer. This keeps
 * the Express integration simple while still using the correct backend API.
 */
export async function callLightRagQueryStream(params) {
  const { query, diagramContext, options } = params;

  if (!query || typeof query !== 'string') {
    throw new Error('LightRAG query must be a non-empty string');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, LIGHTRAG_TIMEOUT_MS);

  const url = `${LIGHTRAG_BASE_URL}${LIGHTRAG_QUERY_STREAM_PATH}`;

  const body = {
    query,
    context: diagramContext ?? null,
    options: options ?? {}
  };

  const headers = {
    'Content-Type': 'application/json'
  };

  if (LIGHTRAG_API_KEY) {
    // Allow flexible auth header configuration while keeping a sensible default.
    const value =
      LIGHTRAG_API_KEY_PREFIX && LIGHTRAG_API_KEY_PREFIX.length > 0
        ? `${LIGHTRAG_API_KEY_PREFIX} ${LIGHTRAG_API_KEY}`
        : LIGHTRAG_API_KEY;
    headers[LIGHTRAG_API_KEY_HEADER] = value;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      const error = new Error(
        `LightRAG request failed with status ${response.status}`
      );
      error.status = response.status;
      error.body = errorText;
      error.config = getLightRagConfigSnapshot();
      throw error;
    }

    const chunks = await readStreamChunks(response);
    const answer = chunks.join('');

    return {
      answer,
      chunks
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error(
        `LightRAG request timed out after ${LIGHTRAG_TIMEOUT_MS}ms`
      );
      timeoutError.code = 'LIGHTRAG_TIMEOUT';
      timeoutError.config = getLightRagConfigSnapshot();
      throw timeoutError;
    }

    if (!error.config) {
      error.config = getLightRagConfigSnapshot();
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}


