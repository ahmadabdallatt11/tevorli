import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { experience } from "@/lib/experience";
import {
  ArrowUpRight,
  ArrowRight,
  Code2,
  PanelsTopLeft,
  Utensils,
  QrCode,
  ContactRound,
  BookOpen,
  Check,
  ShieldCheck,
  Sparkles,
  MoveUpRight,
} from "lucide-react";
import {
  copy,
  services,
  serviceIds,
  legal,
  pathFor,
  type Locale,
} from "@/lib/site";
import { contact, quoteEmailHref } from "@/lib/contact";
const icons = [Code2, Utensils, QrCode, ContactRound, BookOpen];
export function ContactLinks({ locale }: { locale: Locale }) {
  return (
    <div className="contact-links">
      <a className="button" href={contact.emailHref} dir="ltr">
        {contact.email}
      </a>
      <a
        className="button button-outline"
        href={contact.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        dir="ltr"
      >
        Instagram · @tevorli
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
      <span className="contact-hint">
        {locale === "ar"
          ? "يفتح البريد تطبيق البريد؛ ويفتح إنستغرام نافذة جديدة."
          : "Email opens your mail app; Instagram opens a new tab."}
      </span>
    </div>
  );
}
export function Footer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div>
          <Link prefetch={false} className="wordmark" href={pathFor(locale)}>
            <BrandLogo />
          </Link>
          <p>{t.footer}</p>
          <ContactLinks locale={locale} />
        </div>
        <div className="footer-links">
          <Link prefetch={false} href={pathFor(locale, "services")}>
            {t.nav[1]}
          </Link>
          <Link prefetch={false} href={pathFor(locale, "about")}>
            {t.nav[3]}
          </Link>
          <Link prefetch={false} href={pathFor(locale, "contact")}>
            {t.nav[4]}
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span dir="ltr">{t.rights}</span>
        <div>
          <Link prefetch={false} href={pathFor(locale, "privacy")}>
            {t.privacy}
          </Link>
          <Link prefetch={false} href={pathFor(locale, "terms")}>
            {t.terms}
          </Link>
        </div>
      </div>
    </footer>
  );
}
export function Action({
  locale,
  slug = "contact",
  children,
  secondary = false,
}: {
  locale: Locale;
  slug?: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      prefetch={false}
      href={pathFor(locale, slug)}
      className={`button ${secondary ? "button-outline" : ""}`}
    >
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  );
}
export function Callout({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section id="next-step" tabIndex={-1} className="container cta-section">
      <div>
        <span className="eyebrow">
          {locale === "ar"
            ? "لنبدأ شيئًا مميزًا"
            : "LET’S MAKE SOMETHING MATTER"}
        </span>
        <h2>{t.cta}</h2>
        <p>{t.ctaBody}</p>
      </div>
      <Action locale={locale}>{t.quote}</Action>
    </section>
  );
}
export function ServiceGrid({
  locale,
  limit = 5,
}: {
  locale: Locale;
  limit?: number;
}) {
  const t = copy[locale];
  return (
    <div className="service-grid">
      {services[locale].slice(0, limit).map(([title, short], i) => {
        const Icon = icons[i];
        return (
          <Link
            prefetch={false}
            className="service-card"
            href={pathFor(locale, `services/${serviceIds[i]}`)}
            key={serviceIds[i]}
          >
            <div className="card-top">
              <span className="icon-box">
                <Icon size={23} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span className="card-index" aria-hidden="true">
                0{i + 1}
              </span>
            </div>
            <h3>{title}</h3>
            <p>{short}</p>
            <p className="service-fit">
              <span>{experience[locale].fit}</span>
              {experience[locale].fits[i]}
            </p>
            <span className="quote-label">{t.quote}</span>
            <span className="card-link">
              {t.details}
              <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </Link>
        );
      })}
      <aside className="solution-guide">
        <span className="icon-box">
          <Sparkles size={24} aria-hidden="true" />
        </span>
        <h3>{experience[locale].guideTitle}</h3>
        <p>{experience[locale].guideBody}</p>
        <Link
          prefetch={false}
          className="text-link"
          href={pathFor(locale, "contact")}
        >
          {experience[locale].guideAction}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}
function HeroArt({ locale }: { locale: Locale }) {
  return (
    <div className="hero-art" aria-hidden="true">
      <img
        className="hero-brand-mark"
        src="/assets/logo/logo-mark-white.svg"
        width={119}
        height={104}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="art-grid" />
      <div className="browser-card">
        <div className="browser-bar">
          <span />
          <span />
          <span />
          <div>your next idea</div>
        </div>
        <div className="browser-content">
          <div className="tiny-label">MADE FOR YOUR BUSINESS</div>
          <div className="art-heading">
            Small business.
            <br />
            <span>Big possibilities.</span>
          </div>
          <div className="art-line" />
          <div className="art-line short" />
          <div className="art-button">
            Let’s get started <ArrowUpRight size={12} />
          </div>
          <div className="art-tiles">
            <div>
              <Code2 />
              <span>Web</span>
            </div>
            <div>
              <QrCode />
              <span>Connect</span>
            </div>
            <div>
              <Sparkles />
              <span>Grow</span>
            </div>
          </div>
        </div>
      </div>
      <div className="floating-label label-top">
        <span className="status-dot" />
        {locale === "ar" ? "فكرتك، متصلة بالعالم" : "YOUR IDEA, CONNECTED"}
      </div>
      <div className="floating-label label-bottom">
        <ShieldCheck size={20} />
        <div>
          Built Smart.
          <br />
          <strong>Built Secure.</strong>
        </div>
      </div>
      <span className="art-cross cross-one">+</span>
      <span className="art-cross cross-two">+</span>
    </div>
  );
}
export function Home({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="status-dot" />
            {t.eyebrow}
          </span>
          <h1>
            {t.headline}
            <br />
            <span>{t.accent}</span>
          </h1>
          <p>{t.intro}</p>
          <div className="hero-actions">
            <Action locale={locale} slug="services">
              {t.primary}
            </Action>
            <Link
              prefetch={false}
              className="text-link"
              href={pathFor(locale, "contact")}
            >
              {t.secondary}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="hero-note">
            <ShieldCheck size={16} aria-hidden="true" />
            <span dir="ltr">Built Smart. Built Secure.</span>
          </div>
        </div>
        <HeroArt locale={locale} />
      </section>
      <div className="capability-strip">
        <div className="container">
          <span>
            {locale === "ar" ? "مصمّم لهدف" : "DESIGNED WITH PURPOSE"}
          </span>
          <span className="strip-dot" />
          <span>
            {locale === "ar" ? "متجاوب على كل شاشة" : "RESPONSIVE BY DESIGN"}
          </span>
          <span className="strip-dot" />
          <span>
            {locale === "ar" ? "الأمان من البداية" : "SECURITY FROM THE START"}
          </span>
          <span className="strip-dot" />
          <span>{locale === "ar" ? "عربي · إنجليزي" : "ARABIC · ENGLISH"}</span>
        </div>
      </div>
      <nav
        className="container section-jumps"
        aria-label={experience[locale].jump}
      >
        <a href="#solutions">{experience[locale].solutions}</a>
        <a href="#process">{experience[locale].process}</a>
        <a href="#questions">{experience[locale].faqLink}</a>
        <a href="#next-step">{t.quote}</a>
      </nav>
      <section id="solutions" tabIndex={-1} className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              {locale === "ar" ? "ما نقدّمه" : "WHAT WE DO"}
            </span>
            <h2>{t.services}</h2>
            <p>{t.servicesIntro}</p>
          </div>
          <Link
            prefetch={false}
            className="text-link"
            href={pathFor(locale, "services")}
          >
            {t.viewAll}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <ServiceGrid locale={locale} limit={5} />
      </section>
      <section id="process" tabIndex={-1} className="process-section">
        <div className="container section">
          <span className="eyebrow">
            {locale === "ar" ? "كيف نعمل" : "HOW WE WORK"}
          </span>
          <h2>{t.process}</h2>
          <div className="process-grid">
            {t.steps.map(([n, title, body]) => (
              <article key={n}>
                <span className="step-number">{n}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        id="questions"
        tabIndex={-1}
        className="container section faq-section"
      >
        <span className="eyebrow">{experience[locale].faqLink}</span>
        <h2>{experience[locale].faq}</h2>
        <div className="faq-list">
          {experience[locale].faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <Callout locale={locale} />
    </>
  );
}
export function PageIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {body && <p>{body}</p>}
    </div>
  );
}
export function ContentPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const t = copy[locale];
  if (!slug) return <Home locale={locale} />;
  if (slug === "services")
    return (
      <>
        <section className="container section">
          <PageIntro
            eyebrow={t.nav[1]}
            title={t.serviceTitle}
            body={t.servicesIntro}
          />
          <ServiceGrid locale={locale} />
        </section>
        <Callout locale={locale} />
      </>
    );
  if (slug.startsWith("services/")) {
    const i = serviceIds.indexOf(
      slug.split("/")[1] as (typeof serviceIds)[number],
    );
    const [title, short, body] = services[locale][i];
    const Icon = icons[i];
    return (
      <>
        <section className="container section detail-section">
          <Link
            prefetch={false}
            href={pathFor(locale, "services")}
            className="text-link"
          >
            {t.back}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <div className="detail-layout">
            <div>
              <span className="detail-icon">
                <Icon size={44} strokeWidth={1.2} aria-hidden="true" />
              </span>
              <PageIntro eyebrow={t.detailLabel} title={title} body={short} />
              <p className="detail-body">{body}</p>
              <p className="quote-context">{experience[locale].quoteNote}</p>
              <div className="detail-actions">
                <a
                  className="button quote-service"
                  href={quoteEmailHref(locale, title)}
                >
                  {t.quote}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <Link
                  prefetch={false}
                  className="text-link other-contact"
                  href={pathFor(locale, "contact")}
                >
                  {experience[locale].otherContact}
                </Link>
              </div>
              <a className="text-link scope-jump" href="#service-scope">
                {experience[locale].scopeLink}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <aside id="service-scope" tabIndex={-1} className="scope-card">
              <h2>{t.included}</h2>
              <ul>
                {t.deliverables.map((item) => (
                  <li key={item}>
                    <Check size={18} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p>{t.scope}</p>
            </aside>
          </div>
        </section>
        <Callout locale={locale} />
      </>
    );
  }
  if (slug === "work")
    return (
      <>
        <section className="container section">
          <PageIntro eyebrow={t.nav[2]} title={t.workTitle} />
          <div className="empty-state">
            <span className="icon-box">
              <PanelsTopLeft size={30} aria-hidden="true" />
            </span>
            <h2>{t.workNote}</h2>
            <p>{t.workBody}</p>
            <Action locale={locale} slug="services" secondary>
              {t.primary}
            </Action>
          </div>
        </section>
        <Callout locale={locale} />
      </>
    );
  if (slug === "about")
    return (
      <>
        <section className="container section">
          <PageIntro
            eyebrow={t.nav[3]}
            title={t.aboutTitle}
            body={t.aboutBody}
          />
          <div className="about-statement">
            <span className="eyebrow">TEVORLI</span>
            <p dir="ltr">
              Built Smart.
              <br />
              <span>Built Secure.</span>
            </p>
            <MoveUpRight size={64} strokeWidth={1} aria-hidden="true" />
          </div>
          <div className="values-grid">
            {t.values.map(([title, body], i) => (
              <article key={title}>
                <span className="step-number">0{i + 1}</span>
                <h2>{title}</h2>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>
        <Callout locale={locale} />
      </>
    );
  if (slug === "contact")
    return (
      <section className="container section">
        <PageIntro
          eyebrow={t.nav[4]}
          title={t.contactTitle}
          body={t.contactBody}
        />
        <div className="contact-panel">
          <div className="icon-box">
            <ContactRound size={30} aria-hidden="true" />
          </div>
          <h2>{t.contactNote}</h2>
          <p>{t.contactHelp}</p>
          <ContactLinks locale={locale} />
          <Link
            prefetch={false}
            className="text-link"
            href={pathFor(locale, "services")}
          >
            {t.primary}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  const kind = slug as "privacy" | "terms";
  return (
    <section className="container section legal-page">
      <PageIntro eyebrow="TEVORLI" title={t[kind]} />
      <p className="notice">{t.legalNote}</p>
      {legal[locale][kind].map(([title, body]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>{body}</p>
        </section>
      ))}
    </section>
  );
}
