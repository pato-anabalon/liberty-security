import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const widths = [375, 768, 1024, 1440];
const browser = await chromium.launch({ headless: true });
await mkdir("test-results/visual", { recursive: true });
const report = [];

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: width < 768 ? 812 : 900 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error" && !message.text().includes("webpack-hmr")) errors.push(message.text()); });
  await page.addInitScript(() => {
    sessionStorage.setItem("liberty-preloader-seen", "true");
    localStorage.setItem("liberty-analytics-consent", "declined");
  });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.getByTestId("liberty-preloader").waitFor({ state: "hidden", timeout: 10_000 });
  await page.waitForTimeout(350);
  const dimensions = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
  await page.screenshot({ path: `test-results/visual/liberty-${width}.png`, fullPage: true });
  if (width === 375 || width === 1440) {
    for (const id of ["home-hero-section", "home-services-section", "home-why-liberty-section", "home-contact-section"]) {
      await page.getByTestId(id).screenshot({ path: `test-results/visual/liberty-${width}-${id}.png` });
    }
  }
  report.push({ width, overflow: dimensions.scroll - dimensions.client, errors });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
if (report.some((entry) => entry.overflow > 1 || entry.errors.length > 0)) process.exitCode = 1;
