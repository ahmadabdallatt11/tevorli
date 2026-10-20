"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Globe2, Menu, X } from "lucide-react";
import type { Locale } from "@/lib/site";
import { pathFor } from "@/lib/navigation";
import { quotePageHref } from "@/lib/contact";
import { useQuoteService } from "@/lib/quote-state";
import { BrandLogo } from "./brand-logo";
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
          <BrandLogo priority />
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
          <Suspense
            fallback={
              <LanguageLink
                href={alternate}
                other={other}
                label={t.switch}
                close={() => setOpen(false)}
              />
            }
          >
            <LanguageSwitch
              alternate={alternate}
              quote={pathname.endsWith("/quote/")}
              other={other}
              label={t.switch}
              close={() => setOpen(false)}
            />
          </Suspense>
          <Link
            prefetch={false}
            href={quotePageHref(locale)}
            className="button button-small header-cta"
          >
            {t.secondary}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
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

function LanguageLink({
  href,
  other,
  label,
  close,
}: {
  href: string;
  other: Locale;
  label: string;
  close: () => void;
}) {
  return (
    <Link
      prefetch={false}
      href={href}
      className="language"
      lang={other}
      onClick={close}
    >
      <Globe2 size={16} aria-hidden="true" />
      {label}
    </Link>
  );
}
function LanguageSwitch({
  alternate,
  quote,
  other,
  label,
  close,
}: {
  alternate: string;
  quote: boolean;
  other: Locale;
  label: string;
  close: () => void;
}) {
  const service = useQuoteService();
  return (
    <LanguageLink
      href={quote ? quotePageHref(other, service) : alternate}
      other={other}
      label={label}
      close={close}
    />
  );
}
