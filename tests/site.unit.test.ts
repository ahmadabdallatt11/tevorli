import { describe, expect, it } from "vitest";
import {
  locales,
  localeSchema,
  serviceIds,
  services,
  routeNames,
  pathFor,
  isRoute,
} from "../lib/site";
describe("Bilingual route and content integrity", () => {
  it("has unique routes for every service and required page", () => {
    expect(new Set(routeNames).size).toBe(13);
    for (const id of serviceIds) expect(isRoute(`services/${id}`)).toBe(true);
  });
  it.each(locales)(
    "has complete %s service content and locale paths",
    (locale) => {
      expect(services[locale]).toHaveLength(serviceIds.length);
      for (const service of services[locale])
        for (const field of service) expect(field.trim()).not.toBe("");
      expect(pathFor(locale)).toBe(`/${locale}/`);
      expect(pathFor(locale, "contact")).toBe(`/${locale}/contact/`);
    },
  );
  it("rejects unsupported locales and unknown routes", () => {
    for (const locale of ["fr", "../en", "<script>", "AR", ""])
      expect(localeSchema.safeParse(locale).success).toBe(false);
    expect(isRoute("services/not-real")).toBe(false);
  });
});

import {
  quoteEmailHref,
  contact,
  gmailHref,
  quotePageHref,
  readQuoteService,
  quoteServiceIds,
} from "../lib/contact";
describe("Quote link safety", () => {
  it.each(["ar", "en"] as const)(
    "encodes %s service text in a single subject parameter",
    (locale) => {
      const service = "تصميم & Design?bcc=attacker@example.test#fragment";
      const url = new URL(quoteEmailHref(locale, service));
      expect(url.protocol).toBe("mailto:");
      expect(url.pathname).toBe(contact.email);
      expect([...url.searchParams.keys()]).toEqual(["subject"]);
      expect(url.hash).toBe("");
      expect(url.searchParams.get("subject")).toContain(service);
    },
  );
});

describe("Browser email and quote scope safety", () => {
  it("shares only the approved service identifiers", () => {
    expect(quoteServiceIds).toEqual(serviceIds);
  });
  it.each(["ar", "en"] as const)(
    "keeps %s Gmail links on a fixed host and recipient",
    (locale) => {
      const text =
        "Design & اختبار?bcc=attacker@example.test\r\nBcc: test#fragment";
      const url = new URL(gmailHref(locale, text));
      expect(url.origin).toBe("https://mail.google.com");
      expect(url.pathname).toBe("/mail/");
      expect(url.searchParams.get("to")).toBe(contact.email);
      expect(url.searchParams.get("su")).toContain(
        text.replaceAll("\r", " ").replaceAll("\n", " "),
      );
      expect([...url.searchParams.keys()]).toEqual(["view", "fs", "to", "su"]);
      expect(url.hash).toBe("");
    },
  );
  it("rejects injected quote services and unknown targets", () => {
    for (const value of [
      null,
      "__proto__",
      "constructor",
      "https://attacker.invalid",
      "websites&to=attacker@example.test",
      "<img src=x onerror=alert(1)>",
    ]) {
      expect(readQuoteService(value)).toBeUndefined();
      expect(quotePageHref("en", value ?? undefined)).toBe("/en/quote/");
    }
    expect(quotePageHref("ar", "websites")).toBe("/ar/quote/?service=websites");
  });
});

import { quoteCopy } from "../lib/quote-copy";
it("quote-service names match the localized service catalog", () => {
  for (const locale of locales)
    for (const [i, id] of serviceIds.entries())
      expect(quoteCopy[locale].services[id]).toBe(services[locale][i][0]);
});
