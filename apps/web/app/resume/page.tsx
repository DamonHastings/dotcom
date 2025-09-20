import { RESUME_QUERY, ResumeData } from '../../graphql/resume';
import { gqlRequest } from '../../lib/graphql-client';

// TEMP: seeded user is first user; backend exposes no listing yet. We'll call with a fixed user id override via ENV if present.
const USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID || 'seed-user-placeholder';

function formatDate(iso?: string | null) {
  if (!iso) return 'Present';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}

export default async function ResumePage() {
  let data: ResumeData | null = null;
  let error: string | null = null;
  try {
    data = await gqlRequest<ResumeData>(RESUME_QUERY, { userId: USER_ID });
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Resume</h1>
        <p className="text-red-600 text-sm">Failed to load: {error}</p>
      </div>
    );
  }
  if (!data) return null;

  const groupedSkills = data.skills.reduce<
    Record<string, { name: string; proficiency: string; note?: string | null }[]>
  >((acc, s) => {
    const cat = s.skill.category;
    acc[cat] = acc[cat] || [];
    acc[cat].push({ name: s.skill.name, proficiency: s.skill.proficiency, note: s.note });
    return acc;
  }, {});

  return (
    <section className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Resume</h1>
        <p className="text-sm text-gray-600">Auto-fetched from the backend domain models.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-10">
          <section>
            <h2 className="text-xl font-semibold mb-4">Experience</h2>
            <ul className="space-y-6">
              {data.experiences.map((exp, idx) => (
                <li key={idx} className="border rounded p-4 bg-white shadow-sm">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="font-semibold text-lg">{exp.role}</h3>
                    <span className="text-gray-500">@ {exp.company}</span>
                    <span className="ml-auto text-xs text-gray-400">
                      {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
                  {exp.summary && (
                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{exp.summary}</p>
                  )}
                  {exp.highlights.length > 0 && (
                    <ul className="mt-3 list-disc pl-5 text-sm space-y-1">
                      {exp.highlights
                        .sort((a, b) => a.order - b.order)
                        .map((h) => (
                          <li key={h.order}>{h.text}</li>
                        ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            <ul className="space-y-6">
              {data.education.map((ed, idx) => (
                <li key={idx} className="border rounded p-4 bg-white shadow-sm">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="font-medium">{ed.institution}</h3>
                    <span className="text-xs text-gray-400 ml-auto">
                      {formatDate(ed.startDate)} – {formatDate(ed.endDate)}
                    </span>
                  </div>
                  {(ed.degree || ed.field) && (
                    <p className="text-sm text-gray-600">
                      {[ed.degree, ed.field].filter(Boolean).join(' • ')}
                    </p>
                  )}
                  {ed.honors && <p className="text-xs text-amber-600 mt-1">Honors: {ed.honors}</p>}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <aside className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <div className="space-y-4">
              {Object.entries(groupedSkills)
                .sort()
                .map(([cat, items]) => (
                  <div key={cat}>
                    <h3 className="text-sm uppercase tracking-wide text-gray-500 font-medium">
                      {cat}
                    </h3>
                    <ul className="flex flex-wrap gap-2 mt-1">
                      {items
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((s) => (
                          <li
                            key={s.name}
                            className="text-xs bg-gray-100 rounded px-2 py-1 border border-gray-200"
                          >
                            {s.name}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
