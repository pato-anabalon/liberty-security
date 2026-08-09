import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function installPreloaderProbe(page: Page) {
  await page.addInitScript(() => {
    const probeWindow = window as typeof window & {
      __preloaderEvents: number[];
      __preloaderMountedAt?: number;
      __preloaderVisibleFor?: number;
      __preloaderReleaseSnapshot?: {
        dot: { left: number; top: number; right: number; bottom: number } | null;
        viewport: { width: number; height: number };
        colour: string | null;
      };
    };

    probeWindow.__preloaderEvents = [];
    const preloaderObserver = new MutationObserver(() => {
      if (probeWindow.__preloaderMountedAt === undefined && document.querySelector("[data-testid='liberty-preloader']")) {
        probeWindow.__preloaderMountedAt = performance.now();
      }
    });
    preloaderObserver.observe(document, { childList: true, subtree: true });
    window.addEventListener("liberty:preloader-complete", () => {
      const cover = document.querySelector<HTMLElement>("[data-preloader-cover]");
      const rect = cover?.getBoundingClientRect();
      probeWindow.__preloaderEvents.push(performance.now());
      probeWindow.__preloaderReleaseSnapshot = {
        dot: rect ? { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom } : null,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        colour: cover ? getComputedStyle(cover).backgroundColor : null,
      };
      probeWindow.__preloaderVisibleFor = probeWindow.__preloaderMountedAt === undefined
        ? 0
        : performance.now() - probeWindow.__preloaderMountedAt;
      preloaderObserver.disconnect();
    });
  });
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("liberty-preloader-seen", "true");
    localStorage.setItem("liberty-analytics-consent", "declined");
  });
  await page.goto("/");
  const preloader = page.getByTestId("liberty-preloader");
  await expect(preloader).toBeHidden({ timeout: 10_000 });
});

test("renders the commercial story and service detail", async ({ page }) => {
  await expect(page.getByTestId("home-hero-section")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: /People protecting people/i })).toBeVisible();
  const contactSection = page.getByTestId("home-contact-section");
  await expect(contactSection.getByRole("link", { name: /Call Liberty/i })).toHaveAttribute("href", "tel:+64211123564");
  await expect(contactSection.getByRole("link", { name: /Email Liberty/i })).toHaveAttribute("href", "mailto:libertysecuritylimited@gmail.com");
  await expect(page.getByTestId("site-footer")).toContainText("NZBN 94-29053833112");
  await expect(page.getByTestId("home-services-card-grid").locator("article")).toHaveCount(8);
  await page.getByTestId("services-experiment-panel-event-security").getByRole("button").click();
  await expect(page.getByTestId("services-experiment-detail")).toBeVisible();
  await expect(page.getByTestId("services-experiment-detail").getByRole("heading", { name: "Event Security", exact: true })).toBeVisible();
  await page.getByTestId("services-experiment-close").click();
});

