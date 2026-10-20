"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  Monitor,
  MessageCircle,
} from "lucide-react";
import {
  contact,
  gmailHref,
  quoteEmailHref,
  readQuoteService,
} from "@/lib/contact";
import { useQuoteService } from "@/lib/quote-state";
import { quoteCopy } from "@/lib/quote-copy";
import { pathFor } from "@/lib/navigation";

type Locale = "ar" | "en";
export function ContactOptions({
  locale,
  quote,
}: {
  locale: Locale;
  quote: boolean;
}) {
  return (
    <Suspense fallback={<ContactOptionsBody locale={locale} />}>
      <ResolvedOptions locale={locale} quote={quote} />
    </Suspense>
  );
}
function ResolvedOptions({
  locale,
  quote,
}: {
  locale: Locale;
  quote: boolean;
}) {
  const selected = useQuoteService();
  return (
    <ContactOptionsBody
      locale={locale}
      service={quote ? selected : undefined}
    />
  );
}
function ContactOptionsBody({
  locale,
  service,
}: {
  locale: Locale;
  service?: ReturnType<typeof readQuoteService>;
}) {
  const t = quoteCopy[locale];
  const [copyState, setCopyState] = useState<"idle" | "copied" | "selected">(
    "idle",
  );
  const serviceTitle = service ? t.services[service] : undefined;
  async function copyEmail() {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(contact.email);
      setCopyState("copied");
    } catch {
      const address = document.getElementById("copy-address");
      if (address) {
        address.focus({ preventScroll: true });
        const range = document.createRange();
        range.selectNodeContents(address);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setCopyState("selected");
    }
  }
  return (
    <div className="contact-layout">
      <div className="contact-panel">
        {serviceTitle && (
          <p className="selected-service">
            {t.selected} <strong>{serviceTitle}</strong>
          </p>
        )}
        <h2>{t.title}</h2>
        <p>{t.intro}</p>
        <div className="email-choices">
          <a
            className="email-option gmail-option"
            href={gmailHref(locale, serviceTitle)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Monitor size={24} aria-hidden="true" />
            <span>
              <strong>{t.gmail}</strong>
              <span>{t.gmailHelp}</span>
            </span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
          <a
            className="email-option mail-app-option"
            href={quoteEmailHref(locale, serviceTitle)}
          >
            <Mail size={24} aria-hidden="true" />
            <span>
              <strong>{t.app}</strong>
              <span>{t.appHelp}</span>
            </span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </div>
        <div className="copy-email">
          <span id="copy-address" tabIndex={-1} dir="ltr">
            {contact.email}
          </span>
          <button
            className="button button-outline copy-email-button"
            onClick={copyEmail}
            type="button"
          >
            {copyState === "copied" ? (
              <Check size={17} aria-hidden="true" />
            ) : (
              <Copy size={17} aria-hidden="true" />
            )}
            {t.copy}
          </button>
        </div>
        <p className="copy-status" role="status" aria-live="polite">
          {copyState === "copied"
            ? t.copied
            : copyState === "selected"
              ? t.selectedCopy
              : ""}
        </p>
        <p className="email-help">{t.help}</p>
        <a
          className="text-link instagram-option"
          href={contact.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={19} aria-hidden="true" />
          <span>
            {t.instagram} <bdi>@tevorli</bdi>
          </span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
      <aside className="quote-guide">
        <span className="eyebrow">{t.guideLabel}</span>
        <h2>{t.guideTitle}</h2>
        <p>{t.guideIntro}</p>
        <ul>
          {t.guideItems.map((item) => (
            <li key={item}>
              <Check size={18} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <p className="quote-privacy">{t.privacy}</p>
        <Link
          prefetch={false}
          className="text-link"
          href={pathFor(locale, "services")}
        >
          {t.servicesLink}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}
