import { useMemo, useRef, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import {
  WORDS,
  DOUBLETS,
  LITERAL_SENTENCE,
  type ArtKey,
  type WordEntry,
} from './wordXray.data';
import styles from './WordXray.module.css';

type Tab = 'xray' | 'sentence' | 'doublets';

/* Minimal line-drawing illustrations. Stroke uses currentColor (set to the
   topic accent by .art), so they recolor for light/dark automatically. */
function Art({ kind, className }: { kind: ArtKey; className: string }) {
  const common = {
    viewBox: '0 0 64 64',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  };
  switch (kind) {
    case 'mouse':
      return (
        <svg {...common}>
          <circle cx="26" cy="38" r="14" />
          <circle cx="16" cy="26" r="7" />
          <circle cx="22" cy="30" r="1.6" fill="currentColor" />
          <path d="M40 40c10 2 14-4 14-10" />
        </svg>
      );
    case 'star':
      return (
        <svg {...common}>
          <path d="M32 8l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" />
        </svg>
      );
    case 'bread':
      return (
        <svg {...common}>
          <path d="M10 40c0-12 9-18 22-18s22 6 22 18v2H10z" />
          <path d="M22 30l4 6M32 28l4 6M42 30l4 6" />
        </svg>
      );
    case 'dog':
      return (
        <svg {...common}>
          <path d="M18 18l6 10M46 18l-6 10" />
          <path d="M20 26c-4 8-2 22 12 22s16-14 12-22" />
          <circle cx="26" cy="34" r="1.6" fill="currentColor" />
          <circle cx="38" cy="34" r="1.6" fill="currentColor" />
          <path d="M28 42l4 4 4-4" />
        </svg>
      );
    case 'toga':
      return (
        <svg {...common}>
          <circle cx="32" cy="16" r="7" />
          <path d="M18 54l14-26 14 26z" />
        </svg>
      );
    case 'line':
      return (
        <svg {...common}>
          <path d="M12 12v40M52 12v40" strokeDasharray="3 5" />
          <path d="M20 32h24M38 26l6 6-6 6" />
        </svg>
      );
    case 'eye':
      return (
        <svg {...common}>
          <path d="M8 32c6-10 16-15 24-15s18 5 24 15c-6 10-16 15-24 15S14 42 8 32z" />
          <circle cx="32" cy="32" r="7" />
          <circle cx="32" cy="32" r="1.8" fill="currentColor" />
        </svg>
      );
    case 'honey':
      return (
        <svg {...common}>
          <path d="M24 12l8 5 8-5M24 22l8 5 8-5M16 17l8 5 8-5M16 27l8 5 8-5M32 17l8 5 8-5" />
          <path d="M24 32v16M40 32v16M16 42l8 5M40 47l8-5" />
        </svg>
      );
  }
}

export default function WordXray({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [tab, setTab] = useState<Tab>('xray');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'xray', label: t('wordXray.tabXray') },
    { id: 'sentence', label: t('wordXray.tabSentence') },
    { id: 'doublets', label: t('wordXray.tabDoublets') },
  ];

  return (
    <div className={styles.root}>
      <div className={styles.tabs} role="group" aria-label={tabs.map((tb) => tb.label).join(' / ')}>
        {tabs.map((tb) => (
          <button
            key={tb.id}
            aria-pressed={tab === tb.id}
            className={`${styles.tab} ${tab === tb.id ? styles.tabActive : ''}`}
            onClick={() => setTab(tb.id)}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {tab === 'xray' && <XrayMode lang={lang} t={t} />}
      {tab === 'sentence' && <SentenceMode lang={lang} t={t} />}
      {tab === 'doublets' && <DoubletMode lang={lang} t={t} />}
    </div>
  );
}

/* ── Mode 1: x-ray cards ──────────────────────────────────────────── */
function XrayMode({ lang, t }: { lang: Lang; t: (k: any) => string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = WORDS.find((w) => w.id === openId) ?? null;

  return (
    <>
      <p className={styles.intro}>{t('wordXray.xrayIntro')}</p>
      <div className={styles.grid}>
        {WORDS.map((w) => (
          <button
            key={w.id}
            className={`${styles.card} ${openId === w.id ? styles.cardActive : ''}`}
            aria-pressed={openId === w.id}
            aria-label={`${t('wordXray.xrayOpen')}: ${w.word}`}
            onClick={() => setOpenId(openId === w.id ? null : w.id)}
          >
            {w.word}
            <span className={styles.cardHint}>{t('wordXray.xrayOpen')}</span>
          </button>
        ))}
      </div>

      {open && <XrayPanel key={open.id} word={open} lang={lang} t={t} onClose={() => setOpenId(null)} />}
    </>
  );
}

function XrayPanel({
  word,
  lang,
  t,
  onClose,
}: {
  word: WordEntry;
  lang: Lang;
  t: (k: any) => string;
  onClose: () => void;
}) {
  return (
    <div className={styles.panel}>
      <Art kind={word.art} className={styles.art} />
      <div className={styles.panelBody}>
        <div className={styles.panelHead}>
          <span className={styles.headword}>{word.word}</span>
          <span className={styles.originTag}>{word.origin[lang]}</span>
        </div>

        <div className={styles.morphemes} aria-label={t('wordXray.inside')}>
          {word.morphemes.map((m, i) => (
            <span
              key={m.form}
              className={styles.morpheme}
              style={{ ['--i' as any]: i }}
            >
              <span className={styles.morphForm}>{m.form}</span>
              <span className={styles.morphGloss}>{m.gloss[lang]}</span>
            </span>
          ))}
        </div>

        <p className={styles.literal}>
          {t('wordXray.literally')}: <span className={styles.literalWord}>{word.literal[lang]}</span>
        </p>
        <p className={styles.story}>{word.story[lang]}</p>

        <button className={styles.close} onClick={onClose}>
          {t('wordXray.close')}
        </button>
      </div>
    </div>
  );
}

/* ── Mode 2: literal sentence ─────────────────────────────────────── */
function SentenceMode({ lang, t }: { lang: Lang; t: (k: any) => string }) {
  const tokens = LITERAL_SENTENCE[lang];
  const swapIndices = useMemo(
    () => tokens.map((tok, i) => (typeof tok === 'string' ? -1 : i)).filter((i) => i >= 0),
    [tokens],
  );
  const [on, setOn] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setOn((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <div className={styles.sentenceWrap}>
      <p className={styles.intro}>{t('wordXray.sentenceIntro')}</p>
      <p className={styles.sentence}>
        {tokens.map((tok, i) =>
          typeof tok === 'string' ? (
            <span key={i}>{tok}</span>
          ) : (
            <button
              key={i}
              className={`${styles.swap} ${on.has(i) ? styles.swapOn : ''}`}
              aria-pressed={on.has(i)}
              aria-label={`${t('wordXray.swapAria')} ${tok.surface}`}
              onClick={() => toggle(i)}
            >
              {on.has(i) ? tok.literal[lang] : tok.surface}
            </button>
          ),
        )}
      </p>
      <div className={styles.controls}>
        <button className={styles.btn} onClick={() => setOn(new Set(swapIndices))}>
          {t('wordXray.revealAll')}
        </button>
        <button className={styles.btn} onClick={() => setOn(new Set())}>
          {t('wordXray.reset')}
        </button>
      </div>
    </div>
  );
}

/* ── Mode 3: doublet matcher ──────────────────────────────────────── */
interface Tile {
  word: string;
  did: string;
}

// Deterministic initial order (SSR-stable): all first-twins, then all second-twins,
// so partners are never adjacent. The Shuffle button randomizes client-side.
const INITIAL_TILES: Tile[] = [
  ...DOUBLETS.map((d) => ({ word: d.a, did: d.id })),
  ...DOUBLETS.map((d) => ({ word: d.b, did: d.id })),
];

function DoubletMode({ lang, t }: { lang: Lang; t: (k: any) => string }) {
  const [tiles, setTiles] = useState<Tile[]>(INITIAL_TILES);
  const [selected, setSelected] = useState<number | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flashWrong = (idx: number) => {
    setWrongIdx(idx);
    if (wrongTimer.current) clearTimeout(wrongTimer.current);
    wrongTimer.current = setTimeout(() => setWrongIdx(null), 320);
  };

  const onTile = (idx: number) => {
    const tile = tiles[idx];
    if (matched.includes(tile.did)) return;

    if (selected === null) {
      setSelected(idx);
      setMsg(null);
      return;
    }
    if (selected === idx) {
      setSelected(null);
      return;
    }

    const prev = tiles[selected];
    if (prev.did === tile.did) {
      setMatched((m) => [...m, tile.did]);
      setSelected(null);
      setMsg({
        text: matched.length + 1 === DOUBLETS.length ? t('wordXray.allReunited') : t('wordXray.matched'),
        ok: true,
      });
    } else {
      flashWrong(idx);
      setSelected(null);
      setMsg({ text: t('wordXray.notTwins'), ok: false });
    }
  };

  const shuffle = () => {
    // Fisher–Yates; runs only on user click, so no SSR hydration concern.
    const next = tiles.slice();
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setTiles(next);
    setSelected(null);
    setMatched([]);
    setWrongIdx(null);
    setMsg(null);
  };

  return (
    <div className={styles.sentenceWrap}>
      <div className={styles.matcherIntro}>
        <p className={styles.intro}>{t('wordXray.doubletsIntro')}</p>
        <button className={styles.btn} onClick={shuffle}>
          {t('wordXray.shuffle')}
        </button>
      </div>

      <div className={styles.tiles}>
        {tiles.map((tile, idx) => {
          const isMatched = matched.includes(tile.did);
          const isSelected = selected === idx;
          const isWrong = wrongIdx === idx;
          return (
            <button
              key={`${tile.did}-${tile.word}`}
              className={`${styles.tile} ${isMatched ? styles.tileMatched : ''} ${
                isSelected ? styles.tileSelected : ''
              } ${isWrong ? styles.tileWrong : ''}`}
              aria-pressed={isSelected}
              disabled={isMatched}
              onClick={() => onTile(idx)}
            >
              {tile.word}
            </button>
          );
        })}
      </div>

      <p className={`${styles.feedback} ${msg ? (msg.ok ? styles.feedbackOk : styles.feedbackErr) : ''}`} aria-live="polite">
        {msg?.text ?? ''}
      </p>

      {matched.length > 0 && (
        <ul className={styles.stories}>
          {DOUBLETS.filter((d) => matched.includes(d.id)).map((d) => (
            <li key={d.id} className={styles.storyRow}>
              <span className={styles.storyPair}>
                {d.a} · {d.b}
              </span>{' '}
              — {d.origin[lang]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
