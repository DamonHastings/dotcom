export const BLOG_POSTS_QUERY = `#graphql
  query BlogPosts($take: Int, $skip: Int) {
    blogPosts(take: $take, skip: $skip) { slug title excerpt published publishedAt }
  }
`;

export const BLOG_POST_QUERY = `#graphql
  query BlogPost($slug: String!) {
    blogPost(slug: $slug) { slug title content coverImage published publishedAt }
  }
`;

export interface BlogPostsData {
  blogPosts: {
    slug: string;
    title: string;
    excerpt?: string | null;
    published: boolean;
    publishedAt?: string | null;
  }[];
}
export interface BlogPostData {
  blogPost: {
    slug: string;
    title: string;
    content: string;
    coverImage?: string | null;
    published: boolean;
    publishedAt?: string | null;
  } | null;
}
