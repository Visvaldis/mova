import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Articles live at the repo root in content/<lang>/<slug>.md (authored separately).
// generateId forces a path-based id of "<lang>/<slug>" (e.g. "en/sample-entry-one").
// Without it the loader uses the frontmatter `slug` as the id, which is identical
// across languages and would collapse the EN + UK entries into one.
const articles = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './content',
    generateId: ({ entry }) => entry.replace(/\.[^./]+$/, ''),
  }),
  schema: z.object({
    slug: z.string(),
    lang: z.enum(['en', 'uk']),
    title: z.string(),
    summary: z.string(),
    order: z.number(),
    topic: z.string(),
    readingTime: z.number(),
    interactive: z.string(),
    sources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
          note: z.string().optional(),
        })
      )
      .default([]),
  }),
});

export const collections = { articles };
