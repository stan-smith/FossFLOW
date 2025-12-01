import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DiagramData, buildDiagramContextPayload } from '../diagramUtils';
import { queryAi } from '../services/aiService';
import './AiHelperSidebar.css';

type MessageRole = 'user' | 'assistant' | 'system';

interface AiMessage {
  readonly id: string;
  readonly role: MessageRole;
  readonly content: string;
  readonly createdAt: Date;
}

interface LightRagReference {
  readonly reference_id: string;
  readonly file_path: string;
}

interface ParsedLightRagAnswer {
  readonly text: string;
}

/**
 * Best-effort parser for LightRAG-style JSONL responses of the form:
 * {"references":[{...}]}
 * {"response":"I"}
 * {"response":" do"}
 * ...
 *
 * If parsing fails or the content is not in this format, returns null and
 * the raw answer string should be used instead.
 */
function tryParseLightRagAnswer(raw: string | undefined): ParsedLightRagAnswer | null {
  if (!raw || raw.trim().length === 0) {
    return null;
  }

  const lines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return null;
  }

  const responses: string[] = [];
  const references: LightRagReference[] = [];
  let sawStructured = false;

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line) as {
        readonly response?: string;
        readonly references?: readonly LightRagReference[];
      };

      if (typeof parsed.response === 'string') {
        responses.push(parsed.response);
        sawStructured = true;
      }

      if (Array.isArray(parsed.references)) {
        for (const ref of parsed.references) {
          if (
            ref &&
            typeof ref.reference_id === 'string' &&
            typeof ref.file_path === 'string'
          ) {
            references.push(ref);
            sawStructured = true;
          }
        }
      }
    } catch {
      // If any line is not valid JSON, treat the whole answer as unstructured.
      return null;
    }
  }

  if (!sawStructured) {
    return null;
  }

  let text = responses.join('');
  text = text.trim();

  if (references.length > 0) {
    const referenceLines: string[] = [];
    referenceLines.push(text);
    referenceLines.push('');
    referenceLines.push('References:');

    for (const ref of references) {
      referenceLines.push(`- [${ref.reference_id}] ${ref.file_path}`);
    }

    text = referenceLines.join('\n');
  }

  return { text };
}

interface AiHelperSidebarProps {
  readonly diagramId?: string;
  readonly diagramData: DiagramData;
}

export function AiHelperSidebar(props: AiHelperSidebarProps) {
  const { diagramId, diagramData } = props;
  const { t } = useTranslation('app');

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const contextSummary = useMemo(() => {
    return buildDiagramContextPayload(diagramData, diagramId);
  }, [diagramData, diagramId]);

  // Reset chat when diagram changes
  useEffect(() => {
    setMessages([]);
    setError(null);
    setInputValue('');
  }, [diagramId]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const userMessage: AiMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      createdAt: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await queryAi({
        query: trimmed,
        diagramContext: {
          diagramId: contextSummary.diagramId,
          summary: `${contextSummary.title ?? 'Untitled'} - ${contextSummary.nodeCount} nodes, ${contextSummary.edgeCount} edges`,
          // Full structure for LightRAG
          nodes: contextSummary.nodes,
          edges: contextSummary.edges
        } as any
      });

      const assistantMessage: AiMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content:
          tryParseLightRagAnswer(response.answer)?.text ?? response.answer,
        createdAt: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`ai-helper-container ${isOpen ? 'open' : 'closed'}`}>
      <button
        type="button"
        className="ai-toggle-button"
        onClick={handleToggle}
      >
        {isOpen ? '✕' : '🤖'}{' '}
        {isOpen
          ? t('aiHelper.close', 'Close AI Helper')
          : t('aiHelper.open', 'AI Helper')}
      </button>

      {isOpen && (
        <div className="ai-sidebar">
          <div className="ai-header">
            <span className="ai-title">
              🤖 {t('aiHelper.title', 'AI Helper')}
            </span>
            <span className="ai-subtitle">
              {t('aiHelper.contextSummary', {
                defaultValue:
                  'Diagram: {{title}} ({{nodes}} nodes, {{edges}} edges)',
                title: contextSummary.title ?? 'Untitled',
                nodes: contextSummary.nodeCount,
                edges: contextSummary.edgeCount
              })}
            </span>
          </div>

          <div className="ai-messages">
            {messages.length === 0 && (
              <div className="ai-empty-state">
                {t(
                  'aiHelper.empty',
                  'Ask a question about this diagram and I will help you understand or improve it.'
                )}
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-message ai-message-${message.role}`}
              >
                <div className="ai-message-role">
                  {message.role === 'user'
                    ? t('aiHelper.you', 'You')
                    : t('aiHelper.assistant', 'Assistant')}
                </div>
                <div className="ai-message-content">{message.content}</div>
              </div>
            ))}
          </div>

          <form className="ai-input-area" onSubmit={handleSubmit}>
            <textarea
              className="ai-input"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={t(
                'aiHelper.placeholder',
                'Ask a question about this diagram...'
              )}
              rows={3}
              disabled={isLoading}
            />
            {error && <div className="ai-error">{error}</div>}
            <div className="ai-actions">
              <button
                type="submit"
                className="ai-send-button"
                disabled={isLoading || !inputValue.trim()}
              >
                {isLoading
                  ? t('aiHelper.thinking', 'Thinking...')
                  : t('aiHelper.send', 'Send')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}


