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
    expect(new Set(routeNames).size).toBe(12);
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
