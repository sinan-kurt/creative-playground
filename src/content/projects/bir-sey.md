---
title: "Bir Şey"
eyebrow: "05 / INTERACTIVE WEB"
description: "Birine anılarla dolu küçük bir dünya hazırla; linki gönder, o dokundukça keşfetsin."
category: "Experiments"
color: "#d9ecdf"
icon: "🫙"
featured: true
live: "https://bir-sey.netlify.app/"
stack: ["JavaScript", "Three.js", "Web Audio API", "Piksel SVG", "Netlify"]
year: 2026
status: "Live"
problem: "\"Seni düşündüm\" demek istediğinde elindeki seçenekler kısa bir mesaj ya da hazır bir kart. İkisi de o kişiye özel bir şey hazırlamışsın hissini vermiyor."
solution: "Bir dünya seçiyorsun: anı kavanozu, minik gezegen, müzik kutusu ya da yaşayan kelimeler. İçine bir isim, anılar ve birkaç satır koyuyorsun. Linki ya da kendi başına açılan tek bir HTML dosyasını gönderiyorsun; alıcı dokundukça, sürükledikçe dünyayı keşfediyor."
outcome: "Yayında: dört etkileşimli 3D dünya, üç renk teması, önizleme, tarayıcıda saklanan taslak, link ya da çevrimdışı açılan tek dosya olarak paylaşım. Hesap, sunucu veya veritabanı yok."
---
## Dört dünya

- **Anı kavanozu:** Kapağı açılıyor, sallayınca kâğıtlar uçuşuyor. Her anı yakalanıp okunuyor, son anıdan sonra final açılıyor.
- **Minik gezegen:** Sürükledikçe dönen bir gezegen, gece/gündüz geçişi ve keşfedilen yıldızları birbirine bağlayan çizgiler.
- **Müzik kutusu:** Kolu çevirerek kuruluyor. Enerji azaldıkça dişliler yavaşlıyor, müzik ilerledikçe kişisel mesajlar beliriyor.
- **Yaşayan kelimeler:** Sayfa çeviren bir kitap. Metindeki ay, deniz, yağmur, çiçek gibi imgeler sahneye efekt olarak düşüyor.

## Nasıl yaptım

- Framework kullanmadım: düz JavaScript modülleri, HTML ve CSS. Sahneler Three.js ile gerçek WebGL olarak çiziliyor; WebGL olmayan tarayıcılarda aynı etkileşimler piksel SVG görünümüyle devam ediyor.
- Pil ve performans için sahne en fazla 30 FPS'de ve düşük çözünürlükte çiziliyor, ekran dışındayken ya da sekme gizliyken duruyor.
- Müzik kutusunun melodileri hazır ses dosyası değil, Web Audio API ile tarayıcıda sentezleniyor.
- Kişisel içerik linkin `#` sonrasında taşınıyor, sunucuya hiç gitmiyor. İndirilen HTML dosyası Three.js dahil her şeyi içinde taşıyor, internetsiz açılıyor.
- Bağlantı kodlaması, Türkçe metinler ve hatalı girdiler için Node'un test aracıyla yazılmış testler var.

## Neden önemli

Sevgili Bulmacası ile aynı soruya başka bir cevap: birine dijital olarak, ama kişisel bir şey nasıl bırakılır. Bu kez cevap bir oyun değil, dokunulan küçük bir dünya.
