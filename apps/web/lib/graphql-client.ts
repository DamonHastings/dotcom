const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql';

export interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function gqlRequest<T, V extends Record<string, unknown> = Record<string, unknown>>(
  query: string,
  variables?: V,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
    ...init,
  });
  if (!res.ok) throw new Error(`GraphQL network error: ${res.status}`);
  const json: GraphQLResponse<T> = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }
  if (!json.data) throw new Error('No data returned');
  return json.data;
}
