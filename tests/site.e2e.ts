import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { routeNames, services, serviceIds } from "../lib/site";
for (const locale of ["ar", "en"] as const) {
  test(`${locale}: all routes, SEO, links, layouts and accessibility`, async ({
    page,
  }) => {
    for (const slug of routeNames) {
      const response = await page.goto(`/${locale}/${slug ? `${slug}/` : ""}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("html")).toHaveAttribute(
        "dir",
        locale === "ar" ? "rtl" : "ltr",
      );
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page).toHaveTitle(/TEVORLI/);
      await expect(page.locator("meta[name=description]")).toHaveAttribute(
        "content",
        /.{15,}/,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      for (const href of await page
        .locator("a[href]")
        .evaluateAll((links) => links.map((a) => a.getAttribute("href")!))) {
        if (href.startsWith("#")) {
          expect(
            await page.evaluate(
              (id) =>
                !!document.getElementById(decodeURIComponent(id.slice(1))),
              href,
            ),
          ).toBe(true);
        } else if (href.startsWith("mailto:")) {
          const target = new URL(href);
          expect(target.pathname).toBe("tevorli.digital.solutions@gmail.com");
          for (const key of target.searchParams.keys())
            expect(key).toBe("subject");
        } else
          expect(
            href.startsWith("/") ||
              href === "https://www.instagram.com/tevorli/" ||
              new URL(href, "http://127.0.0.1:3000").origin ===
                "https://mail.google.com",
          ).toBe(true);
        if (href.startsWith("/"))
          expect((await page.request.get(href)).status()).toBe(200);
      }
    }
  });
  test(`${locale}: service discovery, details, language switch and contact`, async ({
    page,
  }) => {
    const errors: string[] = [];
    const csp: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (msg) => {
      if (
        msg.type() === "error" &&
        /content security|refused/i.test(msg.text())
      )
        csp.push(msg.text());
    });
    await page.goto(`/${locale}/`);
    await page.locator(".hero-actions .button").click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/services/`));
    await page
      .getByRole("link")
      .filter({
        has: page.getByRole("heading", {
          name: services[locale][0][0],
          exact: true,
        }),
      })
      .click();
    await expect(page.locator("h1")).toHaveText(services[locale][0][0]);
    await expect(page).toHaveURL(new RegExp(`services/${serviceIds[0]}/`));
    await page.locator(".language").click();
    const other = locale === "ar" ? "en" : "ar";
    await expect(page).toHaveURL(new RegExp(`/${other}/services/websites/`));
    await expect(page.locator("html")).toHaveAttribute(
      "dir",
      other === "ar" ? "rtl" : "ltr",
    );
    await expect(page.locator(".quote-service")).toHaveAttribute(
      "href",
      new RegExp(`/${other}/quote/\\?service=websites$`),
    );
    await page.locator(".other-contact").click();
    await expect(page).toHaveURL(new RegExp(`/${other}/contact/`));
    await expect(page.locator("form,input,textarea")).toHaveCount(0);
    await expect(page.locator(".contact-panel")).toBeVisible();
    if (await page.locator(".menu-toggle").isVisible()) {
      const toggle = page.locator(".menu-toggle");
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(toggle).toBeFocused();
      await toggle.click();
      await page.locator("#main-navigation a").first().click();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
    }
    expect(errors).toEqual([]);
    expect(csp).toEqual([]);
  });
}
test("404, malicious paths and unavailable submissions fail safely", async ({
  page,
  request,
}) => {
  for (const path of [
    "/en/missing/",
    "/fr/",
    "/ar/services/unknown/",
    "/en/%3Cscript%3Ealert(1)%3C/script%3E/",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.querySelectorAll("script:not([src])").length,
      ),
    ).toBeGreaterThan(0);
  }
  expect(
    (
      await request.post("/ar/contact/", {
        data: { email: "test@example.test" },
      })
    ).status(),
  ).toBe(405);
  await page.getByRole("link", { name: "Back to home", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/$/);
});
test("keyboard skip link and root landing work", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});
test("visual evidence", async ({ page }, testInfo) => {
  await page.goto("/en/");
  await page.screenshot({
    path: `artifacts/${testInfo.project.name}-en.png`,
    fullPage: true,
  });
  await page.goto("/ar/");
  await page.screenshot({
    path: `artifacts/${testInfo.project.name}-ar.png`,
    fullPage: true,
  });
  for (const locale of ["ar", "en"]) {
    await page.goto(`/${locale}/quote/?service=websites`);
    await expect(page.locator(".selected-service")).toBeVisible();
    await page.screenshot({
      path: `artifacts/${testInfo.project.name}-quote-${locale}.png`,
      fullPage: true,
    });
    await page.goto(`/${locale}/about/`);
    await page.screenshot({
      path: `artifacts/${testInfo.project.name}-about-${locale}.png`,
      fullPage: true,
    });
  }
});
test("CSP blocks unapproved inline JavaScript", async ({ page }) => {
  await page.goto("/en/");
  await page.evaluate(() => {
    const script = document.createElement("script");
    script.textContent = "window.__tevorli_probe = 1";
    document.body.appendChild(script);
  });
  expect(await page.evaluate(() => "__tevorli_probe" in window)).toBe(false);
});
test("root language switch goes to English", async ({ page }) => {
  await page.goto("/");
  await page.locator(".language").click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
test("narrow and intermediate screen widths remain usable", async ({
  page,
}) => {
  for (const width of [320, 360, 768, 1024, 1440])
    for (const locale of ["ar", "en"]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/`);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator(".hero-actions .button")).toBeInViewport();
    }
});
test("approved contacts and quote paths work without a backend", async ({
  page,
}) => {
  for (const locale of ["ar", "en"]) {
    await page.goto(`/${locale}/contact/`);
    const email = page.locator(
      '.contact-panel a[href^="mailto:tevorli.digital.solutions@gmail.com"]',
    );
    await expect(email).toBeVisible();
    const instagram = page.locator(
      '.contact-panel a[href="https://www.instagram.com/tevorli/"]',
    );
    await expect(instagram).toBeVisible();
    await expect(instagram).toHaveAttribute("target", "_blank");
    await expect(instagram).toHaveAttribute("rel", "noopener noreferrer");
    await page.context().route("https://www.instagram.com/tevorli/", (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<title>Navigation test fixture</title>",
      }),
    );
    const opened = page.waitForEvent("popup");
    await instagram.click();
    const popup = await opened;
    await expect(popup).toHaveURL("https://www.instagram.com/tevorli/");
    await popup.close();
    await expect(
      page.locator('a[href^="tel:"],a[href*="wa.me"],form'),
    ).toHaveCount(0);
    await expect(page.locator('footer a[href^="mailto:"]')).toHaveCount(1);
    await expect(
      page.locator('footer a[href="https://www.instagram.com/tevorli/"]'),
    ).toHaveCount(1);
    await page.goto(`/${locale}/services/`);
    await expect(page.locator(".service-card")).toHaveCount(5);
    for (const card of await page.locator(".service-card").all())
      await expect(card.locator(".quote-label")).toHaveText(
        locale === "ar" ? "اطلب عرض سعر" : "Request a Quote",
      );
  }
});
test("Preview stays unindexed and old service links redirect safely", async ({
  page,
  request,
}) => {
  for (const locale of ["ar", "en"]) {
    const response = await page.goto(`/${locale}/`);
    expect(response?.headers()["x-robots-tag"]).toContain("noindex");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    for (const [from, to] of [
      ["landing-pages", "websites"],
      ["nfc-cards", "business-cards"],
      ["business-pages", "catalogs"],
    ]) {
      const r = await request.get(`/${locale}/services/${from}/`, {
        maxRedirects: 0,
      });
      expect(r.status()).toBe(308);
      expect(r.headers().location).toBe(`/${locale}/services/${to}/`);
      await page.goto(`/${locale}/services/${from}/`);
      await expect(page).toHaveURL(new RegExp(`/${locale}/services/${to}/$`));
    }
  }
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
});

test("approved logos and icons load, FAQs work with keyboard", async ({
  page,
}) => {
  for (const locale of ["ar", "en"]) {
    await page.goto(`/${locale}/`);
    const logo = page.locator(".site-header .brand-logo");
    await expect(logo).toBeVisible();
    expect(
      await logo.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
      ),
    ).toBe(true);
    await expect(logo).toHaveAttribute("src", "/assets/logo/logo-for-dark.svg");
    expect((await page.request.get("/favicon.svg")).status()).toBe(200);
    const summary = page.locator(".faq-list summary").first();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".faq-list details").first()).toHaveAttribute(
      "open",
      "",
    );
    await page.keyboard.press("Enter");
    await expect(page.locator(".faq-list details").first()).not.toHaveAttribute(
      "open",
    );
  }
});

test("routes start at top after footer navigation; section targets stay correct", async ({
  page,
}) => {
  for (const locale of ["ar", "en"]) {
    await page.goto(`/${locale}/`);
    await page.locator("footer").scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(200);
    await page
      .locator("footer .footer-links a")
      .filter({ hasText: locale === "ar" ? "الخدمات" : "Services" })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/services/$`));
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(10);
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.locator("footer .wordmark").click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(10);
    for (const id of ["solutions", "process", "questions"]) {
      await page.locator(`.section-jumps a[href="#${id}"]`).click();
      await expect
        .poll(() =>
          page.locator(`#${id}`).evaluate((el) => {
            const y = el.getBoundingClientRect().top;
            return y >= 0 && y <= 24;
          }),
        )
        .toBe(true);
      await expect(page.locator(`#${id}`)).toBeFocused();
    }
    await page.goto(`/${locale}/services/#next-step`);
    await expect
      .poll(() =>
        page.locator("#next-step").evaluate((el) => {
          const y = el.getBoundingClientRect().top;
          return y >= 0 && y < window.innerHeight;
        }),
      )
      .toBe(true);
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.locator("footer .footer-links a").first().click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(10);
  }
});

