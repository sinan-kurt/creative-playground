import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* ------------------------------------------------------------------ */
/*  Fikirler (beynin içindeki nöronlar)                                */
/* ------------------------------------------------------------------ */
const app = document.getElementById('app');
const BASE = (app && app.dataset.base) || '';
const IDEAS = [
  {
    id: 'ben', title: 'Ben', kind: 'Merkez', status: 'İstanbul · 2026', center: true,
    q: 'Fikri düşünmekle kalmayıp çalışan bir şeye çevirmek.',
    desc: 'Yazılım, ürün ve tasarımın kesiştiği yerde çalışıyorum. Bu beyindeki her şey önce bir sorudan çıktı.',
    stack: 'TypeScript · Next.js · Astro · Supabase · Unity',
    links: [['Hakkımda', BASE + '/about'], ['Instagram', 'https://instagram.com/sina.hustle']],
    pos: [0, 0, 0],
  },
  {
    id: 'metrajos', title: 'MetrajOS', kind: 'Ürün · SaaS', status: 'MVP canlı', live: true,
    q: 'İki metraj revizyonu arasında ne değişti, maliyete nasıl yansıdı?',
    desc: 'İki Excel metraj dosyasını karşılaştırır. Eklenen, silinen ve miktarı değişen satırları işaretler, maliyet etkisini görünür yapar.',
    stack: 'Next.js · TypeScript · Supabase',
    links: [['Siteyi dene', 'https://metrajos.vercel.app/'], ['Proje sayfası', BASE + '/projects/metrajos/']],
    pos: [-1.95, 0.75, 0.35],
  },
  {
    id: 'mola', title: 'Mola Oyunları', kind: 'Oyun · Tarayıcı', status: 'Oynanabilir', live: true,
    q: 'Çay ocağı ve dolmuş durağı küçük bir oyuna dönüşür mü?',
    desc: 'Türkiye’de gündelik hayattan çıkan, birkaç dakikalık tarayıcı oyunları. Tanıdık sahneler, basit kurallar.',
    stack: 'JavaScript · HTML/CSS · Oyun tasarımı',
    links: [['Hemen oyna', 'https://sinan-kurt.github.io/herdilabs-play/'], ['Proje sayfası', BASE + '/projects/mola-oyunlari/']],
    pos: [1.9, 0.95, -0.4],
  },
  {
    id: 'sevgili', title: 'Sevgili Bulmacası', kind: 'Deney · Etkileşimli', status: 'Yakında',
    q: 'Sevdiğin birine mesaj yerine bulmaca göndersen?',
    desc: 'Bulmacayı sen kuruyorsun, linki gönderiyorsun. Karşı taraf çözdükçe mesajın ortaya çıkıyor. Oynanabilir MVP hazır.',
    stack: 'Next.js · TypeScript · Supabase',
    links: [['Proje sayfası', BASE + '/projects/sevgili-bulmacasi/']],
    pos: [1.55, -1.05, 0.65],
  },
  {
    id: 'offra', title: 'Offra Studio', kind: 'Girişim · Stüdyo', status: 'Kurucu ortak',
    q: 'Kimlik, strateji ve dijital deneyimi tek çatı altında yapmak.',
    desc: 'Kurucu ortaklarından olduğum yaratıcı stüdyo: kimlik tasarımı, yaratıcı strateji ve dijital deneyimler.',
    stack: 'Marka · Strateji · Dijital',
    links: [['Proje sayfası', BASE + '/projects/offra-studio/']],
    pos: [-1.7, -1.1, -0.55],
  },
  {
    id: 'sonraki', title: 'Sıradaki fikir', kind: 'Henüz isimsiz', status: 'Pişiyor',
    q: 'Bir sonraki tuhaf fikir ne olacak?',
    desc: 'Burada her zaman yarım kalmış bir şey dönüyor. Süreci Instagram’da paylaşıyorum, bir fikrin varsa yaz.',
    stack: '???',
    links: [['Instagram’da takip et', 'https://instagram.com/sina.hustle'], ['Deftere not bırak', BASE + '/guestbook']],
    pos: [0.15, 1.75, -1.0],
  },
];
const LINKS = [['ben', 'metrajos'], ['ben', 'mola'], ['ben', 'sevgili'], ['ben', 'offra'], ['ben', 'sonraki'], ['metrajos', 'offra'], ['mola', 'sevgili'], ['mola', 'sonraki']];

