// slang-decoder — two internet-language toys:
//   (a) flip one message through 1990s IRC → 2000s SMS → 2010s Twitter → 2020s TikTok
//   (b) match each emoji to the gesture-like job it does (per McCulloch).
// All content article-sourced; see slangDecoder.data.ts for the provenance notes.
import { useEffect, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { ERAS, EMOJI_FNS, type FnId } from './slangDecoder.data';
import { useReducedMotion } from './useReducedMotion';
import { useInteractiveContext } from '../../lib/page-context';
import s from './interactive.module.css';
import sd from './slangDecoder.module.css';

export default function SlangDecoder({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const reduced = useReducedMotion();

  const [tab, setTab] = useState<'eras' | 'emoji'>('eras');
  const [enhanced, setEnhanced] = useState(false);

  // (a) era flipper
  const [eraIdx, setEraIdx] = useState(0);

  // (b) emoji matcher
  const [placed, setPlaced] = useState<Partial<Record<FnId, string>>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState<FnId | null>(null);
  const [over, setOver] = useState<FnId | null>(null);

  // Entrance/flip animation is progressive enhancement, gated on reduced-motion.
  useEffect(() => {
    if (!reduced) setEnhanced(true);
  }, [reduced]);

  const era = ERAS[eraIdx];

  const matchedCount = Object.keys(placed).length;
  useInteractiveContext(
    'slang-decoder',
    lang === 'uk'
      ? tab === 'eras'
        ? `Інтерактив «Інтернет-мова», вкладка «ери»: ${era.decade} · ${era.name[lang]}.`
        : `Інтерактив «Інтернет-мова», вкладка «емоджі-матчер»: ${matchedCount}/${EMOJI_FNS.length} зіставлено.`
      : tab === 'eras'
        ? `"Internet Language" interactive, "eras" tab: ${era.decade} · ${era.name[lang]}.`
        : `"Internet Language" interactive, "emoji matcher" tab: ${matchedCount}/${EMOJI_FNS.length} matched.`,
  );

  const placedEmojis = Object.values(placed);
  const tray = EMOJI_FNS.filter((e) => !placedEmojis.includes(e.emoji));
  const allDone = Object.keys(placed).length === EMOJI_FNS.length;

  const pickEmoji = (emoji: string) => {
    setWrong(null);
    setSelected((cur) => (cur === emoji ? null : emoji));
  };

  const assign = (fn: FnId) => {
    if (placed[fn] || !selected) return;
    const item = EMOJI_FNS.find((e) => e.emoji === selected);
    if (item && item.id === fn) {
      setPlaced((p) => ({ ...p, [fn]: selected }));
      setSelected(null);
      setWrong(null);
    } else {
      setWrong(fn);
    }
  };

  const resetMatch = () => {
    setPlaced({});
    setSelected(null);
    setWrong(null);
  };

  return (
    <div className={`${sd.wrap} ${enhanced ? sd.enhanced : ''}`} data-interactive-id="slang-decoder">
      <div className={s.panel}>
        {/* top-level view switch */}
        <div className={s.row} role="group" aria-label={`${t('slangDecoder.tabEras')} / ${t('slangDecoder.tabEmoji')}`}>
          <button className={s.pill} aria-pressed={tab === 'eras'} onClick={() => setTab('eras')}>
            🕰️ {t('slangDecoder.tabEras')}
          </button>
          <button className={s.pill} aria-pressed={tab === 'emoji'} onClick={() => setTab('emoji')}>
            👋 {t('slangDecoder.tabEmoji')}
          </button>
        </div>

        {tab === 'eras' ? (
          <div>
            <p className={s.muted} style={{ fontSize: '0.9rem', margin: '0.8rem 0 0' }}>
              {t('slangDecoder.eraIntro')}
            </p>

            {/* era selector */}
            <div className={s.row} style={{ marginTop: '0.7rem' }} role="group" aria-label={t('slangDecoder.tabEras')}>
              {ERAS.map((e, i) => (
                <button
                  key={e.id}
                  className={s.pill}
                  aria-pressed={i === eraIdx}
                  onClick={() => setEraIdx(i)}
                >
                  {e.decade} · {e.name[lang]}
                </button>
              ))}
            </div>

            {/* the message, in this era's conventions */}
            <div className={sd.screen}>
              <div className={sd.eraTag}>
                <span className={sd.eraName}>{era.name[lang]}</span>
                <span className={sd.eraDecade}>{era.decade}</span>
              </div>
              {/* key forces re-mount so the flip animation replays */}
              <p key={era.id} className={sd.bubble} aria-live="polite">
                {era.text[lang]}
              </p>
              <p className={sd.note}>{era.note[lang]}</p>
            </div>
          </div>
        ) : (
          <div>
            <p className={s.muted} style={{ fontSize: '0.9rem', margin: '0.8rem 0 0' }}>
              {t('slangDecoder.emojiIntro')}
            </p>

            {/* draggable / tappable emoji tray */}
            <div className={sd.tray} role="group" aria-label={t('slangDecoder.emojiPick')}>
              {tray.length > 0 ? (
                tray.map((e) => (
                  <button
                    key={e.emoji}
                    className={sd.tile}
                    aria-pressed={selected === e.emoji}
                    aria-label={`${t('slangDecoder.selectEmoji')} ${e.emoji}`}
                    draggable
                    onDragStart={(ev) => {
                      setSelected(e.emoji);
                      ev.dataTransfer.setData('text/plain', e.emoji);
                    }}
                    onClick={() => pickEmoji(e.emoji)}
                  >
                    {e.emoji}
                  </button>
                ))
              ) : (
                <span className={sd.trayHint}>—</span>
              )}
            </div>
            <p className={s.muted} style={{ fontSize: '0.82rem', margin: '0 0 0.4rem' }}>
              {t('slangDecoder.emojiPick')}
            </p>

            {/* function buckets */}
            <div className={sd.buckets}>
              {EMOJI_FNS.map((f) => {
                const filled = placed[f.id];
                const isWrong = wrong === f.id;
                const isOver = over === f.id;
                const cls = [
                  sd.bucket,
                  filled ? sd.bucketFilled : '',
                  isWrong ? sd.bucketWrong : '',
                  isOver ? sd.bucketOver : '',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <button
                    key={f.id}
                    className={cls}
                    disabled={!!filled}
                    aria-label={`${t('slangDecoder.assignTo')}: ${f.label[lang]}`}
                    onClick={() => assign(f.id)}
                    onDragOver={(ev) => {
                      if (filled) return;
                      ev.preventDefault();
                      setOver(f.id);
                    }}
                    onDragLeave={() => setOver((o) => (o === f.id ? null : o))}
                    onDrop={(ev) => {
                      ev.preventDefault();
                      setOver(null);
                      assign(f.id);
                    }}
                  >
                    <span className={sd.bucketLabel}>{f.label[lang]}</span>
                    <div className={sd.bucketSlot}>{filled || ' '}</div>
                    {filled ? (
                      <p className={sd.bucketBlurb}>
                        <span className={sd.okMark}>✓ </span>
                        {f.blurb[lang]}
                      </p>
                    ) : isWrong ? (
                      <p className={sd.bucketBlurb}>{t('slangDecoder.wrong')}</p>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {allDone ? (
              <div className={sd.done} role="status">
                {t('slangDecoder.matched')}{' '}
                <button className={s.pill} onClick={resetMatch} style={{ marginLeft: '0.5rem' }}>
                  ↺ {t('slangDecoder.reset')}
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