test("reduced-motion preference keeps navigation and section links usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/ar/");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await page.locator('.section-jumps a[href="#questions"]').click();
  await expect(page.locator("#questions")).toBeFocused();
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.locator("footer .footer-links a").first().click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(10);
});

test("quote journey supports browser email, mail apps, copy and language context", async ({
  page,
  context,
}) => {
  for (const locale of ["ar", "en"] as const) {
    await page.goto(`/${locale}/services/websites/`);
    await page.locator(".quote-service").click();
    await expect(page).toHaveURL(
      new RegExp(`/${locale}/quote/\\?service=websites$`),
    );
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(10);
    await expect(page.locator(".selected-service strong")).toHaveText(
      services[locale][0][0],
    );
    const gmail = page.locator(".gmail-option");
    const url = new URL((await gmail.getAttribute("href"))!);
    expect(url.origin).toBe("https://mail.google.com");
    expect(url.searchParams.get("to")).toBe(
      "tevorli.digital.solutions@gmail.com",
    );
    expect(url.searchParams.get("su")).toContain(services[locale][0][0]);
    await context.route("https://mail.google.com/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<title>Email navigation fixture</title>",
      }),
    );
    const popupPromise = page.waitForEvent("popup");
    await gmail.click();
    const popup = await popupPromise;
    await expect(popup).toHaveURL(url.href);
    await popup.close();
    // OS mail-client registration cannot be tested by a browser runner.
    const mail = new URL(
      (await page.locator(".mail-app-option").getAttribute("href"))!,
    );
    expect(mail.protocol).toBe("mailto:");
    expect(mail.pathname).toBe("tevorli.digital.solutions@gmail.com");
    expect(mail.searchParams.get("subject")).toBe(url.searchParams.get("su"));
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.locator(".copy-email-button").click();
    await expect(page.locator(".copy-status")).toContainText(
      locale === "ar" ? "تم نسخ البريد" : "Email copied",
    );
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      "tevorli.digital.solutions@gmail.com",
    );
    await page.locator(".language").click();
    const other = locale === "ar" ? "en" : "ar";
    await expect(page).toHaveURL(
      new RegExp(`/${other}/quote/\\?service=websites$`),
    );
    await expect(page.locator(".selected-service strong")).toHaveText(
      services[other][0][0],
    );
    if (await page.locator(".header-cta").isVisible()) {
      await page.locator(".header-cta").click();
      await expect(page).toHaveURL(new RegExp(`/${other}/quote/$`));
      await expect(page.locator(".selected-service")).toHaveCount(0);
      await page.goBack();
      await expect(page.locator(".selected-service strong")).toHaveText(
        services[other][0][0],
      );
    }
    await expect(page.locator("form,input,textarea")).toHaveCount(0);
  }
});

