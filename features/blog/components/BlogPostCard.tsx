import Link from "next/link";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  published_at: string | null;
};

export default function BlogPostCard({ post }: { post: Post }) {
  return (
    <Link href={"/blog/" + post.slug} className="block border-b border-gray-100 py-4">
      <div className="flex gap-3">
        <div className="w-20 h-20 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
          {post.cover_image_url ? (
            <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">📰</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {post.category ? (
            <span className="text-[10px] font-medium text-orange-500 uppercase">{post.category}</span>
          ) : null}
          <p className="font-medium text-sm line-clamp-2 mt-0.5">{post.title}</p>
          {post.excerpt ? <p className="text-xs text-gray-500 line-clamp-2 mt-1">{post.excerpt}</p> : null}
        </div>
      </div>
    </Link>
  );
}