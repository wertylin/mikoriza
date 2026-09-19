export type Vec3 = [number, number, number];

export type MyceliumNode = {
  p: Vec3;
  depth: number;
  parent: number;
};

export type MyceliumEdge = {
  a: number;
  b: number;
  progress: number;
};

export type MyceliumGraph = {
  nodes: MyceliumNode[];
  edges: MyceliumEdge[];
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function len(v: Vec3) {
  return Math.hypot(v[0], v[1], v[2]) || 1;
}

function norm(v: Vec3): Vec3 {
  const l = len(v);
  return [v[0] / l, v[1] / l, v[2] / l];
}

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function scale(v: Vec3, s: number): Vec3 {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function dist(a: Vec3, b: Vec3) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function avoidCenter(p: Vec3): Vec3 {
  const x = p[0];
  const y = p[1];
  const r = Math.hypot(x, y * 1.25);
  if (r < 1.55) {
    const s = 1.7 / (r || 0.001);
    return [x * s, y * s, p[2] * 0.7 - 0.45];
  }
  return p;
}

export function growMycelium(budget: number, seed = 0x6d1c01a): MyceliumGraph {
  const rand = mulberry32(seed);
  const nodes: MyceliumNode[] = [];
  const edges: MyceliumEdge[] = [];
  const ring = 14;

  for (let i = 0; i < ring; i++) {
    const ang = (i / ring) * Math.PI * 2 + rand() * 0.18;
    nodes.push({
      p: [
        Math.cos(ang) * (3.55 + rand() * 0.55),
        Math.sin(ang) * (2.15 + rand() * 0.35),
        (rand() - 0.5) * 3.2,
      ],
      depth: 0,
      parent: -1,
    });
  }

  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2 + rand() * 0.4;
    nodes.push({
      p: [Math.cos(ang) * 0.55, -2.55, Math.sin(ang) * 0.55],
      depth: 0,
      parent: -1,
    });
  }

  const queue = nodes.map((_, i) => i);

  while (queue.length && nodes.length < budget) {
    const idx = queue.shift();
    if (idx === undefined) break;
    const node = nodes[idx];
    if (node.depth >= 7) continue;

    const branches = node.depth < 2 ? 3 : node.depth < 4 ? 2 : rand() > 0.5 ? 2 : 1;

    for (let b = 0; b < branches && nodes.length < budget; b++) {
      const toward = norm([-node.p[0], -node.p[1] * 0.25, -node.p[2] * 0.2]);
      const wander = norm([
        rand() - 0.5,
        rand() - 0.5,
        rand() - 0.5,
      ]);
      const dir = norm(add(scale(toward, 0.22), scale(wander, 1)));
      const length = 0.62 * Math.pow(0.86, node.depth) + 0.1 * rand();
      const childP = avoidCenter(add(node.p, scale(dir, length)));
      const childIdx = nodes.length;
      nodes.push({ p: childP, depth: node.depth + 1, parent: idx });
      edges.push({ a: idx, b: childIdx, progress: childIdx / budget });
      queue.push(childIdx);
    }
  }

  let extra = 0;
  for (let i = 0; i < nodes.length && extra < 110; i++) {
    const n = nodes[i];
    if (n.depth < 3) continue;
    let best = -1;
    let bestD = 0.42;
    for (let j = i + 1; j < nodes.length; j++) {
      const other = nodes[j];
      if (other.parent === i || n.parent === j) continue;
      if (Math.abs(other.depth - n.depth) > 2) continue;
      const d = dist(n.p, other.p);
      if (d < bestD && d > 0.16) {
        bestD = d;
        best = j;
      }
    }
    if (best >= 0 && rand() > 0.4) {
      edges.push({ a: i, b: best, progress: 0.62 + (n.depth / 8) * 0.3 });
      extra += 1;
    }
  }

  return { nodes, edges };
}

export function sampleEdge(a: Vec3, b: Vec3, t: number): Vec3 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}
