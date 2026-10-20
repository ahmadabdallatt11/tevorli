import { z } from "zod";
export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const localeSchema = z.enum(locales);
export const serviceIds = [
  "websites",
  "digital-menus",
  "qr-solutions",
  "business-cards",
  "catalogs",
] as const;
export const routeNames = [
  "",
  "services",
  ...serviceIds.map((id) => `services/${id}`),
  "work",
  "about",
  "contact",
  "quote",
  "privacy",
  "terms",
];
export const siteOrigin = (() => {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return null;
  const url = z.url().parse(value);
  const parsed = new URL(url);
  if (
    parsed.protocol !== "https:" ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash ||
    parsed.pathname !== "/"
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be an HTTPS origin without credentials, path, query, or fragment.",
    );
  }
  return parsed.origin;
})();
export { pathFor } from "./navigation";
export function isRoute(slug: string) {
  return routeNames.includes(slug);
}
export const services = {
  en: [
    [
      "Websites & Landing Pages",
      "A focused online home for your business.",
      "Standalone websites and landing pages with clear content, responsive layouts, and a direct next step. No integration with internal shop systems.",
    ],
    [
      "Digital Menus",
      "Your menu, within easy reach.",
      "Readable, mobile-friendly digital menus, shared by link or QR code. A simple independent presentation, without POS or internal ordering-system integration.",
    ],
    [
      "Smart QR Solutions",
      "A simple connection to the right page.",
      "QR codes that open your approved menu, catalog, business page, or website. Standalone destinations without internal business-system integration.",
    ],
    [
      "Digital Business Cards & NFC",
      "A simpler professional introduction.",
      "Digital business cards and NFC-ready page links for compatible devices. Hardware and compatibility are agreed in the quote; no internal system integration.",
    ],
    [
      "Digital Catalogs & Smart Pages",
      "Your products and essentials, organized.",
      "Standalone digital catalogs and smart business pages for products, services, and approved contact links. No stock, payment, or shop-system integration.",
    ],
  ],
  ar: [
    [
      "المواقع وصفحات الهبوط",
      "حضور رقمي واضح يناسب عملك.",
      "مواقع وصفحات هبوط مستقلة بمحتوى واضح وتصميم متجاوب وخطوة تالية مباشرة، دون ربط بأنظمة المحل الداخلية.",
    ],
    [
      "القوائم الرقمية",
      "قائمتك، في متناول الجميع.",
      "قوائم رقمية واضحة ومتجاوبة، تُشارك برابط أو رمز QR، دون تكامل مع أنظمة نقاط البيع أو الطلبات الداخلية.",
    ],
    [
      "حلول QR الذكية",
      "وصول بسيط إلى الصفحة المناسبة.",
      "رموز QR تفتح القائمة أو الكتالوج أو صفحة الأعمال أو الموقع المعتمد، بوجهات مستقلة دون ربط بأنظمة العمل الداخلية.",
    ],
    [
      "بطاقات الأعمال الرقمية وNFC",
      "تعارف مهني بخطوات أبسط.",
      "بطاقات أعمال رقمية وروابط صفحات مناسبة لأجهزة NFC المتوافقة. تُحدّد الأجهزة والتوافق في عرض السعر، دون تكامل مع الأنظمة الداخلية.",
    ],
    [
      "الكتالوجات الرقمية وصفحات الأعمال الذكية",
      "منتجاتك ومعلوماتك، بصورة منظّمة.",
      "كتالوجات وصفحات أعمال مستقلة لعرض المنتجات والخدمات وروابط التواصل المعتمدة، دون تكامل مع المخزون أو الدفع أو أنظمة المحل.",
    ],
  ],
} as const;
export const copy = {
  en: {
    nav: ["Home", "Services", "Our work", "About", "Contact"],
    menu: "Menu",
    close: "Close menu",
    switch: "العربية",
    skip: "Skip to content",
    eyebrow: "DIGITAL SOLUTIONS · JORDAN",
    headline: "Your next step,",
    accent: "built smarter.",
    intro:
      "Practical digital experiences for small businesses. Thoughtful design, dependable development, and security built in from the start.",
    primary: "Explore our solutions",
    secondary: "Let’s talk",
    services: "Small ideas. Real possibilities.",
    servicesIntro:
      "Five practical, standalone solutions. No integration with internal shop systems. Security and privacy are included in every service, without an extra fee or an absolute security guarantee.",
    quote: "Request a Quote",
    viewAll: "View all services",
    details: "Explore service",
    process: "A clear path from idea to launch.",
    steps: [
      [
        "01",
        "Understand",
        "We start with your business, your audience, and what you need to achieve.",
      ],
      [
        "02",
        "Build",
        "Design and development come together around a clear, agreed scope.",
      ],
      [
        "03",
        "Refine",
        "We check usability, accessibility, and security before a considered handover.",
      ],
    ],
    cta: "Have something in mind?",
    ctaBody: "Let’s find a practical way to bring it online.",
    footer: "Practical digital solutions for growing businesses in Jordan.",
    privacy: "Privacy policy",
    terms: "Terms of use",
    rights: "TEVORLI. Built Smart. Built Secure.",
    serviceTitle: "Digital solutions, with purpose.",
    workTitle: "Good work starts with a clear idea.",
    workBody:
      "Our portfolio will be shared here when projects are approved for publication. No client projects or results are being claimed on this page.",
    workNote: "Portfolio coming soon",
    aboutTitle: "Practical thinking. Thoughtful digital.",
    aboutBody:
      "TEVORLI is a digital solutions agency in Jordan, focused on practical tools for small businesses. We bring design and development together to make everyday business interactions simpler.",
    values: [
      [
        "Clarity first",
        "Useful experiences start with understandable content and straightforward navigation.",
      ],
      [
        "Security included",
        "Privacy and security are included in every service without additional fees. No absolute security guarantee is made.",
      ],
      [
        "A considered fit",
        "The right solution should match the business need and avoid unnecessary complexity.",
      ],
    ],
    contactTitle: "Let’s build your next step.",
    contactBody:
      "Tell us what your business needs. Contact us by email or Instagram to discuss a standalone digital solution.",
    contactNote: "Email or Instagram",
    contactHelp:
      "Use the links below to request a quote. There is no online submission form. Choose Gmail in your browser or a configured mail app. Gmail and Instagram have their own privacy practices.",
    detailLabel: "THE SOLUTION",
    included: "What we can plan together",
    deliverables: [
      "A clear structure shaped around your business",
      "Responsive layouts for mobile, tablet, and desktop",
      "Arabic and English content options",
      "Usability, accessibility, and security checks",
    ],
    scope:
      "Final features, content, price, and delivery dates are agreed in the project scope. No fixed performance or business outcome is promised.",
    back: "All services",
    notFound: "This page took a different path.",
    notFoundBody:
      "The page you requested could not be found. Return home or explore our services.",
    home: "Back to home",
    legalNote:
      "Draft policy — business details and legal approval pending. Review before public launch.",
  },
  ar: {
    nav: ["الرئيسية", "الخدمات", "أعمالنا", "من نحن", "تواصل معنا"],
    menu: "القائمة",
    close: "إغلاق القائمة",
    switch: "English",
    skip: "انتقل إلى المحتوى",
    eyebrow: "حلول رقمية · الأردن",
    headline: "خطوتك القادمة،",
    accent: "بُنيت بذكاء.",
    intro:
      "تجارب رقمية عملية للأعمال الصغيرة. تصميم مدروس، وتطوير موثوق، وأمان حاضر من البداية.",
    primary: "اكتشف حلولنا",
    secondary: "لنتحدث",
    services: "أفكار صغيرة. إمكانات حقيقية.",
    servicesIntro:
      "خمسة حلول عملية ومستقلة، دون ربط بأنظمة المحلات الداخلية. الأمان والخصوصية ضمن جميع الخدمات دون رسوم إضافية أو ضمان أمان مطلق.",
    quote: "اطلب عرض سعر",
    viewAll: "جميع الخدمات",
    details: "اكتشف الخدمة",
    process: "طريق واضح من الفكرة إلى الإطلاق.",
    steps: [
      ["01", "نفهم", "نبدأ بفهم عملك وجمهورك والهدف الذي تريد الوصول إليه."],
      ["02", "نبني", "نجمع التصميم والتطوير ضمن نطاق واضح ومتفق عليه."],
      [
        "03",
        "نُحسّن",
        "نراجع سهولة الاستخدام وإمكانية الوصول والأمان قبل التسليم.",
      ],
    ],
    cta: "لديك فكرة؟",
    ctaBody: "لنجد طريقة عملية لنقلها إلى العالم الرقمي.",
    footer: "حلول رقمية عملية للأعمال الصغيرة في الأردن.",
    privacy: "سياسة الخصوصية",
    terms: "شروط الاستخدام",
    rights: "TEVORLI. Built Smart. Built Secure.",
    serviceTitle: "حلول رقمية، بهدف واضح.",
    workTitle: "كل عمل جيد يبدأ بفكرة واضحة.",
    workBody:
      "سنشارك أعمالنا هنا عند اعتماد المشاريع للنشر. لا تعرض هذه الصفحة مشاريع عملاء أو نتائج غير موثّقة.",
    workNote: "معرض الأعمال قريبًا",
    aboutTitle: "تفكير عملي. تجربة رقمية مدروسة.",
    aboutBody:
      "TEVORLI وكالة حلول رقمية في الأردن، تركّز على الأدوات العملية للأعمال الصغيرة. نجمع التصميم والتطوير لتبسيط تفاعلات الأعمال اليومية.",
    values: [
      ["الوضوح أولًا", "تبدأ التجربة المفيدة بمحتوى مفهوم وتنقّل مباشر."],
      [
        "الأمان ضمن الأساس",
        "الخصوصية والأمان ضمن جميع الخدمات دون رسوم إضافية، ولا نقدّم ضمان أمان مطلقًا.",
      ],
      [
        "حل يناسب الحاجة",
        "الحل المناسب يلائم حاجة العمل ويتجنّب التعقيد غير الضروري.",
      ],
    ],
    contactTitle: "لنبنِ خطوتك القادمة.",
    contactBody:
      "تواصل معنا عبر البريد أو إنستغرام لمناقشة حل رقمي مستقل يناسب عملك.",
    contactNote: "البريد أو إنستغرام",
    contactHelp:
      "استخدم الروابط أدناه لطلب عرض سعر. لا يوجد نموذج مراسلة داخل الموقع. اختر Gmail في المتصفح أو تطبيق بريد مُعدًّا. يخضع Gmail وإنستغرام لسياسات الخصوصية الخاصة بهما.",
    detailLabel: "الحل",
    included: "ما يمكننا التخطيط له معًا",
    deliverables: [
      "هيكل واضح يناسب طبيعة عملك",
      "تصميم متجاوب للهاتف والجهاز اللوحي والحاسوب",
      "خيارات محتوى بالعربية والإنجليزية",
      "مراجعات سهولة الاستخدام وإمكانية الوصول والأمان",
    ],
    scope:
      "تُحدّد الميزات والمحتوى والسعر ومواعيد التسليم ضمن اتفاق المشروع. لا نقدّم وعودًا ثابتة بالأداء أو النتائج التجارية.",
    back: "جميع الخدمات",
    notFound: "هذه الصفحة سلكت طريقًا آخر.",
    notFoundBody:
      "تعذّر العثور على الصفحة المطلوبة. يمكنك العودة للرئيسية أو استكشاف خدماتنا.",
    home: "العودة للرئيسية",
    legalNote:
      "مسودة سياسة — بيانات المنشأة والمراجعة القانونية قيد الاعتماد. تُراجع قبل الإطلاق العام.",
  },
} as const;
export const legal = {
  en: {
    privacy: [
      [
        "Scope",
        "This draft describes the current static TEVORLI website. Legal registration has not been confirmed. Privacy requests can be sent to tevorli.digital.solutions@gmail.com.",
      ],
      [
        "Information and cookies",
        "This website has no analytics, advertising trackers, account system, or enabled contact form. It does not set application cookies or collect form submissions. The hosting provider may process connection data such as IP addresses and request logs.",
      ],
      [
        "External contact options",
        "Gmail and Instagram open only when you choose their links and are governed by their providers’ policies. Opening an email option does not send a message. Copy email uses your clipboard only after you press the copy button; clipboard contents are not read or sent by this site.",
      ],
      [
        "Hosting and retention",
        "The hosting provider, processing location, log retention period, and deletion procedure must be confirmed before public launch. No specific retention period is promised at this stage.",
      ],
      [
        "Your choices",
        "You can browse without submitting personal information. For privacy requests use tevorli.digital.solutions@gmail.com. Applicable rights and final legal wording require review under Jordanian law.",
      ],
      [
        "Changes",
        "This policy must be updated if forms, analytics, integrations, or hosting practices change.",
      ],
    ],
    terms: [
      [
        "Status and scope",
        "These draft terms describe the informational TEVORLI website. Legal registration has not been confirmed. The official contact email is tevorli.digital.solutions@gmail.com.",
      ],
      [
        "Website information",
        "Service descriptions provide general information. Deliverables, payment terms, timelines, and responsibilities require a separate written project agreement.",
      ],
      [
        "Permitted use",
        "Use the website lawfully. Do not attempt unauthorized access, interfere with availability, or misuse the site or its content.",
      ],
      [
        "Content and availability",
        "Use of brand assets requires appropriate authorization. Information may change. No uninterrupted availability or specific business result is guaranteed; any limitations must comply with applicable law.",
      ],
      [
        "Governing terms",
        "Jordanian jurisdiction, consumer rights, dispute procedures, and final legal wording require review by qualified counsel before public launch.",
      ],
    ],
  },
  ar: {
    privacy: [
      [
        "النطاق",
        "تصف هذه المسودة موقع TEVORLI الثابت الحالي. لم يتم تأكيد التسجيل القانوني. يمكن إرسال طلبات الخصوصية إلى tevorli.digital.solutions@gmail.com.",
      ],
      [
        "البيانات وملفات الارتباط",
        "لا يستخدم الموقع أدوات تحليل أو تتبّع إعلاني، ولا يحتوي على حسابات أو نموذج تواصل مفعّل. لا يضع ملفات ارتباط خاصة بالتطبيق ولا يستقبل بيانات نماذج. قد يعالج مزوّد الاستضافة بيانات الاتصال مثل عناوين IP وسجلات الطلبات.",
      ],
      [
        "خيارات التواصل الخارجية",
        "يُفتح Gmail أو إنستغرام عند اختيار رابطه فقط، ويخضع كل منهما لسياسة مزوّده. فتح خيار البريد لا يرسل رسالة. يُنسخ عنوان البريد إلى الحافظة عند ضغط زر النسخ فقط؛ لا يقرأ الموقع محتويات الحافظة ولا يرسلها.",
      ],
      [
        "الاستضافة والاحتفاظ",
        "يجب تأكيد مزوّد الاستضافة ومكان المعالجة ومدة الاحتفاظ بالسجلات وآلية حذفها قبل الإطلاق العام. لا نحدّد مدة احتفاظ غير موثّقة في هذه المرحلة.",
      ],
      [
        "خياراتك",
        "يمكنك التصفّح دون تقديم معلومات شخصية. يمكن إرسال طلبات الخصوصية إلى tevorli.digital.solutions@gmail.com. تخضع الحقوق المنطبقة والصياغة النهائية لمراجعة وفق القانون الأردني.",
      ],
      [
        "التغييرات",
        "تُحدّث السياسة عند إضافة نماذج أو تحليلات أو تكاملات أو تغيير ممارسات الاستضافة.",
      ],
    ],
    terms: [
      [
        "الحالة والنطاق",
        "تصف هذه الشروط الأولية موقع TEVORLI التعريفي. لم يتم تأكيد التسجيل القانوني. بريد التواصل الرسمي هو tevorli.digital.solutions@gmail.com.",
      ],
      [
        "معلومات الموقع",
        "أوصاف الخدمات للتعريف العام. تُحدّد المخرجات والدفع والمواعيد والمسؤوليات ضمن اتفاق مشروع مكتوب ومستقل.",
      ],
      [
        "الاستخدام المسموح",
        "استخدم الموقع بصورة قانونية. يُمنع الوصول غير المصرّح به أو تعطيل الموقع أو إساءة استخدام محتواه.",
      ],
      [
        "المحتوى والتوافر",
        "يتطلّب استخدام أصول العلامة إذنًا مناسبًا. قد تتغيّر المعلومات ولا يُضمن توافر دائم أو نتيجة تجارية محدّدة. يجب أن تتوافق أي حدود للمسؤولية مع القانون المنطبق.",
      ],
      [
        "الأحكام القانونية",
        "تحتاج أحكام الاختصاص الأردني وحقوق المستهلك وتسوية النزاعات والصياغة النهائية إلى مراجعة قانونية مؤهلة قبل الإطلاق العام.",
      ],
    ],
  },
};
