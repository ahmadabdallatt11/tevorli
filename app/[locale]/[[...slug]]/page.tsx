import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/site";
import {
  copy,
  isRoute,
  localeSchema,
  pathFor,
  routeNames,
  services,
  serviceIds,
  siteOrigin,
  type Locale,
} from "@/lib/site";
type Params = { locale: string; slug?: string[] };
export const dynamicParams = false;
export function generateStaticParams() {
  return routeNames.map((slug) => ({ slug: slug ? slug.split("/") : [] }));
}
function pageInfo(locale: Locale, slug: string) {
  const t = copy[locale];
  if (slug.startsWith("services/")) {
    const index = serviceIds.indexOf(
      slug.split("/")[1] as (typeof serviceIds)[number],
    );
    return {
      title: services[locale][index][0],
      description: services[locale][index][2],
    };
  }
  const titles: Record<string, string> = {
    "": t.headline + " " + t.accent,
    services: t.serviceTitle,
    work: t.workTitle,
    about: t.aboutTitle,
    contact: t.contactTitle,
    privacy: t.privacy,
    terms: t.terms,
  };
  const descriptions: Record<string, string> = {
    "": t.intro,
    services: t.servicesIntro,
    work: t.workBody,
    about: t.aboutBody,
    contact: t.contactBody,
    privacy: t.legalNote,
    terms: t.legalNote,
  };
  return { title: titles[slug], description: descriptions[slug] };
}
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const p = await params;
  const parsed = localeSchema.safeParse(p.locale);
  const slug = p.slug?.join("/") ?? "";
  if (!parsed.success || !isRoute(slug)) return {};
  const locale = parsed.data;
  const info = pageInfo(locale, slug);
  return {
    ...info,
    ...(siteOrigin
      ? {
          alternates: {
            canonical: pathFor(locale, slug),
            languages: {
              ar: pathFor("ar", slug),
              en: pathFor("en", slug),
              "x-default": pathFor("ar", slug),
            },
          },
          openGraph: {
            ...info,
            type: "website",
            locale: locale === "ar" ? "ar_JO" : "en_GB",
            alternateLocale: locale === "ar" ? "en_GB" : "ar_JO",
            siteName: "TEVORLI",
            images: [
              {
                url: "/assets/social/og-image-1200x630.png",
                width: 1200,
                height: 630,
                alt: "TEVORLI — Built Smart. Built Secure.",
              },
            ],
            url: pathFor(locale, slug),
          },
        }
      : {}),
  };
}
export default async function Page({ params }: { params: Promise<Params> }) {
  const p = await params;
  const parsed = localeSchema.safeParse(p.locale);
  const slug = p.slug?.join("/") ?? "";
  if (!parsed.success || !isRoute(slug)) notFound();
  return <ContentPage locale={parsed.data} slug={slug} />;
}