test("clipboard denial has a usable keyboard fallback", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () => Promise.reject(new Error("Permission denied")),
      },
    }),
  );
  await page.goto("/en/quote/");
  await page.locator(".copy-email-button").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".copy-status")).toContainText("Ctrl+C");
  await expect(page.locator("#copy-address")).toBeFocused();
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe(
    "tevorli.digital.solutions@gmail.com",
  );
});

test("quote input cannot inject content, recipients or redirects", async ({
  page,
}) => {
  for (const value of [
    "__proto__",
    "constructor",
    "<img src=x onerror=alert(1)>",
    "https://attacker.invalid",
    "websites&to=attacker@example.test",
  ]) {
    await page.goto(
      `/en/quote/?service=${encodeURIComponent(value)}&to=attacker@example.test&next=https://attacker.invalid`,
    );
    await expect(page.locator(".selected-service")).toHaveCount(0);
    const href = new URL(
      (await page.locator(".gmail-option").getAttribute("href"))!,
    );
    expect(href.origin).toBe("https://mail.google.com");
    expect(href.searchParams.get("to")).toBe(
      "tevorli.digital.solutions@gmail.com",
    );
    expect(href.searchParams.get("su")).toBe("Request a Quote");
    expect(
      await page.evaluate(() => document.querySelector("[onerror]")),
    ).toBeNull();
    await expect(page.locator("main")).not.toContainText("attacker");
  }
});

