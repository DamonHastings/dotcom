import { BLOG_POSTS_QUERY, BlogPostsData } from '../../graphql/blog';
import { gqlRequest } from '../../lib/graphql-client';

export default async function BlogPage() {
  let data: BlogPostsData | null = null;
  let error: string | null = null;
  try {
    data = await gqlRequest<BlogPostsData>(BLOG_POSTS_QUERY, { take: 50 });
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      {error && <p className="text-sm text-red-600">Failed to load: {error}</p>}
      {!error && (!data || data.blogPosts.length === 0) && (
        <p className="text-sm text-gray-600">No posts yet.</p>
      )}
      <ul className="space-y-4">
        {data?.blogPosts.map((p) => (
          <li
            key={p.slug}
            className="border rounded p-4 bg-white shadow-sm hover:shadow transition"
          >
            <a href={`/blog/${p.slug}`} className="block">
              <h2 className="font-semibold">{p.title}</h2>
              {p.excerpt && <p className="text-xs text-gray-500 mt-1 line-clamp-3">{p.excerpt}</p>}
              <p className="text-[10px] uppercase tracking-wide text-gray-400 mt-2">Read post →</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