const METALS = {
  gold: { color: 0xE7B964, glow: 0xFFC766, css: '#E7B964' },
  silver: { color: 0xD3D9E2, glow: 0xBFD6FF, css: '#D3D9E2' },
};

/* ------------------------------------------------------------------ */
/*  Simplex gürültü (kıvrımlar için)                                    */
/* ------------------------------------------------------------------ */
function makeNoise(seed) {
  const grad = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let s = seed;
  for (let i = 255; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); const t = p[i]; p[i] = p[j]; p[j] = t; }
  const perm = new Uint8Array(512), pm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; pm[i] = perm[i] % 12; }
  const F3 = 1 / 3, G3 = 1 / 6;
  const c = (gi, x, y, z) => { let t = 0.6 - x * x - y * y - z * z; if (t < 0) return 0; t *= t; const g = grad[gi]; return t * t * (g[0] * x + g[1] * y + g[2] * z); };
  return (x, y, z) => {
    const s2 = (x + y + z) * F3;
    const i = Math.floor(x + s2), j = Math.floor(y + s2), k = Math.floor(z + s2);
    const t = (i + j + k) * G3;
    const x0 = x - (i - t), y0 = y - (j - t), z0 = z - (k - t);
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }
    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;
    const ii = i & 255, jj = j & 255, kk = k & 255;
    return 32 * (
      c(pm[ii + perm[jj + perm[kk]]], x0, y0, z0) +
      c(pm[ii + i1 + perm[jj + j1 + perm[kk + k1]]], x1, y1, z1) +
      c(pm[ii + i2 + perm[jj + j2 + perm[kk + k2]]], x2, y2, z2) +
      c(pm[ii + 1 + perm[jj + 1 + perm[kk + 1]]], x3, y3, z3)
    );
  };
}
const smooth = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

