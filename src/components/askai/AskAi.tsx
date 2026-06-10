// Ask-AI selection chat (docs/ASK-AI.md): select text → pill → chat drawer.
// BYOK: the user's own key, stored client-side, sent only to the provider.
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lang, UIKey } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { stream, testKey, LlmError, DEFAULT_OPENAI_BASE, type ChatMessage, type LlmConfig, type Provider } from '../../lib/llm';
import {
  loadConfig, saveConfig, forgetConfig,
  newConversation, listConversations, saveConversation, deleteConversation, clearHistory,
  displayContent, downloadMarkdown, type Conversation,
} from '../../lib/askai-store';

const SYSTEM: Record<Lang, string> = {
  en: `You are the reading companion of "Mova", a bilingual (English/Ukrainian) website about language evolution: etymology, sound change, language families, the history of Ukrainian, writing systems, sociolinguistics. The reader selected a passage and wants help. Answer in English unless asked otherwise. Be concise — under 150 words unless asked for more. It is good to say "linguists aren't sure" when that is true. Never invent etymologies; if a popular story is folk etymology, say so. Plain text only, no markdown headings.`,
  uk: `Ти — супутник читання сайту «Мова», двомовного (українська/англійська) сайту про еволюцію мови: етимологію, звукові зміни, мовні родини, історію української, системи письма, соціолінгвістику. Читач виділив фрагмент і хоче допомоги. Відповідай українською, якщо не попросять інакше. Будь стислим — до 150 слів, якщо не просять більше. Чесно казати «лінгвісти не впевнені», коли це правда. Ніколи не вигадуй етимологій; якщо популярна історія є народною етимологією — скажи це. Лише простий текст, без markdown-заголовків.`,
};

interface SelectionCtx {
  text: string;
  paragraph: string;
}

function buildContext(lang: Lang, sel: SelectionCtx): string {
  const title = document.title;
  const para = sel.paragraph.length > 1200 ? sel.paragraph.slice(0, 1200) + '…' : sel.paragraph;
  return lang === 'uk'
    ? `Сторінка: ${title}\nВиділений фрагмент: «${sel.text}»\nАбзац навколо: «${para}»`
    : `Page: ${title}\nSelected passage: "${sel.text}"\nSurrounding paragraph: "${para}"`;
}

