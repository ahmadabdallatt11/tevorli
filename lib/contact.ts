// Owner-approved public contact details. These are not credentials.
export const contact = {
  email: "tevorli.digital.solutions@gmail.com",
  emailHref: "mailto:tevorli.digital.solutions@gmail.com",
  instagramUrl: "https://www.instagram.com/tevorli/",
} as const;

export function quoteEmailHref(locale: "ar" | "en", service?: string) {
  const title = locale === "ar" ? "طلب عرض سعر" : "Request a Quote";
  const safeService = Array.from(service ?? "", (char) => {
    const code = char.charCodeAt(0);
    return code < 32 || (code >= 127 && code <= 159) ? " " : char;
  })
    .join("")
    .slice(0, 200);
  return `${contact.emailHref}?subject=${encodeURIComponent(safeService ? `${title} — ${safeService}` : title)}`;
}

// Only known service identifiers may influence a quote. Never accept recipients,
// external URLs or arbitrary subject text from the address bar.
export const quoteServiceIds = [
  "websites",
  "digital-menus",
  "qr-solutions",
  "business-cards",
  "catalogs",
] as const;
export function readQuoteService(value: string | null) {
  return quoteServiceIds.find((id) => id === value);
}
export function quotePageHref(locale: "ar" | "en", service?: string) {
  const id = readQuoteService(service ?? null);
  return `/${locale}/quote/${id ? `?service=${id}` : ""}`;
}
export function gmailHref(locale: "ar" | "en", service?: string) {
  const subject = new URL(quoteEmailHref(locale, service)).searchParams.get(
    "subject",
  )!;
  const url = new URL("https://mail.google.com/mail/");
  url.search = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: contact.email,
    su: subject,
  }).toString();
  return url.href;
}
