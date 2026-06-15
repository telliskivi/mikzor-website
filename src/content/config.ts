import { defineCollection, z } from 'astro:content';
import { CATEGORIES } from '~/lib/categories';

// NOTE: using the legacy `type: 'content'` API so `entry.slug` derives from the
// folder name and routes resolve to /posts/<folder>/. Astro 5 prints a single
// non-fatal "Duplicate id" warning under this mode; output is correct.
const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      category: z.enum(CATEGORIES),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      description: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
