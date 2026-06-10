---
id: 500-ask-ai-selection-chat
title: Build the Ask-AI selection chat (BYOK)
area: feature
component: ask-ai
article: (site-wide)
depends_on: [010-interactive-foundation]
order: 500
---

# Build the Ask-AI selection chat (BYOK)

**Goal:** select text anywhere on an article page → "Ask about this" pill → streaming chat drawer
answering with article context, powered by the **user's own** LLM API key stored in `localStorage`.

**Spec → `docs/ASK-AI.md`** (read fully: provider choices, security copy, prompting, a11y).
Conventions → `tasks/CONVENTIONS.md` (strings in `ui.ts` under `askai.*`, no hardcoded hex,
reduced-motion, single `lang` prop).

## Steps (mirror the doc's milestones)

1. `src/lib/llm.ts` — anthropic + openai-compatible adapters, SSE streaming, AbortController.
2. `src/lib/askai-store.ts` — key/provider/model storage (`mova:askai:v1`), session-only mode,
   per-page thread in `sessionStorage`.
3. `src/components/askai/AskAi.tsx` — selection pill, setup sheet (with test-ping validation,
   forget-key), chat drawer with suggested questions; mount `client:idle` in `BaseLayout.astro`.
4. i18n (`askai.*`, EN+UK), a11y (focus trap, `aria-live`, Esc, keyboard selection), mobile
   bottom-sheet.

## Acceptance

- [ ] Works end-to-end with an Anthropic key; OpenAI-compatible path works with a base URL.
- [ ] No request fires without explicit user action; key never sent anywhere but the provider.
- [ ] Invalid key / CORS / rate-limit produce friendly bilingual errors.
- [ ] Forget-key wipes storage; session-only mode honored.
- [ ] Bundle ≤ 25 KB gz; `client:idle`; Lighthouse unaffected on article pages.
- [ ] Both languages complete; focus management verified; 375px bottom-sheet verified.

## Notes

- This feature raises the bar on keeping the site free of third-party JS — see risk section in the doc.
