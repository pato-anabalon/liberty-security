"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import {
  createLibertyShapes,
  LIBERTY_EAGLE_CONTOUR_RATIO,
  LIBERTY_EAGLE_FILL_RATIO,
  type LibertyShapeName,
} from "@/lib/motion/libertyShapes";

type SceneDetail = { from: LibertyShapeName; to: LibertyShapeName; progress: number };

const PRELOADER_SESSION_KEY = "liberty-preloader-seen";

const vertexShader = /* glsl */ `
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    float perspective = clamp(5.2 / -modelViewPosition.z, 0.62, 2.1);
    gl_PointSize = aSize * uPixelRatio * perspective;
    gl_Position = projectionMatrix * modelViewPosition;
    vAlpha = aAlpha;
    vColor = aColor;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float distanceFromCentre = distance(gl_PointCoord, vec2(0.5));
    float disc = 1.0 - smoothstep(0.27, 0.5, distanceFromCentre);
    float glow = 1.0 - smoothstep(0.0, 0.5, distanceFromCentre);
    float alpha = vAlpha * disc;
    if (alpha < 0.012) discard;
    gl_FragColor = vec4(vColor * (0.82 + glow * 0.32), alpha);
  }
`;

function deterministicRandom(index: number, salt: number) {
  const value = Math.sin((index + 1) * 17.183 + salt * 41.731) * 43758.5453;
  return value - Math.floor(value);
}

