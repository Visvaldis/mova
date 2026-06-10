// Storage for the Ask-AI feature.
// - Provider config: localStorage (or sessionStorage in session-only mode).
// - Chat history: persistent conversations in localStorage ('mova:askai:history:v1'),
//   capped at MAX_CONVOS; each conversation remembers its page, selection, and messages.
import type { ChatMessage, LlmConfig } from './llm';

const CFG_KEY = 'mova:askai:v1';
const HISTORY_KEY = 'mova:askai:history:v1';
const MAX_CONVOS = 50;
const MAX_MESSAGES = 40;

interface StoredCfg extends LlmConfig {
  v: 1;
}

function storages(): Storage[] {
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

// ---- conversation history ---------------------------------------------------

export interface Conversation {
  id: string;
  /** Page pathname + human title, so history reads well across articles. */
  page: string;
  pageTitle: string;
  selection: string;
  lang: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

export function newConversation(selection: string, lang: string): Conversation {
  const now = Date.now();
  return {
    id: `${now.toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    page: location.pathname,
    pageTitle: document.title.split('·')[0].trim(),
    selection,
    lang,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

export function listConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const list = raw ? (JSON.parse(raw) as Conversation[]) : [];
    return list.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

/** Insert or update a conversation. Empty conversations are not persisted. */
export function saveConversation(convo: Conversation): void {
  if (convo.messages.length === 0) return;
  try {
    const list = listConversations().filter((c) => c.id !== convo.id);
    list.unshift({ ...convo, messages: convo.messages.slice(-MAX_MESSAGES), updatedAt: Date.now() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, MAX_CONVOS)));
  } catch {}
}

export function deleteConversation(id: string): void {
  try {
    const list = listConversations().filter((c) => c.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch {}
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {}
}

// ---- export -----------------------------------------------------------------

/** First user message carries the context block; show/export only the question part. */
export function displayContent(m: ChatMessage, index: number): string {
  return index === 0 && m.role === 'user' ? m.content.split('\n\n').slice(-1)[0] : m.content;
}

export function exportMarkdown(convo: Conversation, labels: { you: string; ai: string; selection: string }): string {
  const date = new Date(convo.createdAt).toISOString().slice(0, 10);
  const lines = [
    `# Mova chat — ${convo.pageTitle}`,
    ``,
    `_${date} · ${location.origin}${convo.page}_`,
    ``,
    `> ${labels.selection}: “${convo.selection}”`,
    ``,
  ];
  convo.messages.forEach((m, i) => {
    lines.push(`**${m.role === 'user' ? labels.you : labels.ai}:** ${displayContent(m, i)}`, ``);
  });
  return lines.join('\n');
}

export function downloadMarkdown(convo: Conversation, labels: { you: string; ai: string; selection: string }): void {
  const md = exportMarkdown(convo, labels);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mova-chat-${new Date(convo.createdAt).toISOString().slice(0, 10)}-${convo.id.slice(0, 5)}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
