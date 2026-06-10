# ASK-AI.md — "Ask about this" selection chat (BYOK)

Tech & design plan for an AI explainer chat: select any text on an article page → a small "Ask AI"
popover appears → opens a chat drawer that answers questions about the selection, in the site's
language, with article context. **Bring-your-own-key (BYOK)**: the user pastes their own LLM API
token once; it lives in `localStorage` and never touches any server of ours. (Pattern: hellointerview's
in-page AI tutor — minus their backend.)

Same ground rules as everything else in this repo: static site, no backend, fully bilingual,
keyboard-accessible, honest with the user.

## 1. Constraints & key decisions

**No backend, ever.** The browser must call the LLM API directly. This decides the provider list:

- **Anthropic (primary).** Officially supports browser CORS when the request includes the
  `anthropic-dangerous-direct-browser-access: true` header. Default model `claude-haiku-4-5` —
  fast and cheap for explainer chat; model id kept in one constant for easy bumps.
- **OpenAI-compatible (secondary).** `POST /v1/chat/completions` with a user-supplied base URL —
  covers OpenAI, OpenRouter, Groq, local Ollama (`http://localhost:11434/v1`). CORS support varies
  by provider; we surface the error honestly when it fails.

**BYOK economics.** The site owner pays nothing. First use opens a setup sheet: pick provider,
paste key, optional model override. We recommend (in the UI copy) creating a **dedicated key with
a spend cap** in the provider console.

**Security posture — stated, not hidden.** A key in `localStorage` is readable by any JS on the
origin. Our exposure is small (static site, zero third-party scripts, no analytics, no CMS) but not
zero. The setup sheet says exactly this in one sentence, links the provider's key-management page,
and offers a one-click "forget my key". We never transmit the key anywhere except the provider's
API endpoint over HTTPS. Optional hardening: session-only mode (checkbox → `sessionStorage`).

## 2. UX flow

1. **Select** any text in the article body (also: interactive cards, sources panel). After
   selection ends (mouseup / selectionchange debounce 300 ms), a floating pill appears near the
   selection: `✨ Ask about this` / `✨ Запитати про це`. Esc or click-away dismisses. On touch:
   appears under the native selection handles.
2. **First time:** the pill opens the **setup sheet** (drawer): provider picker (Anthropic /
   OpenAI-compatible), key field (`type=password`, paste-friendly), optional model + base-URL
   fields behind "advanced", the one-sentence security note, save → a **test call** (1-token ping)
   validates the key before storing.
3. **Chat drawer** slides in from the right (bottom sheet on mobile), shows the selection as a
   quoted chip, plus 3 suggested questions:
   - "Explain this simply" / «Поясни простіше»
   - "Where does this word come from?" / «Звідки походить це слово?»
   - "How sure are linguists about this?" / «Наскільки впевнені в цьому лінгвісти?»
4. **Answers stream** token-by-token. Follow-up questions keep the thread. The thread persists per
   page in `sessionStorage` (survives language toggle, dies with the tab — deliberate: no chat
   hoarding). A small "✕ forget key" lives in the drawer footer next to a provider/model badge.
5. **No key / declined:** the pill still works — drawer opens with the setup sheet inline. We never
   nag; no key = no feature, everything else unaffected.

## 3. Prompting

System prompt (EN/UK variants, ~120 words): *you are the reading companion of Mova, a bilingual
site about language evolution; answer in {site language} unless asked otherwise; be concise
(≤150 words unless asked); it's fine to say "linguists aren't sure"; never invent etymologies —
flag folk-etymology lookalikes (see the myths article).*

Per-message context, truncated to a budget (~2,500 chars):
`article title + slug` → `the user's selection` → `the paragraph containing the selection`.
No full-article dumps — keeps cost ~zero and answers focused.

## 4. Architecture

```
src/lib/llm.ts                     provider-agnostic client: send(messages, opts) → async token stream
                                   adapters: anthropic (messages API + CORS header), openai-compatible
src/lib/askai-store.ts             key/provider/model in localStorage ('mova:askai:v1'),
                                   session-only variant, thread in sessionStorage
src/components/askai/AskAi.tsx     one React island: selection listener + pill + drawer + setup sheet
src/components/askai/askai.module.css
```

- Mounted once in `BaseLayout.astro` as `<AskAi client:idle lang={lang} />` — `client:idle` so it
  costs nothing on first paint. Bundle budget ≤ 25 KB gz (no SDKs — both providers are plain
  `fetch` + SSE parsing via `ReadableStream`).
- Strings → `ui.ts` under `askai.*` (EN+UK, per repo convention). No facts in code, so no sourcing
  concerns; the honesty rules live in the system prompt.
- Streaming: parse `text/event-stream` chunks manually (`data:` lines), abort via `AbortController`
  when the drawer closes.
- Errors mapped to friendly bilingual messages: 401 → "key rejected — check or re-paste it";
  429 → "rate/spend limit hit on your key"; CORS/network → "this provider blocks browser calls —
  try Anthropic or OpenRouter".

## 5. Accessibility & polish

Drawer is a focus-trapped `role="dialog"` with `aria-label`, Esc closes, focus returns to the
selection anchor. The pill is a real `<button>` reachable via keyboard (selection via keyboard
triggers it too: listen to `selectionchange`, not just mouse). `prefers-reduced-motion` → no
slide animation. Chat log is `aria-live="polite"`. Drawer respects the topic accent variables —
it should feel native to whatever article it's on.

## 6. Milestones

1. **M1 — lib + storage:** `llm.ts` (both adapters, streaming, abort), `askai-store.ts`, unit-test
   the SSE parser against recorded fixtures.
2. **M2 — setup sheet + key validation** (test ping, friendly errors, forget-key).
3. **M3 — selection pill + chat drawer** (streaming UI, suggested questions, thread persistence).
4. **M4 — polish:** mobile bottom-sheet, a11y pass, i18n review, docs blurb on the About page
   ("your key stays in your browser").

## 7. Risks & mitigations

- **Provider CORS changes** → adapter isolation; errors stay honest; Anthropic is the blessed path.
- **Key leakage anxiety** → plain-language note, spend-cap recommendation, forget-key button,
  session-only option, zero third-party JS on the site (keep it that way — this feature raises the
  stakes of ever adding analytics).
- **Hallucinated etymologies** → system prompt forbids invention + nudges users to the myths
  article; suggested questions steer toward explanation rather than trivia generation.
- **Cost surprises** → `max_tokens` cap (default 1,024), context truncation, no auto-fired
  requests — nothing is sent until the user explicitly asks.

## 8. Out of scope

Our own proxy/keys, server-side anything, chat history sync, RAG over the whole site, voice. The
feature is a reading companion, not a platform.
