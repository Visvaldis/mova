// Provider-agnostic browser LLM client for the Ask-AI feature (docs/ASK-AI.md).
// No SDKs: plain fetch + manual SSE parsing. The user's key goes ONLY to the
// provider endpoint, over HTTPS, and nowhere else.

export type Provider = 'anthropic' | 'openai';

export interface LlmConfig {
  provider: Provider;
  apiKey: string;
  /** Model override; defaults per provider below. */
  model?: string;
  /** OpenAI-compatible base URL (e.g. https://api.openai.com/v1, https://openrouter.ai/api/v1). */
  baseUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const DEFAULT_MODEL: Record<Provider, string> = {
  anthropic: 'claude-haiku-4-5',
  openai: 'gpt-4o-mini',
};
export const DEFAULT_OPENAI_BASE = 'https://api.openai.com/v1';
const MAX_TOKENS = 1536;

export class LlmError extends Error {
  kind: 'auth' | 'rate' | 'cors' | 'other';
  constructor(kind: LlmError['kind'], message: string) {
    super(message);
    this.kind = kind;
  }
}

async function toLlmError(res: Response): Promise<LlmError> {
  let detail = '';
  try {
    const body = await res.json();
    detail = body?.error?.message ?? '';
  } catch {}
  if (res.status === 401 || res.status === 403) return new LlmError('auth', detail || `HTTP ${res.status}`);
  if (res.status === 429) return new LlmError('rate', detail || 'rate limited');
  return new LlmError('other', detail || `HTTP ${res.status}`);
}

/** Iterate "data: {...}" SSE payload strings from a streaming response body. */
async function* sseData(res: Response): AsyncGenerator<string> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() ?? '';
    for (const line of lines) {
      const t = line.trim();
      if (t.startsWith('data:')) {
        const payload = t.slice(5).trim();
        if (payload && payload !== '[DONE]') yield payload;
      }
    }
  }
}

/**
 * Stream a chat completion. Yields text deltas.
 * Throws LlmError; network/CORS failures surface as kind: 'cors'.
 */
export async function* stream(
  cfg: LlmConfig,
  system: string,
  messages: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const model = cfg.model || DEFAULT_MODEL[cfg.provider];
  let res: Response;
  try {
    if (cfg.provider === 'anthropic') {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        signal,
        headers: {
          'content-type': 'application/json',
          'x-api-key': cfg.apiKey,
          'anthropic-version': '2023-06-01',
          // Official opt-in for direct browser (CORS) usage of the Anthropic API.
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({ model, max_tokens: MAX_TOKENS, system, messages, stream: true }),
      });
    } else {
      const base = (cfg.baseUrl || DEFAULT_OPENAI_BASE).replace(/\/$/, '');
      res = await fetch(`${base}/chat/completions`, {
        method: 'POST',
        signal,
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${cfg.apiKey}`,
        },
        body: JSON.stringify({
          model,
          max_tokens: MAX_TOKENS,
          stream: true,
          messages: [{ role: 'system', content: system }, ...messages],
        }),
      });
    }
  } catch (e) {
    if ((e as Error).name === 'AbortError') return;
    throw new LlmError('cors', (e as Error).message);
  }

  if (!res.ok) throw await toLlmError(res);

  try {
    for await (const payload of sseData(res)) {
      let json: any;
      try {
        json = JSON.parse(payload);
      } catch {
        continue;
      }
      if (cfg.provider === 'anthropic') {
        if (json.type === 'content_block_delta' && json.delta?.type === 'text_delta') {
          yield json.delta.text as string;
        }
      } else {
        const delta = json.choices?.[0]?.delta?.content;
        if (typeof delta === 'string' && delta) yield delta;
      }
    }
  } catch (e) {
    if ((e as Error).name !== 'AbortError') throw e;
  }
}

/** 1-token sanity ping used by the setup sheet to validate a key before storing it. */
export async function testKey(cfg: LlmConfig): Promise<void> {
  const model = cfg.model || DEFAULT_MODEL[cfg.provider];
  let res: Response;
  try {
    if (cfg.provider === 'anthropic') {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': cfg.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({ model, max_tokens: 1, messages: [{ role: 'user', content: 'hi' }] }),
      });
    } else {
      const base = (cfg.baseUrl || DEFAULT_OPENAI_BASE).replace(/\/$/, '');
      res = await fetch(`${base}/chat/completions`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${cfg.apiKey}` },
        body: JSON.stringify({ model, max_tokens: 1, messages: [{ role: 'user', content: 'hi' }] }),
      });
    }
  } catch (e) {
    throw new LlmError('cors', (e as Error).message);
  }
  if (!res.ok) throw await toLlmError(res);
}
