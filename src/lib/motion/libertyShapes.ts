export type LibertyShapeName = "eagle" | "services" | "shield" | "path" | "auckland" | "wings" | "promise";

export const LIBERTY_EAGLE_CONTOUR_RATIO = 0.5;
export const LIBERTY_EAGLE_FILL_RATIO = 0.34;

type Point2 = readonly [number, number];

const leftWing: readonly Point2[] = [
  [-0.16, 0.28], [-0.54, 0.72], [-1.02, 1.05], [-1.78, 1.5],
  [-1.52, 1.02], [-2.12, 1.25], [-1.6, 0.72], [-2.18, 0.82],
  [-1.5, 0.38], [-1.98, 0.4], [-0.76, 0.02], [-0.28, -0.18],
];

const rightWing: readonly Point2[] = [
  [0.08, 0.3], [0.48, 0.7], [1.02, 1.04], [2.14, 1.62],
  [1.76, 1.08], [2.3, 1.3], [1.62, 0.74], [2.18, 0.84],
  [1.4, 0.36], [1.9, 0.35], [0.68, 0.02], [0.28, -0.17],
];

const beak: readonly Point2[] = [[0.48, 0.54], [1.03, 0.38], [0.52, 0.24]];
const tail: readonly Point2[] = [[-0.32, -0.74], [-0.68, -1.38], [-0.08, -1.08], [0.18, -1.46], [0.44, -0.73]];

function random(index: number, salt = 0) {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function scatter(out: Float32Array, index: number, x: number, y: number, z = 0, spread = 0.08) {
  const offset = index * 3;
  out[offset] = x + (random(index, 1) - 0.5) * spread;
  out[offset + 1] = y + (random(index, 2) - 0.5) * spread;
  out[offset + 2] = z + (random(index, 3) - 0.5) * spread * 2;
}

function pointInPolygon(x: number, y: number, polygon: readonly Point2[]) {
  let inside = false;
  for (let current = 0, previous = polygon.length - 1; current < polygon.length; previous = current, current += 1) {
    const [currentX, currentY] = polygon[current];
    const [previousX, previousY] = polygon[previous];
    const crosses = (currentY > y) !== (previousY > y)
      && x < ((previousX - currentX) * (y - currentY)) / (previousY - currentY) + currentX;
    if (crosses) inside = !inside;
  }
  return inside;
}

function samplePolygon(polygon: readonly Point2[], index: number, salt: number): Point2 {
  const lengths = polygon.map((point, pointIndex) => {
    const next = polygon[(pointIndex + 1) % polygon.length];
    return Math.hypot(next[0] - point[0], next[1] - point[1]);
  });
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let distance = random(index, salt) * total;
  let segment = 0;
  while (segment < lengths.length - 1 && distance > lengths[segment]) {
    distance -= lengths[segment];
    segment += 1;
  }
  const point = polygon[segment];
  const next = polygon[(segment + 1) % polygon.length];
  const progress = distance / Math.max(lengths[segment], 0.0001);
  return [point[0] + (next[0] - point[0]) * progress, point[1] + (next[1] - point[1]) * progress];
}

function isInsideEagle(x: number, y: number) {
  const body = ((x + 0.01) / 0.43) ** 2 + ((y + 0.3) / 0.94) ** 2 <= 1;
  const head = ((x - 0.28) / 0.38) ** 2 + ((y - 0.33) / 0.31) ** 2 <= 1;
  return body
    || head
    || pointInPolygon(x, y, leftWing)
    || pointInPolygon(x, y, rightWing)
    || pointInPolygon(x, y, beak)
    || pointInPolygon(x, y, tail);
}

function eagleContour(out: Float32Array, index: number) {
  const selector = random(index, 31);
  let x = 0;
  let y = 0;

  if (selector < 0.29) {
    [x, y] = samplePolygon(leftWing, index, 32);
  } else if (selector < 0.58) {
    [x, y] = samplePolygon(rightWing, index, 33);
  } else if (selector < 0.7) {
    const angle = random(index, 34) * Math.PI * 2;
    x = -0.01 + Math.cos(angle) * 0.43;
    y = -0.3 + Math.sin(angle) * 0.94;
  } else if (selector < 0.8) {
    const angle = random(index, 35) * Math.PI * 2;
    x = 0.28 + Math.cos(angle) * 0.38;
    y = 0.33 + Math.sin(angle) * 0.31;
  } else if (selector < 0.87) {
    [x, y] = samplePolygon(beak, index, 36);
  } else if (selector < 0.94) {
    [x, y] = samplePolygon(tail, index, 37);
  } else {
    const side = random(index, 38) < 0.5 ? -1 : 1;
    const progress = random(index, 39);
    const feather = index % 4;
    x = side * (0.2 + progress * (1.58 + feather * 0.12));
    y = 0.14 + Math.sin(progress * Math.PI) * (0.35 + feather * 0.075) + progress * 0.34 - feather * 0.05;
  }

  scatter(out, index, x, y, (random(index, 40) - 0.5) * 0.18, 0.026);
}

function eagleFill(out: Float32Array, index: number) {
  let x = 0;
  let y = 0;
  let found = false;
  for (let attempt = 0; attempt < 48; attempt += 1) {
    x = -2.22 + random(index, 50 + attempt * 2) * 4.5;
    y = -1.42 + random(index, 51 + attempt * 2) * 3.02;
    if (isInsideEagle(x, y)) {
      found = true;
      break;
    }
  }
  if (!found) {
    const angle = random(index, 149) * Math.PI * 2;
    const radius = Math.sqrt(random(index, 150));
    x = Math.cos(angle) * 0.4 * radius;
    y = -0.3 + Math.sin(angle) * 0.9 * radius;
  }
  scatter(out, index, x, y, (random(index, 151) - 0.5) * 0.58, 0.038);
}

function eagleAtmosphere(out: Float32Array, index: number) {
  const angle = random(index, 160) * Math.PI * 2;
  const radius = 0.55 + Math.sqrt(random(index, 161)) * 1.65;
  const x = 0.48 + Math.cos(angle) * radius * 1.28;
  const y = 0.14 + Math.sin(angle) * radius * 0.78;
  scatter(out, index, x, y, (random(index, 162) - 0.5) * 2.4, 0.12);
}

function eagle(count: number) {
  const out = new Float32Array(count * 3);
  const contourEnd = Math.floor(count * LIBERTY_EAGLE_CONTOUR_RATIO);
  const fillEnd = Math.floor(count * (LIBERTY_EAGLE_CONTOUR_RATIO + LIBERTY_EAGLE_FILL_RATIO));
  for (let index = 0; index < count; index += 1) {
    if (index < contourEnd) eagleContour(out, index);
    else if (index < fillEnd) eagleFill(out, index);
    else eagleAtmosphere(out, index);
  }
  return out;
}

function serviceClusters(count: number) {
  const out = new Float32Array(count * 3);
  const centres = [
    [-1.2, 0.62], [-0.4, 0.7], [0.4, 0.7], [1.2, 0.62],
    [-1.2, -0.48], [-0.4, -0.58], [0.4, -0.58], [1.2, -0.48],
  ];
  for (let index = 0; index < count; index += 1) {
    const centre = centres[index % centres.length];
    const angle = random(index, 10) * Math.PI * 2;
    const radius = Math.sqrt(random(index, 11)) * 0.28;
    scatter(out, index, centre[0] + Math.cos(angle) * radius, centre[1] + Math.sin(angle) * radius, (random(index, 12) - 0.5) * 0.65, 0.035);
  }
  return out;
}

function shield(count: number, close = false) {
  const out = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const t = random(index, 13);
    const edge = index % 5;
    let x = 0;
    let y = 0;
    if (edge === 0) { x = -1 + t * 2; y = 0.88; }
    if (edge === 1) { x = 1 - t * 0.16; y = 0.88 - t * 1.16; }
    if (edge === 2) { x = 0.84 - t * 0.84; y = -0.28 - t * 0.82; }
    if (edge === 3) { x = -0.84 + t * 0.84; y = -0.28 - t * 0.82; }
    if (edge === 4) { x = -1 + t * 0.16; y = 0.88 - t * 1.16; }
    const scale = close ? 0.78 : 1;
    scatter(out, index, x * scale, y * scale, (random(index, 14) - 0.5) * 0.35, close ? 0.025 : 0.05);
  }
  return out;
}

