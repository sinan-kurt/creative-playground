import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/* ================================================================== */
/*  İçerik: masadaki her nesne bir projeyi temsil eder                  */
/* ================================================================== */
const app = document.getElementById('app');
const BASE = (app && app.dataset.base) || '';
const IG = 'https://instagram.com/sina.hustle';

export const ITEMS = {
  monitor: {
    object: 'Monitör', file: 'ben.txt', title: 'Hey, ben Sinan.', kind: 'Hakkımda', status: 'İstanbul · 2026',
    q: 'İnternette küçük, kullanışlı ya da sadece eğlenceli şeyler yapıyorum.',
    desc: 'Yazılım, ürün ve tasarımın kesiştiği yerde çalışıyorum. Fikirleri kafamda döndürmek yerine çalışan bir şeye çevirmeyi seviyorum. Bu masadaki her nesne o fikirlerden biri.',
    stack: 'TypeScript · Next.js · Astro · Supabase · Unity',
    links: [['Instagram', IG], ['GitHub', 'https://github.com/sinan-kurt'], ['Hakkımda', BASE + '/about']],
  },
  envelope: {
    object: 'Zarf', file: 'zarf.dat', title: 'Sevgili Bulmacası', kind: 'Deney · Etkileşimli', status: 'Canlı',
    q: 'Sevdiğin birine mesaj yerine bulmaca göndersen?',
    desc: 'İpucu olarak bir anı, cevap olarak bir kelime yazıyorsun; ızgara kendiliğinden kuruluyor. Linki gönderiyorsun, o telefonda çözüyor ve son harfi yazdığı anda senin mesajın açılıyor.',
    stack: 'Next.js · TypeScript · Supabase',
    links: [['Bir bulmaca hazırla', 'https://sevgili.netlify.app/'], ['Örneği çöz', 'https://sevgili.netlify.app/#dene'], ['Proje sayfası', BASE + '/projects/sevgili-bulmacasi/']],
  },
  tea: {
    object: 'Çay bardağı', file: 'mola.exe', title: 'Mola Oyunları', kind: 'Oyun · Tarayıcı', status: 'Oynanabilir',
    q: 'Çay ocağı ve dolmuş durağı küçük bir oyuna dönüşür mü?',
    desc: 'Türkiye’de gündelik hayattan çıkan, birkaç dakikalık tarayıcı oyunları. Tanıdık sahneler, basit kurallar, bir çay molası uzunluğunda oyun.',
    stack: 'JavaScript · HTML/CSS · Oyun tasarımı',
    links: [['Hemen oyna', 'https://sinan-kurt.github.io/herdilabs-play/'], ['Proje sayfası', BASE + '/projects/mola-oyunlari/']],
  },
  hat: {
    object: 'Baret', file: 'metraj.xls', title: 'MetrajOS', kind: 'Ürün · SaaS', status: 'MVP canlı',
    q: 'İki metraj revizyonu arasında ne değişti, maliyete nasıl yansıdı?',
    desc: 'İki Excel metraj dosyasını karşılaştırıyor. Eklenen, silinen ve miktarı değişen satırları işaretliyor, maliyet etkisini görünür yapıyor. Şantiyede revizyon takibini elle yapmaktan kurtarmak için.',
    stack: 'Next.js · TypeScript · Supabase',
    links: [['Siteyi dene', 'https://metrajos.vercel.app/'], ['Proje sayfası', BASE + '/projects/metrajos/']],
  },
  camera: {
    object: 'Fotoğraf makinesi', file: 'offra.raw', title: 'Offra Studio', kind: 'Girişim · Stüdyo', status: 'Kurucu ortak',
    q: 'Kimlik, strateji ve dijital deneyimi tek çatı altında yapmak.',
    desc: 'Kurucu ortaklarından olduğum yaratıcı stüdyo. Kimlik tasarımı, yaratıcı strateji, içerik ve dijital deneyimler üretiyoruz.',
    stack: 'Marka · Strateji · İçerik · Dijital',
    links: [['Proje sayfası', BASE + '/projects/offra-studio/']],
  },
  bulb: {
    object: 'Ampul', file: 'fikir.tmp', title: 'Sıradaki fikir', kind: 'Henüz isimsiz', status: 'Pişiyor',
    q: 'Bu masaya bir sonraki ne konacak?',
    desc: 'Burada her zaman yarım kalmış bir şey dönüyor. Süreci Instagram’da adım adım paylaşıyorum. Aklında bir fikir varsa yaz, belki bir sonraki nesne o olur.',
    stack: '???',
    links: [['Instagram’da takip et', IG], ['Deftere not bırak', BASE + '/guestbook']],
  },
};

/* ================================================================== */
/*  Yardımcılar                                                         */
/* ================================================================== */
const rand = (a, b) => a + Math.random() * (b - a);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function canvasTex(w, h, draw, srgb = true) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
const std = (color, rough = 0.6, metal = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
function shadowAll(obj) { obj.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return obj; }

/* ---------------- Dokular ---------------- */
function woodTexture() {
  return canvasTex(1024, 512, (g, w, h) => {
    g.fillStyle = '#6E4B33'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {
      const y = Math.random() * h;
      g.strokeStyle = `rgba(${Math.random() < 0.5 ? '40,24,14' : '150,105,70'},${rand(0.05, 0.18)})`;
      g.lineWidth = rand(0.5, 3);
      g.beginPath(); g.moveTo(0, y);
      for (let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x * 0.01 + i) * rand(1, 5));
      g.stroke();
    }
  });
}

