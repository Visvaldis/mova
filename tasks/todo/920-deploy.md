---
id: 920-deploy
title: Deploy to GitHub Pages (one-time setup)
area: ship
component:
article:
depends_on: []
order: 920
---

# Deploy to GitHub Pages

**Goal:** get the site live. Mostly **Seva's manual actions** — an agent can prep and verify but
can't click GitHub settings.

**Context:** workflow → `.github/workflows/deploy.yml` (Astro → Pages) · config →
`astro.config.mjs` (`site` + `base: '/mova'`, `trailingSlash: 'always'`) · remote →
`git@github.com:Visvaldis/mova.git`.

## Steps (Seva)

1. `git push -u origin main`.
2. Repo **Settings → Pages → Source = "GitHub Actions"**.
3. If the default branch isn't `main`, update the trigger in `.github/workflows/deploy.yml`.
4. Watch the Actions run; open the published URL and click through EN/UK + a couple of articles.

## Acceptance

- [ ] CI build passes; site reachable at the Pages URL.
- [ ] Internal links resolve under the `/mova/` base; language toggle works live.

## Notes

- Re-runnable: every push to `main` redeploys. Not really "done" so much as "live" — keep at the
  bottom of the queue and run when ready.
