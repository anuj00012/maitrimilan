import Link from "next/link";
import { CheckCircle2, HeartHandshake, LockKeyhole, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { ButtonLink, Card, Section } from "@/components/ui";
import { blogPosts, testimonials } from "@/lib/content";

const features = [
  {
    title: "Verified profiles",
    icon: ShieldCheck,
    text: "Profiles remain hidden until an admin reviews profile details and private ID proof."
  },
  {
    title: "Safe communication",
    icon: LockKeyhole,
    text: "Members send interest first. Chat opens only when the other person accepts."
  },
  {
    title: "1-year membership",
    icon: HeartHandshake,
    text: "Simple annual access with Razorpay payments, expiry tracking, and premium action checks."
  }
];

const faqs = [
  ["Are ID documents public?", "No. ID proof is stored in a private Supabase bucket and is visible only to admins."],
  ["Can free users create a profile?", "Yes. Free users can register and complete onboarding. Premium access unlocks full request limits."],
  ["When does chat open?", "Only after one member sends interest and the other member accepts it."],
  ["Can admins reject profiles?", "Yes. Admins can approve, reject, block, delete fake users, and manage reports."]
];

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[82vh] overflow-hidden bg-ink">
        <img
          src="/hero-wedding.svg"
          alt="Indian wedding ceremony hands"
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fffaf7] to-transparent" />
        <div className="relative mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-center px-4 py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-mehendi shadow-sm">
              <Sparkles size={16} /> Trust-first matrimony for modern families
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find Your Perfect Life Partner
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
              Join trusted and verified profiles to discover meaningful matches.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/register">Register Free</ButtonLink>
              <ButtonLink href="/login" className="bg-white text-ink hover:bg-stone-100">
                Login
              </ButtonLink>
            </div>
            <div className="mt-8 grid gap-3 text-sm font-medium text-stone-700 sm:grid-cols-3">
              {["Manual verification", "Private ID proof", "Accepted-match chat"].map((item) => (
                <span key={item} className="flex items-center gap-2 text-white/90">
                  <CheckCircle2 className="text-marigold" size={18} /> {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section>
        <div className="mb-8 grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="font-semibold text-sindoor">How MaitriMilan works</p>
            <h2 className="mt-3 text-3xl font-black text-ink">Every introduction passes through a safer flow.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Register and complete profile", "Admin verifies details", "Send interest", "Chat after acceptance"].map(
              (step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-soft">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-sindoor text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-ink">{step}</span>
                </div>
              )
            )}
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <feature.icon className="text-sindoor" size={28} />
              <h2 className="mt-4 text-xl font-bold text-ink">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">{feature.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <section className="bg-white">
        <Section>
          <div className="grid gap-5 md:grid-cols-4">
            {[
              ["Verified Profiles", "/images/verified-profiles.jpg"],
              ["Find Perfect Match", "/images/couple-match.jpg"],
              ["Safe & Secure Chat", "/trust-2.svg"],
              ["Community-Based Matches", "/images/family-trust.jpg"]
            ].map(([title, src]) => (
              <Card key={title} className="overflow-hidden p-0">
                <img src={src} alt={title} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-black text-ink">{title}</h3>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      </section>

      <section className="bg-lotus">
        <Section>
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="grid grid-cols-2 gap-3">
              {[
                "/trust-1.svg",
                "/trust-2.svg",
                "/trust-3.svg",
                "/trust-4.svg"
              ].map((src, index) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-soft">
                  <img
                    src={src}
                    alt={`MaitriMilan trust visual ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div>
              <p className="font-semibold text-sindoor">Trust and privacy</p>
              <h2 className="mt-3 text-3xl font-black text-ink">Built for families who want clarity before contact.</h2>
              <p className="mt-4 leading-7 text-stone-700">
                MaitriMilan keeps sensitive details protected, uses manual verification before visibility, and lets both
                sides choose whether a conversation should begin.
              </p>
              <div className="mt-6 grid gap-3">
                {["Private ID proof review", "Visible only after approval", "Interest-based communication", "Report and block controls"].map(
                  (item) => (
                    <span key={item} className="flex items-center gap-2 rounded-lg bg-white p-3 font-semibold text-ink shadow-sm">
                      <CheckCircle2 className="text-mehendi" size={18} /> {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </Section>
      </section>

      <section className="bg-white">
        <Section>
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="font-semibold text-sindoor">Success stories</p>
              <h2 className="mt-3 text-3xl font-black text-ink">Made for thoughtful decisions, not rushed chats.</h2>
              <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src="/story-wedding.svg"
                  alt="Wedding couple celebration"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="grid gap-4">
              {testimonials.map((story) => (
                  <Card key={story.names} className="shadow-none">
                    <p className="text-sm font-semibold text-sindoor">{story.community}</p>
                    <h3 className="mt-2 text-xl font-black text-ink">{story.names}</h3>
                    <p className="mt-1 text-sm text-stone-500">{story.location}</p>
                    <p className="mt-3 leading-7 text-stone-700">"{story.quote}"</p>
                    <p className="mt-3 text-xs text-stone-500">{story.note}</p>
                  </Card>
              ))}
            </div>
          </div>
        </Section>
      </section>

      <Section>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-sindoor">MaitriMilan blog</p>
            <h2 className="mt-3 text-3xl font-black text-ink">Indian marriage, culture, and safe matchmaking.</h2>
          </div>
          <ButtonLink href="/blog" className="bg-white text-ink hover:bg-stone-100">
            Read all blogs
          </ButtonLink>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-sindoor/30"
            >
              <p className="text-sm font-semibold text-mehendi">{post.readTime}</p>
              <h3 className="mt-3 text-xl font-black text-ink">{post.title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold text-sindoor">Pricing</p>
          <h2 className="mt-3 text-3xl font-black text-ink">One simple annual membership</h2>
        </div>
        <Card className="mx-auto mt-8 max-w-xl border-sindoor/30 p-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-mehendi">Premium</p>
          <div className="mt-4 text-5xl font-black text-ink">Rs. 4,999</div>
          <p className="mt-2 text-stone-600">1-year access to premium requests and accepted-match chat.</p>
          <div className="mt-6 grid gap-3 text-left text-sm text-stone-700">
            {["Send more interests", "Chat with accepted matches", "Profile visibility after verification", "Report and block controls"].map(
              (item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="text-mehendi" size={18} /> {item}
                </span>
              )
            )}
          </div>
          <ButtonLink href="/subscription" className="mt-7 w-full">
            Start membership
          </ButtonLink>
        </Card>
      </Section>

      <section className="bg-white">
        <Section>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map(([question, answer]) => (
              <Card key={question} className="shadow-none">
                <h3 className="font-bold text-ink">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{answer}</p>
              </Card>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-lg bg-ink p-6 text-white md:flex-row">
            <div>
              <h2 className="text-2xl font-black">Ready to begin carefully?</h2>
              <p className="mt-1 text-sm text-white/75">Create your profile and complete verification.</p>
            </div>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-ink"
            >
              <MessageCircle size={18} />
              Register now
            </Link>
          </div>
        </Section>
      </section>
    </>
  );
}
