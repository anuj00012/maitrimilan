import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <h2 className="text-xl font-bold text-ink">MaitriMilan</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
            An original, trust-focused matrimonial platform for families and individuals who want verified profiles,
            respectful communication, and transparent membership.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-ink">Platform</h3>
          <div className="mt-3 grid gap-2 text-sm text-stone-600">
            <Link href="/profiles">Browse profiles</Link>
            <Link href="/subscription">Membership</Link>
            <Link href="/requests">Requests</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-ink">Safety</h3>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            ID documents stay private, profiles go live only after admin review, and chat opens after accepted interest.
          </p>
        </div>
      </div>
    </footer>
  );
}