function cityTexture() {
  return canvasTex(1024, 1024, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#070B1F'); sky.addColorStop(0.45, '#1B1838'); sky.addColorStop(0.62, '#4A2B45'); sky.addColorStop(0.68, '#2A1A2E'); sky.addColorStop(1, '#0B0E1C');
    g.fillStyle = sky; g.fillRect(0, 0, w, h);
    // ay hâlesi
    const moon = g.createRadialGradient(w * 0.78, h * 0.2, 0, w * 0.78, h * 0.2, 160);
    moon.addColorStop(0, 'rgba(220,225,255,0.35)'); moon.addColorStop(1, 'rgba(220,225,255,0)');
    g.fillStyle = moon; g.fillRect(0, 0, w, h);
    // siluet: tepeler, kubbeler, minareler, Galata kulesi
    const base = h * 0.66;
    g.fillStyle = '#0A0814';
    g.beginPath(); g.moveTo(0, base);
    for (let x = 0; x <= w; x += 8) g.lineTo(x, base - 30 - Math.sin(x * 0.006) * 26 - Math.sin(x * 0.017) * 10);
    g.lineTo(w, h); g.lineTo(0, h); g.fill();
    const dome = (cx, cy, r) => { g.beginPath(); g.ellipse(cx, cy, r, r * 0.85, 0, Math.PI, 0); g.fill(); g.fillRect(cx - r, cy, r * 2, 40); };
    const minaret = (x, y, hgt) => { g.fillRect(x - 3, y - hgt, 6, hgt); g.beginPath(); g.moveTo(x - 5, y - hgt); g.lineTo(x, y - hgt - 26); g.lineTo(x + 5, y - hgt); g.fill(); g.fillRect(x - 6, y - hgt * 0.7, 12, 4); };
    // cami 1
    dome(250, base - 78, 46); dome(200, base - 60, 24); dome(300, base - 60, 24); minaret(140, base - 50, 150); minaret(360, base - 50, 150);
    // cami 2 (uzakta)
    g.fillStyle = '#120E1E';
    dome(690, base - 70, 34); dome(650, base - 58, 18); minaret(610, base - 46, 120); minaret(770, base - 46, 120);
    // Galata
    g.fillStyle = '#0A0814';
    g.fillRect(470, base - 210, 34, 170);
    g.beginPath(); g.moveTo(462, base - 210); g.lineTo(487, base - 268); g.lineTo(512, base - 210); g.fill();
    // pencereler, sokak ışıkları (bokeh)
    for (let i = 0; i < 260; i++) {
      const x = Math.random() * w, y = base - 40 + Math.random() * 90;
      const r = rand(1.5, 10);
      const col = Math.random() < 0.7 ? '255,190,110' : (Math.random() < 0.5 ? '255,240,220' : '150,190,255');
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, `rgba(${col},${rand(0.5, 0.95)})`); gr.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
    // Galata ve cami ışıkları
    g.fillStyle = 'rgba(255,200,120,0.9)';
    for (let i = 0; i < 4; i++) g.fillRect(478 + i * 6, base - 190, 3, 6);
    // Boğaz: yansımalar
    const wy = h * 0.74;
    g.fillStyle = '#0B1024'; g.fillRect(0, wy, w, h - wy);
    for (let i = 0; i < 160; i++) {
      const x = Math.random() * w, y = wy + Math.random() * (h - wy);
      g.fillStyle = `rgba(255,${Math.random() < 0.5 ? 180 : 220},120,${rand(0.08, 0.35)})`;
      g.fillRect(x, y, rand(6, 40), rand(1, 2.5));
    }
  });
}

function dropsTexture() {
  return canvasTex(512, 512, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    for (let i = 0; i < 420; i++) {
      const x = Math.random() * w, y = Math.random() * h, r = rand(1.2, 5.5);
      const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
      gr.addColorStop(0, 'rgba(255,255,255,0.55)'); gr.addColorStop(0.6, 'rgba(200,215,255,0.18)'); gr.addColorStop(1, 'rgba(200,215,255,0)');
      g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, r, r * 1.15, 0, 0, Math.PI * 2); g.fill();
    }
  });
}
function streaksTexture() {
  const t = canvasTex(256, 512, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * w, y = Math.random() * h, len = rand(30, 120);
      const gr = g.createLinearGradient(x, y, x, y + len);
      gr.addColorStop(0, 'rgba(220,230,255,0)'); gr.addColorStop(1, `rgba(220,230,255,${rand(0.12, 0.35)})`);
      g.strokeStyle = gr; g.lineWidth = rand(0.8, 1.8);
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + rand(-2, 2), y + len); g.stroke();
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/* ================================================================== */
/*  Nesneler                                                            */
/* ================================================================== */
function buildMonitor(screenTex) {
  const g = new THREE.Group();
  const beige = std(0xD8CDB4, 0.55);
  const dark = std(0x2A2620, 0.7);
  const stand = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.06, 0.4, 3, 0.02), beige);
  stand.position.y = 0.03; g.add(stand);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.06, 24), beige);
  neck.position.y = 0.09; g.add(neck);
  const body = new THREE.Mesh(new RoundedBoxGeometry(0.94, 0.76, 0.62, 5, 0.06), beige);
  body.position.set(0, 0.5, -0.05); g.add(body);
  const back = new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.56, 0.3, 4, 0.08), beige);
  back.position.set(0, 0.48, -0.42); g.add(back);
  const bezel = new THREE.Mesh(new RoundedBoxGeometry(0.8, 0.6, 0.04, 3, 0.03), dark);
  bezel.position.set(0, 0.52, 0.255); g.add(bezel);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.53), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
  screen.position.set(0, 0.52, 0.277); g.add(screen);
  // marka şeridi ve ışık
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.008, 12, 8), new THREE.MeshBasicMaterial({ color: 0x7CFF8A }));
  led.position.set(0.36, 0.17, 0.27); g.add(led);
  const grill = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.012, 0.01), dark);
  grill.position.set(-0.3, 0.17, 0.266); g.add(grill);
  g.userData.screen = screen;
  g.userData.screenSize = [0.72, 0.53];
  return shadowAll(g);
}

function buildKeyboard() {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new RoundedBoxGeometry(0.82, 0.04, 0.27, 3, 0.012), std(0xD3C8AE, 0.6));
  base.position.y = 0.02; base.rotation.x = 0.04; g.add(base);
  const keyGeo = new RoundedBoxGeometry(0.045, 0.022, 0.045, 2, 0.008);
  const keys = new THREE.InstancedMesh(keyGeo, std(0xE8E0CC, 0.5), 15 * 4 + 1);
  const m = new THREE.Matrix4();
  let n = 0;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 15; c++) {
    m.makeTranslation(-0.36 + c * 0.0515 + (r % 2) * 0.012, 0.05 + r * 0.002, -0.08 + r * 0.055);
    keys.setMatrixAt(n++, m);
  }
  m.makeScale(6, 1, 1).setPosition(0, 0.05, 0.145);
  keys.setMatrixAt(n++, m);
  keys.castShadow = true;
  g.add(keys);
  return shadowAll(g);
}

