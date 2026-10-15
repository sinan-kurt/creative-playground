# Creative Playground — Sinan Kurt

Astro 6 + Tailwind 4 kişisel portföy ve Instagram proje vitrini.

## Başlat

```bash
npm install
npm run dev
```

Yerel adres: http://localhost:4321
Üretim derlemesi: `npm run build`. Bu ortamda henüz build doğrulanamadı.

## Özellikler

- Mobil uyumlu ana sayfa ve dört proje kartı
- Kategori filtreleri ve dinamik proje detay sayfaları
- Mikro animasyonlar ve azaltılmış hareket desteği
- Now sayfası ve `sinan` klavye Easter egg'i
- Supabase üzerinden onaylı ziyaretçi defteri (ek yapılandırma gerekiyor)

## Yeni proje ekleme

`src/content/projects/` içine yeni Markdown kaydı ekle. Frontmatter alanları `src/content.config.ts` içinde tanımlıdır.

## Örnek temalar

Ana sayfadan bağımsız, denenmiş tasarım yönleri. Her biri kendi adresinde çalışır, mevcut sayfaları etkilemez.

### Beyin — `/temalar/beyin`

Ortada kendi etrafında dönen altın (ya da gümüş) 3D bir beyin. Beyne tıklayınca kamera içeri dalar, projeler ve girişimler birbirine bağlı parlayan nöronlar olarak açılır; bir nörona dokununca detay kartı çıkar.

- Sayfa: `src/pages/temalar/beyin.astro`
- 3D sahne ve etkileşim: `src/scripts/brain.js` (three.js). Beyin model dosyası kullanılmaz, kodla üretilir.
- Fikir eklemek/düzenlemek: `brain.js` başındaki `IDEAS` listesine kayıt ekle, bağlantıları `LINKS` ile belirle.
- Paylaşım görseli: `public/temalar/beyin-og.png`
- WebGL olmayan cihazlarda sayfanın altındaki düz liste görünür.

Ana sayfa yapmak için `src/pages/temalar/beyin.astro` içeriğini `src/pages/index.astro`'ya taşı ve script yolunu `../scripts/brain.js` yap.

## Ziyaretçi defteri

1. Supabase SQL Editor'de `supabase.sql` betiğini çalıştır.
2. `.env.example` dosyasını `.env` olarak kopyala ve **public anon/publishable key** ile URL gir. Secret/service_role anahtarlarını kullanma.
3. Mesajları onaylamak için Supabase Table Editor üzerinden `approved` alanını güncelle.
4. **Herkese açmadan önce** CAPTCHA/Turnstile, sunucu tarafı doğrulama ve rate limiting ekle. Mevcut kod prototiptir; spam koruması tamamlanmamıştır.

## Yayınlama

Cloudflare Pages, Netlify veya Vercel: Build `npm run build`, çıktı `dist`. `astro.config.mjs` içindeki örnek `site` URL'sini gerçek adresinle değiştir. Proje bağlantılarını ve ekran görüntülerini doğrula; henüz emoji yer tutucular kullanılıyor.

## Not

Bu depo V1 kaynak aktarımıdır. Canlı dağıtım ve üretim derlemesi ayrıca doğrulanmalıdır.
Cloudflare Pages: https://creative-playground.pages.dev (GitHub main branch)