test("repeated section clicks, back navigation and scope links stop at target", async ({
  page,
}) => {
  for (const locale of ["ar", "en"]) {
    await page.goto(`/${locale}/`);
    for (const id of ["questions", "solutions", "solutions", "process"]) {
      await page.locator(`.section-jumps a[href="#${id}"]`).click();
      await expect
        .poll(() =>
          page
            .locator(`#${id}`)
            .evaluate((el) => Math.abs(el.getBoundingClientRect().top - 20)),
        )
        .toBeLessThan(3);
    }
    await page.goBack();
    await expect(page).toHaveURL(/#solutions$/);
    await expect
      .poll(() =>
        page
          .locator("#solutions")
          .evaluate((el) => Math.abs(el.getBoundingClientRect().top - 20)),
      )
      .toBeLessThan(3);
    await page.goto(`/${locale}/services/websites/`);
    await page.locator(".scope-jump").click();
    await expect(page.locator("#service-scope")).toBeFocused();
    await expect
      .poll(() =>
        page
          .locator("#service-scope")
          .evaluate((el) => Math.abs(el.getBoundingClientRect().top - 20)),
      )
      .toBeLessThan(3);
  }
});

test("hero, contact controls and headers do not overlap at laptop and phone widths", async ({
  page,
}) => {
  for (const locale of ["ar", "en"]) {
    for (const width of [320, 390, 760, 820, 1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ["", "quote/?service=catalogs"]) {
        await page.goto(`/${locale}/${route}`);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        const rectangles = await page
          .locator(route ? ".contact-layout > *" : ".hero > *")
          .evaluateAll((elements) =>
            elements.map((el) => {
              const r = el.getBoundingClientRect();
              return { x: r.x, y: r.y, right: r.right, bottom: r.bottom };
            }),
          );
        const [a, b] = rectangles;
        expect(
          a.right <= b.x ||
            b.right <= a.x ||
            a.bottom <= b.y ||
            b.bottom <= a.y,
        ).toBe(true);
        const header = await page
          .locator(".header-inner > *:visible")
          .evaluateAll((elements) =>
            elements.map((el) => {
              const r = el.getBoundingClientRect();
              return { x: r.x, right: r.right };
            }),
          );
        for (let i = 0; i < header.length; i++)
          for (let j = i + 1; j < header.length; j++)
            expect(
              header[i].right <= header[j].x || header[j].right <= header[i].x,
            ).toBe(true);
        if (route) {
          const controls = page.locator(
            ".gmail-option,.mail-app-option,.copy-email-button,.instagram-option",
          );
          for (const control of await controls.all()) {
            await control.scrollIntoViewIfNeeded();
            await expect(control).toBeVisible();
            expect(
              await control.evaluate((el) => {
                const r = el.getBoundingClientRect();
                const at = document.elementFromPoint(
                  r.x + r.width / 2,
                  r.y + r.height / 2,
                );
                return at === el || el.contains(at);
              }),
            ).toBe(true);
          }
        } else {
          expect(
            await page.locator(".studio-solutions").innerText(),
          ).not.toContain(locale === "ar" ? "Your" : "موقعك");
          await expect(page.locator(".studio-solutions > div")).toHaveCount(5);
          expect(
            await page.locator(".hero-art").evaluate((el) => {
              const frame = el.getBoundingClientRect();
              const studio = el
                .querySelector(".idea-studio")!
                .getBoundingClientRect();
              return (
                studio.top >= frame.top &&
                studio.bottom <= frame.bottom &&
                studio.left >= frame.left &&
                studio.right <= frame.right
              );
            }),
          ).toBe(true);
          expect(
            await page
              .locator(".idea-studio")
              .evaluate(
                (el) =>
                  el.scrollHeight <= el.clientHeight + 1 &&
                  el.scrollWidth <= el.clientWidth + 1,
              ),
          ).toBe(true);
        }
      }
    }
  }
});

test("quote options remain available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const locale of ["ar", "en"]) {
      await page.goto(`/${locale}/quote/`);
      await expect(page.locator(".gmail-option")).toBeVisible();
      await expect(page.locator(".mail-app-option")).toBeVisible();
      await expect(page.locator("#copy-address")).toHaveText(
        "tevorli.digital.solutions@gmail.com",
      );
      await expect(page.locator(".instagram-option")).toBeVisible();
    }
  } finally {
    await context.close();
  }
});
