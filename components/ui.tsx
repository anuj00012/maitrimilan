import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn("mx-auto max-w-7xl px-4 py-14 sm:py-20", className)}>{children}</section>;
}

export function ButtonLink({
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-sindoor px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-ink",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function Button({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-sindoor px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {children}
    </button>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-lg border border-stone-200 bg-white p-5 shadow-soft", className)}>{children}</div>;
}

export function Field({
  label,
  name,
  type = "text",
  required,
  placeholder
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} required={required} placeholder={placeholder} />
    </div>
  );
}
