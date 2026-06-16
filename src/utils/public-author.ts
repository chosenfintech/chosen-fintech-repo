// src/utils/public-author.ts

/**
 * Strips the author's email from a mapped content item before returning it from
 * a public (unauthenticated) endpoint. Public responses expose only id +
 * fullname; the email stays available to authenticated admin endpoints.
 */
export function withPublicAuthor<
  T extends { author: { id: string; fullname: string; email?: string } },
>(item: T): T {
  return {
    ...item,
    author: { id: item.author.id, fullname: item.author.fullname },
  };
}