function buildLamp() {
  const g = new THREE.Group();
  const metal = std(0x1F4D3A, 0.35, 0.6);
  const brass = std(0xB8925A, 0.3, 0.9);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.04, 40), metal); base.position.y = 0.02; g.add(base);
  const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.62, 12), brass);
  arm1.position.set(0.05, 0.32, 0); arm1.rotation.z = -0.18; g.add(arm1);
  const j1 = new THREE.Mesh(new THREE.SphereGeometry(0.028, 16, 12), brass); j1.position.set(0.105, 0.62, 0); g.add(j1);
  const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 12), brass);
  arm2.position.set(0.3, 0.72, 0.03); arm2.rotation.z = -1.15; g.add(arm2);
  const head = new THREE.Group(); head.position.set(0.52, 0.8, 0.06); g.add(head);
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.14, 0.17, 40, 1, true), std(0x2C6B50, 0.35, 0.5, { side: THREE.DoubleSide }));
  shade.rotation.z = 0.55; head.add(shade);
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.135, 0.16, 40, 1, true), new THREE.MeshBasicMaterial({ color: 0xFFE2AE, side: THREE.BackSide }));
  inner.rotation.z = 0.55; head.add(inner);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 14), new THREE.MeshBasicMaterial({ color: 0xFFF1D0 }));
  bulb.position.set(0.03, -0.05, 0); head.add(bulb);
  const light = new THREE.SpotLight(0xFFC98A, 9, 6, 0.85, 0.55, 1.6);
  light.position.copy(head.position).add(new THREE.Vector3(0.03, -0.05, 0));
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.bias = -0.0008;
  light.shadow.radius = 4;
  g.add(light);
  g.add(light.target);
  const wash = new THREE.PointLight(0xFFB677, 0.9, 3.2, 1.6);
  wash.position.copy(head.position).add(new THREE.Vector3(0, 0.15, -0.1));
  g.add(wash);
  g.userData = { light, bulb, inner, wash, on: true };
  return shadowAll(g);
}

function buildPlant() {
  const g = new THREE.Group();
  const pts = [[0, 0], [0.1, 0], [0.12, 0.02], [0.14, 0.2], [0.155, 0.22], [0.15, 0.24], [0, 0.24]].map(([x, y]) => new THREE.Vector2(x, y));
  const pot = new THREE.Mesh(new THREE.LatheGeometry(pts, 40), std(0xB5643C, 0.85));
  g.add(pot);
  const soil = new THREE.Mesh(new THREE.CircleGeometry(0.14, 30), std(0x2B1D14, 1));
  soil.rotation.x = -Math.PI / 2; soil.position.y = 0.225; g.add(soil);
  const leafMat = [std(0x2F6B3F, 0.6), std(0x3E8A4F, 0.6), std(0x24553A, 0.6)];
  for (let i = 0; i < 9; i++) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), leafMat[i % 3]);
    const hgt = rand(0.28, 0.5);
    leaf.scale.set(0.045, hgt, 0.012);
    const a = (i / 9) * Math.PI * 2 + rand(-0.2, 0.2);
    leaf.position.set(Math.cos(a) * 0.05, 0.23 + hgt * 0.85, Math.sin(a) * 0.05);
    leaf.rotation.set(Math.sin(a) * 0.35, -a, Math.cos(a) * -0.35);
    g.add(leaf);
  }
  return shadowAll(g);
}

function buildEnvelope() {
  const g = new THREE.Group();
  const paper = std(0xF2D7DC, 0.85);
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.012, 0.29), paper);
  body.position.y = 0.006; g.add(body);
  const s = new THREE.Shape();
  s.moveTo(-0.22, 0); s.lineTo(0.22, 0); s.lineTo(0, 0.17); s.closePath();
  const flap = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.004, bevelEnabled: false }), std(0xE6BFC7, 0.85));
  flap.rotation.x = -Math.PI / 2; flap.position.set(0, 0.013, -0.145); g.add(flap);
  const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.042, 0.014, 28), std(0xA3162B, 0.4));
  seal.position.set(0, 0.022, 0.025); g.add(seal);
  const hs = new THREE.Shape();
  hs.moveTo(0, -0.012); hs.bezierCurveTo(-0.03, 0.008, -0.012, 0.026, 0, 0.012); hs.bezierCurveTo(0.012, 0.026, 0.03, 0.008, 0, -0.012);
  const heart = new THREE.Mesh(new THREE.ExtrudeGeometry(hs, { depth: 0.004, bevelEnabled: false }), std(0x7E0F1F, 0.4));
  heart.rotation.x = -Math.PI / 2; heart.position.set(0, 0.03, 0.03); g.add(heart);
  // ikinci zarf altta
  const under = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.01, 0.27), std(0xEDE3D2, 0.9));
  under.position.set(0.03, -0.004, 0.02); under.rotation.y = 0.18; g.add(under);
  g.position.y = 0.01;
  return shadowAll(g);
}

