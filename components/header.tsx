"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Globe2, Menu, X } from "lucide-react";
import type { Locale } from "@/lib/site";
import { pathFor } from "@/lib/navigation";
import { contact } from "@/lib/contact";
const paths = ["", "services", "work", "about", "contact"];
type HeaderLabels = {
  nav: readonly string[];
  close: string;
  switch: string;
  secondary: string;
  menu: string;
};
export function Header({
  locale,
  labels: t,
}: {
  locale: Locale;
  labels: HeaderLabels;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const other = locale === "ar" ? "en" : "ar";
  const alternate = /^\/(ar|en)(?=\/|$)/.test(pathname)
    ? pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${other}`)
    : pathFor(other);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (
        !nav.current?.contains(event.target as Node) &&
        !toggle.current?.contains(event.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          prefetch={false}
          href={pathFor(locale)}
          className="wordmark"
          aria-label={locale === "ar" ? "TEVORLI — الرئيسية" : "TEVORLI — Home"}
        >
          TEVORLI
        </Link>
        <nav
          ref={nav}
          id="main-navigation"
          aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}
          className={`navigation ${open ? "is-open" : ""}`}
        >
          {paths.map((path, i) => (
            <Link
              prefetch={false}
              key={path}
              href={pathFor(locale, path)}
              aria-current={
                pathname === pathFor(locale, path) ||
                (!path && pathname === "/")
                  ? "page"
                  : undefined
              }
              onClick={() => setOpen(false)}
            >
              {t.nav[i]}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            prefetch={false}
            href={alternate}
            className="language"
            lang={other}
            onClick={() => setOpen(false)}
          >
            <Globe2 size={16} aria-hidden="true" />
            {t.switch}
          </Link>
          <a
            href={contact.emailHref}
            className="button button-small header-cta"
          >
            {t.secondary}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <button
            ref={toggle}
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="main-navigation"
            aria-label={open ? t.close : t.menu}
            onClick={() => setOpen(!open)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
