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
      "Show people what you do and how to reach you.",
      "A website for your business, or a single page for an offer or ad. Show your services, answer common questions, and give visitors a clear way to contact you."
    ],
    [
      "Digital Menus",
      "Let customers read your menu on their phones.",
      "A menu with your food, drinks, and prices. Customers open it with a link or by scanning a QR code with their phone camera. It displays your menu; it does not take orders or payments."
    ],
    [
      "QR Codes",
      "Scan a code. Open your page.",
      "A QR code is the square pattern you scan with a phone camera. We prepare one that opens your menu, product catalog, website, or contact page. Customers can reach the page without typing its address."
    ],
    [
      "Digital Business Cards & NFC",
      "Share your details in one link.",
      "A page with your name, business, and contact links. Share it by link or QR code. NFC lets a compatible phone open the page with a tap on a suitable card. We agree on card costs and device compatibility before you order."
    ],
    [
      "Product Catalogs & Business Pages",
      "Show your products in one place.",
      "A catalog with product photos, descriptions, and prices, or a page with your services and contact links. Customers browse and contact you to ask about a product. It does not manage stock, take payments, or connect to your shop systems."
    ]
  ],
  ar: [
    [
      "مواقع وصفحات إعلانية",
      "عرّف بعملك وخدماتك، وسهّل على الناس التواصل معك.",
      "موقع يعرّف بعملك، أو صفحة واحدة لعرض خدمة أو إعلان. نرتّب فيها معلوماتك وخدماتك وأجوبة الأسئلة المتكررة، مع طريقة واضحة للتواصل معك."
    ],
    [
      "منيو إلكتروني",
      "خلّي زبائنك يشوفوا المنيو على الموبايل.",
      "قائمة بأصناف الأكل والمشروبات وأسعارها. يفتحها الزبون من رابط، أو يمسح الرمز المربّع QR بكاميرا الموبايل. المنيو لعرض الأصناف، ولا يستقبل طلبات أو دفعات."
    ],
    [
      "رموز QR",
      "مسحة بالكاميرا تفتح صفحتك.",
      "رمز QR هو المربّع الذي تمسحه بكاميرا الموبايل لفتح رابط. نجهّز لك رمزًا يفتح المنيو أو كتالوج المنتجات أو موقعك أو صفحة التواصل، بدل ما يكتب الزبون عنوان الصفحة."
    ],
    [
      "بطاقات أعمال رقمية وNFC",
      "معلوماتك وروابط التواصل معك، في رابط واحد.",
      "صفحة تجمع اسمك وعملك وروابط التواصل معك، تشاركها برابط أو رمز QR. ويمكن فتحها بتقريب موبايل يدعم NFC من بطاقة مناسبة. نتفق على تكلفة البطاقة والأجهزة التي تدعمها قبل الطلب."
    ],
    [
      "كتالوجات وصفحات لعرض المنتجات",
      "اعرض منتجاتك وتفاصيلها في مكان واحد.",
      "كتالوج فيه صور المنتجات ووصفها وأسعارها، أو صفحة تجمع خدماتك وروابط التواصل معك. يتصفّح الزبون ويتواصل معك للاستفسار. الخدمة لا تدير المخزون ولا تستقبل دفعات ولا ترتبط بأنظمة المحل."
    ]
  ]
} as const;
export const copy = {
  en: {
    nav: [
      "Home",
      "Services",
      "Our work",
      "About",
      "Contact"
    ],
    menu: "Menu",
    close: "Close menu",
    switch: "العربية",
    skip: "Skip to content",
    eyebrow: "WEBSITES, MENUS & MORE · JORDAN",
    headline: "Your business.",
    accent: "Easy to reach.",
    intro: "We build websites, digital menus, and pages that show your products and contact details. Help customers find what they need, on a phone or a laptop.",
    primary: "See our services",
    secondary: "Request a Quote",
    services: "What would help your business?",
    servicesIntro: "Introduce your business, share your menu, or show your products. Choose a service below to see how it works.",
    quote: "Request a Quote",
    viewAll: "View all services",
    details: "See how it works",
    process: "What happens after you get in touch?",
    steps: [
      [
        "01",
        "Tell us what you need",
        "Tell us about your business and what you want to show your customers. We help you choose a service."
      ],
      [
        "02",
        "Agree on the details",
        "We agree on the pages, content, price, and delivery date before starting."
      ],
      [
        "03",
        "Build, test, and review",
        "We build it, check it on phones and computers, and review it with you before launch."
      ]
    ],
    cta: "Tell us what you have in mind.",
    ctaBody: "Not sure which service to choose? Tell us about your business and we’ll help you decide.",
    footer: "Websites, digital menus, and product pages for small businesses in Jordan.",
    privacy: "Privacy policy",
    terms: "Terms of use",
    rights: "TEVORLI. Built Smart. Built Secure.",
    serviceTitle: "Choose what your business needs.",
    workTitle: "See our work.",
    workBody: "There are no projects to show here yet. We’ll add completed work once we have permission to share it.",
    workNote: "No published projects yet",
    aboutTitle: "We make it easier to find your business online.",
    aboutBody: "TEVORLI provides digital solutions in Jordan. We help small businesses introduce themselves, show their menus and products, and make it easier for customers to get in touch.",
    values: [
      [
        "Easy to understand",
        "Visitors should be able to find what you offer and how to contact you without having to figure things out."
      ],
      [
        "Security is part of the work",
        "We check security and privacy as part of every service, without an extra fee. These checks reduce risks; they cannot remove every risk."
      ],
      [
        "Only what you need",
        "We help you choose the pages and features that serve your business, without adding things you won’t use."
      ]
    ],
    contactTitle: "How can we help?",
    contactBody: "Tell us about your business and what you need. Reach us by email or Instagram to ask a question or request a quote.",
    contactNote: "Email or Instagram",
    contactHelp: "Choose Gmail in your browser, open your mail app, or message us on Instagram. Nothing is sent until you send it yourself. Gmail and Instagram have their own privacy policies.",
    detailLabel: "ABOUT THIS SERVICE",
    included: "What we agree on before starting",
    deliverables: [
      "The pages and information your customers need",
      "A layout for phones, tablets, and computers",
      "Whether you need Arabic, English, or both",
      "Checks for usability, keyboard access, and security"
    ],
    scope: "We agree on the content, features, price, and delivery date in writing. These services do not connect to your shop’s sales, stock, or payment systems.",
    back: "All services",
    notFound: "We couldn’t find this page.",
    notFoundBody: "The link may be incorrect. Go back to the home page or browse our services.",
    home: "Back to home",
    legalNote: "Draft for review. Business details and legal wording still need confirmation before public launch."
  },
  ar: {
    nav: [
      "الرئيسية",
      "الخدمات",
      "أعمالنا",
      "من نحن",
      "تواصل معنا"
    ],
    menu: "القائمة",
    close: "إغلاق القائمة",
    switch: "English",
    skip: "انتقل إلى المحتوى",
    eyebrow: "مواقع ومنيو إلكتروني وأكثر · الأردن",
    headline: "عرّف الناس بعملك،",
    accent: "وسهّل التواصل.",
    intro: "نصمّم مواقع ومنيو إلكتروني وصفحات لعرض منتجاتك ومعلومات التواصل معك. زبونك يلاقي اللي يحتاجه بسهولة، من الموبايل أو الكمبيوتر.",
    primary: "شوف خدماتنا",
    secondary: "اطلب عرض سعر",
    services: "شو يحتاج عملك؟",
    servicesIntro: "موقع يعرّف بعملك، منيو للمطعم، أو صفحة لمنتجاتك. اختر الخدمة لتعرف كيف ممكن تفيدك.",
    quote: "اطلب عرض سعر",
    viewAll: "جميع الخدمات",
    details: "تعرّف على الخدمة",
    process: "شو بصير بعد ما تراسلنا؟",
    steps: [
      [
        "01",
        "احكِ لنا عن عملك",
        "شو بتقدّم؟ وشو بدك تعرض لزبائنك؟ نسمع منك ونساعدك تختار الخدمة المناسبة."
      ],
      [
        "02",
        "نتفق على التفاصيل",
        "نحدّد الصفحات والمحتوى والسعر وموعد التسليم قبل ما نبدأ."
      ],
      [
        "03",
        "نجهّز ونراجع معك",
        "نصمّم ونفحص على الموبايل والكمبيوتر، ونراجع النتيجة معك قبل النشر."
      ]
    ],
    cta: "احكِ لنا شو في بالك.",
    ctaBody: "مش متأكد أي خدمة تختار؟ عرّفنا بعملك وبنساعدك تحدّد اللي تحتاجه.",
    footer: "مواقع ومنيو إلكتروني وصفحات منتجات للأعمال الصغيرة في الأردن.",
    privacy: "سياسة الخصوصية",
    terms: "شروط الاستخدام",
    rights: "TEVORLI. Built Smart. Built Secure.",
    serviceTitle: "اختَر اللي يحتاجه عملك.",
    workTitle: "تعرّف على أعمالنا.",
    workBody: "ما في مشاريع منشورة هنا حاليًا. سنضيف أعمالًا مكتملة بعد الحصول على موافقة أصحابها على عرضها.",
    workNote: "لا توجد أعمال منشورة بعد",
    aboutTitle: "نساعد الناس يتعرّفوا على عملك أونلاين.",
    aboutBody: "TEVORLI تقدّم حلولًا رقمية في الأردن. نساعد أصحاب الأعمال الصغيرة يعرّفوا بخدماتهم، ويعرضوا المنيو والمنتجات، ويسهّلوا على الزبائن التواصل معهم.",
    values: [
      [
        "كلام واضح واستخدام سهل",
        "الزائر يعرف شو بتقدّم وكيف يتواصل معك، بدون ما يحتار أو يضيع بين الصفحات."
      ],
      [
        "الأمان جزء من الشغل",
        "نفحص الأمان والخصوصية ضمن كل خدمة، بدون رسوم إضافية. الفحوصات تقلّل المخاطر، لكنها ما بتلغيها بالكامل."
      ],
      [
        "على قدّ حاجتك",
        "نساعدك تختار الصفحات والميزات اللي تفيد عملك، بدون إضافات ما رح تستخدمها."
      ]
    ],
    contactTitle: "كيف نقدر نساعدك؟",
    contactBody: "احكِ لنا عن عملك واللي تحتاجه. راسلنا بالإيميل أو على إنستغرام للاستفسار أو طلب عرض سعر.",
    contactNote: "الإيميل أو إنستغرام",
    contactHelp: "افتح Gmail من المتصفح، أو استخدم تطبيق البريد، أو راسلنا على إنستغرام. ما بتنرسل أي رسالة إلا لما ترسلها بنفسك. لكل من Gmail وإنستغرام سياسة خصوصية خاصة فيه.",
    detailLabel: "عن الخدمة",
    included: "شو بنتفق عليه قبل ما نبدأ؟",
    deliverables: [
      "الصفحات والمعلومات اللي يحتاجها زبونك",
      "شكل مناسب للموبايل والتابلت والكمبيوتر",
      "المحتوى بالعربي أو الإنجليزي أو الاثنين",
      "فحص سهولة الاستخدام، والتنقّل بالكيبورد، والأمان"
    ],
    scope: "نتفق كتابةً على المحتوى والميزات والسعر وموعد التسليم. خدماتنا لا ترتبط بأنظمة البيع أو المخزون أو الدفع في المحل.",
    back: "جميع الخدمات",
    notFound: "الصفحة غير موجودة.",
    notFoundBody: "ممكن يكون الرابط غير صحيح. ارجع للرئيسية أو تعرّف على خدماتنا.",
    home: "العودة للرئيسية",
    legalNote: "مسودة للمراجعة. بيانات العمل والصياغة القانونية بحاجة إلى تأكيد قبل إطلاق الموقع للعامة."
  }
} as const;
export const legal = {
  en: {
    privacy: [
      [
        "About this policy",
        "This draft explains privacy on the current TEVORLI website. Legal registration has not been confirmed. For privacy questions, email tevorli.digital.solutions@gmail.com."
      ],
      [
        "What the website collects",
        "The website has no analytics, advertising trackers, customer accounts, or contact form. It does not collect form responses or set its own cookies. Vercel hosts the site and may process your IP address and visit logs. Its sign-in protection for this preview may use cookies."
      ],
      [
        "Email, Instagram, and copying our address",
        "Gmail and Instagram open only when you choose their links. They have their own privacy policies. Opening an email option does not send a message. The copy button copies our email address only after you press it. We do not read or send the contents of your clipboard."
      ],
      [
        "Hosting records",
        "Before public launch, we still need to confirm where Vercel processes hosting records, how long it keeps them, and how deletion requests are handled. We cannot give a confirmed retention period yet."
      ],
      [
        "Your choices",
        "You can browse without sending us personal details. Send privacy questions or requests to tevorli.digital.solutions@gmail.com. Your rights and the final policy need review under Jordanian law."
      ],
      [
        "Policy changes",
        "We will need to update this policy if we add forms, analytics, connections to other services, or change how the site is hosted."
      ]
    ],
    terms: [
      [
        "About these terms",
        "These draft terms cover the TEVORLI information website. Legal registration has not been confirmed. Contact us at tevorli.digital.solutions@gmail.com."
      ],
      [
        "Services and prices",
        "The service pages explain what we offer. The exact work, price, payment terms, delivery dates, and responsibilities must be agreed in a separate written project agreement."
      ],
      [
        "Using the website",
        "Use the website lawfully. Do not try to access it without permission, disrupt it, or misuse its content."
      ],
      [
        "Content and availability",
        "You need permission to use TEVORLI brand materials. Website information may change. We cannot guarantee that the site will always be available or that a service will produce a particular business result. Any limits on responsibility must follow applicable law."
      ],
      [
        "Legal review before launch",
        "A qualified legal adviser still needs to review the final terms, including Jordanian law, consumer rights, and how disputes are handled, before public launch."
      ]
    ]
  },
  ar: {
    privacy: [
      [
        "عن هذه السياسة",
        "هذه مسودة توضّح الخصوصية في موقع TEVORLI الحالي. لم يتم تأكيد التسجيل القانوني. لأسئلة الخصوصية، راسلنا على tevorli.digital.solutions@gmail.com."
      ],
      [
        "ما البيانات التي يجمعها الموقع؟",
        "لا نستخدم أدوات لتحليل الزيارات أو تتبّع الإعلانات، ولا توجد حسابات زبائن أو نماذج مراسلة. الموقع لا يستقبل بيانات نماذج ولا يضع ملفات تعريف ارتباط خاصة به. تستضيف Vercel الموقع، وقد تعالج عنوان اتصالك بالإنترنت وسجل الزيارات. وقد يستخدم تسجيل الدخول لحماية هذه المعاينة ملفات تعريف ارتباط."
      ],
      [
        "الإيميل وإنستغرام ونسخ العنوان",
        "لا يُفتح Gmail أو إنستغرام إلا عند اختيار رابطه، ولكل منهما سياسة خصوصية خاصة به. فتح البريد لا يرسل رسالة. زر النسخ ينسخ عنوان بريدنا فقط بعد الضغط عليه. لا نقرأ محتويات الحافظة ولا نرسلها."
      ],
      [
        "سجلات الاستضافة",
        "قبل الإطلاق العام، نحتاج إلى تأكيد مكان معالجة Vercel لسجلات الاستضافة، ومدة حفظها، وطريقة طلب حذفها. لم تتأكد مدة الحفظ بعد."
      ],
      [
        "خياراتك وطلباتك",
        "يمكنك التصفّح دون إرسال معلومات شخصية لنا. لأسئلة الخصوصية أو طلباتها، راسل tevorli.digital.solutions@gmail.com. الحقوق التي تنطبق عليك والصياغة النهائية بحاجة إلى مراجعة وفق القانون الأردني."
      ],
      [
        "تحديث السياسة",
        "نحتاج إلى تحديث هذه السياسة إذا أضفنا نماذج أو أدوات تحليل أو ربطًا بخدمات أخرى، أو غيّرنا طريقة استضافة الموقع."
      ]
    ],
    terms: [
      [
        "عن هذه الشروط",
        "هذه شروط أولية لموقع TEVORLI التعريفي. لم يتم تأكيد التسجيل القانوني. بريد التواصل هو tevorli.digital.solutions@gmail.com."
      ],
      [
        "الخدمات والأسعار",
        "صفحات الخدمات تشرح ما نقدّمه. العمل المطلوب والسعر وشروط الدفع وموعد التسليم ومسؤوليات الطرفين تُحدّد في اتفاق مشروع مكتوب ومنفصل."
      ],
      [
        "استخدام الموقع",
        "استخدم الموقع بشكل قانوني. لا تحاول الدخول إليه دون إذن، أو تعطيله، أو إساءة استخدام محتواه."
      ],
      [
        "المحتوى وتوفّر الموقع",
        "استخدام شعار TEVORLI وملفات هويتها يحتاج إلى إذن. قد تتغيّر معلومات الموقع. لا نضمن أن يبقى متاحًا دون انقطاع أو أن تحقّق الخدمة نتيجة تجارية محدّدة. أي حدود للمسؤولية يجب أن تلتزم بالقانون الذي ينطبق عليها."
      ],
      [
        "المراجعة القانونية قبل الإطلاق",
        "ما زالت الشروط النهائية بحاجة إلى مراجعة قانونية مؤهلة قبل الإطلاق العام، بما يشمل القانون الأردني وحقوق المستهلك وطريقة حل النزاعات."
      ]
    ]
  }
} as const;