export default function AskAi({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [pill, setPill] = useState<{ x: number; y: number } | null>(null);
  const [sel, setSel] = useState<SelectionCtx | null>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'chat' | 'history'>('chat');
  const [convo, setConvo] = useState<Conversation | null>(null);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [cfg, setCfg] = useState<LlmConfig | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<Element | null>(null);

  useEffect(() => {
    setCfg(loadConfig());
  }, []);

  // ---- selection pill ----------------------------------------------------
  // Responsiveness: mouseup/touchend trigger ~immediately (selection is final
  // the moment the button is released); selectionchange keeps a short debounce
  // only as the keyboard-selection path.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const compute = () => {
      const s = window.getSelection();
      if (!s || s.isCollapsed || open) {
        setPill(null);
        return;
      }
      const text = s.toString().trim();
      if (text.length < 3 || text.length > 1000) {
        setPill(null);
        return;
      }
      // Ignore selections inside the drawer itself.
      const node = s.anchorNode?.parentElement;
      if (node?.closest('[data-askai]')) return;
      const range = s.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const paragraph = node?.closest('p, li, blockquote, h2, h3, figcaption')?.textContent ?? text;
      anchorRef.current = node ?? null;
      setSel({ text, paragraph });
      // Above the selection (doesn't cover the next line); flip below near the top.
      const above = rect.top + window.scrollY - 34;
      const below = rect.bottom + window.scrollY + 6;
      setPill({
        x: Math.min(Math.max(rect.left + rect.width / 2, 60), window.innerWidth - 60),
        y: rect.top > 60 ? above : below,
      });
    };

    const onPointerUp = () => {
      clearTimeout(timer);
      // One tick so the browser finalizes the selection before we read it.
      timer = setTimeout(compute, 10);
    };
    const onSelectionChange = () => {
      clearTimeout(timer);
      timer = setTimeout(compute, 120);
    };

    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchend', onPointerUp);
    document.addEventListener('selectionchange', onSelectionChange);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseup', onPointerUp);
      document.removeEventListener('touchend', onPointerUp);
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, [open]);

  // ---- drawer behavior ----------------------------------------------------
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    drawerRef.current?.querySelector<HTMLElement>('input, button')?.focus();
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, busy]);

  const close = useCallback(() => {
    abortRef.current?.abort();
    setOpen(false);
    setBusy(false);
    setView('chat');
    (anchorRef.current as HTMLElement | null)?.focus?.();
  }, []);

  /** Start a fresh conversation from the current selection (pill click). */
  const startFromSelection = useCallback(() => {
    if (!sel) return;
    setConvo(newConversation(sel.text, lang));
    setMessages([]);
    setError('');
    setView('chat');
    setOpen(true);
    setPill(null);
  }, [sel, lang]);

  /** Reopen a saved conversation from history. */
  const resume = useCallback((c: Conversation) => {
    setConvo(c);
    setMessages(c.messages);
    setSel({ text: c.selection, paragraph: c.selection });
    setError('');
    setView('chat');
  }, []);

  const ask = useCallback(
    async (question: string) => {
      if (!cfg || !sel || !convo || busy || !question.trim()) return;
      setError('');
      setInput('');
      const userMsg: ChatMessage = {
        role: 'user',
        content: messages.length === 0 ? `${buildContext(lang, sel)}\n\n${question}` : question,
      };
      const next = [...messages, userMsg];
      setMessages([...next, { role: 'assistant', content: '' }]);
      setBusy(true);
      abortRef.current = new AbortController();
      let acc = '';
      try {
        for await (const delta of stream(cfg, SYSTEM[lang], next, abortRef.current.signal)) {
          acc += delta;
          setMessages([...next, { role: 'assistant', content: acc }]);
        }
        const finished = [...next, { role: 'assistant' as const, content: acc }];
        const updated = { ...convo, messages: finished };
        setConvo(updated);
        saveConversation(updated);
      } catch (e) {
        const kind = e instanceof LlmError ? e.kind : 'other';
        setError(t(`askai.err.${kind}` as UIKey) + (kind === 'other' ? ` ${(e as Error).message}` : ''));
        setMessages(next);
        const updated = { ...convo, messages: next };
        setConvo(updated);
        saveConversation(updated);
      } finally {
        setBusy(false);
      }
    },
    [cfg, sel, convo, busy, messages, lang, t],
  );

  return (
    <div data-askai>
      {pill && sel && !open && (
        <button
          onClick={startFromSelection}
          onMouseDown={(e) => e.preventDefault() /* keep the selection */}
          className="askai-pill"
          style={{
            position: 'absolute', left: pill.x, top: pill.y, transform: 'translateX(-50%)',
            zIndex: 90, border: 'none', borderRadius: 999, cursor: 'pointer',
            background: 'var(--accent)', color: 'var(--on-accent)',
            padding: '0.18rem 0.6rem', fontWeight: 600, fontSize: '0.78rem',
            lineHeight: 1.5, boxShadow: 'var(--shadow)', font: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
          }}
        >
          ✨ {t('askai.pill')}
        </button>
      )}

      {open && sel && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('askai.title')}
          className="askai-drawer"
          style={{
            position: 'fixed', zIndex: 100, background: 'var(--bg-elev)',
            borderLeft: '1px solid var(--line)', boxShadow: 'var(--shadow-lg)',
            display: 'flex', flexDirection: 'column',
            inset: 'auto 0 0 auto', width: 'min(420px, 100vw)', height: 'min(640px, 100dvh)',
          }}
        >
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: '0.8rem 1rem', borderBottom: '1px solid var(--line)' }}>
            <strong>💬 {t('askai.title')}</strong>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {cfg && (
                <button
                  onClick={() => {
                    if (view === 'chat') setHistory(listConversations());
                    setView(view === 'chat' ? 'history' : 'chat');
                  }}
                  aria-pressed={view === 'history'}
                  style={{ border: 'none', background: view === 'history' ? 'var(--accent-soft)' : 'transparent', borderRadius: 8, cursor: 'pointer', font: 'inherit', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', padding: '0.25rem 0.6rem' }}
                >
                  🕘 {t('askai.history')}
                </button>
              )}
              {cfg && convo && messages.length > 0 && view === 'chat' && (
                <button
                  onClick={() => downloadMarkdown({ ...convo, messages }, { you: t('askai.you'), ai: t('askai.ai'), selection: t('askai.selection') })}
                  style={{ border: 'none', background: 'transparent', borderRadius: 8, cursor: 'pointer', font: 'inherit', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', padding: '0.25rem 0.6rem' }}
                >
                  ⤓ {t('askai.export')}
                </button>
              )}
              <button onClick={close} aria-label={t('askai.close')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--muted)' }}>
                ✕
              </button>
            </span>
          </header>

          {!cfg ? (
            <SetupSheet lang={lang} onSaved={(c) => setCfg(c)} />
          ) : view === 'history' ? (
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.9rem 1rem', display: 'grid', gap: '0.6rem', alignContent: 'start' }}>
              {history.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{t('askai.historyEmpty')}</p>
              ) : (
                <>
                  {history.map((c) => (
                    <div key={c.id} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '0.6rem 0.8rem', display: 'grid', gap: 2 }}>
                      <button onClick={() => resume(c)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', textAlign: 'left', color: 'var(--text)', padding: 0 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                          “{c.selection.length > 70 ? c.selection.slice(0, 70) + '…' : c.selection}”
                        </span>
                        <br />
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                          {c.pageTitle} · {new Date(c.updatedAt).toLocaleDateString()} · {c.messages.length} ✉
                        </span>
                      </button>
                      <span style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => downloadMarkdown(c, { you: t('askai.you'), ai: t('askai.ai'), selection: t('askai.selection') })}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', fontSize: '0.74rem', color: 'var(--muted)', textDecoration: 'underline', padding: 0 }}>
                          ⤓ {t('askai.export')}
                        </button>
                        <button onClick={() => { deleteConversation(c.id); setHistory(listConversations()); }}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', fontSize: '0.74rem', color: '#dc2626', textDecoration: 'underline', padding: 0 }}>
                          {t('askai.delete')}
                        </button>
                      </span>
                    </div>
                  ))}
                  <button onClick={() => { clearHistory(); setHistory([]); }}
                    style={{ border: '1.5px solid var(--line)', background: 'transparent', borderRadius: 999, cursor: 'pointer', font: 'inherit', fontSize: '0.8rem', color: 'var(--muted)', padding: '0.35rem 0.8rem', justifySelf: 'start' }}>
                    🗑 {t('askai.clearHistory')}
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <div style={{ padding: '0.7rem 1rem', borderBottom: '1px solid var(--line)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.04em' }}>
                  {t('askai.selection')}
                </div>
                <div style={{ fontSize: '0.88rem', fontStyle: 'italic', maxHeight: '3.2em', overflow: 'hidden' }}>
                  “{sel.text.length > 160 ? sel.text.slice(0, 160) + '…' : sel.text}”
                </div>
              </div>

              <div ref={logRef} aria-live="polite" style={{ flex: 1, overflowY: 'auto', padding: '0.9rem 1rem', display: 'grid', gap: '0.6rem', alignContent: 'start' }}>
                {messages.length === 0 && (
                  <div style={{ display: 'grid', gap: '0.4rem' }}>
                    {(['askai.suggest1', 'askai.suggest2', 'askai.suggest3'] as UIKey[]).map((k) => (
                      <button key={k} onClick={() => ask(t(k))}
                        style={{ textAlign: 'left', border: '1.5px dashed var(--accent)', background: 'transparent', color: 'var(--text)', borderRadius: 10, padding: '0.5rem 0.8rem', cursor: 'pointer', font: 'inherit', fontSize: '0.92rem' }}>
                        {t(k)}
                      </button>
                    ))}
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} style={{
                    justifySelf: m.role === 'user' ? 'end' : 'start',
                    maxWidth: '88%', borderRadius: 12, padding: '0.55rem 0.85rem',
                    fontSize: '0.94rem', whiteSpace: 'pre-wrap',
                    background: m.role === 'user' ? 'var(--accent)' : 'var(--accent-soft)',
                    color: m.role === 'user' ? 'var(--on-accent)' : 'var(--text)',
                  }}>
                    {displayContent(m, i)}
                    {busy && i === messages.length - 1 && m.role === 'assistant' && <span style={{ opacity: 0.6 }}>▍</span>}
                  </div>
                ))}
                {error && <div role="alert" style={{ color: '#dc2626', fontSize: '0.88rem' }}>{error}</div>}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                }}
                style={{ display: 'flex', gap: 8, padding: '0.7rem 1rem', borderTop: '1px solid var(--line)' }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('askai.placeholder')}
                  aria-label={t('askai.placeholder')}
                  style={{ flex: 1, padding: '0.55rem 0.9rem', borderRadius: 10, border: '1.5px solid var(--line)', background: 'var(--bg)', color: 'var(--text)', font: 'inherit' }}
                />
                {busy ? (
                  <button type="button" onClick={() => abortRef.current?.abort()} className="askai-btn"
                    style={{ border: '1.5px solid var(--line)', background: 'transparent', color: 'var(--text)', borderRadius: 999, padding: '0.45rem 0.9rem', cursor: 'pointer', font: 'inherit', fontWeight: 600 }}>
                    ⏹ {t('askai.stop')}
                  </button>
                ) : (
                  <button type="submit"
                    style={{ border: 'none', background: 'var(--accent)', color: 'var(--on-accent)', borderRadius: 999, padding: '0.45rem 0.95rem', cursor: 'pointer', font: 'inherit', fontWeight: 700 }}>
                    {t('askai.send')}
                  </button>
                )}
              </form>

              <footer style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', padding: '0.45rem 1rem', borderTop: '1px solid var(--line)', fontSize: '0.72rem', color: 'var(--muted)' }}>
                <span>{cfg.provider} · {t('askai.poweredBy')}</span>
                <button onClick={() => { forgetConfig(); setCfg(null); }}
                  style={{ border: 'none', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', font: 'inherit', fontSize: '0.72rem', textDecoration: 'underline' }}>
                  {t('askai.forget')}
                </button>
              </footer>
            </>
          )}
        </div>
      )}
      <style>{`
        .askai-pill { animation: askai-pop 0.12s ease-out; }
        .askai-pill:hover { box-shadow: var(--shadow-lg); }
        @keyframes askai-pop { from { opacity: 0; transform: translateX(-50%) translateY(3px) scale(0.95); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
        @media (prefers-reduced-motion: reduce) { .askai-pill { animation: none; } }
        @media (max-width: 640px) { .askai-drawer { inset: auto 0 0 0 !important; width: 100vw !important; height: min(75dvh, 560px) !important; border-left: none !important; border-top: 1px solid var(--line) !important; } }
      `}</style>
    </div>
  );
}

