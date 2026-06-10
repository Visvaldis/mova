// Ask-AI selection chat (docs/ASK-AI.md): select text → pill → chat drawer.
// BYOK: the user's own key, stored client-side, sent only to the provider.
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lang, UIKey } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { stream, testKey, LlmError, DEFAULT_OPENAI_BASE, type ChatMessage, type LlmConfig, type Provider } from '../../lib/llm';
import { loadConfig, saveConfig, forgetConfig, loadThread, saveThread } from '../../lib/askai-store';

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
    setMessages(loadThread());
  }, []);

  // ---- selection pill ----------------------------------------------------
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onSelection = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
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
        setPill({
          x: Math.min(Math.max(rect.left + rect.width / 2, 80), window.innerWidth - 80),
          y: rect.bottom + window.scrollY + 8,
        });
      }, 300);
    };
    document.addEventListener('selectionchange', onSelection);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('selectionchange', onSelection);
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
    (anchorRef.current as HTMLElement | null)?.focus?.();
  }, []);

  const ask = useCallback(
    async (question: string) => {
      if (!cfg || !sel || busy || !question.trim()) return;
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
        saveThread([...next, { role: 'assistant', content: acc }]);
      } catch (e) {
        const kind = e instanceof LlmError ? e.kind : 'other';
        setError(t(`askai.err.${kind}` as UIKey) + (kind === 'other' ? ` ${(e as Error).message}` : ''));
        setMessages(next);
      } finally {
        setBusy(false);
      }
    },
    [cfg, sel, busy, messages, lang, t],
  );

  return (
    <div data-askai>
      {pill && sel && !open && (
        <button
          onClick={() => {
            setOpen(true);
            setPill(null);
          }}
          style={{
            position: 'absolute', left: pill.x, top: pill.y, transform: 'translateX(-50%)',
            zIndex: 90, border: 'none', borderRadius: 999, cursor: 'pointer',
            background: 'var(--accent)', color: 'var(--on-accent)',
            padding: '0.45rem 0.95rem', fontWeight: 700, fontSize: '0.88rem',
            boxShadow: 'var(--shadow-lg)', font: 'inherit',
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
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', borderBottom: '1px solid var(--line)' }}>
            <strong>💬 {t('askai.title')}</strong>
            <button onClick={close} aria-label={t('askai.close')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--muted)' }}>
              ✕
            </button>
          </header>

          {!cfg ? (
            <SetupSheet lang={lang} onSaved={(c) => setCfg(c)} />
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
                    {i === 0 && m.role === 'user' ? m.content.split('\n\n').slice(-1)[0] : m.content}
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
      <style>{`@media (max-width: 640px) { .askai-drawer { inset: auto 0 0 0 !important; width: 100vw !important; height: min(75dvh, 560px) !important; border-left: none !important; border-top: 1px solid var(--line) !important; } }`}</style>
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
