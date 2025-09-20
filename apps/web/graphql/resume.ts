export const RESUME_QUERY = `#graphql
  query Resume($userId: String!) {
    skills(userId: $userId) {
      order
      note
      skill { name category proficiency }
    }
    experiences(userId: $userId) {
      company
      role
      location
      startDate
      endDate
      summary
      highlights { order text }
    }
    education(userId: $userId) {
      institution
      degree
      field
      startDate
      endDate
      location
      honors
    }
  }
`;

export interface ResumeData {
  skills: { order: number; note?: string | null; skill: { name: string; category: string; proficiency: string } }[];
  experiences: { company: string; role: string; location?: string | null; startDate: string; endDate?: string | null; summary?: string | null; highlights: { order: number; text: string }[] }[];
  education: { institution: string; degree?: string | null; field?: string | null; startDate: string; endDate?: string | null; location?: string | null; honors?: string | null }[];
}