// ---- setup sheet -----------------------------------------------------------
function SetupSheet({ lang, onSaved }: { lang: Lang; onSaved: (c: LlmConfig) => void }) {
  const t = useTranslations(lang);
  const [provider, setProvider] = useState<Provider>('anthropic');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [sessionOnly, setSessionOnly] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState('');

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim() || testing) return;
    const cfg: LlmConfig = {
      provider,
      apiKey: apiKey.trim(),
      model: model.trim() || undefined,
      baseUrl: provider === 'openai' ? baseUrl.trim() || DEFAULT_OPENAI_BASE : undefined,
    };
    setTesting(true);
    setError('');
    try {
      await testKey(cfg);
      saveConfig(cfg, sessionOnly);
      onSaved(cfg);
    } catch (err) {
      const kind = err instanceof LlmError ? err.kind : 'other';
      setError(t(`askai.err.${kind}` as UIKey) + (kind === 'other' ? ` ${(err as Error).message}` : ''));
    } finally {
      setTesting(false);
    }
  };

  const keyUrl = provider === 'anthropic' ? 'https://console.anthropic.com/settings/keys' : 'https://platform.openai.com/api-keys';
  const pillStyle = (active: boolean): React.CSSProperties => ({
    border: active ? '1.5px solid var(--accent)' : '1.5px solid var(--line)',
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? 'var(--on-accent)' : 'var(--text)',
    borderRadius: 999, padding: '0.4rem 0.9rem', cursor: 'pointer', font: 'inherit', fontWeight: 600, fontSize: '0.9rem',
  });
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.55rem 0.9rem', borderRadius: 10,
    border: '1.5px solid var(--line)', background: 'var(--bg)', color: 'var(--text)', font: 'inherit',
  };

  return (
    <form onSubmit={save} style={{ padding: '1rem', overflowY: 'auto', display: 'grid', gap: '0.8rem', alignContent: 'start' }}>
      <strong>{t('askai.setup.title')}</strong>
      <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: 0 }}>{t('askai.setup.why')}</p>

      <div role="group" aria-label={t('askai.setup.provider')} style={{ display: 'flex', gap: 8 }}>
        <button type="button" style={pillStyle(provider === 'anthropic')} onClick={() => setProvider('anthropic')}>Anthropic</button>
        <button type="button" style={pillStyle(provider === 'openai')} onClick={() => setProvider('openai')}>OpenAI-compatible</button>
      </div>

      <label style={{ display: 'grid', gap: 4, fontSize: '0.85rem', fontWeight: 600 }}>
        {t('askai.setup.keyLabel')}
        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={t('askai.setup.keyPlaceholder')} autoComplete="off" style={inputStyle} />
      </label>
      <a href={keyUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem' }}>
        {t('askai.setup.getKey')} ↗
      </a>

      <button type="button" onClick={() => setAdvanced(!advanced)}
        style={{ border: 'none', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', font: 'inherit', fontSize: '0.82rem', textAlign: 'left', padding: 0 }}>
        {advanced ? '▾' : '▸'} {t('askai.setup.advanced')}
      </button>
      {advanced && (
        <>
          <label style={{ display: 'grid', gap: 4, fontSize: '0.85rem' }}>
            {t('askai.setup.model')}
            <input type="text" value={model} onChange={(e) => setModel(e.target.value)} style={inputStyle} />
          </label>
          {provider === 'openai' && (
            <label style={{ display: 'grid', gap: 4, fontSize: '0.85rem' }}>
              {t('askai.setup.baseUrl')}
              <input type="text" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder={DEFAULT_OPENAI_BASE} style={inputStyle} />
            </label>
          )}
        </>
      )}

      <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.85rem' }}>
        <input type="checkbox" checked={sessionOnly} onChange={(e) => setSessionOnly(e.target.checked)} />
        {t('askai.setup.sessionOnly')}
      </label>

      <p style={{ fontSize: '0.76rem', color: 'var(--muted)', margin: 0 }}>🔒 {t('askai.setup.security')}</p>
      {error && <p role="alert" style={{ color: '#dc2626', fontSize: '0.85rem', margin: 0 }}>{error}</p>}

      <button type="submit" disabled={!apiKey.trim() || testing}
        style={{ border: 'none', background: 'var(--accent)', color: 'var(--on-accent)', borderRadius: 999, padding: '0.55rem 1rem', cursor: 'pointer', font: 'inherit', fontWeight: 700, opacity: !apiKey.trim() || testing ? 0.6 : 1 }}>
        {testing ? t('askai.setup.testing') : t('askai.setup.save')}
      </button>
    </form>
  );
}
