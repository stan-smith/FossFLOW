import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AI_PROVIDERS,
  generateDiagramFromPrompt,
  listModelsForProvider,
  type AIProviderConfig,
  type ModelOption
} from '../../services/aiDiagramService';
import { DIAGRAM_SYSTEM_PROMPT, extractJsonFromResponse, isCompactFormat } from '../../services/aiDiagramPrompt';
import { transformFromCompactFormat } from 'fossflow';
import type { DiagramData } from '../../diagramUtils';

const STORAGE_KEY_API_KEY = 'fossflow_ai_api_key';
const STORAGE_KEY_PROVIDER = 'fossflow_ai_provider';
const STORAGE_KEY_MODEL = 'fossflow_ai_model';
const STORAGE_KEY_CUSTOM_URL = 'fossflow_ai_custom_url';

export interface AIGenerateDialogProps {
  onClose: () => void;
  onGenerated: (data: DiagramData) => void;
  defaultColors: Array<{ id: string; value: string }>;
}

export function AIGenerateDialog({
  onClose,
  onGenerated,
  defaultColors
}: AIGenerateDialogProps) {
  const { t } = useTranslation('app');
  const [apiKey, setApiKey] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_API_KEY) || '';
    } catch {
      return '';
    }
  });
  const [providerId, setProviderId] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_PROVIDER) || 'openai';
    } catch {
      return 'openai';
    }
  });
  const [model, setModel] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_MODEL) || '';
    } catch {
      return '';
    }
  });
  const [customBaseUrl, setCustomBaseUrl] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_CUSTOM_URL) || '';
    } catch {
      return '';
    }
  });
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelList, setModelList] = useState<ModelOption[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [listModelsError, setListModelsError] = useState<string | null>(null);

  const currentProvider = AI_PROVIDERS.find((p) => p.id === providerId) ?? AI_PROVIDERS[0];
  const canGenerate = apiKey.trim().length > 0 && prompt.trim().length > 0 && !loading;

  const canListModels = providerId === 'custom' || providerId === 'anthropic' || apiKey.trim().length > 0;

  useEffect(() => {
    if (!canListModels) {
      setModelList([]);
      setModel('');
      setListModelsError(null);
      return;
    }
    let cancelled = false;
    setListModelsError(null);
    setLoadingModels(true);
    const baseUrl = providerId === 'custom' ? customBaseUrl.trim() || undefined : undefined;
    listModelsForProvider(providerId, apiKey.trim(), baseUrl)
      .then((list) => {
        if (cancelled) return;
        setModelList(list);
        setListModelsError(null);
        setModel((prev) => {
          if (list.length === 0) return prev;
          const inList = list.some((m) => m.id === prev);
          return inList ? prev : list[0].id;
        });
      })
      .catch((e) => {
        if (!cancelled) {
          setListModelsError(e instanceof Error ? e.message : String(e));
          setModelList([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingModels(false);
      });
    return () => {
      cancelled = true;
    };
  }, [providerId, apiKey, customBaseUrl, canListModels]);

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;
    setError(null);
    setLoading(true);

    try {
      if (apiKey.trim()) {
        try {
          sessionStorage.setItem(STORAGE_KEY_API_KEY, apiKey.trim());
          sessionStorage.setItem(STORAGE_KEY_PROVIDER, providerId);
          sessionStorage.setItem(STORAGE_KEY_MODEL, model.trim());
          if (providerId === 'custom') sessionStorage.setItem(STORAGE_KEY_CUSTOM_URL, customBaseUrl.trim());
        } catch {
          /* ignore */
        }
      }

      const baseUrl = providerId === 'custom' ? customBaseUrl.trim() || undefined : undefined;
      const modelToUse =
        model.trim() ||
        (modelList.length > 0 ? modelList[0].id : null) ||
        currentProvider.defaultModel ||
        'gpt-4o';

      const result = await generateDiagramFromPrompt(
        providerId,
        apiKey.trim(),
        modelToUse,
        prompt.trim(),
        DIAGRAM_SYSTEM_PROMPT,
        baseUrl
      );

      if (result.error) {
        setError(result.error);
        return;
      }
      if (!result.content?.trim()) {
        setError(t('dialog.ai.invalidResponse', { defaultValue: 'Could not parse a valid diagram from the response.' }));
        return;
      }

      const raw = extractJsonFromResponse(result.content);
      let diagramData: DiagramData;

      if (isCompactFormat(raw)) {
        const fullModel = transformFromCompactFormat(raw);
        diagramData = {
          title: fullModel.title || 'AI Generated',
          version: fullModel.version,
          icons: fullModel.icons || [],
          colors: fullModel.colors?.length ? fullModel.colors : defaultColors,
          items: fullModel.items || [],
          views: fullModel.views || [],
          fitToScreen: true
        };
      } else if (
        typeof raw === 'object' &&
        raw !== null &&
        'items' in (raw as object) &&
        'views' in (raw as object)
      ) {
        const o = raw as Record<string, unknown>;
        diagramData = {
          title: (o.title as string) || 'AI Generated',
          version: o.version as string | undefined,
          icons: (o.icons as DiagramData['icons']) || [],
          colors: (o.colors as DiagramData['colors'])?.length
            ? (o.colors as DiagramData['colors'])
            : defaultColors,
          items: (o.items as DiagramData['items']) || [],
          views: (o.views as DiagramData['views']) || [],
          fitToScreen: true
        };
      } else {
        setError(t('dialog.ai.invalidResponse', { defaultValue: 'Could not parse a valid diagram from the response.' }));
        return;
      }

      onGenerated(diagramData);
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg === 'Failed to fetch' ? 'Network error (request blocked or server unreachable). Run the app with npm run dev so requests use the proxy.' : msg);
    } finally {
      setLoading(false);
    }
  }, [
    canGenerate,
    apiKey,
    providerId,
    model,
    modelList,
    customBaseUrl,
    prompt,
    currentProvider.defaultModel,
    defaultColors,
    onGenerated,
    onClose,
    t
  ]);

  const isCustom = providerId === 'custom';

  const tx = (key: string, fallback: string) => t(key, { defaultValue: fallback });

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog ai-generate-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <h2>{tx('dialog.ai.title', 'Generate diagram with AI')}</h2>
        <p className="dialog-ai-description">{tx('dialog.ai.description', 'Paste your API key here and describe the diagram you want. Keys are only used from this screen and kept in this browser session.')}</p>

        <label className="dialog-ai-label">{tx('dialog.ai.apiKey', 'Your API key (paste here)')}</label>
        <input
          type="password"
          className="dialog-input"
          placeholder={tx('dialog.ai.apiKeyPlaceholder', 'sk-...')}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          autoComplete="off"
        />
        {!apiKey.trim() && (
          <p className="dialog-ai-hint">{tx('dialog.ai.apiKeyRequired', 'Enter your API key above to generate.')}</p>
        )}

        <label className="dialog-ai-label">{tx('dialog.ai.provider', 'Provider')}</label>
        <select
          className="dialog-select"
          value={providerId}
          onChange={(e) => setProviderId(e.target.value)}
        >
          {AI_PROVIDERS.map((p: AIProviderConfig) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {isCustom && (
          <>
            <label className="dialog-ai-label">{tx('dialog.ai.customUrl', 'Custom API base URL')}</label>
            <input
              type="url"
              className="dialog-input"
              placeholder="https://your-api.com/v1"
              value={customBaseUrl}
              onChange={(e) => setCustomBaseUrl(e.target.value)}
            />
          </>
        )}

        <label className="dialog-ai-label">{tx('dialog.ai.model', 'Model')}</label>
        <div className="dialog-ai-model-row">
          {loadingModels ? (
            <span className="dialog-ai-hint">{tx('dialog.ai.loadingModels', 'Loading models…')}</span>
          ) : modelList.length > 0 ? (
            <select
              className="dialog-select dialog-select-flex"
              value={modelList.some((m) => m.id === model) ? model : ''}
              onChange={(e) => setModel(e.target.value)}
            >
              {modelList.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label || opt.id}
                </option>
              ))}
              <option value="">{tx('dialog.ai.modelCustom', 'Custom (type below)')}</option>
            </select>
          ) : (
            <input
              type="text"
              className="dialog-input dialog-input-flex"
              placeholder={currentProvider.defaultModel || 'e.g. gpt-4o'}
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          )}
        </div>
        {listModelsError && (
          <p className="dialog-ai-hint" style={{ color: '#c62828' }}>
            {listModelsError}
          </p>
        )}
        {modelList.length > 0 && !modelList.some((m) => m.id === model) && (
          <input
            type="text"
            className="dialog-input"
            placeholder={tx('dialog.ai.modelCustomPlaceholder', 'Type model ID')}
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        )}

        <label className="dialog-ai-label">{tx('dialog.ai.prompt', 'Prompt')}</label>
        <textarea
          className="dialog-textarea"
          placeholder={tx('dialog.ai.promptPlaceholder', 'e.g. A simple 3-tier web app: load balancer, 2 app servers, database')}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />

        {error && (
          <div className="dialog-ai-error" role="alert">
            {error}
          </div>
        )}

        <div className="dialog-buttons">
          <button onClick={handleGenerate} disabled={!canGenerate}>
            {loading ? tx('dialog.ai.generating', 'Generating…') : tx('dialog.ai.generate', 'Generate')}
          </button>
          <button onClick={onClose}>{tx('dialog.ai.cancel', 'Cancel')}</button>
        </div>
      </div>
    </div>
  );
}
