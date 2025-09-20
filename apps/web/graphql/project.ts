export const PROJECTS_QUERY = `#graphql
  query Projects($take: Int, $skip: Int){
    projects(take: $take, skip: $skip){ slug title description imageUrl }
  }
`;

export const PROJECT_QUERY = `#graphql
  query Project($slug: String!){
    project(slug: $slug){ slug title description url repoUrl imageUrl }
  }
`;

export interface ProjectsData {
  projects: {
    slug: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
  }[];
}
export interface ProjectData {
  project: {
    slug: string;
    title: string;
    description?: string | null;
    url?: string | null;
    repoUrl?: string | null;
    imageUrl?: string | null;
  } | null;
}
