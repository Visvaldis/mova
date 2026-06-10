// The Journey — guided course mode (docs/JOURNEY.md): 6 chapters, checkpoints,
// localStorage progress, Grimm's-Law certificate. Orchestration of existing content.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Lang, UIKey } from '../../i18n/ui';
import { useTranslations, localizedPath } from '../../i18n/utils';
import { CHAPTERS, type Chapter } from './journey.data';
import { RULE_PACKS, applyPack } from '../../lib/soundlaws';
import questionsData from '../../data/journey-questions.json';

interface Question {
  chapter: number;
  article: string;
  q: Record<Lang, string>;
  options: Record<Lang, string>[];
  correct: number;
  why: Record<Lang, string>;
}
const QUESTIONS = (questionsData as unknown as { questions: Question[] }).questions;

const KEY = 'mova:journey:v1';
interface Progress {
  v: 1;
  visited: string[];
  passed: number[];
  startedAt?: number;
}
function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Progress;
      if (p.v === 1) return { visited: p.visited ?? [], passed: p.passed ?? [], startedAt: p.startedAt, v: 1 };
    }
  } catch {}
  return { v: 1, visited: [], passed: [] };
}
function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}

/** Article titles per slug+lang come from the page (passed in as props from Astro). */
export interface ArticleMeta {
  slug: string;
  title: string;
}

