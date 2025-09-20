import { notFound } from 'next/navigation';

import { BLOG_POST_QUERY, BlogPostData } from '../../../graphql/blog';
import { gqlRequest } from '../../../lib/graphql-client';

interface Props {
  params: { slug: string };
}

export default async function BlogPostPage({ params }: Props) {
  const data = await gqlRequest<BlogPostData>(BLOG_POST_QUERY, { slug: params.slug });
  if (!data.blogPost) return notFound();
  const b = data.blogPost;
  return (
    <article className="prose max-w-3xl">
      <h1>{b.title}</h1>
      <div className="text-xs text-gray-500 mb-4">
        {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : 'Draft'}
      </div>
      <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 border rounded">{b.content}</pre>
      <p className="text-xs text-gray-400 mt-6">Render markdown/MDX coming soon.</p>
    </article>
  );
}
