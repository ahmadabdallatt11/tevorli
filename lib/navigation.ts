// Pure helpers shared with the client. Keep schema validation and page copy server-side.
export function pathFor(locale: "ar" | "en", slug = "") {
  return `/${locale}/${slug ? `${slug}/` : ""}`;
}
