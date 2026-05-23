import Link from "next/link";
import { HeartHandshake, ShieldCheck } from "lucide-react";
import { getSessionUser } from "@/lib/custom-auth";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/profiles", label: "Profiles" },
  { href: "/profiles", label: "Search Matches" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  const user = getSessionUser();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-sindoor text-white">
            <HeartHandshake size={21} />
          </span>
          <span>
            <span className="block text-lg font-bold leading-tight text-ink">MaitriMilan</span>
            <span className="hidden text-xs text-stone-500 sm:block">Verified matrimonial introductions</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-sindoor">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 sm:inline-flex"
              >
                Dashboard
              </Link>
              <form action="/api/auth/logout" method="post">
                <button className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-sindoor">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 sm:inline-flex"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-sindoor"
              >
                <ShieldCheck size={16} />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