test("connects first and repeat visits to the eagle hero with one release event", async ({ browser }) => {
  const firstVisitContext = await browser.newContext();
  const firstVisitPage = await firstVisitContext.newPage();
  try {
    await installPreloaderProbe(firstVisitPage);
    await firstVisitPage.goto("/");
    await expect(firstVisitPage.getByTestId("liberty-preloader")).toBeVisible();
    await expect(firstVisitPage.getByTestId("liberty-preloader-skip")).toHaveCount(0);
    await expect.poll(() => firstVisitPage.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");
    await expect(firstVisitPage.getByTestId("liberty-preloader")).toBeHidden({ timeout: 7_000 });
    await expect(firstVisitPage.getByTestId("hero-eagle-fog")).toBeVisible();
    await expect(firstVisitPage.getByTestId("liberty-motion-static-fallback")).toBeVisible();
    await expect.poll(() => firstVisitPage.evaluate(() => document.documentElement.style.overflow)).toBe("");

    const firstRelease = await firstVisitPage.evaluate(() => (window as typeof window & { __preloaderEvents: number[] }).__preloaderEvents);
    const firstVisibleFor = await firstVisitPage.evaluate(() => (window as typeof window & { __preloaderVisibleFor?: number }).__preloaderVisibleFor);
    expect(firstRelease).toHaveLength(1);
    expect(firstVisibleFor).toBeGreaterThan(2_000);
    expect(firstVisibleFor).toBeLessThan(4_200);

    await firstVisitPage.reload();
    await expect(firstVisitPage.getByTestId("liberty-preloader")).toBeHidden({ timeout: 2_000 });
    const repeatRelease = await firstVisitPage.evaluate(() => (window as typeof window & { __preloaderEvents: number[] }).__preloaderEvents);
    const repeatVisibleFor = await firstVisitPage.evaluate(() => (window as typeof window & { __preloaderVisibleFor?: number }).__preloaderVisibleFor);
    expect(repeatRelease).toHaveLength(1);
    expect(repeatVisibleFor).toBeLessThan(1_000);
  } finally {
    await firstVisitContext.close();
  }
});

test("resolves image errors and enforces the critical-resource timeout", async ({ browser }) => {
  const errorContext = await browser.newContext();
  const errorPage = await errorContext.newPage();
  try {
    await errorPage.route("**/brand/eagle.jpg", (route) => route.abort("failed"));
    await installPreloaderProbe(errorPage);
    await errorPage.goto("/");
    await expect(errorPage.getByTestId("liberty-preloader")).toBeHidden({ timeout: 5_000 });
    const errorEvents = await errorPage.evaluate(() => (window as typeof window & { __preloaderEvents: number[] }).__preloaderEvents);
    expect(errorEvents).toHaveLength(1);
  } finally {
    await errorContext.close();
  }

  const timeoutContext = await browser.newContext();
  const timeoutPage = await timeoutContext.newPage();
  try {
    await timeoutPage.route("**/brand/eagle.jpg", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 3_000));
      await route.abort("timedout");
    });
    await installPreloaderProbe(timeoutPage);
    await timeoutPage.goto("/", { waitUntil: "domcontentloaded" });
    await expect(timeoutPage.getByTestId("liberty-preloader")).toBeHidden({ timeout: 5_000 });
    const timeoutEvents = await timeoutPage.evaluate(() => (window as typeof window & { __preloaderEvents: number[] }).__preloaderEvents);
    const timeoutVisibleFor = await timeoutPage.evaluate(() => (window as typeof window & { __preloaderVisibleFor?: number }).__preloaderVisibleFor);
    expect(timeoutEvents).toHaveLength(1);
    expect(timeoutVisibleFor).toBeGreaterThan(3_000);
    expect(timeoutVisibleFor).toBeLessThan(4_200);
  } finally {
    await timeoutContext.close();
  }
});

