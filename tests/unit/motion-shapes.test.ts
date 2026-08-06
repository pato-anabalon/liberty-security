import { describe, expect, it } from "vitest";
import {
  createLibertyShapes,
  LIBERTY_EAGLE_CONTOUR_RATIO,
  LIBERTY_EAGLE_FILL_RATIO,
} from "@/lib/motion/libertyShapes";

function axisValues(shape: Float32Array, axis: 0 | 1 | 2) {
  const values: number[] = [];
  for (let index = axis; index < shape.length; index += 3) values.push(shape[index]);
  return values;
}

describe("Liberty eagle particle geometry", () => {
  it("creates a deterministic, recognisable wide-wing silhouette", () => {
    const first = createLibertyShapes(1000).eagle;
    const second = createLibertyShapes(1000).eagle;
    const x = axisValues(first, 0);
    const y = axisValues(first, 1);

    expect(first).toEqual(second);
    expect(first).toHaveLength(3000);
    expect(Math.min(...x)).toBeLessThan(-2);
    expect(Math.max(...x)).toBeGreaterThan(2.1);
    expect(Math.min(...y)).toBeLessThan(-1.3);
    expect(Math.max(...y)).toBeGreaterThan(1.5);
  });

  it("reserves explicit contour, fill and atmospheric particle layers", () => {
    const count = 1000;
    const eagle = createLibertyShapes(count).eagle;
    const contourEnd = Math.floor(count * LIBERTY_EAGLE_CONTOUR_RATIO);
    const fillEnd = Math.floor(count * (LIBERTY_EAGLE_CONTOUR_RATIO + LIBERTY_EAGLE_FILL_RATIO));
    let atmosphericDepth = 0;

    for (let index = fillEnd; index < count; index += 1) {
      if (Math.abs(eagle[index * 3 + 2]) > 0.7) atmosphericDepth += 1;
    }

    expect(contourEnd).toBe(500);
    expect(fillEnd).toBe(840);
    expect(atmosphericDepth).toBeGreaterThan(40);
  });
});
