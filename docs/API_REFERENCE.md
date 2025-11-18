# API Reference (overview)

This document provides a short reference for the API surface and example GraphQL queries and mutations used by the web frontend.

Entrypoint

- GraphQL endpoint (dev): `http://localhost:${API_PORT:-4000}/graphql`

Auth

- The API uses JWT for admin authentication. Public content queries (blog posts, projects, resume) are available without auth. Mutations that modify content require an authenticated admin token.

Common queries

Example: Fetch published blog posts

```graphql
query PublishedPosts($take: Int = 10) {
  posts(take: $take, published: true) {
    id
    slug
    title
    excerpt
    publishedAt
    author {
      id
      name
    }
  }
}
```

Example: Fetch project by slug

```graphql
query ProjectBySlug($slug: String!) {
  project(slug: $slug) {
    id
    title
    description
    url
    repoUrl
    author {
      id
      name
    }
  }
}
```

Mutations (admin)

Example: Create a blog post (admin only)

```graphql
mutation CreatePost($input: BlogPostInput!) {
  createPost(input: $input) {
    id
    slug
    title
  }
}
```

Where to find full schema

- Server resolvers and GraphQL types: `apps/api/src/resolvers`.
- Prisma models: `apps/api/prisma/schema.prisma`.

Notes

- When testing the API locally, use the seeded admin account or create a user via the `db:seed` script.
- For authenticated requests, include the `Authorization: Bearer <token>` header.
