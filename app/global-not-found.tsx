import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import "./globals.css";
import { fontClasses } from "./fonts";
export const metadata: Metadata = {
  title: "404 | TEVORLI",
  robots: { index: false, follow: false },
};
export default function GlobalNotFound() {
  return (
    <html className={fontClasses} lang="ar" dir="rtl">
      <body>
        <main className="container not-found">
          <Link prefetch={false} href="/ar/" className="wordmark">
            <BrandLogo />
          </Link>
          <p className="error-code">404</p>
          <h1>هذه الصفحة سلكت طريقًا آخر.</h1>
          <p>تعذّر العثور على الصفحة المطلوبة.</p>
          <div className="hero-actions">
            <Link prefetch={false} className="button" href="/ar/">
              العودة للرئيسية
            </Link>
            <Link
              prefetch={false}
              className="button button-outline"
              href="/en/"
              lang="en"
              dir="ltr"
            >
              Back to home
            </Link>
          </div>
          <p lang="en" dir="ltr">
            The requested page could not be found.
          </p>
        </main>
      </body>
    </html>
  );
}
