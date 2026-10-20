import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontClasses } from "../fonts";
import { Header } from "@/components/header";
import { Footer } from "@/components/site";
import { copy, localeSchema, locales, siteOrigin } from "@/lib/site";
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export const metadata: Metadata = {
  title: {
    default: "TEVORLI — Built Smart. Built Secure.",
    template: "%s | TEVORLI",
  },
  ...(siteOrigin ? { metadataBase: new URL(siteOrigin) } : {}),
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg" },
  applicationName: "TEVORLI",
  referrer: "strict-origin-when-cross-origin",
};
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const parsed = localeSchema.safeParse((await params).locale);
  if (!parsed.success) notFound();
  const locale = parsed.data;
  const t = copy[locale];
  return (
    <html
      className={fontClasses}
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <body>
        <a className="skip-link" href="#main">
          {copy[locale].skip}
        </a>
        <Header
          locale={locale}
          labels={{
            nav: t.nav,
            close: t.close,
            switch: t.switch,
            secondary: t.secondary,
            menu: t.menu,
          }}
        />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