function hasSeenPreloader() {
  try {
    return window.sessionStorage.getItem(PRELOADER_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function StaticEagle() {
  return (
    <svg
      className="liberty-motion-static"
      data-testid="liberty-motion-static-fallback"
      viewBox="0 0 600 420"
      role="img"
      aria-label="Abstract eagle formed by fine golden lines"
    >
      <g transform="translate(300 205) scale(112 -112)">
        <path d="M-.16 .28L-.54 .72L-1.02 1.05L-1.78 1.5L-1.52 1.02L-2.12 1.25L-1.6 .72L-2.18 .82L-1.5 .38L-1.98 .4L-.76 .02L-.28-.18Z" />
        <path d="M.08 .3L.48 .7L1.02 1.04L2.14 1.62L1.76 1.08L2.3 1.3L1.62 .74L2.18 .84L1.4 .36L1.9 .35L.68 .02L.28-.17Z" />
        <ellipse cx="-.01" cy="-.3" rx=".43" ry=".94" />
        <ellipse cx=".28" cy=".33" rx=".38" ry=".31" />
        <path d="M.48 .54L1.03 .38L.52 .24Z" />
        <path d="M-.32-.74L-.68-1.38L-.08-1.08L.18-1.46L.44-.73Z" />
      </g>
    </svg>
  );
}

export function LibertyMotionCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isCompact = window.matchMedia("(max-width: 767px)").matches;
    const isTablet = window.matchMedia("(min-width: 768px) and (max-width: 1023px)").matches;
    const count = isCompact ? 1600 : isTablet ? 3800 : 6200;
    const shapes = createLibertyShapes(count);
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isCompact,
        powerPreference: "high-performance",
      });
    } catch {
      host.classList.add("liberty-motion-canvas--fallback");
      return;
    }

    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.z = 5.2;

    const positions = shapes.eagle.slice();
    const introPositions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);
    const colours = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const contourEnd = Math.floor(count * LIBERTY_EAGLE_CONTOUR_RATIO);
    const fillEnd = Math.floor(count * (LIBERTY_EAGLE_CONTOUR_RATIO + LIBERTY_EAGLE_FILL_RATIO));
    const cream = new THREE.Color("#f2efe8");
    const gold = new THREE.Color("#c8a45d");
    const blue = new THREE.Color("#3c507d");

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      const side = positions[offset] < 0 ? -1 : 1;
      introPositions[offset] = side * (3.5 + deterministicRandom(index, 1) * 0.9);
      introPositions[offset + 1] = positions[offset + 1] * 0.22 + (deterministicRandom(index, 2) - 0.5) * 0.34;
      introPositions[offset + 2] = (deterministicRandom(index, 3) - 0.5) * 1.8;
      phases[index] = deterministicRandom(index, 4) * Math.PI * 2;

      let colour: THREE.Color;
      if (index < contourEnd) {
        sizes[index] = 3 + deterministicRandom(index, 5) * 1.7;
        alphas[index] = 0.72 + deterministicRandom(index, 6) * 0.25;
        colour = gold.clone().lerp(cream, deterministicRandom(index, 7) * 0.24);
      } else if (index < fillEnd) {
        sizes[index] = 1.8 + deterministicRandom(index, 8) * 1.8;
        alphas[index] = 0.4 + deterministicRandom(index, 9) * 0.34;
        colour = cream.clone().lerp(gold, 0.35 + deterministicRandom(index, 10) * 0.45);
      } else {
        sizes[index] = 1.3 + deterministicRandom(index, 11) * 1.5;
        alphas[index] = 0.16 + deterministicRandom(index, 12) * 0.25;
        colour = blue.clone().lerp(gold, 0.12 + deterministicRandom(index, 13) * 0.25);
      }
      colours[offset] = colour.r;
      colours[offset + 1] = colour.g;
      colours[offset + 2] = colour.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colours, 3));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { uPixelRatio: { value: 1 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    host.appendChild(renderer.domElement);

    let fromName: LibertyShapeName = "eagle";
    let toName: LibertyShapeName = "eagle";
    let from = shapes.eagle;
    let to = shapes.eagle;
    let progress = 0;
    let pointerActive = false;
    let pointerWorldX = 99;
    let pointerWorldY = 99;
    let pointerTargetX = 99;
    let pointerTargetY = 99;
    let tiltX = 0;
    let tiltY = 0;
    let frame = 0;
    let lastFrame = 0;
    const formation = { progress: hasSeenPreloader() ? 1 : 0 };
    let formationTween: gsap.core.Tween | undefined;
    const gsapContext = gsap.context(() => {}, host);

    function resize() {
      const width = hostRef.current?.clientWidth ?? window.innerWidth;
      const height = hostRef.current?.clientHeight ?? window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio, isCompact ? 1 : 1.5);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      material.uniforms.uPixelRatio.value = pixelRatio;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    }

    function onScene(event: Event) {
      const detail = (event as CustomEvent<SceneDetail>).detail;
      if (!detail || !shapes[detail.from] || !shapes[detail.to]) return;
      fromName = detail.from;
      toName = detail.to;
      from = shapes[fromName];
      to = shapes[toName];
      progress = Math.min(1, Math.max(0, detail.progress));
    }

    function onPointer(event: PointerEvent) {
      if (isCompact || event.pointerType === "touch") return;
      const worldHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.position.z;
      const worldWidth = worldHeight * camera.aspect;
      const eagleScale = isTablet ? 0.82 : 0.88;
      pointerTargetX = ((event.clientX / window.innerWidth) * 2 - 1) * worldWidth * 0.5;
      pointerTargetY = (1 - (event.clientY / window.innerHeight) * 2) * worldHeight * 0.5;
      pointerTargetX = (pointerTargetX - points.position.x) / eagleScale;
      pointerTargetY = (pointerTargetY - points.position.y) / eagleScale;
      if (!pointerActive) {
        pointerWorldX = pointerTargetX;
        pointerWorldY = pointerTargetY;
      }
      pointerActive = true;
    }

    function clearPointer() {
      pointerActive = false;
      pointerTargetX = 99;
      pointerTargetY = 99;
    }

    function formEagle() {
      formationTween?.kill();
      gsapContext.add(() => {
        formationTween = gsap.to(formation, {
          progress: 1,
          duration: 1.35,
          ease: "power4.out",
          overwrite: true,
        });
      });
    }

    function render(time: number) {
      frame = window.requestAnimationFrame(render);
      if (isCompact && time - lastFrame < 32) return;
      lastFrame = time;

      const eased = progress * progress * (3 - 2 * progress);
      const fromEagle = fromName === "eagle" ? 1 : 0;
      const toEagle = toName === "eagle" ? 1 : 0;
      const eagleWeight = fromEagle + (toEagle - fromEagle) * eased;
      const targetX = eagleWeight * (isCompact ? 0.28 : isTablet ? 0.58 : 0.96);
      const targetScale = eagleWeight > 0 ? (isCompact ? 0.66 : isTablet ? 0.82 : 0.88) : (isCompact ? 0.8 : 1);
      points.position.x += (targetX - points.position.x) * 0.055;
      points.scale.x += (targetScale - points.scale.x) * 0.055;
      points.scale.y += (targetScale - points.scale.y) * 0.055;
      points.scale.z += (targetScale - points.scale.z) * 0.055;

      pointerWorldX += (pointerTargetX - pointerWorldX) * 0.075;
      pointerWorldY += (pointerTargetY - pointerWorldY) * 0.075;
      const pointerTiltX = pointerActive && eagleWeight > 0.1
        ? THREE.MathUtils.clamp(pointerWorldY * 0.012, -0.035, 0.035)
        : 0;
      const pointerTiltY = pointerActive && eagleWeight > 0.1
        ? THREE.MathUtils.clamp(pointerWorldX * 0.012, -0.045, 0.045)
        : 0;
      tiltX += (pointerTiltX - tiltX) * 0.045;
      tiltY += (pointerTiltY - tiltY) * 0.045;
      points.rotation.x = tiltX;
      points.rotation.y = tiltY;

      const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
      const array = attr.array as Float32Array;
      const formationEase = 1 - (1 - formation.progress) ** 3;
      for (let index = 0; index < count; index += 1) {
        const offset = index * 3;
        const baseX = from[offset] + (to[offset] - from[offset]) * eased;
        const baseY = from[offset + 1] + (to[offset + 1] - from[offset + 1]) * eased;
        const baseZ = from[offset + 2] + (to[offset + 2] - from[offset + 2]) * eased;
        const formedX = introPositions[offset] + (baseX - introPositions[offset]) * formationEase;
        const formedY = introPositions[offset + 1] + (baseY - introPositions[offset + 1]) * formationEase;
        const formedZ = introPositions[offset + 2] + (baseZ - introPositions[offset + 2]) * formationEase;
        const featherMotion = eagleWeight * Math.sin(time * 0.00115 + phases[index]) * (index < contourEnd ? 0.009 : 0.005);
        const depthMotion = Math.sin(time * 0.00042 + phases[index]) * (index >= fillEnd ? 0.035 : 0.012);
        let reactionX = 0;
        let reactionY = 0;

        if (pointerActive && eagleWeight > 0.08 && index < fillEnd) {
          const deltaX = formedX - pointerWorldX;
          const deltaY = formedY - pointerWorldY;
          const distanceSquared = deltaX * deltaX + deltaY * deltaY;
          const radius = 0.58;
          if (distanceSquared < radius * radius && distanceSquared > 0.0001) {
            const distance = Math.sqrt(distanceSquared);
            const force = (1 - distance / radius) ** 2 * 0.22 * eagleWeight;
            reactionX = (deltaX / distance) * force;
            reactionY = (deltaY / distance) * force;
          }
        }

        array[offset] = formedX + reactionX;
        array[offset + 1] = formedY + featherMotion + reactionY;
        array[offset + 2] = formedZ + depthMotion;
      }
      attr.needsUpdate = true;
      renderer.render(scene, camera);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("mouseleave", clearPointer);
    window.addEventListener("blur", clearPointer);
    window.addEventListener("liberty:motion-scene", onScene);
    window.addEventListener("liberty:preloader-complete", formEagle);
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("mouseleave", clearPointer);
      window.removeEventListener("blur", clearPointer);
      window.removeEventListener("liberty:motion-scene", onScene);
      window.removeEventListener("liberty:preloader-complete", formEagle);
      formationTween?.kill();
      gsapContext.revert();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div ref={hostRef} className="liberty-motion-canvas" data-testid="liberty-motion-canvas" aria-hidden="true">
      <StaticEagle />
    </div>
  );
}
