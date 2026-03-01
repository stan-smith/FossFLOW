/**
 * AI Diagram Service – provider-agnostic interface for generating diagram JSON from prompts.
 * Supports OpenAI, Anthropic, Google Gemini, OpenRouter, and custom OpenAI-compatible endpoints.
 */

export interface AIProviderConfig {
  id: string;
  name: string;
  /** Base URL for the API. Empty means use the default for this provider. */
  baseUrl?: string;
  /** Default model when none specified (optional). */
  defaultModel?: string;
}

/** Standard chat message for provider APIs */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** Request passed to a provider adapter */
export interface AIGenerateRequest {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
}

/** Result from a provider – raw content from the model */
export interface AIGenerateResult {
  content: string;
  error?: string;
}

/** Provider adapter: builds fetch args and parses response for a given API shape */
export type AIProviderAdapter = (
  request: AIGenerateRequest,
  config: AIProviderConfig
) => Promise<AIGenerateResult>;

const OPENAI_DEFAULT = 'https://api.openai.com/v1';
const ANTHROPIC_DEFAULT = 'https://api.anthropic.com/v1';
const GEMINI_DEFAULT = 'https://generativelanguage.googleapis.com/v1beta';
const OPENROUTER_DEFAULT = 'https://openrouter.ai/api/v1';

/** In dev, use same-origin proxy to avoid CORS when calling AI APIs from the browser. Include version path so /models etc. resolve correctly. */
const AI_PROXY_PATHS: Record<string, string> = {
  openai: '/api/ai-proxy/openai/v1',
  anthropic: '/api/ai-proxy/anthropic/v1',
  gemini: '/api/ai-proxy/gemini/v1beta',
  openrouter: '/api/ai-proxy/openrouter/api/v1'
};

function getEffectiveBaseUrl(providerId: string, baseUrl: string | undefined): string | undefined {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const path = AI_PROXY_PATHS[providerId];
    if (path) return window.location.origin + path;
  }
  return baseUrl?.replace(/\/$/, '');
}

export const AI_PROVIDERS: AIProviderConfig[] = [
  { id: 'openai', name: 'OpenAI (GPT)', baseUrl: OPENAI_DEFAULT, defaultModel: 'gpt-4o' },
  { id: 'anthropic', name: 'Anthropic (Claude)', baseUrl: ANTHROPIC_DEFAULT, defaultModel: 'claude-3-5-sonnet-20241022' },
  { id: 'gemini', name: 'Google (Gemini)', baseUrl: GEMINI_DEFAULT, defaultModel: 'gemini-2.0-flash' },
  { id: 'openrouter', name: 'OpenRouter (any model)', baseUrl: OPENROUTER_DEFAULT, defaultModel: 'openai/gpt-4o' },
  { id: 'custom', name: 'Custom endpoint', defaultModel: '' }
];

export interface ModelOption {
  id: string;
  label?: string;
}

async function openAICompatibleAdapter(
  request: AIGenerateRequest,
  config: AIProviderConfig,
  options: { headerKey?: string; modelInBody?: boolean } = {}
): Promise<AIGenerateResult> {
  const baseUrl = (config.baseUrl || OPENAI_DEFAULT).replace(/\/$/, '');
  const url = `${baseUrl}/chat/completions`;
  const headerKey = options.headerKey ?? 'Authorization';
  const modelInBody = options.modelInBody !== false;

  const body: Record<string, unknown> = {
    model: request.model,
    messages: request.messages,
    max_tokens: 4096,
    temperature: 0.2
  };
  if (!modelInBody) {
    delete body.model;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    [headerKey]: request.apiKey.startsWith('Bearer ') ? request.apiKey : `Bearer ${request.apiKey}`
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    return { content: '', error: `API error ${res.status}: ${errText.slice(0, 500)}` };
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? data.content?.[0]?.text ?? '';
  if (typeof content !== 'string') {
    return { content: '', error: 'Unexpected API response shape' };
  }
  return { content };
}

/** Anthropic uses x-api-key and a different response shape */
async function anthropicAdapter(request: AIGenerateRequest, config: AIProviderConfig): Promise<AIGenerateResult> {
  const baseUrl = (config.baseUrl || ANTHROPIC_DEFAULT).replace(/\/$/, '');
  const url = `${baseUrl}/messages`;

  const systemMessage = request.messages.find((m) => m.role === 'system');
  const otherMessages = request.messages.filter((m) => m.role !== 'system');

  const body = {
    model: request.model,
    max_tokens: 4096,
    system: systemMessage?.content ?? '',
    messages: otherMessages.map((m) => ({ role: m.role, content: m.content }))
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': request.apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    return { content: '', error: `API error ${res.status}: ${errText.slice(0, 500)}` };
  }

  const data = await res.json();
  const text = data.content?.find((c: { type: string }) => c.type === 'text');
  const content = text?.text ?? '';
  return { content };
}

/** Extract text from a single Gemini API response object (stream chunk or full response) */
function extractTextFromGeminiResponse(data: Record<string, unknown>): string {
  const candidates = data.candidates as Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }> | undefined;
  if (!candidates?.[0]?.content?.parts) return '';
  let text = '';
  for (const part of candidates[0].content.parts) {
    if (typeof part.text === 'string') text += part.text;
  }
  return text;
}

