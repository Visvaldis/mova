// writing-detective — definition lab · artifact explorer · claims quiz.
// Interactive for: who-wrote-first (topic: writing).

import { useState } from 'react';
import type { Lang, UIKey } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import {
  CANDIDATES,
  ARTIFACTS,
  CLAIMS,
  type Candidate,
  type Artifact,
  type ArtifactStatus,
  type ClaimAnswer,
} from './writingDetective.data';
import { useInteractiveContext } from '../../lib/page-context';
import s from './interactive.module.css';
import c from './WritingDetective.module.css';

type Tab = 'definition' | 'artifacts' | 'claims';
type T = (key: Parameters<ReturnType<typeof useTranslations>>[0]) => string;

export default function WritingDetective({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [tab, setTab] = useState<Tab>('definition');

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'definition', icon: '🔬', label: t('writingDetective.tabDefinition') },
    { id: 'artifacts', icon: '🏺', label: t('writingDetective.tabArtifacts') },
    { id: 'claims', icon: '❓', label: t('writingDetective.tabClaims') },
  ];

  return (
    <div className={s.panel}>
      <div className={c.tabs} role="tablist" aria-label={t('writingDetective.tabsAria')}>
        {tabs.map((tb) => (
          <button
            key={tb.id}
            role="tab"
            aria-selected={tab === tb.id}
            className={s.pill}
            data-active={tab === tb.id}
            onClick={() => setTab(tb.id)}
          >
            <span aria-hidden="true">{tb.icon}</span> {tb.label}
          </button>
        ))}
      </div>

      {tab === 'definition' && <DefinitionLab lang={lang} t={t} />}
      {tab === 'artifacts' && <ArtifactExplorer lang={lang} t={t} />}
      {tab === 'claims' && <ClaimsQuiz lang={lang} t={t} />}
    </div>
  );
}

/* ── Definition lab ───────────────────────────────────────────────── */

function DefinitionLab({ lang, t }: { lang: Lang; t: T }) {
  const [any, setAny] = useState(true);
  const [language, setLanguage] = useState(false);
  const [phonetic, setPhonetic] = useState(false);

  // Stricter criteria are subsets: phonetic ⊂ language ⊂ any
  const handleAny = (v: boolean) => {
    setAny(v);
    if (!v) { setLanguage(false); setPhonetic(false); }
  };
  const handleLanguage = (v: boolean) => {
    setLanguage(v);
    if (v) setAny(true);
    if (!v) setPhonetic(false);
  };
  const handlePhonetic = (v: boolean) => {
    setPhonetic(v);
    if (v) { setAny(true); setLanguage(true); }
  };

  const passes = (cand: Candidate) => {
    if (phonetic) return cand.phonetic;
    if (language) return cand.language;
    if (any) return cand.any;
    return false;
  };

  const matching = CANDIDATES.filter(passes);
  const first = matching.length > 0 ? matching[0] : null;

  const criteriaLabel = phonetic
    ? t('writingDetective.defPhonetic')
    : language
      ? t('writingDetective.defLanguage')
      : t('writingDetective.defAny');

  useInteractiveContext(
    'writing-detective',
    lang === 'uk'
      ? `Інтерактив «Детектив письма», вкладка «Лабораторія визначень». Критерій: ${criteriaLabel}. ${matching.length} кандидатів відповідають. Перший: ${first ? first.name.uk : '(немає)'}.`
      : `"Writing Detective" interactive, "Definition Lab" tab. Criterion: ${criteriaLabel}. ${matching.length} candidates match. First: ${first ? first.name.en : '(none)'}.`,
  );

  return (
    <div>
      <p className={c.intro}>{t('writingDetective.defIntro')}</p>

      <div className={c.toggles}>
        <label className={c.toggle}>
          <input type="checkbox" checked={any} onChange={(e) => handleAny(e.target.checked)} />
          {t('writingDetective.defAny')}
        </label>
        <label className={c.toggle}>
          <input type="checkbox" checked={language} onChange={(e) => handleLanguage(e.target.checked)} />
          {t('writingDetective.defLanguage')}
        </label>
        <label className={c.toggle}>
          <input type="checkbox" checked={phonetic} onChange={(e) => handlePhonetic(e.target.checked)} />
          {t('writingDetective.defPhonetic')}
        </label>
      </div>

      <div className={c.timeline}>
        {CANDIDATES.map((cand) => {
          const match = passes(cand);
          return (
            <div
              key={cand.id}
              className={`${c.timelineItem} ${match ? '' : c.timelineFaded}`}
            >
              <span className={c.timelineName}>
                {cand.name[lang]}
                {match && first?.id === cand.id && (
                  <span className={c.firstBadge}>{t('writingDetective.defFirst')}</span>
                )}
              </span>
              <div className={c.timelineMeta}>
                {cand.dateLabel[lang]} · {cand.location[lang]}
              </div>
              <div className={c.timelineNote}>{cand.note[lang]}</div>
            </div>
          );
        })}
      </div>

      {!any && !language && !phonetic && (
        <p className={c.defNote}>{t('writingDetective.defNone')}</p>
      )}
      <p className={c.defNote}>{t('writingDetective.defNote')}</p>
    </div>
  );
}

