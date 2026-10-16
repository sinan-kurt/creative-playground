---
title: "Sevgili Bulmacası"
eyebrow: "02 / INTERACTIVE WEB"
description: "Anılarını ve iç şakalarınızı ona özel bir bulmacaya dönüştür, linki gönder; çözünce senin mesajın açılsın."
category: "Experiments"
color: "#ffd5c8"
icon: "💌"
featured: true
live: "https://sevgili.netlify.app/"
github: "https://github.com/sinan-kurt/sevgilim_bulmaca"
stack: ["Next.js", "TypeScript", "Supabase", "Tailwind"]
year: 2026
status: "Live"
problem: "Sevdiğin birine kişisel bir şey göndermek istediğinde elindeki seçenekler ya sıradan bir mesaj ya da hazır bir şablon. İkisi de 'bunu sadece biz biliriz' hissini vermiyor."
solution: "İpucu olarak bir anı, cevap olarak tek bir kelime yazıyorsun; kelimeler yazdıkça ızgaraya kendiliğinden yerleşiyor. Paylaşılabilir bir link oluşuyor, karşı taraf telefonda çözüyor ve bitirdiği anda yazdığın final mesajı açılıyor."
outcome: "Uçtan uca çalışan ürün yayında: oluşturma, canlı ızgara önizlemesi, WhatsApp paylaşımı, temalı çözme sayfası ve final anı. Sıradaki adım gerçek kullanıcılarla 14 Şubat öncesi test."
---
## Fikir

Mesaj yerine küçük bir oyun göndermek. İpuçları sadece ikinizin bildiği şeyler olduğu için bulmacayı çözmek, ilişkiyi hatırlamanın bir yolu oluyor.

## Nasıl yaptım

- Kelime yerleştirme algoritmasını kendim yazdım: en uzun kelime ortaya yatay yerleşiyor, diğerleri ortak harflerden dik kesişiyor, kesişemeyenler boş alana düşüyor. Sığmayan kelime olursa oluşturan kişi göndermeden önce görüyor.
- Çözme ekranı telefon için tasarlandı: ızgara boş kenarlardan kırpılıyor, aktif ipucu üstte sabit duruyor, İ/I karışıklığı hata sayılmıyor, ilerleme kaydediliyor.
- Link önizlemesi bilinçli olarak spoiler vermiyor; bulmaca sayfaları arama motorlarına kapalı.
- Bulmacalar Supabase'de; okuma ve yazma yalnızca sunucuda, tahmin edilemeyen linklerle.

## Neden önemli

Bulmacayı çözen kişi final ekranında "Sen de ona bir bulmaca hazırla" butonunu görüyor. Her gönderilen bulmaca, bir sonraki kullanıcıyı getirebiliyor.
