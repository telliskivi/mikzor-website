import rss from '@astrojs/rss';
import { getPublishedPosts } from '~/lib/posts';
import { SITE } from '~/lib/site';

export async function GET(context) {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? '',
      link: `/posts/${post.slug}/`,
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: `<language>${SITE.locale}</language>`,
  });
}