function buildTea() {
  const g = new THREE.Group();
  const saucerPts = [[0, 0], [0.12, 0], [0.16, 0.012], [0.175, 0.03], [0.165, 0.032], [0.15, 0.018], [0.05, 0.012], [0, 0.012]].map(([x, y]) => new THREE.Vector2(x, y));
  const saucer = new THREE.Mesh(new THREE.LatheGeometry(saucerPts, 48), std(0xF4F1EA, 0.25));
  g.add(saucer);
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.168, 0.004, 8, 48), std(0xC9A35A, 0.3, 0.8));
  band.rotation.x = Math.PI / 2; band.position.y = 0.03; g.add(band);
  const prof = [[0, 0.012], [0.05, 0.012], [0.056, 0.02], [0.046, 0.05], [0.036, 0.1], [0.034, 0.12], [0.04, 0.15], [0.055, 0.2], [0.064, 0.24], [0.066, 0.25]];
  const glassPts = prof.map(([x, y]) => new THREE.Vector2(x, y));
  const glass = new THREE.Mesh(new THREE.LatheGeometry(glassPts, 48), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.28, side: THREE.DoubleSide, clearcoat: 1 }));
  glass.castShadow = false;
  g.add(glass);
  const teaPts = prof.filter(([, y]) => y <= 0.21).map(([x, y]) => new THREE.Vector2(Math.max(0, x - 0.004), y + 0.004));
  teaPts.push(new THREE.Vector2(0.058, 0.214), new THREE.Vector2(0, 0.214));
  const tea = new THREE.Mesh(new THREE.LatheGeometry(teaPts, 48), new THREE.MeshPhysicalMaterial({ color: 0x9A240E, roughness: 0.15, transparent: true, opacity: 0.93, clearcoat: 1 }));
  g.add(tea);
  // kaşık
  const spoon = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.17, 8), std(0xCFCFD2, 0.25, 1));
  spoon.rotation.z = Math.PI / 2; spoon.rotation.y = 0.5; spoon.position.set(0.04, 0.035, 0.1); g.add(spoon);
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 8), std(0xCFCFD2, 0.25, 1));
  bowl.scale.set(1, 0.35, 1.5); bowl.position.set(-0.035, 0.034, 0.142); bowl.rotation.y = 0.5; g.add(bowl);
  return shadowAll(g);
}

function buildHat() {
  const g = new THREE.Group();
  const blue = std(0x2D5FA6, 0.8);
  const paper = std(0xDDE6F2, 0.9);
  for (let i = 0; i < 2; i++) {
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.62, 28), blue);
    roll.rotation.z = Math.PI / 2; roll.rotation.y = 0.12 * (i ? -1 : 1);
    roll.position.set(i * 0.02, 0.045, i * 0.095); g.add(roll);
    const end = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.625, 20), paper);
    end.rotation.copy(roll.rotation); end.position.copy(roll.position); g.add(end);
  }
  const yellow = std(0xF0B323, 0.4);
  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.17, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), yellow);
  shell.scale.set(1, 0.9, 1.12); shell.position.set(0, 0.09, 0.05); g.add(shell);
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.21, 0.014, 48), yellow);
  brim.scale.set(1, 1, 1.22); brim.position.set(0, 0.092, 0.08); g.add(brim);
  const ridge = new THREE.Mesh(new THREE.TorusGeometry(0.168, 0.012, 10, 40, Math.PI), yellow);
  ridge.rotation.y = Math.PI / 2; ridge.scale.set(1, 0.9, 1.12); ridge.position.set(0, 0.09, 0.05); g.add(ridge);
  const sticker = new THREE.Mesh(new THREE.CircleGeometry(0.035, 20), std(0x1C3F7A, 0.6));
  sticker.position.set(0, 0.17, 0.215); sticker.rotation.x = -0.55; g.add(sticker);
  g.rotation.y = -0.35;
  return shadowAll(g);
}

function buildCamera() {
  const g = new THREE.Group();
  const black = std(0x1B1B1E, 0.55);
  const silver = std(0xC9CBCF, 0.3, 0.9);
  const body = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.2, 0.12, 4, 0.025), black);
  body.position.y = 0.1; g.add(body);
  const top = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.05, 0.11, 3, 0.015), silver);
  top.position.y = 0.215; g.add(top);
  const prism = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.06, 0.09, 3, 0.015), silver);
  prism.position.set(0, 0.25, 0); g.add(prism);
  const lens1 = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.07, 40), black);
  lens1.rotation.x = Math.PI / 2; lens1.position.set(0, 0.1, 0.09); g.add(lens1);
  const lens2 = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.07, 0.05, 40), silver);
  lens2.rotation.x = Math.PI / 2; lens2.position.set(0, 0.1, 0.145); g.add(lens2);
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x111827, roughness: 0.05, metalness: 0.2, clearcoat: 1, emissive: 0x2A1650, emissiveIntensity: 0.4 });
  const glass = new THREE.Mesh(new THREE.CircleGeometry(0.055, 40), glassMat);
  glass.position.set(0, 0.1, 0.171); g.add(glass);
  const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.02, 16), std(0xC2271F, 0.4));
  btn.position.set(0.12, 0.25, 0); g.add(btn);
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.025, 24), silver);
  dial.position.set(-0.11, 0.25, 0); g.add(dial);
  g.rotation.y = -0.55;
  return shadowAll(g);
}

function buildBulb() {
  const g = new THREE.Group();
  const prof = [[0, 0], [0.03, 0.005], [0.032, 0.03], [0.034, 0.05], [0.06, 0.085], [0.075, 0.12], [0.072, 0.16], [0.05, 0.19], [0, 0.2]].map(([x, y]) => new THREE.Vector2(x, y));
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xFFF6E0, roughness: 0.05, transparent: true, opacity: 0.35, clearcoat: 1, emissive: 0xFFB347, emissiveIntensity: 0.05 });
  const glass = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), glassMat);
  glass.castShadow = false;
  const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.033, 0.028, 0.06, 24), std(0xB8B4AA, 0.3, 1));
  screw.position.y = -0.005;
  const fil = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.002, 6, 20, Math.PI), new THREE.MeshBasicMaterial({ color: 0xFFC46B }));
  fil.position.y = 0.11;
  const inner = new THREE.Group(); inner.add(glass, screw, fil);
  for (let i = 0; i < 3; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.003, 6, 24), std(0x8E8A80, 0.3, 1)); r.rotation.x = Math.PI / 2; r.position.y = -0.02 + i * 0.015; inner.add(r); }
  inner.rotation.z = Math.PI / 2 - 0.15; inner.position.y = 0.075;
  g.add(inner);
  const glow = new THREE.PointLight(0xFFB347, 0, 0.8, 2);
  glow.position.set(0, 0.08, 0); g.add(glow);
  g.userData = { glassMat, glow, fil };
  return shadowAll(g);
}

