import { PROJECTS_QUERY, ProjectsData } from '../../graphql/project';
import { gqlRequest } from '../../lib/graphql-client';

export default async function ProjectsPage() {
  let data: ProjectsData | null = null;
  let error: string | null = null;
  try {
    data = await gqlRequest<ProjectsData>(PROJECTS_QUERY, { take: 50 });
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      {error && <p className="text-sm text-red-600">Failed to load: {error}</p>}
      {!error && (!data || data.projects.length === 0) && (
        <p className="text-sm text-gray-600">No projects yet.</p>
      )}
      <ul className="grid md:grid-cols-2 gap-6">
        {data?.projects.map((p) => (
          <li
            key={p.slug}
            className="border rounded p-4 bg-white shadow-sm hover:shadow transition"
          >
            <a href={`/projects/${p.slug}`} className="block">
              <h2 className="font-semibold">{p.title}</h2>
              {p.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-3">{p.description}</p>
              )}
              <p className="text-[10px] uppercase tracking-wide text-gray-400 mt-2">
                View details →
              </p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