/* ------------------------------------------------------------------ */
/*  Beyin geometrisi                                                    */
/* ------------------------------------------------------------------ */
function hemisphere(side, noise, detail) {
  const geo = new THREE.SphereGeometry(1, detail * 2, Math.round(detail * 1.5));
  const pos = geo.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const A = 0.58, B = 0.66, C = 1.0;
  for (let i = 0; i < pos.count; i++) {
    const ux = pos.getX(i), uy = pos.getY(i), uz = pos.getZ(i);
    const inner = ux * side < 0;
    let x = ux * (inner ? 0.16 : 1), y = uy, z = uz;
    // alt ve ön daralır, şakak lobu yanlara şişer, alt yüzey düzleşir
    const bottom = Math.max(0, -uy);
    const wf = 1 - 0.22 * bottom * bottom - 0.1 * Math.max(0, uz);
    const temporal = Math.exp(-((uy + 0.4) ** 2) / 0.06 - ((uz - 0.1) ** 2) / 0.3) * 0.14;
    x = x * A * wf + side * (inner ? 0 : temporal);
    if (y < -0.3) y = -0.3 + (y + 0.3) * 0.45;
    y *= B; z *= C;
    // kıvrımlar: bükülmüş gürültünün sıfır çizgileri = oluklar, aradaki yuvarlak sırtlar = girintiler
    const f = 3.1, nx = ux * f + side * 9.3, ny = uy * f, nz = uz * f;
    const w = noise(nx * 0.5, ny * 0.5, nz * 0.5) * 0.9;
    const n1 = noise(nx + w, ny - w, nz + w);
    const n2 = noise(nx * 1.9 + 4.1 + w, ny * 1.9, nz * 1.9 - w);
    const g1 = smooth(0, 0.24, Math.abs(n1));
    const g2 = smooth(0, 0.1, Math.abs(n2));
    let d = -0.075 * (1 - g1) - 0.006 * (1 - g2) * g1 + 0.01 * Math.sqrt(g1);
    if (inner) d *= 0.2;
    const nl = new THREE.Vector3(x / (A * A), y / (B * B), z / (C * C)).normalize();
    pos.setXYZ(i, x + nl.x * d + side * 0.018, y + nl.y * d, z + nl.z * d);
    const shade = inner ? 0.75 : 0.4 + 0.6 * g1;
    col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = shade;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  return geo;
}

function cerebellum(noise) {
  const geo = new THREE.SphereGeometry(1, 120, 80);
  const pos = geo.attributes.position;
  const col = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const ux = pos.getX(i), uy = pos.getY(i), uz = pos.getZ(i);
    const band = Math.abs(Math.sin(uy * 22 + noise(ux * 2, uy * 2, uz * 2) * 1.6));
    const g = smooth(0, 0.35, band);
    const d = -0.05 * (1 - g);
    const r = 1 + d;
    const midGroove = 1 - 0.12 * Math.exp(-(ux * ux) / 0.01);
    pos.setXYZ(i, ux * r * 0.5 * midGroove, uy * r * 0.27, uz * r * 0.34);
    const shade = 0.45 + 0.55 * g;
    col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = shade;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  return geo;
}

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)');
  r.addColorStop(0.18, 'rgba(255,255,255,0.55)');
  r.addColorStop(0.5, 'rgba(255,255,255,0.12)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------------------------------------------ */
/*  Sahne                                                               */
/* ------------------------------------------------------------------ */
const canvas = document.getElementById('gl');
const stage = document.getElementById('stage');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (e) {
  renderer = null;
}

if (!renderer || !renderer.getContext()) {
  document.documentElement.classList.add('no-gl');
} else {
  start();
}

function start() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 700px)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 100);
  const CAM_BRAIN = 5.2, CAM_MIND = 6.2;
  camera.position.set(0, 0, CAM_BRAIN);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const key = new THREE.DirectionalLight(0xfff1dc, 2.4); key.position.set(2.5, 3, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0xb88cff, 1.5); rim.position.set(-3, 1.5, -3); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffb27a, 0.8); fill.position.set(0, -3, 2); scene.add(fill);

  let metal = 'gold';
  const brainMat = new THREE.MeshPhysicalMaterial({
    color: METALS.gold.color, metalness: 1, roughness: 0.3, vertexColors: true,
    clearcoat: 0.35, clearcoatRoughness: 0.35, transparent: true, opacity: 1,
  });

  // beyin
  const noise = makeNoise(7);
  const detail = small ? 100 : 150;
  const brain = new THREE.Group();
  const meshes = [
    new THREE.Mesh(hemisphere(1, noise, detail), brainMat),
    new THREE.Mesh(hemisphere(-1, noise, detail), brainMat),
  ];
  const cb = new THREE.Mesh(cerebellum(noise), brainMat);
  cb.position.set(0, -0.38, -0.62);
  cb.rotation.x = 0.25;
  meshes.push(cb);
  const stemGeo = new THREE.CylinderGeometry(0.12, 0.085, 0.42, 40, 1);
  const sc = new Float32Array(stemGeo.attributes.position.count * 3).fill(0.7);
  stemGeo.setAttribute('color', new THREE.BufferAttribute(sc, 3));
  const stem = new THREE.Mesh(stemGeo, brainMat);
  stem.position.set(0, -0.58, -0.3);
  stem.rotation.x = 0.35;
  meshes.push(stem);
  meshes.forEach((m) => brain.add(m));
  const brainPivot = new THREE.Group();
  brainPivot.add(brain);
  brain.rotation.x = 0.28;
  brainPivot.rotation.y = 0.9;
  brainPivot.position.y = small ? -0.3 : 0.08;
  brainPivot.scale.setScalar(small ? 1.05 : 1.32);
  scene.add(brainPivot);

  // toz / sinaps parçacıkları
  const dustN = 700;
  const dustPos = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) {
    const r = 1.2 + Math.random() * 5;
    const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    dustPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    dustPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.8;
    dustPos[i * 3 + 2] = r * Math.cos(ph);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const glowTex = glowTexture();
  const dustMat = new THREE.PointsMaterial({ size: 0.05, map: glowTex, color: METALS.gold.glow, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // beynin içi: nöronlar
  const mind = new THREE.Group();
  mind.visible = false;
  scene.add(mind);
  const nodeMat = new THREE.MeshPhysicalMaterial({ color: METALS.gold.color, metalness: 1, roughness: 0.25, transparent: true });
  const glowMats = [];
  const nodes = {};
  IDEAS.forEach((idea) => {
    const g = new THREE.Group();
    g.position.fromArray(idea.pos);
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(idea.center ? 0.2 : 0.13, 4), nodeMat);
    const gm = new THREE.SpriteMaterial({ map: glowTex, color: METALS.gold.glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: idea.live ? 0.95 : 0.6 });
    glowMats.push(gm);
    const glow = new THREE.Sprite(gm);
    glow.scale.setScalar(idea.center ? 1.5 : 1.05);
    g.add(core, glow);
    g.userData = { idea, phase: Math.random() * Math.PI * 2 };
    mind.add(g);
    nodes[idea.id] = g;
  });
  const lineMat = new THREE.LineBasicMaterial({ color: METALS.gold.glow, transparent: true, opacity: 0.28 });
  const pulses = [];
  const pulseMat = new THREE.SpriteMaterial({ map: glowTex, color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  LINKS.forEach(([a, b]) => {
    const pa = nodes[a].position, pb = nodes[b].position;
    const mid = pa.clone().add(pb).multiplyScalar(0.5).add(new THREE.Vector3((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6));
    const curve = new THREE.QuadraticBezierCurve3(pa.clone(), mid, pb.clone());
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)), lineMat);
    mind.add(line);
    const p = new THREE.Sprite(pulseMat);
    p.scale.setScalar(0.22);
    mind.add(p);
    pulses.push({ curve, sprite: p, t: Math.random(), speed: 0.18 + Math.random() * 0.2 });
  });

  /* ---------- DOM ---------- */
  const intro = document.getElementById('intro');
  const enterWrap = document.getElementById('enterWrap');
  const mindUi = document.getElementById('mindUi');
  const labelsEl = document.getElementById('labels');
  const flash = document.getElementById('flash');
  const panel = document.getElementById('panel');
  const enterBtn = document.getElementById('enter');
  const leaveBtn = document.getElementById('leave');

  const labels = IDEAS.map((idea) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'node-label' + (idea.center ? ' is-center' : '');
    const t = document.createElement('span'); t.className = 'nl-title'; t.textContent = idea.title;
    const k = document.createElement('span'); k.className = 'nl-kind'; k.textContent = idea.status;
    b.append(t, k);
    b.addEventListener('click', () => openPanel(idea));
    b.addEventListener('pointerenter', () => { hoverLabel = true; });
    b.addEventListener('pointerleave', () => { hoverLabel = false; });
    b.addEventListener('focus', () => { hoverLabel = true; });
    b.addEventListener('blur', () => { hoverLabel = false; });
    labelsEl.appendChild(b);
    return { el: b, idea };
  });

  function openPanel(idea) {
    panel.replaceChildren();
    const close = document.createElement('button');
    close.type = 'button'; close.className = 'panel-close'; close.setAttribute('aria-label', 'Kapat'); close.textContent = '×';
    close.addEventListener('click', closePanel);
    const kind = document.createElement('p'); kind.className = 'eyebrow'; kind.textContent = idea.kind + ' · ' + idea.status;
    const h = document.createElement('h3'); h.textContent = idea.title;
    const q = document.createElement('p'); q.className = 'panel-q'; q.textContent = idea.q;
    const d = document.createElement('p'); d.className = 'panel-desc'; d.textContent = idea.desc;
    const s = document.createElement('p'); s.className = 'panel-stack'; s.textContent = idea.stack;
    const ls = document.createElement('div'); ls.className = 'panel-links';
    idea.links.forEach(([label, href], i) => {
      const a = document.createElement('a');
      a.href = href; a.textContent = label + ' ↗'; a.className = i === 0 ? 'pl primary' : 'pl';
      ls.appendChild(a);
    });
    panel.append(close, kind, h, q, d, s, ls);
    panel.hidden = false;
    selected = idea.id;
    close.focus({ preventScroll: true });
  }
  function closePanel() { panel.hidden = true; selected = null; }
  let selected = null;
  let hoverLabel = false;

  /* ---------- Metal seçimi ---------- */
  document.querySelectorAll('[data-metal]').forEach((btn) => {
    btn.addEventListener('click', () => setMetal(btn.dataset.metal));
  });
  function setMetal(m) {
    metal = m;
    const M = METALS[m];
    brainMat.color.setHex(M.color);
    nodeMat.color.setHex(M.color);
    dustMat.color.setHex(M.glow);
    lineMat.color.setHex(M.glow);
    glowMats.forEach((g) => g.color.setHex(M.glow));
    document.documentElement.style.setProperty('--metal', M.css);
    document.querySelectorAll('[data-metal]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.metal === m)));
    try { localStorage.setItem('brain-metal', m); } catch (e) {}
  }
  try { const saved = localStorage.getItem('brain-metal'); if (saved && METALS[saved]) setMetal(saved); } catch (e) {}

  /* ---------- Etkileşim ---------- */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hover = false;
  let drag = null;
  let spinVel = 0;
  let parX = 0, parY = 0;

  function setNdc(e) {
    const r = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  }
  function hitBrain() {
    ray.setFromCamera(ndc, camera);
    return ray.intersectObjects(meshes, false).length > 0;
  }
  canvas.addEventListener('pointerdown', (e) => {
    setNdc(e);
    drag = { x: e.clientX, y: e.clientY, lastX: e.clientX, moved: 0, id: e.pointerId };
  });
  window.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    parX = ((e.clientX - r.left) / r.width - 0.5);
    parY = ((e.clientY - r.top) / r.height - 0.5);
    if (drag && state === 'brain') {
      const dx = e.clientX - drag.lastX;
      drag.lastX = e.clientX;
      drag.moved += Math.abs(dx) + Math.abs(e.clientY - drag.y) * 0.1;
      brainPivot.rotation.y += dx * 0.008;
      spinVel = dx * 0.008 * 60;
    } else if (e.target === canvas && state === 'brain') {
      setNdc(e);
      hover = hitBrain();
      canvas.style.cursor = hover ? 'pointer' : 'grab';
    }
  });
  window.addEventListener('pointerup', (e) => {
    if (!drag) return;
    const wasClick = drag.moved < 8;
    drag = null;
    if (wasClick && e.target === canvas && state === 'brain') {
      setNdc(e);
      if (hitBrain()) enter();
    }
  });
  enterBtn.addEventListener('click', () => enter());
  leaveBtn.addEventListener('click', () => leave());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if (!panel.hidden) closePanel(); else if (state === 'mind') leave(); }
  });

  /* ---------- Durumlar ---------- */
  let state = 'brain';
  let anim = null; // { from, to, t, dur }
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function enter() {
    if (state !== 'brain') return;
    state = 'entering';
    app.classList.add('is-entering');
    intro.setAttribute('aria-hidden', 'true');
    enterWrap.hidden = true;
    anim = { kind: 'enter', t: 0, dur: reduce ? 0.01 : 2.1 };
  }
  function leave() {
    if (state !== 'mind') return;
    closePanel();
    state = 'leaving';
    app.classList.remove('is-mind');
    mindUi.hidden = true;
    anim = { kind: 'leave', t: 0, dur: reduce ? 0.01 : 1.3 };
  }
  function finishEnter() {
    state = 'mind';
    app.classList.remove('is-entering');
    app.classList.add('is-mind');
    mindUi.hidden = false;
    leaveBtn.focus({ preventScroll: true });
  }
  function finishLeave() {
    state = 'brain';
    intro.removeAttribute('aria-hidden');
    enterWrap.hidden = false;
    enterBtn.focus({ preventScroll: true });
  }

  /* ---------- Boyut ---------- */
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 48 : 35;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  /* ---------- Döngü ---------- */
  const clock = new THREE.Clock();
  const v = new THREE.Vector3();
  let visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) clock.getDelta(); });

  function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const raw = Math.min(clock.getDelta(), 0.1);
    const dt = Math.min(raw, 0.05);
    const time = clock.elapsedTime;

    // beyin dönüşü
    if (!drag) {
      spinVel += ((reduce ? 0.08 : 0.32) - spinVel) * Math.min(1, dt * 1.5);
      brainPivot.rotation.y += spinVel * dt;
    }
    brain.position.y = Math.sin(time * 0.9) * 0.04;
    const hs = state === 'brain' && hover ? 1.04 : 1;
    brain.scale.lerp(v.set(hs, hs, hs), Math.min(1, dt * 6));
    dust.rotation.y += dt * 0.02;

    // geçişler
    if (anim) {
      anim.t = Math.min(1, anim.t + raw / anim.dur);
      const t = anim.t;
      if (anim.kind === 'enter') {
        const a = ease(Math.min(1, t / 0.55));
        camera.position.z = THREE.MathUtils.lerp(CAM_BRAIN, 0.35, a);
        brainMat.opacity = 1 - smooth(0.35, 0.55, t);
        brainPivot.visible = t < 0.56;
        flash.style.opacity = String(Math.max(0, 1 - Math.abs(t - 0.55) / 0.14) * 0.85);
        if (t > 0.55) {
          mind.visible = true;
          const b = ease((t - 0.55) / 0.45);
          camera.position.z = THREE.MathUtils.lerp(0.4, CAM_MIND, b);
          mind.scale.setScalar(0.4 + 0.6 * b);
          nodeMat.opacity = b;
          lineMat.opacity = 0.28 * b;
          dustMat.opacity = 0.35 + 0.3 * b;
        }
        if (t >= 1) { anim = null; finishEnter(); }
      } else {
        const a = ease(t);
        mind.scale.setScalar(1 - 0.6 * a);
        nodeMat.opacity = 1 - a;
        lineMat.opacity = 0.28 * (1 - a);
        if (a > 0.5) mind.visible = false;
        brainPivot.visible = true;
        brainMat.opacity = smooth(0.25, 0.85, t);
        camera.position.z = THREE.MathUtils.lerp(CAM_MIND + 1.5, CAM_BRAIN, a);
        dustMat.opacity = 0.65 - 0.3 * a;
        if (t >= 1) { anim = null; brainMat.opacity = 1; flash.style.opacity = '0'; finishLeave(); }
      }
    }

    // beynin içi
    if (mind.visible) {
      if (!hoverLabel && !selected) mind.rotation.y += dt * (reduce ? 0.01 : 0.06);
      mind.rotation.x += ((parY * 0.25) - mind.rotation.x) * Math.min(1, dt * 2);
      camera.position.x += ((parX * 0.8) - camera.position.x) * Math.min(1, dt * 2);
      Object.values(nodes).forEach((g) => {
        const ph = g.userData.phase;
        const s = 1 + Math.sin(time * 2 + ph) * 0.08 + (selected === g.userData.idea.id ? 0.35 : 0);
        g.scale.lerp(v.set(s, s, s), Math.min(1, dt * 8));
      });
      pulses.forEach((p) => {
        p.t = (p.t + dt * p.speed) % 1;
        p.curve.getPoint(p.t, p.sprite.position);
        p.sprite.material.opacity = Math.sin(p.t * Math.PI);
      });
    } else {
      camera.position.x += (0 - camera.position.x) * Math.min(1, dt * 3);
    }
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

    // etiketler
    if (state === 'mind') {
      const w = stage.clientWidth, h = stage.clientHeight;
      labels.forEach(({ el, idea }) => {
        nodes[idea.id].getWorldPosition(v);
        v.project(camera);
        const x = (v.x * 0.5 + 0.5) * w, y = (-v.y * 0.5 + 0.5) * h;
        const depth = THREE.MathUtils.clamp(1.3 - (v.z - 0.9) * 8, 0.45, 1);
        el.style.transform = `translate(${x.toFixed(1)}px, ${(y + (idea.center ? 34 : 26)).toFixed(1)}px) translate(-50%, 0)`;
        el.style.opacity = depth.toFixed(2);
        el.style.zIndex = String(Math.round((1 - v.z) * 1000));
      });
    }
  }
  tick();
}

/* ------------------------------------------------------------------ */
/*  Gizli kelime                                                         */
/* ------------------------------------------------------------------ */
(function () {
  const seq = 'sinan';
  let i = 0;
  document.addEventListener('keydown', (e) => {
    const k = e.key ? e.key.toLowerCase() : '';
    if (k === seq[i]) {
      i++;
      if (i === seq.length) {
        i = 0;
        const el = document.getElementById('secret');
        if (el) { el.hidden = false; setTimeout(() => { el.hidden = true; }, 5000); }
      }
    } else { i = k === seq[0] ? 1 : 0; }
  });
})();
