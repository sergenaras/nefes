// data.js

const icons = {
    in: '<path d="M12 2L12 22M12 2L5 9M12 2L19 9" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>', // Ok Yukarı
    out: '<path d="M12 2L12 22M12 22L5 15M12 22L19 15" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>', // Ok Aşağı
    hold: '<path d="M10 9v6m4-6v6" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>', // Duraklat
    squeeze: '<path d="M18 12a6 6 0 0 1-6 6v0a6 6 0 0 1-6-6v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2z" fill="currentColor"/><path d="M8 8L6 6m10 2l2-2" stroke="currentColor" stroke-width="2"/>', // Yumruk
    candle: '<path d="M12 2c0 0-3 2.5-3 6 0 4 6 4 6 0 0-3.5-3-6-3-6z" fill="#e8c1e8"/><rect x="10" y="8" width="4" height="14" rx="1" fill="currentColor"/>' // Mum Alevi (Basit)
};

// Nefes Teknikleri Veritabanı
const techniques = {
    calm: {
        name: "4-7-8 Sakinleşme",
        desc: "Uyku ve derin gevşeme için. Dilini damağına değdir.",
        stepsDisplay: "Al 4s - Tut 7s - Ver 8s",
        cycle: [
            { type: 'in', duration: 4000, scale: 1, label: 'Al (4s)' },
            { type: 'hold', duration: 7000, scale: 1, label: 'Tut (7s)' },
            { type: 'out', duration: 8000, scale: 0.3, label: 'Ver (8s)' }
        ]
    },
    box: {
        name: "Kutu Tekniği",
        desc: "Odaklanma, stres kontrolü ve panik anında resetleme.",
        stepsDisplay: "Al 4 - Tut 4 - Ver 4 - Tut 4",
        cycle: [
            { type: 'in', duration: 4000, scale: 1, label: 'Al' },
            { type: 'hold', duration: 4000, scale: 1, label: 'Tut' },
            { type: 'out', duration: 4000, scale: 0.3, label: 'Ver' },
            { type: 'hold', duration: 4000, scale: 0.3, label: 'Tut' }
        ]
    },
    candle: {
        name: "Mum Nefesi",
        desc: "Dudaklarını büz, hayali bir mumun alevini söndürmeden titret.",
        stepsDisplay: "Al 4s - Üfle (İnce) 8s",
        cycle: [
            { type: 'in', duration: 4000, scale: 1, label: 'Al (Burun)' },
            { type: 'out', duration: 8000, scale: 0.3, label: 'Üfle (İnce)' } // 'candle' ikonu da kullanabilirsin
        ]
    },
    energy: {
        name: "Isınma (Enerji)",
        desc: "Vücut ısısını artırır (Termojenez). Tutarken tüm vücudu KAS.",
        stepsDisplay: "Al 6 - Sık 10 - Ver 6 - Sık 10",
        cycle: [
            { type: 'in', duration: 6000, scale: 1, label: 'Al (6s)' },
            { type: 'squeeze', duration: 10000, scale: 1, label: 'SIK (10s)' },
            { type: 'out', duration: 6000, scale: 0.3, label: 'Ver (6s)' },
            { type: 'squeeze', duration: 10000, scale: 0.3, label: 'SIK (10s)' }
        ]
    },
    coherence: {
        name: "Rezonans",
        desc: "Kalp ritmi dengesi (HRV). Akışkan ve duraksız.",
        stepsDisplay: "Al 5.5s - Ver 5.5s",
        cycle: [
            { type: 'in', duration: 5500, scale: 1, label: 'Al' },
            { type: 'out', duration: 5500, scale: 0.3, label: 'Ver' }
        ]
    }
};