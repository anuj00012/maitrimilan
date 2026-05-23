import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui";
import { blogPosts, getBlogPost } from "@/lib/content";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  return {
    title: post ? `${post.title} | MaitriMilan Blog` : "MaitriMilan Blog"
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <Section className="max-w-4xl">
      <Link href="/blog" className="text-sm font-bold text-sindoor">
        Back to blog
      </Link>
      <article className="mt-6 rounded-lg bg-white p-6 shadow-soft sm:p-10">
        <p className="text-sm font-semibold text-mehendi">{post.readTime}</p>
        <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">{post.title}</h1>
        <p className="mt-4 text-lg leading-8 text-stone-600">{post.excerpt}</p>
        <div className="mt-8 grid gap-7">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-black text-ink">{section.heading}</h2>
              <p className="mt-3 leading-8 text-stone-700">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </Section>
  );
}