/* ================================================================== */
/*  Sahne kurulumu                                                       */
/* ================================================================== */
const canvas = document.getElementById('gl');
const stage = document.getElementById('stage');
let renderer = null;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); } catch (e) { renderer = null; }
if (!renderer || !renderer.getContext()) document.documentElement.classList.add('no-gl');
else start();

function start() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0C0A12);
  scene.fog = new THREE.Fog(0x0C0A12, 6, 14);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 50);

  /* ---- ışıklar ---- */
  scene.add(new THREE.HemisphereLight(0x7F8FC8, 0x1A120C, 0.75));
  const moon = new THREE.DirectionalLight(0x9DB2FF, 0.9);
  moon.position.set(-1.6, 2.4, -2.5);
  scene.add(moon);
  const screenGlow = new THREE.PointLight(0xFFAE4A, 0.5, 2.2, 2);
  scene.add(screenGlow);

  /* ---- oda ---- */
  const wallMat = std(0x463A52, 0.95);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(9, 5), wallMat);
  wall.position.set(0, 1.6, -0.85); wall.receiveShadow = true;
  // pencere boşluğu: duvarı dört parçaya böl
  const win = { x: -0.72, y: 0.98, w: 1.45, h: 0.98 };
  const wallParts = new THREE.Group();
  const addWall = (x, y, w, h) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat); m.position.set(x, y, -0.85); m.receiveShadow = true; wallParts.add(m); };
  const L = -4.5, R = 4.5, B = -0.9, T = 4.1;
  addWall((L + (win.x - win.w / 2)) / 2, (B + T) / 2, (win.x - win.w / 2) - L, T - B);
  addWall(((win.x + win.w / 2) + R) / 2, (B + T) / 2, R - (win.x + win.w / 2), T - B);
  addWall(win.x, ((win.y + win.h / 2) + T) / 2, win.w, T - (win.y + win.h / 2));
  addWall(win.x, ((win.y - win.h / 2) + B) / 2, win.w, (win.y - win.h / 2) - B);
  scene.add(wallParts);

  // dışarısı
  const city = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 3.4), new THREE.MeshBasicMaterial({ map: cityTexture(), toneMapped: false, fog: false }));
  city.position.set(win.x, win.y + 0.2, -2.6);
  scene.add(city);
  const streakTex = streaksTexture(); streakTex.repeat.set(2.5, 1.6);
  const rainFar = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2), new THREE.MeshBasicMaterial({ map: streakTex, transparent: true, depthWrite: false, opacity: 0.5, toneMapped: false }));
  rainFar.position.set(win.x, win.y, -1.5); scene.add(rainFar);
  const dropTex = dropsTexture();
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(win.w, win.h), new THREE.MeshBasicMaterial({ map: dropTex, transparent: true, depthWrite: false, opacity: 0.85, toneMapped: false }));
  glass.position.set(win.x, win.y, -0.88); scene.add(glass);
  const streakTex2 = streaksTexture(); streakTex2.repeat.set(1.4, 0.9);
  const rainGlass = new THREE.Mesh(new THREE.PlaneGeometry(win.w, win.h), new THREE.MeshBasicMaterial({ map: streakTex2, transparent: true, depthWrite: false, opacity: 0.6, toneMapped: false }));
  rainGlass.position.set(win.x, win.y, -0.875); scene.add(rainGlass);
  // çerçeve
  const frameMat = std(0x3A2A20, 0.7);
  const fr = (x, y, w, h, d = 0.08) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat); m.position.set(x, y, -0.84); m.castShadow = m.receiveShadow = true; scene.add(m); };
  fr(win.x, win.y + win.h / 2, win.w + 0.1, 0.06); fr(win.x, win.y - win.h / 2, win.w + 0.1, 0.06);
  fr(win.x - win.w / 2, win.y, 0.06, win.h + 0.06); fr(win.x + win.w / 2, win.y, 0.06, win.h + 0.06);
  fr(win.x, win.y, 0.035, win.h, 0.05); fr(win.x, win.y + 0.08, win.w, 0.03, 0.05);
  const sill = new THREE.Mesh(new THREE.BoxGeometry(win.w + 0.3, 0.04, 0.2), frameMat);
  sill.position.set(win.x, win.y - win.h / 2 - 0.04, -0.76); sill.castShadow = sill.receiveShadow = true; scene.add(sill);

  // duvarda küçük bir not panosu
  const cork = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.46, 0.03, 2, 0.01), std(0xA97C50, 0.95));
  cork.position.set(1.05, 1.25, -0.83); cork.receiveShadow = true; scene.add(cork);
  const noteCols = [0xF7E27A, 0xF6A6C1, 0x9FD7F2];
  [[-0.14, 0.06, 0.08], [0.12, 0.08, -0.1], [0.02, -0.1, 0.05]].forEach(([x, y, r], i) => {
    const n = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.16), std(noteCols[i], 0.9));
    n.position.set(1.05 + x, 1.25 + y, -0.81); n.rotation.z = r; n.castShadow = true; scene.add(n);
    const pin = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 8), std(0xC2271F, 0.4));
    pin.position.set(1.05 + x, 1.25 + y + 0.06, -0.8); scene.add(pin);
  });

  /* ---- masa ---- */
  const wood = woodTexture(); wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
  const deskTop = new THREE.Mesh(new RoundedBoxGeometry(3.4, 0.08, 1.55, 3, 0.02), std(0xffffff, 0.55, 0, { map: wood }));
  deskTop.position.set(0, -0.04, 0); deskTop.receiveShadow = true; scene.add(deskTop);
  const floorFade = new THREE.Mesh(new THREE.PlaneGeometry(12, 8), std(0x0C0A12, 1));
  floorFade.rotation.x = -Math.PI / 2; floorFade.position.y = -0.9; scene.add(floorFade);

  /* ---- monitör ekranı (boşta) ---- */
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 1024; screenCanvas.height = 754;
  const sctx = screenCanvas.getContext('2d');
  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.colorSpace = THREE.SRGBColorSpace;
  let cursorOn = true;
  let screenMode = 'idle';
  function drawScreen() {
    const w = screenCanvas.width, h = screenCanvas.height;
    const bg = sctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w * 0.7);
    bg.addColorStop(0, '#1E1306'); bg.addColorStop(1, '#070402');
    sctx.fillStyle = bg; sctx.fillRect(0, 0, w, h);
    sctx.fillStyle = '#FFB347';
    sctx.shadowColor = 'rgba(255,170,60,0.85)'; sctx.shadowBlur = 18;
    if (screenMode === 'idle') {
      sctx.font = '56px VT323, "IBM Plex Mono", monospace';
      sctx.fillText('C:\\SINAN> dir /masa', 70, 120);
      sctx.font = '210px VT323, "IBM Plex Mono", monospace';
      sctx.fillText('SİNAN', 64, 320);
      sctx.fillText('KURT', 64, 490);
      sctx.font = '64px VT323, "IBM Plex Mono", monospace';
      sctx.fillText('> masadaki bir şeye dokun' + (cursorOn ? '_' : ''), 70, 600);
      sctx.globalAlpha = 0.55;
      sctx.font = '48px VT323, "IBM Plex Mono", monospace';
      sctx.fillText('6 dosya · 1 tanesi pişiyor', 70, 680);
      sctx.globalAlpha = 1;
    } else {
      sctx.font = '56px VT323, "IBM Plex Mono", monospace';
      sctx.globalAlpha = 0.5;
      sctx.fillText('yükleniyor...', 70, 120);
      sctx.globalAlpha = 1;
    }
    sctx.shadowBlur = 0;
    sctx.fillStyle = 'rgba(0,0,0,0.22)';
    for (let y = 0; y < h; y += 4) sctx.fillRect(0, y, w, 2);
    screenTex.needsUpdate = true;
  }
  drawScreen();
  if (document.fonts && document.fonts.load) document.fonts.load('48px VT323').then(drawScreen).catch(() => {});

  /* ---- nesneleri yerleştir ---- */
  const monitor = buildMonitor(screenTex); monitor.position.set(0.12, 0, -0.32); scene.add(monitor);
  const keyboard = buildKeyboard(); keyboard.position.set(0.12, 0, 0.36); scene.add(keyboard);
  const lamp = buildLamp(); lamp.position.set(-1.38, 0, -0.42); lamp.rotation.y = -0.25; scene.add(lamp);
  lamp.userData.light.target.position.set(0.95, -0.8, 0.55);
  const plant = buildPlant(); plant.position.set(1.4, 0, -0.5); scene.add(plant);
  const envelope = buildEnvelope(); envelope.position.set(-1.0, 0, 0.42); envelope.rotation.y = 0.32; scene.add(envelope);
  const tea = buildTea(); tea.position.set(1.0, 0, 0.36); scene.add(tea);
  const hat = buildHat(); hat.position.set(-0.78, 0, -0.18); scene.add(hat);
  const cam = buildCamera(); cam.position.set(0.98, 0, -0.12); scene.add(cam);
  const bulb = buildBulb(); bulb.position.set(-0.46, 0, 0.5); bulb.rotation.y = 0.5; scene.add(bulb);

  monitor.userData.screen.getWorldPosition(screenGlow.position);
  screenGlow.position.z += 0.25;

  const clickables = { monitor, envelope, tea, hat, camera: cam, bulb, lamp };
  Object.entries(clickables).forEach(([key, obj]) => {
    obj.traverse((o) => { o.userData.key = key; });
    obj.userData.key = key;
    obj.userData.baseY = obj.position.y;
    obj.userData.baseRotY = obj.rotation.y;
    obj.userData.lift = 0;
  });
  const pickList = Object.values(clickables);

  // çaydan buhar
  const steamTex = canvasTex(64, 64, (g2, w, h) => { const r = g2.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,0.5)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g2.fillStyle = r; g2.fillRect(0, 0, w, h); });
  const steam = [];
  for (let i = 0; i < 7; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, transparent: true, depthWrite: false, opacity: 0 }));
    s.userData.t = i / 7;
    tea.add(s); steam.push(s);
  }

  /* ================================================================ */
  /*  DOM                                                               */
  /* ================================================================ */
  const tip = document.getElementById('tip');
  const screenEl = document.getElementById('screen');
  const screenBody = document.getElementById('screenBody');
  const backBtn = document.getElementById('back');
  const hint = document.getElementById('hint');
  const soundBtn = document.getElementById('sound');

  document.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); focusOn(b.dataset.open); }));
  backBtn.addEventListener('click', () => unfocus());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && state !== 'desk') unfocus(); });

  function fillScreen(key) {
    const it = ITEMS[key];
    screenBody.replaceChildren();
    const mk = (tag, cls, text) => { const el = document.createElement(tag); if (cls) el.className = cls; if (text != null) el.textContent = text; return el; };
    screenBody.append(
      mk('p', 'scr-cmd', 'C:\\SINAN> aç ' + it.file),
      mk('p', 'scr-kind', it.kind + ' · ' + it.status),
      mk('h2', 'scr-title', it.title),
      mk('p', 'scr-q', it.q),
      mk('p', 'scr-desc', it.desc),
      mk('p', 'scr-stack', '[' + it.stack + ']'),
    );
    const links = mk('div', 'scr-links');
    it.links.forEach(([label, href], i) => {
      const a = mk('a', i === 0 ? 'scr-link primary' : 'scr-link', (i === 0 ? '> ' : '') + label + ' ↗');
      a.href = href;
      links.append(a);
    });
    screenBody.append(links, mk('p', 'scr-object', 'masadaki nesne: ' + it.object.toLowerCase()));
    screenBody.scrollTop = 0;
  }

  /* ================================================================ */
  /*  Kamera                                                            */
  /* ================================================================ */
  const camPos = new THREE.Vector3(), camTarget = new THREE.Vector3();
  const tween = { active: false, t: 0, dur: 1, fromP: new THREE.Vector3(), toP: new THREE.Vector3(), fromT: new THREE.Vector3(), toT: new THREE.Vector3(), done: null };
  let view = { pos: new THREE.Vector3(), target: new THREE.Vector3() };
  let narrow = false;

  function homeView() {
    const a = camera.aspect;
    if (a < 0.75) { camera.fov = 60; return { pos: new THREE.Vector3(0, 2.45, 3.55), target: new THREE.Vector3(0, 0.12, 0.05) }; }
    if (a < 1.25) { camera.fov = 48; return { pos: new THREE.Vector3(0, 2.1, 3.4), target: new THREE.Vector3(0, 0.38, -0.05) }; }
    camera.fov = 38;
    return { pos: new THREE.Vector3(0, 1.55, 2.95), target: new THREE.Vector3(0, 0.42, -0.1) };
  }
  const screenCenter = new THREE.Vector3();
  function focusView() {
    const [sw, sh] = monitor.userData.screenSize;
    monitor.userData.screen.getWorldPosition(screenCenter);
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    let fitH = 0.8, fitW = 0.9;
    if (narrow) { fitW = 0.96; }
    const dist = Math.max((sh / 2) / tan / fitH, (sw / 2) / (tan * camera.aspect) / fitW);
    const target = screenCenter.clone();
    if (narrow) target.y -= sh * 0.42;
    return { pos: new THREE.Vector3(screenCenter.x, screenCenter.y + 0.01, screenCenter.z + dist), target };
  }
  function goTo(v, dur, done) {
    tween.active = true; tween.t = 0; tween.dur = reduce ? 0.01 : dur;
    tween.fromP.copy(camPos); tween.toP.copy(v.pos);
    tween.fromT.copy(camTarget); tween.toT.copy(v.target);
    tween.done = done || null;
  }

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    narrow = camera.aspect < 0.85;
    view = state === 'desk' ? homeView() : (homeView(), focusView());
    camera.updateProjectionMatrix();
    if (!tween.active) { camPos.copy(view.pos); camTarget.copy(view.target); }
    if (state === 'focus') placeScreen();
  }

  /* ================================================================ */
  /*  Durum                                                             */
  /* ================================================================ */
  let state = 'desk'; // desk | focusing | focus | leaving
  let active = null;
  let hovered = null;

  function focusOn(key) {
    if (key === 'lamp') { toggleLamp(); return; }
    if (!ITEMS[key]) return;
    if (state === 'focus' && active === key) return;
    active = key;
    fillScreen(key);
    screenMode = 'loading'; drawScreen();
    hideTip();
    if (state === 'focus') { screenEl.classList.remove('on'); setTimeout(() => { screenEl.classList.add('on'); }, 60); return; }
    state = 'focusing';
    app.classList.add('is-focus');
    hint.hidden = true;
    view = focusView();
    goTo(view, 1.15, () => {
      state = 'focus';
      placeScreen();
      screenEl.hidden = false;
      requestAnimationFrame(() => screenEl.classList.add('on'));
      backBtn.focus({ preventScroll: true });
    });
  }
  function unfocus() {
    if (state === 'desk' || state === 'leaving') return;
    state = 'leaving';
    screenEl.classList.remove('on');
    screenEl.hidden = true;
    screenMode = 'idle'; drawScreen();
    view = homeView();
    camera.updateProjectionMatrix();
    goTo(view, 1.0, () => {
      state = 'desk';
      app.classList.remove('is-focus');
      const k = active; active = null;
      const b = k && document.querySelector('[data-open="' + k + '"]');
      if (b) b.focus({ preventScroll: true });
    });
  }

  function toggleLamp() {
    const d = lamp.userData;
    d.on = !d.on;
    d.light.intensity = d.on ? 9 : 0;
    d.wash.intensity = d.on ? 0.9 : 0;
    d.bulb.material.color.setHex(d.on ? 0xFFF1D0 : 0x6B6355);
    d.inner.material.color.setHex(d.on ? 0xFFE2AE : 0x3A352C);
    showToast(d.on ? 'Lamba açıldı.' : 'Lamba kapandı. Ekranın ışığı yeter mi?');
  }
  const toast = document.getElementById('toast');
  let toastTimer = 0;
  function showToast(text) { toast.textContent = text; toast.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.hidden = true; }, 2600); }

  /* ---- monitör içeriğini ekrana hizala ---- */
  const corners = [new THREE.Vector3(), new THREE.Vector3()];
  function placeScreen() {
    const [sw, sh] = monitor.userData.screenSize;
    monitor.userData.screen.getWorldPosition(screenCenter);
    corners[0].set(screenCenter.x - sw / 2, screenCenter.y + sh / 2, screenCenter.z).project(camera);
    corners[1].set(screenCenter.x + sw / 2, screenCenter.y - sh / 2, screenCenter.z).project(camera);
    const W = stage.clientWidth, H = stage.clientHeight;
    const x1 = (corners[0].x * 0.5 + 0.5) * W, y1 = (-corners[0].y * 0.5 + 0.5) * H;
    const x2 = (corners[1].x * 0.5 + 0.5) * W, y2 = (-corners[1].y * 0.5 + 0.5) * H;
    let left = x1, top = y1, width = x2 - x1, height = y2 - y1;
    if (narrow) { left = 12; width = W - 24; top = Math.min(top, 64); height = H - top - 12; }
    screenEl.style.left = left.toFixed(1) + 'px';
    screenEl.style.top = top.toFixed(1) + 'px';
    screenEl.style.width = width.toFixed(1) + 'px';
    screenEl.style.height = height.toFixed(1) + 'px';
    screenEl.style.fontSize = Math.max(18, Math.min(28, width / 26)).toFixed(1) + 'px';
  }

  /* ================================================================ */
  /*  Fare / dokunma                                                    */
  /* ================================================================ */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2(9, 9);
  let mx = 0, my = 0, downAt = null;
  function pick(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(pickList, true);
    for (const h of hits) if (h.object.userData.key) return h.object.userData.key;
    return null;
  }
  function hideTip() { tip.hidden = true; }
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - 0.5;
    my = (e.clientY - r.top) / r.height - 0.5;
    if (state !== 'desk' || e.pointerType === 'touch') return;
    const k = pick(e);
    hovered = k;
    canvas.style.cursor = k ? 'pointer' : 'default';
    if (k) {
      const it = ITEMS[k];
      tip.replaceChildren();
      const a = document.createElement('strong'); a.textContent = it ? it.object : 'Lamba';
      const b = document.createElement('span'); b.textContent = it ? it.title : 'aç / kapat';
      tip.append(a, b);
      tip.hidden = false;
      tip.style.transform = `translate(${(e.clientX - r.left + 16).toFixed(0)}px, ${(e.clientY - r.top + 14).toFixed(0)}px)`;
    } else hideTip();
  });
  canvas.addEventListener('pointerleave', () => { hovered = null; hideTip(); });
  canvas.addEventListener('pointerdown', (e) => { downAt = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('pointerup', (e) => {
    if (!downAt) return;
    const moved = Math.abs(e.clientX - downAt.x) + Math.abs(e.clientY - downAt.y);
    downAt = null;
    if (moved > 10) return;
    if (state === 'focus') { const k = pick(e); if (!k || k === 'monitor') return; focusOn(k); return; }
    if (state !== 'desk') return;
    const k = pick(e);
    if (k) focusOn(k);
  });

  /* ================================================================ */
  /*  Yağmur sesi (WebAudio ile üretilir)                                */
  /* ================================================================ */
  let audio = null;
  soundBtn.addEventListener('click', () => {
    try {
      if (!audio) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const len = ctx.sampleRate * 3;
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        let last = 0;
        for (let i = 0; i < len; i++) { const white = Math.random() * 2 - 1; last = (last + 0.02 * white) / 1.02; d[i] = white * 0.5 + last * 3; }
        const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1600;
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 250;
        const gain = ctx.createGain(); gain.gain.value = 0;
        src.connect(hp).connect(lp).connect(gain).connect(ctx.destination);
        src.start();
        audio = { ctx, gain, on: false };
      }
      audio.on = !audio.on;
      if (audio.ctx.state === 'suspended') audio.ctx.resume();
      audio.gain.gain.setTargetAtTime(audio.on ? 0.16 : 0, audio.ctx.currentTime, 0.4);
      soundBtn.setAttribute('aria-pressed', String(audio.on));
      soundBtn.textContent = audio.on ? 'Yağmur: açık' : 'Yağmur: kapalı';
    } catch (err) { soundBtn.hidden = true; }
  });

  /* ================================================================ */
  /*  Döngü                                                             */
  /* ================================================================ */
  new ResizeObserver(resize).observe(stage);
  resize();
  camPos.copy(view.pos); camTarget.copy(view.target);

  const clock = new THREE.Clock();
  let visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; clock.getDelta(); });
  let blink = 0;
  const tmp = new THREE.Vector3();

  function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const raw = Math.min(clock.getDelta(), 0.1);
    const dt = Math.min(raw, 0.05);
    const time = clock.elapsedTime;

    // yağmur
    if (!reduce) {
      streakTex.offset.y += raw * 0.9;
      streakTex2.offset.y += raw * 0.25;
      dropTex.offset.y += raw * 0.004;
    }
    // ekran imleci
    blink += raw;
    if (blink > 0.55) { blink = 0; cursorOn = !cursorOn; if (screenMode === 'idle') drawScreen(); }
    // buhar
    steam.forEach((s) => {
      s.userData.t = (s.userData.t + raw * 0.22) % 1;
      const t = s.userData.t;
      s.position.set(Math.sin(t * 6 + s.id) * 0.03, 0.27 + t * 0.32, Math.cos(t * 5 + s.id) * 0.02);
      s.scale.setScalar(0.06 + t * 0.14);
      s.material.opacity = Math.sin(t * Math.PI) * 0.22;
    });

    // nesne kaldırma / döndürme
    Object.entries(clickables).forEach(([key, obj]) => {
      if (key === 'monitor' || key === 'lamp') return;
      const isActive = active === key && state !== 'desk';
      const target = isActive ? 0.14 : (hovered === key && state === 'desk' ? 0.045 : 0);
      obj.userData.lift += (target - obj.userData.lift) * Math.min(1, dt * 8);
      obj.position.y = obj.userData.baseY + obj.userData.lift + (isActive ? Math.sin(time * 2) * 0.01 : 0);
      if (isActive) obj.rotation.y += dt * 0.6;
      else obj.rotation.y += (obj.userData.baseRotY - obj.rotation.y) * Math.min(1, dt * 4);
    });
    // ampul: üzerine gelince ya da açıkken yanar
    const bulbOn = hovered === 'bulb' || active === 'bulb';
    const bd = bulb.userData;
    bd.glassMat.emissiveIntensity += ((bulbOn ? 1.6 : 0.05) - bd.glassMat.emissiveIntensity) * Math.min(1, dt * 6);
    bd.glow.intensity += ((bulbOn ? 1.2 : 0) - bd.glow.intensity) * Math.min(1, dt * 6);
    screenGlow.intensity = 0.45 + Math.sin(time * 9) * 0.03 + (state === 'focus' ? 0.4 : 0);

    // kamera
    if (tween.active) {
      tween.t = Math.min(1, tween.t + raw / tween.dur);
      const e = ease(tween.t);
      camPos.lerpVectors(tween.fromP, tween.toP, e);
      camTarget.lerpVectors(tween.fromT, tween.toT, e);
      if (tween.t >= 1) { tween.active = false; const d = tween.done; tween.done = null; if (d) d(); }
    }
    camera.position.copy(camPos);
    if (state === 'desk' && !reduce) {
      camera.position.x += mx * 0.25;
      camera.position.y += -my * 0.12;
    }
    camera.lookAt(camTarget);

    renderer.render(scene, camera);
  }
  tick();
}

/* ---- gizli kelime ---- */
(function () {
  const seq = 'sinan';
  let i = 0;
  document.addEventListener('keydown', (e) => {
    const k = e.key ? e.key.toLowerCase() : '';
    if (k === seq[i]) {
      i++;
      if (i === seq.length) {
        i = 0;
        const el = document.getElementById('toast');
        if (el) { el.textContent = 'Gizli kelimeyi buldun ✳ Defterime bir not bırakmayı unutma.'; el.hidden = false; setTimeout(() => { el.hidden = true; }, 4000); }
      }
    } else { i = k === seq[0] ? 1 : 0; }
  });
})();
