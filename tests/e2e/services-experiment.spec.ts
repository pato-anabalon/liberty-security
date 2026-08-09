import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/services-experiment");
});

test("renders the noindex service gallery and opens an inline detail", async ({ page, isMobile }) => {
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/services-experiment$/);
  await expect(page.getByTestId("services-experiment-gallery").locator("article")).toHaveCount(8);

  const eventPanel = page.getByTestId("services-experiment-panel-event-security");
  const opener = eventPanel.getByRole("button", { name: /Event Security/i });
  await opener.click();

  const detail = page.getByTestId("services-experiment-detail");
  await expect(detail).toBeVisible();
  await expect(detail.getByRole("heading", { name: "Event Security", exact: true })).toBeVisible();
  await expect(page.getByTestId("services-experiment-contact-cta")).toHaveAttribute("href", "/#contact");

  const nextPanel = page.getByTestId("services-experiment-panel-close-protection");
  if (isMobile) await expect(nextPanel).toBeVisible();
  else await expect(nextPanel).toBeHidden();

  await page.getByTestId("services-experiment-close").click();
  await expect(detail).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("closes the detail with Escape", async ({ page }) => {
  const opener = page.getByTestId("services-experiment-panel-close-protection").getByRole("button", { name: /Close Protection/i });
  await opener.click();
  await expect(page.getByTestId("services-experiment-detail")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("services-experiment-detail")).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("has no serious or critical accessibility violations", async ({ page }) => {
  const galleryResults = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(galleryResults.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical")).toEqual([]);

  await page.getByTestId("services-experiment-panel-event-security").getByRole("button").click();
  await expect(page.getByTestId("services-experiment-detail")).toBeVisible();
  const detailResults = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(detailResults.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical")).toEqual([]);
});

test("keeps all content available with reduced motion", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "single reduced-motion verification");
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  try {
    await page.goto("/services-experiment");
    const opener = page.getByTestId("services-experiment-panel-static-guarding").getByRole("button", { name: /Static Guarding/i });
    await opener.click();
    await expect(page.getByTestId("services-experiment-detail")).toBeVisible();
    await page.getByTestId("services-experiment-close").click();
    await expect(opener).toBeFocused();
  } finally {
    await context.close();
  }
});

test("has no overflow or broken imagery at target widths", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "single cross-viewport verification");

  for (const viewport of [
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 },
  ]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    try {
      await page.goto("/services-experiment", { waitUntil: "networkidle" });
      for (const panel of await page.locator("[data-service-panel]").all()) await panel.scrollIntoViewIfNeeded();
      await expect.poll(() => page.locator("[data-service-panel] img").evaluateAll((images) => images.every((image) => {
        const element = image as HTMLImageElement;
        return element.complete && element.naturalWidth > 0;
      }))).toBe(true);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
      expect(errors).toEqual([]);
    } finally {
      await context.close();
    }
  }
});
