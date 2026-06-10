import { useMemo, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import {
  TOPONYMS,
  UKRAINE_OUTLINE,
  UA_VIEW,
  uaProject,
  SLAV_HOROD,
  UKRAINA_DEBATE,
  MONTHS,
  SURNAMES,
  SURNAMES_PAYOFF,
  type Toponym,
} from './nameMap.data';
import s from './interactive.module.css';
import c from './NameMap.module.css';

type Tab = 'places' | 'months' | 'surnames';
type T = (key: Parameters<ReturnType<typeof useTranslations>>[0]) => string;

export default function NameMap({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [tab, setTab] = useState<Tab>('places');

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'places', icon: '🗺', label: t('nameMap.tabPlaces') },
    { id: 'months', icon: '🗓', label: t('nameMap.tabMonths') },
    { id: 'surnames', icon: '🪪', label: t('nameMap.tabSurnames') },
  ];

  return (
    <div className={c.root}>
      <div className={c.tabs} role="tablist" aria-label={t('nameMap.tabsAria')}>
        {tabs.map((tb) => (
          <button
            key={tb.id}
            role="tab"
            aria-selected={tab === tb.id}
            aria-pressed={tab === tb.id}
            className={`${c.tab} ${tab === tb.id ? c.tabActive : ''}`}
            onClick={() => setTab(tb.id)}
          >
            <span aria-hidden="true">{tb.icon}</span> {tb.label}
          </button>
        ))}
      </div>

      {tab === 'places' && <PlacesView lang={lang} t={t} />}
      {tab === 'months' && <MonthsView lang={lang} t={t} />}
      {tab === 'surnames' && <SurnamesView lang={lang} t={t} />}
    </div>
  );
}

/* ── Tab 1: toponyms on a schematic map of Ukraine ─────────────────────────── */
type Selection = { kind: 'pin'; id: string } | { kind: 'ukraina' } | { kind: 'slavhorod' } | null;