/** Read SSE stream from Gemini streamGenerateContent and accumulate full text. Also handles single JSON response (e.g. buffered). */
async function readGeminiStream(res: Response): Promise<{ content: string; error?: string }> {
  if (!res.body) {
    return { content: '', error: 'No response body' };
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';
  let firstError: string | undefined;

  const processChunkPayload = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr) as Record<string, unknown>;
      const promptFeedback = data.promptFeedback as { blockReason?: string } | undefined;
      if (promptFeedback?.blockReason && !fullText) {
        firstError = `Gemini blocked: ${promptFeedback.blockReason}`;
      }
      fullText += extractTextFromGeminiResponse(data);
    } catch {}
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6).trim();
          if (jsonStr) processChunkPayload(jsonStr);
        } else if (trimmed.startsWith('{')) {
          processChunkPayload(trimmed);
        }
      }
    }
    if (buffer.trim()) {
      const trimmed = buffer.trim();
      if (trimmed.startsWith('data: ')) {
        const jsonStr = trimmed.slice(6).trim();
        if (jsonStr) processChunkPayload(jsonStr);
      } else if (trimmed.startsWith('{')) {
        processChunkPayload(trimmed);
      }
    }
    if (firstError && !fullText) return { content: '', error: firstError };
    return { content: fullText.trim() };
  } finally {
    reader.releaseLock();
  }
}

/** Gemini non-streaming call (generateContent) – used as fallback when streaming fails or returns empty */
async function geminiNonStreaming(
  request: AIGenerateRequest,
  baseUrl: string
): Promise<AIGenerateResult> {
  const url = `${baseUrl}/models/${encodeURIComponent(request.model)}:generateContent`;
  const systemMessage = request.messages.find((m) => m.role === 'system');
  const userMessage = request.messages.find((m) => m.role === 'user');
  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: userMessage?.content ?? '' }] }],
    generationConfig: { maxOutputTokens: 8192, temperature: 0.2 }
  };
  if (systemMessage?.content) {
    body.systemInstruction = { parts: [{ text: systemMessage.content }] };
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': request.apiKey },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const errText = await res.text();
    return { content: '', error: `API error ${res.status}: ${errText.slice(0, 500)}` };
  }
  let data: Record<string, unknown>;
  try {
    data = await res.json();
  } catch {
    return { content: '', error: 'Invalid JSON in Gemini response' };
  }
  const promptFeedback = data.promptFeedback as { blockReason?: string } | undefined;
  if (promptFeedback?.blockReason) {
    return { content: '', error: `Gemini blocked: ${promptFeedback.blockReason}` };
  }
  const text = extractTextFromGeminiResponse(data);
  if (!text) {
    const candidates = data.candidates as Array<{ finishReason?: string }> | undefined;
    const reason = candidates?.[0]?.finishReason ?? 'unknown';
    return { content: '', error: `Gemini produced no content (finishReason: ${reason}). Try again or check the prompt.` };
  }
  return { content: text };
}