/* ── Artifact explorer ────────────────────────────────────────────── */

function ArtifactExplorer({ lang, t }: { lang: Lang; t: T }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const statusClass = (status: ArtifactStatus) =>
    status === 'consensus' ? c.statusConsensus
      : status === 'debated' ? c.statusDebated
        : c.statusRejected;

  const statusLabel = (status: ArtifactStatus) =>
    t(`writingDetective.artStatus.${status}` as UIKey);

  useInteractiveContext(
    'writing-detective',
    lang === 'uk'
      ? `Інтерактив «Детектив письма», вкладка «Дослідник артефактів». ${openId ? `Відкрито: ${ARTIFACTS.find((a) => a.id === openId)?.name.uk}` : 'Жоден не відкрито'}.`
      : `"Writing Detective" interactive, "Artifact Explorer" tab. ${openId ? `Open: ${ARTIFACTS.find((a) => a.id === openId)?.name.en}` : 'None open'}.`,
  );

  return (
    <div>
      <p className={c.intro}>{t('writingDetective.artIntro')}</p>

      <div className={c.artifacts}>
        {ARTIFACTS.map((art) => {
          const isOpen = openId === art.id;
          return (
            <div
              key={art.id}
              className={c.artifact}
              data-open={isOpen}
              onClick={() => setOpenId(isOpen ? null : art.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenId(isOpen ? null : art.id); } }}
              tabIndex={0}
              role="button"
              aria-expanded={isOpen}
            >
              <div className={c.artifactHead}>
                <div>
                  <div className={c.artifactName}>{art.name[lang]}</div>
                  <div className={c.artifactDate}>
                    {art.date[lang]} · {art.location[lang]}
                  </div>
                </div>
                <span className={`${c.statusBadge} ${statusClass(art.status)}`}>
                  {statusLabel(art.status)}
                </span>
              </div>
              <div className={c.artifactDesc}>{art.desc[lang]}</div>
              {isOpen && <div className={c.artifactDetail}>{art.detail[lang]}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Claims quiz ──────────────────────────────────────────────────── */

function ClaimsQuiz({ lang, t }: { lang: Lang; t: T }) {
  const [answers, setAnswers] = useState<Record<string, ClaimAnswer>>({});

  const pick = (id: string, value: ClaimAnswer) => {
    if (answers[id]) return; // already answered
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const answered = Object.keys(answers).length;
  const correct = CLAIMS.filter((cl) => answers[cl.id] === cl.answer).length;

  useInteractiveContext(
    'writing-detective',
    lang === 'uk'
      ? `Інтерактив «Детектив письма», вкладка «Тест тверджень». Відповіді: ${answered}/${CLAIMS.length}, правильних: ${correct}.`
      : `"Writing Detective" interactive, "Claims Quiz" tab. Answered: ${answered}/${CLAIMS.length}, correct: ${correct}.`,
  );

  const options: ClaimAnswer[] = ['true', 'false', 'debated'];

  return (
    <div>
      <p className={c.intro}>{t('writingDetective.claimIntro')}</p>

      {CLAIMS.map((cl) => {
        const chosen = answers[cl.id];
        const isCorrect = chosen === cl.answer;
        return (
          <div key={cl.id} className={c.claimCard}>
            <p className={c.claimStatement}>{cl.statement[lang]}</p>
            <div className={c.claimButtons}>
              {options.map((opt) => (
                <button
                  key={opt}
                  className={c.claimBtn}
                  data-chosen={chosen === opt}
                  disabled={!!chosen}
                  onClick={() => pick(cl.id, opt)}
                >
                  {t(`writingDetective.claim${opt.charAt(0).toUpperCase() + opt.slice(1)}` as UIKey)}
                </button>
              ))}
            </div>
            {chosen && (
              <p className={c.claimResult}>
                <span className={isCorrect ? c.claimCorrect : c.claimWrong}>
                  {isCorrect ? t('writingDetective.claimCorrect') : t('writingDetective.claimWrong')}
                </span>{' '}
                {cl.explanation[lang]}
              </p>
            )}
          </div>
        );
      })}

      {answered > 0 && (
        <div className={c.scoreBar}>
          <span>
            {t('writingDetective.claimScore')}: {correct} {t('writingDetective.claimOf')} {CLAIMS.length}
          </span>
          {answered === CLAIMS.length && (
            <button
              className={s.pill}
              onClick={() => setAnswers({})}
            >
              {t('writingDetective.claimReset')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
