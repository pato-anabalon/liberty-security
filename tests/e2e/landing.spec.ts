import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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
  await expect(page.getByTestId("home-services-card-grid").locator("article")).toHaveCount(8);
  await page.getByTestId("services-card-event-security-details").click();
  await expect(page.getByTestId("service-details-dialog")).toBeVisible();
  await expect(page.getByTestId("service-details-dialog").getByRole("heading", { name: "Event Security", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close service details" }).click();
});

test("connects the first-visit preloader to the hero canvas", async ({ browser }) => {
  const firstVisitContext = await browser.newContext();
  const firstVisitPage = await firstVisitContext.newPage();
  try {
    await firstVisitPage.goto("/");
    await expect(firstVisitPage.getByTestId("liberty-preloader")).toBeVisible();
    await expect(firstVisitPage.getByTestId("liberty-preloader")).toBeHidden({ timeout: 5_000 });
    await expect(firstVisitPage.getByTestId("liberty-motion-canvas").locator("canvas")).toBeVisible();
  } finally {
    await firstVisitContext.close();
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
  test("keeps content available without motion layers", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await expect(page.getByTestId("home-hero-section")).toBeVisible();
    await expect(page.getByTestId("liberty-motion-canvas").locator("canvas")).toHaveCount(0);
    await expect(page.getByTestId("liberty-motion-static-fallback")).toBeVisible();
  });
});
