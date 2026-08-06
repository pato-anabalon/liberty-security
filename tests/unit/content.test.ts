import { describe, expect, it } from "vitest";
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
});