function PlacesView({ lang, t }: { lang: Lang; t: T }) {
  const [sel, setSel] = useState<Selection>(null);

  const outlinePath = useMemo(() => {
    const pts = UKRAINE_OUTLINE.map(([la, lo]) => uaProject(la, lo));
    return 'M ' + pts.map((p) => `${p.x} ${p.y}`).join(' L ') + ' Z';
  }, []);

  const activePin = sel?.kind === 'pin' ? sel.id : null;

  return (
    <div className={c.placesWrap}>
      <p className={c.intro}>{t('nameMap.placesIntro')}</p>

      <svg
        className={c.map}
        viewBox={`0 0 ${UA_VIEW.w} ${UA_VIEW.h}`}
        role="img"
        aria-label={t('nameMap.mapAria')}
        preserveAspectRatio="xMidYMid meet"
      >
        <path className={c.land} d={outlinePath} />
        {TOPONYMS.map((tp) => {
          const p = uaProject(tp.lat, tp.lon);
          const on = activePin === tp.id;
          return (
            <g
              key={tp.id}
              className={`${c.pin} ${on ? c.pinOn : ''}`}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={`${tp.name} — ${tp.origin[lang]}`}
              onClick={() => setSel(on ? null : { kind: 'pin', id: tp.id })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSel(on ? null : { kind: 'pin', id: tp.id });
                }
              }}
            >
              <circle className={c.pinDot} cx={p.x} cy={p.y} r={on ? 11 : 8} />
              <text className={c.pinLabel} x={p.x} y={p.y - 15} textAnchor="middle">
                {tp.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* non-geographic items: the country's own name, and a naming pattern */}
      <div className={c.chips}>
        <button
          className={`${c.chip} ${sel?.kind === 'ukraina' ? c.chipOn : ''}`}
          aria-pressed={sel?.kind === 'ukraina'}
          onClick={() => setSel(sel?.kind === 'ukraina' ? null : { kind: 'ukraina' })}
        >
          🏷 {UKRAINA_DEBATE.name}
        </button>
        <button
          className={`${c.chip} ${sel?.kind === 'slavhorod' ? c.chipOn : ''}`}
          aria-pressed={sel?.kind === 'slavhorod'}
          onClick={() => setSel(sel?.kind === 'slavhorod' ? null : { kind: 'slavhorod' })}
        >
          🏘 {SLAV_HOROD.name}
        </button>
      </div>

      <div className={s.card} role="status" aria-live="polite">
        {sel === null && <p className={c.muted}>{t('nameMap.placesHint')}</p>}
        {sel?.kind === 'pin' && <PinCard tp={TOPONYMS.find((x) => x.id === sel.id)!} lang={lang} />}
        {sel?.kind === 'slavhorod' && (
          <ToponymCard name={SLAV_HOROD.name} origin={SLAV_HOROD.origin[lang]} story={SLAV_HOROD.story[lang]} />
        )}
        {sel?.kind === 'ukraina' && <UkrainaCard lang={lang} t={t} />}
      </div>
    </div>
  );
}

function ToponymCard({ name, origin, story }: { name: string; origin: string; story: string }) {
  return (
    <div className={c.cardBody}>
      <div className={c.cardHead}>
        <span className={c.cardWord}>{name}</span>
        <span className={c.originTag}>{origin}</span>
      </div>
      <p className={c.story}>{story}</p>
    </div>
  );
}

function PinCard({ tp, lang }: { tp: Toponym; lang: Lang }) {
  return <ToponymCard name={tp.name} origin={tp.origin[lang]} story={tp.story[lang]} />;
}

function UkrainaCard({ lang, t }: { lang: Lang; t: T }) {
  return (
    <div className={c.cardBody}>
      <div className={c.cardHead}>
        <span className={c.cardWord}>{UKRAINA_DEBATE.name}</span>
        <span className={c.debateTag}>{t('nameMap.debate')}</span>
      </div>
      <div className={c.debateGrid}>
        {UKRAINA_DEBATE.views.map((v, i) => (
          <div key={i} className={c.debateView}>
            <div className={c.debateLabel}>{v.label[lang]}</div>
            <p className={c.story}>{v.text[lang]}</p>
          </div>
        ))}
      </div>
      <p className={c.debateNote}>“{UKRAINA_DEBATE.note[lang]}”</p>
    </div>
  );
}

/* ── Tab 2: the month wheel ────────────────────────────────────────────────── */
type CalMode = 'roman' | 'nature';

function MonthsView({ lang, t }: { lang: Lang; t: T }) {
  const [mode, setMode] = useState<CalMode>(lang === 'uk' ? 'nature' : 'roman');
  const [pick, setPick] = useState(0); // selected month index

  const m = MONTHS[pick];
  const gloss = mode === 'roman' ? m.enGloss : m.ukGloss;
  const centerName = mode === 'roman' ? m.en : m.uk;

  return (
    <div className={c.monthsWrap}>
      <p className={c.intro}>{t('nameMap.monthsIntro')}</p>

      <div className={c.controls}>
        <button
          className={s.pill}
          aria-pressed={mode === 'roman'}
          onClick={() => setMode('roman')}
        >
          {t('nameMap.calRoman')}
        </button>
        <button
          className={s.pill}
          aria-pressed={mode === 'nature'}
          onClick={() => setMode('nature')}
        >
          {t('nameMap.calNature')}
        </button>
      </div>

      <div className={c.wheel} role="group" aria-label={t('nameMap.wheelAria')}>
        {MONTHS.map((mo, i) => {
          const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
          const left = 50 + 42 * Math.cos(a);
          const top = 50 + 42 * Math.sin(a);
          const hasGloss = !!(mode === 'roman' ? mo.enGloss : mo.ukGloss);
          return (
            <button
              key={i}
              className={`${c.month} ${pick === i ? c.monthOn : ''}`}
              data-gloss={hasGloss ? 'yes' : 'no'}
              style={{ left: `${left}%`, top: `${top}%` }}
              aria-pressed={pick === i}
              onClick={() => setPick(i)}
            >
              {mode === 'roman' ? mo.en.slice(0, 3) : mo.uk}
            </button>
          );
        })}
        <div className={c.wheelCenter} aria-hidden="true">
          <span className={c.wheelMonth}>{centerName}</span>
          <span className={c.wheelOther}>{mode === 'roman' ? m.uk : m.en}</span>
        </div>
      </div>

      <div className={s.card} role="status" aria-live="polite">
        <div className={c.cardHead}>
          <span className={c.cardWord}>{centerName}</span>
          <span className={c.originTag}>{mode === 'roman' ? t('nameMap.calRoman') : t('nameMap.calNature')}</span>
        </div>
        {gloss ? (
          <p className={c.story}>{gloss[lang]}</p>
        ) : (
          <p className={c.muted}>{t('nameMap.monthNoGloss')}</p>
        )}
      </div>

      <p className={s.caption}>{t('nameMap.monthsCaption')}</p>
    </div>
  );
}

/* ── Tab 3: the surname matcher ────────────────────────────────────────────── */
// A fixed, deterministic shuffle of the Ukrainian column (no Math.random, which
// is unavailable in this build env and would also break hydration).
const UK_ORDER = ['miller', 'baker', 'smith'];

function SurnamesView({ lang, t }: { lang: Lang; t: T }) {
  const [selEn, setSelEn] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const ukCards = useMemo(
    () => UK_ORDER.map((id) => SURNAMES.find((p) => p.id === id)!),
    [],
  );
  const done = matched.length === SURNAMES.length;

  function pickEn(id: string) {
    if (matched.includes(id)) return;
    setSelEn(id === selEn ? null : id);
    setFeedback(null);
  }

  function pickUk(id: string) {
    if (matched.includes(id)) return;
    if (!selEn) {
      setFeedback({ ok: false, msg: t('nameMap.pickEnFirst') });
      return;
    }
    if (selEn === id) {
      const pair = SURNAMES.find((p) => p.id === id)!;
      setMatched((m) => [...m, id]);
      setSelEn(null);
      const detail = pair.open ? pair.note![lang] : pair.trade![lang];
      setFeedback({ ok: true, msg: `${t('nameMap.matched')} — ${detail}` });
    } else {
      setFeedback({ ok: false, msg: t('nameMap.notMatch') });
      setSelEn(null);
    }
  }

  function reset() {
    setSelEn(null);
    setMatched([]);
    setFeedback(null);
  }

  return (
    <div className={c.surnameWrap}>
      <p className={c.intro}>{t('nameMap.surnamesIntro')}</p>

      <div className={c.matcher}>
        <div className={c.column} aria-label={t('nameMap.colEn')}>
          <div className={c.colHead}>{t('nameMap.colEn')}</div>
          {SURNAMES.map((p) => (
            <button
              key={p.id}
              className={`${c.surn} ${selEn === p.id ? c.surnSel : ''} ${
                matched.includes(p.id) ? c.surnDone : ''
              }`}
              aria-pressed={selEn === p.id}
              disabled={matched.includes(p.id)}
              onClick={() => pickEn(p.id)}
            >
              {p.en}
              {matched.includes(p.id) && <span aria-hidden="true"> ✓</span>}
            </button>
          ))}
        </div>

        <div className={c.column} aria-label={t('nameMap.colUk')}>
          <div className={c.colHead}>{t('nameMap.colUk')}</div>
          {ukCards.map((p) => (
            <button
              key={p.id}
              className={`${c.surn} ${matched.includes(p.id) ? c.surnDone : ''} ${
                p.open ? c.surnOpen : ''
              }`}
              disabled={matched.includes(p.id)}
              onClick={() => pickUk(p.id)}
            >
              {p.uk}
              {matched.includes(p.id) && <span aria-hidden="true"> ✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className={s.card} role="status" aria-live="polite">
        {done ? (
          <p className={c.story}>🛠 {SURNAMES_PAYOFF[lang]}</p>
        ) : feedback ? (
          <p className={feedback.ok ? c.fbOk : c.fbNo}>{feedback.msg}</p>
        ) : (
          <p className={c.muted}>{t('nameMap.surnamesHint')}</p>
        )}
      </div>

      <div className={c.controls}>
        <button className={s.pill} onClick={reset}>
          ↻ {t('nameMap.reset')}
        </button>
      </div>
    </div>
  );
}
