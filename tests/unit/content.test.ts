import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { services } from "@/lib/content";

describe("Liberty commercial content", () => {
  it("keeps all eight services in explicit order", () => {
    expect(services).toHaveLength(8);
    expect(services[0].id).toBe("event-security");
    expect(services.map((service) => service.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("describes CCTV as on-site surveillance", () => {
    const cctv = services.find((service) => service.id === "cctv-monitoring");
    expect(cctv?.eyebrow).toContain("On-site");
    expect(cctv?.detail).toContain("monitor CCTV from your site");
  });

  it("maps every service to an available visual asset", () => {
    expect(new Set(services.map((service) => service.image.src)).size).toBe(services.length);
    for (const service of services) {
      expect(service.image.src).toMatch(/^\/services\/.+\.png$/);
      expect(existsSync(join(process.cwd(), "public", service.image.src.slice(1)))).toBe(true);
    }
  });
});