export default function Journey({ lang, articles }: { lang: Lang; articles: ArticleMeta[] }) {
  const t = useTranslations(lang);
  const titleOf = useMemo(() => new Map(articles.map((a) => [a.slug, a.title])), [articles]);
  const [progress, setProgress] = useState<Progress>({ v: 1, visited: [], passed: [] });
  const [quiz, setQuiz] = useState<{ chapter: number; picked: Question[]; at: number; answers: number[] } | null>(null);
  const [answered, setAnswered] = useState<number | null>(null);
  const [name, setName] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [certReady, setCertReady] = useState(false);

  useEffect(() => setProgress(load()), []);

  const allDone = CHAPTERS.every((c) => progress.passed.includes(c.num));

  const startQuiz = (chapter: number) => {
    const pool = QUESTIONS.filter((q) => q.chapter === chapter);
    // Shuffle answer options per question (the bank stores correct at index 0 —
    // serving them unshuffled would teach "always pick the first").
    const picked = [...pool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((q) => {
        const order = q.options.map((_, i) => i).sort(() => Math.random() - 0.5);
        return {
          ...q,
          options: order.map((i) => q.options[i]),
          correct: order.indexOf(q.correct),
        };
      });
    setQuiz({ chapter, picked, at: 0, answers: [] });
    setAnswered(null);
  };

  const answer = (i: number) => {
    if (!quiz || answered !== null) return;
    setAnswered(i);
  };

  const nextQuestion = () => {
    if (!quiz || answered === null) return;
    const answers = [...quiz.answers, answered];
    if (quiz.at + 1 < quiz.picked.length) {
      setQuiz({ ...quiz, at: quiz.at + 1, answers });
      setAnswered(null);
    } else {
      const score = answers.filter((a, idx) => a === quiz.picked[idx].correct).length;
      if (score >= 2 && !progress.passed.includes(quiz.chapter)) {
        const next = { ...progress, passed: [...progress.passed, quiz.chapter] };
        setProgress(next);
        save(next);
      }
      setQuiz({ ...quiz, at: quiz.at + 1, answers }); // at == length → results view
      setAnswered(null);
    }
  };

  const drawCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas || !name.trim()) return;
    const grimm = RULE_PACKS.find((p) => p.id === 'grimm')!;
    const grimmName = applyPack(grimm, name.trim()).output;
    const ctx = canvas.getContext('2d')!;
    const W = 1200, H = 850;
    canvas.width = W;
    canvas.height = H;
    ctx.fillStyle = '#fbfaf7';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, W - 60, H - 60);
    ctx.strokeStyle = '#0d9488';
    ctx.lineWidth = 2;
    ctx.strokeRect(44, 44, W - 88, H - 88);
    ctx.fillStyle = '#1c1626';
    ctx.textAlign = 'center';
    ctx.font = '700 30px Inter, sans-serif';
    ctx.fillText('MOVA · МОВА', W / 2, 120);
    ctx.font = '800 52px Inter, sans-serif';
    ctx.fillStyle = '#b45309';
    ctx.fillText(t('journey.cert.title'), W / 2, 210);
    ctx.fillStyle = '#1c1626';
    ctx.font = '800 64px Inter, sans-serif';
    ctx.fillText(name.trim(), W / 2, 360);
    ctx.font = '400 26px Inter, sans-serif';
    ctx.fillStyle = '#645c70';
    ctx.fillText(t('journey.cert.subtitle'), W / 2, 420);
    ctx.font = '600 30px Inter, sans-serif';
    ctx.fillStyle = '#0d9488';
    ctx.fillText(`${t('journey.cert.grimm')} ${grimmName}`, W / 2, 510);
    ctx.font = '400 24px Inter, sans-serif';
    ctx.fillStyle = '#645c70';
    const chapters = CHAPTERS.map((c) => c.icon).join('  ');
    ctx.fillText(chapters, W / 2, 590);
    ctx.fillText(new Date().toLocaleDateString(lang === 'uk' ? 'uk-UA' : 'en-GB'), W / 2, 680);
    setCertReady(true);
  };

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `mova-certificate-${Date.now()}.png`;
    a.click();
  };

  const resetAll = () => {
    save({ v: 1, visited: [], passed: [] });
    setProgress({ v: 1, visited: [], passed: [] });
    setCertReady(false);
  };

  const chapterState = (c: Chapter) => {
    const read = c.slugs.filter((s) => progress.visited.includes(s)).length;
    const unlocked = read === c.slugs.length;
    const passed = progress.passed.includes(c.num);
    return { read, unlocked, passed };
  };

  return (
    <div className="toy" data-journey>
      {CHAPTERS.map((c) => {
        const { read, unlocked, passed } = chapterState(c);
        const pct = Math.round(((read + (passed ? 1 : 0)) / (c.slugs.length + 1)) * 100);
        return (
          <section key={c.num} className="stage-card" style={{ marginBottom: '0.8rem', borderLeftColor: passed ? '#15803d' : 'var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
              <strong style={{ fontSize: '1.05rem' }}>
                {c.icon} {t('journey.chapter')} {c.num} · {c.title[lang]}
              </strong>
              <span className="muted" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                {passed ? `✅ ${t('journey.passed')}` : `${pct}%`}
              </span>
            </div>

            <div style={{ marginTop: 8 }}>
              <span className="muted" style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>{t('journey.articles')}: </span>
              {c.slugs.map((slug, i) => (
                <span key={slug}>
                  {i > 0 && ' · '}
                  <a href={localizedPath(lang, slug)} style={{ fontSize: '0.92rem' }}>
                    {progress.visited.includes(slug) ? '✓ ' : ''}{titleOf.get(slug) ?? slug}
                  </a>
                </span>
              ))}
            </div>
            <div style={{ marginTop: 4 }}>
              <span className="muted" style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>{t('journey.toy')}: </span>
              <a href={localizedPath(lang, 'playground', c.toy)} style={{ fontSize: '0.92rem' }}>
                {t(`pg.${c.toy === 'babel-daily' ? 'babel' : c.toy === 'sound-shift-sandbox' ? 'sss' : c.toy === 'stratigraph' ? 'str' : c.toy === 'word-atlas' ? 'atlas' : c.toy === 'word-time-machine' ? 'wtm' : 'clf'}.title` as UIKey)}
              </a>
            </div>

            <div style={{ marginTop: 10 }}>
              {quiz?.chapter === c.num ? (
                quiz.at < quiz.picked.length ? (
                  <div aria-live="polite">
                    <div className="muted" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                      {t('journey.question')} {quiz.at + 1} {t('journey.of')} {quiz.picked.length} ·{' '}
                      <a href={localizedPath(lang, quiz.picked[quiz.at].article)} style={{ fontWeight: 400 }}>
                        {titleOf.get(quiz.picked[quiz.at].article)}
                      </a>
                    </div>
                    <p style={{ fontWeight: 600, margin: '6px 0' }}>{quiz.picked[quiz.at].q[lang]}</p>
                    <div style={{ display: 'grid', gap: 6 }}>
                      {quiz.picked[quiz.at].options.map((opt, i) => {
                        const isCorrect = i === quiz.picked[quiz.at].correct;
                        const chosen = answered === i;
                        return (
                          <button key={i} className="pill" onClick={() => answer(i)}
                            style={{
                              textAlign: 'left', justifyContent: 'flex-start',
                              borderColor: answered === null ? undefined : isCorrect ? '#15803d' : chosen ? '#dc2626' : undefined,
                              background: answered !== null && isCorrect ? 'color-mix(in srgb, #15803d 15%, transparent)' : undefined,
                            }}>
                            {opt[lang]}
                          </button>
                        );
                      })}
                    </div>
                    {answered !== null && (
                      <div style={{ marginTop: 8 }}>
                        <p className="muted" style={{ fontSize: '0.9rem', margin: 0 }}>{quiz.picked[quiz.at].why[lang]}</p>
                        <button className="pill active" onClick={nextQuestion} style={{ marginTop: 8 }}>
                          {quiz.at + 1 < quiz.picked.length ? t('journey.next') : t('journey.finish')} →
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div aria-live="polite">
                    <p style={{ fontWeight: 700 }}>
                      {t('journey.scored')}{' '}
                      {quiz.answers.filter((a, i) => a === quiz.picked[i].correct).length} / {quiz.picked.length}
                      {progress.passed.includes(c.num) ? ' 🎉' : ''}
                    </p>
                    {!progress.passed.includes(c.num) && (
                      <button className="pill" onClick={() => startQuiz(c.num)}>↺ {t('journey.retry')}</button>
                    )}
                  </div>
                )
              ) : passed ? null : unlocked ? (
                <button className="pill active" onClick={() => startQuiz(c.num)}>
                  🚩 {t('journey.start')}
                </button>
              ) : (
                <span className="muted" style={{ fontSize: '0.85rem' }}>
                  🔒 {t('journey.checkpointLocked')} ({read}/{c.slugs.length} {t('journey.visited')})
                </span>
              )}
            </div>
          </section>
        );
      })}

      <p className="muted" style={{ fontSize: '0.82rem' }}>{t('journey.passNote')}</p>

      {allDone && (
        <section className="stage-card" style={{ borderLeftColor: '#15803d', marginTop: '1rem' }}>
          <strong style={{ fontSize: '1.15rem' }}>🏆 {t('journey.done.title')}</strong>
          <p className="muted" style={{ fontSize: '0.95rem' }}>{t('journey.done.body')}</p>
          <div className="row" style={{ marginTop: 8 }}>
            <input
              type="text" value={name} maxLength={40}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('journey.cert.name')} aria-label={t('journey.cert.name')}
              style={{ flex: '1 1 12rem', padding: '0.55rem 0.9rem', borderRadius: 10, border: '1.5px solid var(--line)', background: 'var(--bg)', color: 'var(--text)', font: 'inherit' }}
            />
            <button className="pill active" onClick={drawCertificate} disabled={!name.trim()}>
              📜 {t('journey.cert.make')}
            </button>
            {certReady && (
              <button className="pill" onClick={downloadCertificate}>⤓ {t('journey.cert.download')}</button>
            )}
          </div>
          <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', marginTop: 10, borderRadius: 10, display: certReady ? 'block' : 'none' }} />
          <p className="muted" style={{ fontSize: '0.75rem', marginTop: 6 }}>{t('journey.cert.note')}</p>
        </section>
      )}

      <button onClick={resetAll}
        style={{ marginTop: '1rem', border: 'none', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', font: 'inherit', fontSize: '0.78rem', textDecoration: 'underline', padding: 0 }}>
        {t('journey.reset')}
      </button>
    </div>
  );
}