function processPath(count: number) {
  const out = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const t = index / Math.max(count - 1, 1);
    const x = -1.5 + t * 3;
    const y = Math.sin(t * Math.PI * 4) * 0.34;
    const node = Math.round(t * 4) / 4;
    const nodeWeight = random(index, 15) < 0.28 ? 1 : 0;
    scatter(out, index, nodeWeight ? -1.5 + node * 3 : x, nodeWeight ? Math.sin(node * Math.PI * 4) * 0.34 : y, (random(index, 16) - 0.5) * 0.42, nodeWeight ? 0.18 : 0.045);
  }
  return out;
}

function auckland(count: number) {
  const out = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const t = random(index, 17) * Math.PI * 2;
    const radius = 0.72 + Math.sin(t * 3) * 0.2 + Math.cos(t * 5) * 0.1;
    const pinch = 0.65 + random(index, 18) * 0.45;
    const x = Math.cos(t) * radius * pinch;
    const y = Math.sin(t) * radius * 1.3 + Math.sin(t * 2) * 0.22;
    scatter(out, index, x, y, (random(index, 19) - 0.5) * 0.5, 0.1);
  }
  return out;
}

function wings(count: number) {
  const out = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const side = index % 2 === 0 ? -1 : 1;
    const t = random(index, 20);
    const feather = (index % 6) / 5;
    const x = side * (0.18 + t * 1.55);
    const y = 0.25 + Math.sin(t * Math.PI) * (0.4 + feather * 0.28) - feather * 0.16;
    scatter(out, index, x, y, (random(index, 21) - 0.5) * 0.55, 0.06);
  }
  return out;
}

export function createLibertyShapes(count: number): Record<LibertyShapeName, Float32Array> {
  return {
    eagle: eagle(count),
    services: serviceClusters(count),
    shield: shield(count),
    path: processPath(count),
    auckland: auckland(count),
    wings: wings(count),
    promise: shield(count, true),
  };
}