test("centres the shared-width composition and covers every target viewport", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "single cross-viewport verification");

  for (const viewport of [
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 },
  ]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    try {
      await installPreloaderProbe(page);
      await page.goto("/");
      await expect(page.getByTestId("liberty-preloader")).toBeVisible();
      await page.waitForTimeout(450);

      const layout = await page.evaluate(() => {
        const composition = document.querySelector<HTMLElement>(".preloader__composition")!.getBoundingClientRect();
        const liberty = document.querySelector<HTMLElement>(".preloader__liberty")!.getBoundingClientRect();
        const loader = document.querySelector<HTMLElement>(".preloader__loader")!.getBoundingClientRect();
        return {
          composition: { centerX: composition.left + composition.width / 2, centerY: composition.top + composition.height / 2 },
          libertyWidth: liberty.width,
          loaderWidth: loader.width,
          viewport: { width: window.innerWidth, height: window.innerHeight },
          background: getComputedStyle(document.querySelector<HTMLElement>(".preloader")!).backgroundColor,
        };
      });

      expect(Math.abs(layout.composition.centerX - layout.viewport.width / 2)).toBeLessThanOrEqual(1);
      expect(Math.abs(layout.composition.centerY - layout.viewport.height / 2)).toBeLessThanOrEqual(1);
      expect(Math.abs(layout.libertyWidth - layout.loaderWidth)).toBeLessThanOrEqual(1);
      expect(layout.background).toBe("rgb(255, 255, 255)");
      await page.screenshot({ path: `/private/tmp/liberty-preloader-${viewport.width}.png` });

      await expect(page.getByTestId("liberty-preloader")).toBeHidden({ timeout: 5_000 });
      const snapshot = await page.evaluate(() => (window as typeof window & {
        __preloaderReleaseSnapshot?: {
          dot: { left: number; top: number; right: number; bottom: number } | null;
          viewport: { width: number; height: number };
          colour: string | null;
        };
      }).__preloaderReleaseSnapshot);

      expect(snapshot?.colour).toBe("rgb(0, 0, 0)");
      expect(snapshot?.dot?.left).toBeLessThanOrEqual(0);
      expect(snapshot?.dot?.top).toBeLessThanOrEqual(0);
      expect(snapshot?.dot?.right).toBeGreaterThanOrEqual(snapshot!.viewport.width);
      expect(snapshot?.dot?.bottom).toBeGreaterThanOrEqual(snapshot!.viewport.height);
      const visibleFor = await page.evaluate(() => (window as typeof window & { __preloaderVisibleFor?: number }).__preloaderVisibleFor);
      expect(visibleFor).toBeLessThan(4_200);
    } finally {
      await context.close();
    }
  }
});

test("supports form validation and has no horizontal overflow", async ({ page }) => {
  await page.getByTestId("contact-form-submit-button").click();
  await expect(page.getByTestId("contact-form-error-state")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("submits a complete enquiry through the local API simulation", async ({ page }) => {
  await page.getByLabel("Your name").fill("Taylor Smith");
  await page.getByLabel("Email address").fill("taylor@example.co.nz");
  await page.getByLabel("What do you need protected?").fill("We are planning an Auckland event and need to discuss a suitable security team.");
  await page.locator("input[name='privacyConsent']").check();
  await page.getByTestId("contact-form-submit-button").click();
  await expect(page.getByTestId("contact-form-success-state")).toContainText("Local simulation complete");
});

test("has no serious or critical automated accessibility violations", async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  const blocking = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(blocking).toEqual([]);
});

test("mobile navigation announces its state", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only check");
  const toggle = page.getByTestId("mobile-navigation-toggle");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.getByTestId("site-navigation").getByRole("link", { name: "Services" }).click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test.describe("reduced motion", () => {
  test("keeps content available and releases once without the intro", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    try {
      await installPreloaderProbe(page);
      await page.goto("/");
      await expect(page.getByTestId("liberty-preloader")).toBeHidden({ timeout: 2_000 });
      await expect(page.getByTestId("home-hero-section")).toBeVisible();
      await expect(page.getByTestId("liberty-motion-static-fallback")).toBeVisible();
      const releaseEvents = await page.evaluate(() => (window as typeof window & { __preloaderEvents: number[] }).__preloaderEvents);
      const visibleFor = await page.evaluate(() => (window as typeof window & { __preloaderVisibleFor?: number }).__preloaderVisibleFor);
      expect(releaseEvents).toHaveLength(1);
      expect(visibleFor).toBeLessThan(1_000);
    } finally {
      await context.close();
    }
  });
});

test("uses absolute black for the hero and primary black token", async ({ page }) => {
  const colours = await page.evaluate(() => ({
    hero: getComputedStyle(document.querySelector<HTMLElement>(".hero-section")!).backgroundColor,
    primary: getComputedStyle(document.documentElement).getPropertyValue("--black").trim(),
  }));

  expect(colours.hero).toBe("rgb(0, 0, 0)");
  expect(colours.primary).toBe("#000");
});
