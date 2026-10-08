"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const base =
  "relative inline-flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors duration-200 " +
  "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-accent after:transition-transform after:duration-300 " +
  "hover:bg-white/10 hover:text-white hover:after:scale-x-100 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70";
const active = "text-white after:scale-x-100 font-semibold";
const idle = "text-white/85";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "/";
  const on = isActive(pathname, href);
  return (
    <Link
      href={href}
      aria-current={on ? "page" : undefined}
      className={`${base} ${on ? active : idle}`}
    >
      {children}
    </Link>
  );
}

export function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname() ?? "/";
  const on = items.some((i) => isActive(pathname, i.href));
  return (
    <div className="group relative">
      <button
        type="button"
        aria-haspopup="menu"
        className={`${base} ${on ? active : idle} group-hover:bg-white/10 group-hover:after:scale-x-100 group-focus-within:after:scale-x-100`}
      >
        {label}
        <svg
          className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M19 8l-7 7-7-7" />
        </svg>
      </button>
      {/* pt-2 = pont invisible : le menu ne se ferme pas en descendant la souris */}
      <div className="invisible absolute left-1/2 top-full z-40 w-60 -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <ul className="rounded-panel border border-slate-200 bg-white p-1.5 text-ardoise shadow-xl">
          {items.map((item) => {
            const itemOn = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={itemOn ? "page" : undefined}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-[15px] font-medium transition hover:bg-primary-light hover:pl-4 ${
                    itemOn ? "bg-primary-light/70 text-sapin" : ""
                  }`}
                >
                  {item.label}
                  <span aria-hidden className="text-primary">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
