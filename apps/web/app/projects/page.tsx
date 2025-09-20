import { gqlRequest } from '../../lib/graphql-client';
import { PROJECT_SLUGS_QUERY, ProjectSlugsData } from '../../graphql/projects';

export default async function ProjectsPage() {
  let data: ProjectSlugsData | null = null;
  let error: string | null = null;
  try {
    data = await gqlRequest<ProjectSlugsData>(PROJECT_SLUGS_QUERY);
  } catch (e: any) {
    error = e.message;
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      {error && <p className="text-sm text-red-600">Failed to load: {error}</p>}
      {!error && (!data || data.projectSlugs.length === 0) && <p className="text-sm text-gray-600">No projects yet.</p>}
      <ul className="grid md:grid-cols-2 gap-6">
        {data?.projectSlugs.map(slug => (
          <li key={slug} className="border rounded p-4 bg-white shadow-sm hover:shadow transition">
            <h2 className="font-semibold">{slug}</h2>
            <p className="text-xs text-gray-500 mt-1">Case study coming soon.</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
