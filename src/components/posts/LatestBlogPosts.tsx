// src/components/posts/LatestBlogPosts.tsx
import { Button } from "../ui/button";
import Link from "next/link";
import BlogPostCard from "@/components/posts/BlogPostCard";
import { IPostsPaginatedResponse } from "@/types/posts/post.types";
import { EmptyState } from "../ui/EmptyState";
import ErrorMessage from "../ui/ErrorMessage";

interface LatestBlogPostsProps {
  postsData: IPostsPaginatedResponse | null;
}

const LatestBlogPosts = ({ postsData }: LatestBlogPostsProps) => {
  // Handle error or no data cases
  if (!postsData) {
    return (
      <ErrorMessage
        error={"No posts found"}
        title="Failed to load latest blog posts. Please try again later."
      />
    );
  }

  const posts = postsData.data;

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-16">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-destructive"></div>
              <span className="text-sm font-medium text-muted-foreground">
                Our Stories
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
              Latest <span className="text-destructive">Stories</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Read about our recent work and the impact we&apos;re making in
              communities worldwide
            </p>
          </div>
          <div className="shrink-0">
            <Button
              variant="default"
              size="lg"
              asChild
              className="bg-foreground text-background hover:bg-foreground/90 px-8"
            >
              <Link href="/blog">View All Posts</Link>
            </Button>
          </div>
        </div>

        {/* Posts Grid or No Posts Message */}
        {!posts || posts.length === 0 ? (
          <EmptyState
            title="No Featured Stories"
            description="We're currently working on new content. Check back soon for inspiring stories about our impact in communities worldwide."
            buttonText="Explore our blog"
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestBlogPosts;
