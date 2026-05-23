import Link from "next/link";
import { BookOpenText } from "lucide-react";
import { Card, Section } from "@/components/ui";
import { blogPosts } from "@/lib/content";

export const metadata = {
  title: "MaitriMilan Blog | Indian Matrimony Culture And Safety"
};

export default function BlogPage() {
  return (
    <Section>
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-sindoor text-white">
          <BookOpenText />
        </span>
        <div>
          <p className="font-semibold text-sindoor">MaitriMilan blog</p>
          <h1 className="text-3xl font-black text-ink">Indian marriages, cultures, and safe matchmaking</h1>
        </div>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="h-full transition hover:-translate-y-1 hover:border-sindoor/30">
              <p className="text-sm font-semibold text-mehendi">{post.readTime}</p>
              <h2 className="mt-3 text-xl font-black text-ink">{post.title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">{post.excerpt}</p>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
