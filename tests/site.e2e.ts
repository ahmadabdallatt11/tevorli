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
        expect(
          href.startsWith("/") ||
            href === "#main" ||
            href === "mailto:tevorli.digital.solutions@gmail.com" ||
            href === "https://www.instagram.com/tevorli/",
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
    await page.locator(".detail-layout .button").click();
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
      '.contact-panel a[href="mailto:tevorli.digital.solutions@gmail.com"]',
    );
    await expect(email).toBeVisible();
    const instagram = page.locator(
      '.contact-panel a[href="https://www.instagram.com/tevorli/"]',
    );
    await expect(instagram).toBeVisible();
    await expect(instagram).toHaveAttribute("target", "_blank");
    await expect(instagram).toHaveAttribute("rel", "noopener noreferrer");
    await page
      .context()
      .route("https://www.instagram.com/tevorli/", (route) =>
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
