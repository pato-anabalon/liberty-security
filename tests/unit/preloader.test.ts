import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  PRELOADER_SESSION_KEY,
  calculateCoverRadius,
  createCompletionGate,
  shouldBypassPreloader,
  waitForImage,
  waitForPreloaderAssets,
} from "@/lib/motion/preloader";

afterEach(() => {
  vi.useRealTimers();
});

describe("preloader orchestration", () => {
  it("keeps the branded pre-hydration state visible without JavaScript", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    const compositionRule = css.match(/\.preloader__composition\s*\{([^}]*)\}/)?.[1];
    const fillRule = css.match(/\.preloader__indicator-fill\s*\{([^}]*)\}/)?.[1];
    const coverRule = css.match(/\.preloader__cover\s*\{([^}]*)\}/)?.[1];

    expect(compositionRule).toBeDefined();
    expect(compositionRule).not.toMatch(/opacity\s*:\s*0/);
    expect(fillRule).toContain("clip-path: inset(0 100% 0 0)");
    expect(coverRule).toContain("clip-path: circle(0 at 50% 50%)");
  });

  it("plays only for an unseen session without reduced motion", () => {
    const unseen = { getItem: () => null };
    const seen = { getItem: () => "true" };

    expect(shouldBypassPreloader(unseen, false)).toBe(false);
    expect(shouldBypassPreloader(seen, false)).toBe(true);
    expect(shouldBypassPreloader(seen, false, true)).toBe(false);
    expect(shouldBypassPreloader(unseen, true)).toBe(true);
    expect(shouldBypassPreloader(seen, true, true)).toBe(true);
    expect(PRELOADER_SESSION_KEY).toBe("liberty-preloader-seen");
  });

  it("bypasses the intro when storage access is restricted", () => {
    const restricted = { getItem: () => { throw new Error("blocked"); } };
    expect(shouldBypassPreloader(restricted, false)).toBe(true);
    expect(shouldBypassPreloader(null, false)).toBe(true);
  });

  it("treats an image error as resolved", async () => {
    const image = document.createElement("img");
    const ready = waitForImage(image);

    image.dispatchEvent(new Event("error"));

    await expect(ready).resolves.toBeUndefined();
  });

  it("releases asset waiting at the timeout", async () => {
    vi.useFakeTimers();
    const pendingFonts = new Promise(() => undefined);
    const ready = waitForPreloaderAssets({ images: [], fontsReady: pendingFonts, timeoutMs: 2200 });

    await vi.advanceTimersByTimeAsync(2200);

    await expect(ready).resolves.toBeUndefined();
  });

  it("runs the release callback once", () => {
    const gate = createCompletionGate();
    const release = vi.fn();

    expect(gate.run(release)).toBe(true);
    expect(gate.run(release)).toBe(false);
    expect(release).toHaveBeenCalledTimes(1);
  });

  it.each([
    [375, 667],
    [768, 1024],
    [1024, 768],
    [1440, 900],
  ])("covers a %i by %i viewport from an off-centre dot", (viewportWidth, viewportHeight) => {
    const centerX = viewportWidth * 0.47;
    const centerY = viewportHeight * 0.54;
    const coveredRadius = calculateCoverRadius({ viewportWidth, viewportHeight, centerX, centerY });
    const requiredRadius = Math.hypot(
      Math.max(centerX, viewportWidth - centerX),
      Math.max(centerY, viewportHeight - centerY),
    );

    expect(coveredRadius).toBeGreaterThan(requiredRadius);
  });
});
