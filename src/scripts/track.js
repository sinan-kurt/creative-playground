// Masa tıklama sayacı.
// Yalnızca "ne tıklandı" kaydedilir: hangi obje açıldı ya da hangi dış siteye geçildi.
// İsim, IP, çerez veya tarayıcı kimliği tutulmaz; kimin tıkladığı bilinemez.
// Kayıt arka planda gider, başarısız olursa sessizce yok sayılır (sitenin çalışmasını hiç etkilemez).
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/desk_events`;
const local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);

export function track(event, target) {
  // yerel geliştirmede sayma, "takip etme" isteyen tarayıcılara saygı göster
  if (local || navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
  try {
    fetch(endpoint, {
      method: 'POST',
      keepalive: true, // yeni sekmeye geçilirken de istek tamamlanır
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ event, target: String(target).slice(0, 80) }),
    }).catch(() => {});
  } catch { /* yok say */ }
}

// Sayfadaki her dış bağlantı tıklamasını hangi siteye gidildiği olarak say (ör. "sevgili.netlify.app").
document.addEventListener('click', (e) => {
  const a = e.target instanceof Element ? e.target.closest('a[href^="http"]') : null;
  if (!a) return;
  try {
    const u = new URL(a.href);
    if (u.host === location.host) return;
    track('link', u.host + (u.pathname !== '/' ? u.pathname : ''));
  } catch { /* yok say */ }
}, { capture: true });
