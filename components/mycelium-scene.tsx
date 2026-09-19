"use client";

import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Fog,
  Group,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import { growMycelium, sampleEdge } from "@/lib/mycelium-network";

function glowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d unavailable");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.22, "rgba(255,255,255,0.45)");
  g.addColorStop(0.55, "rgba(255,255,255,0.08)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function MyceliumScene() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const compact = window.innerWidth < 720;
    const graph = growMycelium(compact ? 320 : 580);
    const bg = new Color(0x090a08);
    const hypha = new Color(0x8a9a5a);
    const spore = new Color(0xc8f04a);

    const scene = new Scene();
    scene.background = bg;
    scene.fog = new Fog(bg, 6.2, 12.5);

    const camera = new PerspectiveCamera(46, 1, 0.1, 24);
    camera.position.set(0, 0.05, compact ? 7.1 : 6.35);
    camera.lookAt(0, 0, 0);

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    renderer.setClearColor(bg, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.25 : 1.75));
    renderer.domElement.className = "mycelium-webgl";
    root.appendChild(renderer.domElement);

    const sprite = glowTexture();
    const group = new Group();
    scene.add(group);

    const edges = [...graph.edges].sort((a, b) => a.progress - b.progress);
    const linePos: number[] = [];
    const dustPos: number[] = [];
    const dustProg: number[] = [];
    const nodePos: number[] = [];
    const nodeProg: number[] = [];
    const nodeSize: number[] = [];

    for (const edge of edges) {
      const a = graph.nodes[edge.a].p;
      const b = graph.nodes[edge.b].p;
      linePos.push(a[0], a[1], a[2], b[0], b[1], b[2]);
      const samples = compact ? 5 : 8;
      for (let i = 1; i < samples; i++) {
        const t = i / samples;
        const p = sampleEdge(a, b, t);
        dustPos.push(p[0], p[1], p[2]);
        dustProg.push(edge.progress);
      }
    }

    const nodeOrder = graph.nodes
      .map((node, i) => ({ node, i }))
      .sort((a, b) => a.node.depth - b.node.depth);

    for (const { node } of nodeOrder) {
      nodePos.push(node.p[0], node.p[1], node.p[2]);
      nodeProg.push(node.parent < 0 ? 0.02 : node.depth / 8);
      nodeSize.push(node.depth < 2 ? 0.16 : node.depth < 5 ? 0.09 : 0.055);
    }

    const lineGeo = new BufferGeometry();
    lineGeo.setAttribute("position", new BufferAttribute(new Float32Array(linePos), 3));
    const lines = new LineSegments(
      lineGeo,
      new LineBasicMaterial({
        color: hypha,
        transparent: true,
        opacity: 0.42,
        fog: true,
      }),
    );
    group.add(lines);

    const dustGeo = new BufferGeometry();
    const dustCount = dustPos.length / 3;
    dustGeo.setAttribute("position", new BufferAttribute(new Float32Array(dustPos), 3));
    const dustColors = new Float32Array(dustCount * 3);
    dustGeo.setAttribute("color", new BufferAttribute(dustColors, 3));
    const dust = new Points(
      dustGeo,
      new PointsMaterial({
        map: sprite,
        vertexColors: true,
        size: compact ? 0.11 : 0.13,
        sizeAttenuation: true,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        fog: true,
      }),
    );
    group.add(dust);

    const nodeGeo = new BufferGeometry();
    const nodeCount = nodePos.length / 3;
    nodeGeo.setAttribute("position", new BufferAttribute(new Float32Array(nodePos), 3));
    const nodeColors = new Float32Array(nodeCount * 3);
    nodeGeo.setAttribute("color", new BufferAttribute(nodeColors, 3));
    const nodes = new Points(
      nodeGeo,
      new PointsMaterial({
        map: sprite,
        vertexColors: true,
        size: compact ? 0.18 : 0.22,
        sizeAttenuation: true,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        fog: true,
      }),
    );
    group.add(nodes);

    const floatCount = compact ? 48 : 84;
    const floatPos = new Float32Array(floatCount * 3);
    const floatBase = new Float32Array(floatCount * 3);
    const floatSeed = new Float32Array(floatCount);
    for (let i = 0; i < floatCount; i++) {
      floatBase[i * 3] = (Math.random() - 0.5) * 8.4;
      floatBase[i * 3 + 1] = (Math.random() - 0.5) * 5.2;
      floatBase[i * 3 + 2] = (Math.random() - 0.5) * 6.2;
      floatPos.set(floatBase.subarray(i * 3, i * 3 + 3), i * 3);
      floatSeed[i] = Math.random();
    }
    const floatGeo = new BufferGeometry();
    floatGeo.setAttribute("position", new BufferAttribute(floatPos, 3));
    const floaters = new Points(
      floatGeo,
      new PointsMaterial({
        map: sprite,
        color: spore,
        size: 0.07,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: AdditiveBlending,
        fog: true,
      }),
    );
    group.add(floaters);

    const tmp = new Color();
    const paint = (
      colors: Float32Array,
      progress: number[],
      time: number,
      attr: BufferAttribute,
    ) => {
      for (let i = 0; i < progress.length; i++) {
        const wave = Math.abs((((time * 0.09 - progress[i] * 1.4) % 1) + 1) % 1);
        const pulse = Math.pow(Math.max(0, 1 - Math.abs(wave - 0.12) / 0.12), 3);
        tmp.copy(hypha).lerp(spore, 0.35 + pulse * 0.65);
        colors[i * 3] = tmp.r;
        colors[i * 3 + 1] = tmp.g;
        colors[i * 3 + 2] = tmp.b;
      }
      attr.needsUpdate = true;
    };

    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const setSize = () => {
      const w = root.clientWidth || window.innerWidth;
      const h = root.clientHeight || window.innerHeight;
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(root);

    const lineVerts = linePos.length / 3;
    const started = performance.now();
    let raf = 0;
    let alive = true;

    const tick = (now: number) => {
      if (!alive) return;
      const t = (now - started) / 1000;
      const grow = easeOutCubic(Math.min(t / 3.2, 1));

      lineGeo.setDrawRange(0, Math.max(2, Math.floor(lineVerts * grow) & ~1));
      dustGeo.setDrawRange(0, Math.floor(dustCount * grow));
      nodeGeo.setDrawRange(0, Math.floor(nodeCount * grow));

      paint(dustColors, dustProg, t, dustGeo.getAttribute("color") as BufferAttribute);
      paint(nodeColors, nodeProg, t, nodeGeo.getAttribute("color") as BufferAttribute);

      const pos = floatGeo.getAttribute("position") as BufferAttribute;
      for (let i = 0; i < floatCount; i++) {
        const seed = floatSeed[i];
        const y = ((floatBase[i * 3 + 1] + 2.6 + t * (0.07 + seed * 0.05)) % 5.2) - 2.6;
        pos.setXYZ(
          i,
          floatBase[i * 3] + Math.sin(t * 0.6 + seed * 12) * 0.16,
          y,
          floatBase[i * 3 + 2] + Math.cos(t * 0.5 + seed * 9) * 0.16,
        );
      }
      pos.needsUpdate = true;

      mouse.x += (target.x - mouse.x) * 0.045;
      mouse.y += (target.y - mouse.y) * 0.045;
      group.rotation.y = mouse.x * 0.22 + t * 0.02;
      group.rotation.x = mouse.y * 0.1;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    tick(performance.now());

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (alive) {
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      lineGeo.dispose();
      dustGeo.dispose();
      nodeGeo.dispose();
      floatGeo.dispose();
      lines.material.dispose();
      dust.material.dispose();
      nodes.material.dispose();
      floaters.material.dispose();
      sprite.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    />
  );
}
