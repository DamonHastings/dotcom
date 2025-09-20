import { notFound } from 'next/navigation';

import { PROJECT_QUERY, ProjectData } from '../../../graphql/project';
import { gqlRequest } from '../../../lib/graphql-client';

interface Props {
  params: { slug: string };
}

export default async function ProjectDetailPage({ params }: Props) {
  const data = await gqlRequest<ProjectData>(PROJECT_QUERY, { slug: params.slug });
  if (!data.project) return notFound();
  const p = data.project;
  return (
    <article className="space-y-4 max-w-3xl">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{p.title}</h1>
        {p.description && <p className="text-gray-600">{p.description}</p>}
      </header>
      <div className="space-y-3 text-sm text-gray-700">
        {p.url && (
          <p>
            Live:{' '}
            <a className="text-blue-600 underline" href={p.url}>
              {p.url}
            </a>
          </p>
        )}
        {p.repoUrl && (
          <p>
            Repo:{' '}
            <a className="text-blue-600 underline" href={p.repoUrl}>
              {p.repoUrl}
            </a>
          </p>
        )}
      </div>
      <p className="text-xs text-gray-400">Additional case study content forthcoming.</p>
    </article>
  );
}