/** Google Gemini: try streaming first for full response; fall back to non-streaming if stream fails or is empty */
async function geminiAdapter(request: AIGenerateRequest, config: AIProviderConfig): Promise<AIGenerateResult> {
  const baseUrl = (config.baseUrl || GEMINI_DEFAULT).replace(/\/$/, '');
  const streamUrl = `${baseUrl}/models/${encodeURIComponent(request.model)}:streamGenerateContent?alt=sse`;
  const systemMessage = request.messages.find((m) => m.role === 'system');
  const userMessage = request.messages.find((m) => m.role === 'user');
  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: userMessage?.content ?? '' }] }],
    generationConfig: { maxOutputTokens: 8192, temperature: 0.2 }
  };
  if (systemMessage?.content) {
    body.systemInstruction = { parts: [{ text: systemMessage.content }] };
  }

  let res: Response;
  try {
    res = await fetch(streamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': request.apiKey
      },
      body: JSON.stringify(body)
    });
  } catch (e) {
    return { content: '', error: e instanceof Error ? e.message : 'Network request failed' };
  }

  if (!res.ok) {
    const errText = await res.text();
    return { content: '', error: `API error ${res.status}: ${errText.slice(0, 500)}` };
  }

  const contentType = res.headers.get('content-type') ?? '';
  const isStream = contentType.includes('text/event-stream') || contentType.includes('application/x-ndjson');
  if (!isStream) {
    const text = await res.text();
    if (text.includes('data: ') && text.includes('\n')) {
      let buffered = '';
      for (const line of text.split(/\r?\n/)) {
        const t = line.trim();
        if (!t || t === 'data: [DONE]') continue;
        if (t.startsWith('data: ')) {
          const j = t.slice(6).trim();
          if (j) {
            try {
              const data = JSON.parse(j) as Record<string, unknown>;
              buffered += extractTextFromGeminiResponse(data);
            } catch {}
          }
        } else if (t.startsWith('{')) {
          try {
            const data = JSON.parse(t) as Record<string, unknown>;
            buffered += extractTextFromGeminiResponse(data);
          } catch {}
        }
      }
      if (buffered.trim()) return { content: buffered.trim() };
    } else {
      try {
        const data = JSON.parse(text) as Record<string, unknown>;
        const out = extractTextFromGeminiResponse(data);
        if (out) return { content: out };
      } catch {}
    }
    return geminiNonStreaming(request, baseUrl);
  }

  const { content: streamedText, error: streamError } = await readGeminiStream(res);
  if (streamError) return { content: '', error: streamError };
  if (streamedText) return { content: streamedText };

  return geminiNonStreaming(request, baseUrl);
}

export function getAdapter(providerId: string): AIProviderAdapter {
  switch (providerId) {
    case 'anthropic':
      return anthropicAdapter;
    case 'gemini':
      return geminiAdapter;
    case 'openai':
    case 'openrouter':
    case 'custom':
    default:
      return (req, config) => openAICompatibleAdapter(req, config, {});
  }
}

/** List available models for a provider. Requires API key for Gemini, OpenAI, OpenRouter. */
export async function listModelsForProvider(
  providerId: string,
  apiKey: string,
  customBaseUrl?: string
): Promise<ModelOption[]> {
  const key = apiKey.trim();
  if (!key) return [];

  const config = AI_PROVIDERS.find((p) => p.id === providerId);
  const rawBase = providerId === 'custom' ? customBaseUrl : config?.baseUrl;
  const baseUrl = getEffectiveBaseUrl(providerId, rawBase) || rawBase?.replace(/\/$/, '');

  switch (providerId) {
    case 'gemini': {
      const url = `${baseUrl || GEMINI_DEFAULT}/models`;
      const res = await fetch(url, {
        headers: { 'x-goog-api-key': key }
      });
      if (!res.ok) return [];
      const data = await res.json();
      const models: ModelOption[] = (data.models || []).map((m: { name?: string; displayName?: string }) => {
        const name = m.name || '';
        const id = name.startsWith('models/') ? name.slice(7) : name;
        return { id, label: m.displayName || id };
      });
      return models.filter((m) => m.id);
    }
    case 'openai': {
      const url = `${baseUrl || OPENAI_DEFAULT}/models`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${key}` }
      });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.data || []).map((m: { id: string }) => ({ id: m.id, label: m.id }));
    }
    case 'openrouter': {
      const url = `${baseUrl || OPENROUTER_DEFAULT}/models`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${key}` }
      });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.data || []).map((m: { id: string; name?: string }) => ({
        id: m.id,
        label: m.name || m.id
      }));
    }
    case 'anthropic': {
      return [
        { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
        { id: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' },
        { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
        { id: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
        { id: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' }
      ];
    }
    case 'custom':
      return [];
    default:
      return [];
  }
}

export async function generateDiagramFromPrompt(
  providerId: string,
  apiKey: string,
  model: string,
  userPrompt: string,
  systemPrompt: string,
  customBaseUrl?: string
): Promise<AIGenerateResult> {
  const config = AI_PROVIDERS.find((p) => p.id === providerId) ?? AI_PROVIDERS[0];
  const effectiveModel = model.trim() || config.defaultModel || 'gpt-4o';
  let baseConfig: AIProviderConfig =
    providerId === 'custom' && customBaseUrl
      ? { ...config, baseUrl: customBaseUrl }
      : { ...config };

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && providerId !== 'custom') {
    const path = AI_PROXY_PATHS[providerId];
    if (path) baseConfig = { ...baseConfig, baseUrl: window.location.origin + path };
  }

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  const adapter = getAdapter(providerId);
  return adapter(
    { apiKey, model: effectiveModel, messages },
    baseConfig
  );
}
