// Storage for the Ask-AI feature: provider config (localStorage or sessionStorage
// in session-only mode) and the per-page chat thread (sessionStorage).
import type { LlmConfig } from './llm';
import type { ChatMessage } from './llm';

const CFG_KEY = 'mova:askai:v1';

interface StoredCfg extends LlmConfig {
  v: 1;
}

function storages(): Storage[] {
  // Check both: session-only configs live in sessionStorage.
  try {
    return [window.sessionStorage, window.localStorage];
  } catch {
    return [];
  }
}

export function loadConfig(): LlmConfig | null {
  for (const s of storages()) {
    try {
      const raw = s.getItem(CFG_KEY);
      if (!raw) continue;
      const cfg = JSON.parse(raw) as StoredCfg;
      if (cfg.v === 1 && cfg.apiKey) return cfg;
    } catch {}
  }
  return null;
}

export function saveConfig(cfg: LlmConfig, sessionOnly: boolean): void {
  const stored: StoredCfg = { v: 1, ...cfg };
  try {
    forgetConfig();
    (sessionOnly ? window.sessionStorage : window.localStorage).setItem(CFG_KEY, JSON.stringify(stored));
  } catch {}
}

export function forgetConfig(): void {
  for (const s of storages()) {
    try {
      s.removeItem(CFG_KEY);
    } catch {}
  }
}

// ---- per-page thread (dies with the tab on purpose) ----------------------
function threadKey(): string {
  return `mova:askai:thread:${location.pathname}`;
}

export function loadThread(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(threadKey());
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

export function saveThread(messages: ChatMessage[]): void {
  try {
    sessionStorage.setItem(threadKey(), JSON.stringify(messages.slice(-20)));
  } catch {}
}
