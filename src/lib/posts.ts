import { getCollection, type CollectionEntry } from 'astro:content';
import type { Category } from '~/lib/categories';

export type Post = CollectionEntry<'posts'>;

// Single helper every route uses. Drafts are visible in dev, hidden in prod.
export async function getPublishedPosts(): Promise<Post[]> {
  const all = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  return all.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export async function getPostsByCategory(category: Category): Promise<Post[]> {
  const all = await getPublishedPosts();
  return all.filter((p) => p.data.category === category);
}
