// data.js

// GitHub CDN KULLANIMI
// "manefes_al" hatası düzeltildi -> "main"
const GITHUB_CDN = 'https://cdn.jsdelivr.net/gh/sergenaras/nefes@main/ikon/';

// İKON DOSYA YOLLARI
const iconFiles = {
    nefes_al: GITHUB_CDN + 'nefes_al.png',
    nefes_ver: GITHUB_CDN + 'nefes_ver.png',
    nefes_tut: GITHUB_CDN + 'nefes_tut.png',
    yumruk_sik: GITHUB_CDN + 'yumruk_sik.png',
    yumruk_serbest: GITHUB_CDN + 'yumruk_serbest.png', // Bu dosyanın repoda olduğundan emin olun
    yavas_ufle: GITHUB_CDN + 'mum_üfle.png'
};

// FALLBACK: SVG İkonlar (SVG kodlarındaki "lnefes_ale" hataları temizlendi)
const icons = {
    nefes_al: '<path d="M12 2L12 22M12 2L5 9M12 2L19 9" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    nefes_ver: '<path d="M12 2L12 22M12 22L5 15M12 22L19 15" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    nefes_tut: '<path d="M10 9v6m4-6v6" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>',
    yumruk_sik: '<path d="M18 12a6 6 0 0 1-6 6v0a6 6 0 0 1-6-6v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2z" fill="currentColor"/><path d="M8 8L6 6m10 2l2-2" stroke="currentColor" stroke-width="2"/>',
    // Eğer yumruk_serbest için özel SVG yoksa, geçici olarak el açık ikonu veya boş bırakıldı:
    yumruk_serbest: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="4 4"/>', 
    yavas_ufle: '<path d="M12 2c0 0-3 2.5-3 6 0 4 6 4 6 0 0-3.5-3-6-3-6z" fill="#e8c1e8"/><rect x="10" y="8" width="4" height="14" rx="1" fill="currentColor"/>'
};

// Nefes Teknikleri Veritabanı (Metinlerdeki bozulmalar düzeltildi)
const techniques = {
    calm: {
        name: "4-7-8 Sakinleşme",
        desc: "Uyku ve derin gevşeme için. Dilini damağına değdir.",
        stepsDisplay: "Al 4s - Tut 7s - Ver 8s",
        cycle: [
            { type: 'nefes_al', duration: 4000, scale: 1, label: 'Al (4s)' },
            { type: 'nefes_tut', duration: 7000, scale: 1, label: 'Tut (7s)' },
            { type: 'nefes_ver', duration: 8000, scale: 0.3, label: 'Ver (8s)' }
        ]
    },
    box: {
        name: "Kutu Tekniği",
        desc: "Odaklanma, stres kontrolü ve panik anında resetleme.",
        stepsDisplay: "Al 4 - Tut 4 - Ver 4 - Tut 4",
        cycle: [
            { type: 'nefes_al', duration: 4000, scale: 1, label: 'Al (4s)' },
            { type: 'nefes_tut', duration: 4000, scale: 1, label: 'Tut (4s)' },
            { type: 'nefes_ver', duration: 4000, scale: 0.3, label: 'Ver (4s)' },
            { type: 'nefes_tut', duration: 4000, scale: 0.3, label: 'Tut (4s)' }
        ]
    },
    yavas_ufle: {
        name: "Mum Nefesi",
        desc: "Dudaklarını büz, hayali bir mumun alevini söndürmeden titret.",
        stepsDisplay: "Al 4s - Üfle (İnce) 8s",
        cycle: [
            { type: 'nefes_al', duration: 4000, scale: 1, label: 'Al (4s)' },
            { type: 'yavas_ufle', duration: 8000, scale: 0.3, label: 'Üfle (8s)' }
        ]
    },
    energy: {
        name: "Isınma (Enerji)",
        desc: "Vücut ısısını artırır (Termojenez). Tutarken tüm vücudu KAS.",
        stepsDisplay: "Al 6 - Sık 10 - Ver 6 - Sık 10",
        // Not: duration: 0, animasyonda geçiş efekti yaratmaz. 
        // Kullanıcı arayüzünde sadece ikonun değişmesini sağlar.
        cycle: [
            { type: 'nefes_al', duration: 6000, scale: 1, label: 'Al (6s)' },
            { type: 'yumruk_sik', duration: 10000, scale: 1, label: 'Yumruk Sık (10s)' },
            { type: 'yumruk_serbest', duration: 1000, scale: 1, label: 'Serbest Bırak (1s)' },
            { type: 'nefes_ver', duration: 6000, scale: 0.3, label: 'Ver (6s)' },
            { type: 'yumruk_sik', duration: 10000, scale: 0.3, label: 'Yumruk Sık (10s)' },
            { type: 'yumruk_serbest', duration: 1000, scale: 0.3, label: 'Serbest Bırak (1s)' }
        ]
    },
    coherence: {
        name: "Rezonans",
        desc: "Kalp ritmi dengesi (HRV). Akışkan ve duraksız.",
        stepsDisplay: "Al 5.5s - Ver 5.5s",
        cycle: [
            { type: 'nefes_al', duration: 5500, scale: 1, label: 'Al (5.5s)' },
            { type: 'nefes_ver', duration: 5500, scale: 0.3, label: 'Ver (5.5s)' }
        ]
    }
};