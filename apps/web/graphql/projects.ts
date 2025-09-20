export const PROJECT_SLUGS_QUERY = `#graphql
  query ProjectSlugs { projectSlugs }
`;

export interface ProjectSlugsData { projectSlugs: string[] }
