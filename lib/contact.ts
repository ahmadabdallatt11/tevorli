// Owner-approved public contact details. These are not credentials.
export const contact = {
  email: "tevorli.digital.solutions@gmail.com",
  emailHref: "mailto:tevorli.digital.solutions@gmail.com",
  instagramUrl: "https://www.instagram.com/tevorli/",
} as const;

export function quoteEmailHref(locale: "ar" | "en", service?: string) {
  const title = locale === "ar" ? "طلب عرض سعر" : "Request a Quote";
  return `${contact.emailHref}?subject=${encodeURIComponent(service ? `${title} — ${service}` : title)}`;
}
