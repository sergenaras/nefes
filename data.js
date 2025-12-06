// data.js - ORGANİK İKONOGRAFİK TASARIM

const icons = {
    // NEFES AL (İn) - Yukarı akan yaprak/rüzgar
    in: `
        <path d="M12 20C12 20 12 4 12 4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M12 4L8 8M12 4L16 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M7 12C7 12 6 10 6 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
        <path d="M17 12C17 12 18 10 18 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    `,
    
    // NEFES VER (Out) - Aşağı akan yaprak/rüzgar
    out: `
        <path d="M12 4C12 4 12 20 12 20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M12 20L8 16M12 20L16 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M7 12C7 12 6 14 6 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
        <path d="M17 12C17 12 18 14 18 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    `,
    
    // TUT (Hold) - Denge/Meditasyon sembolü
    hold: `
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
        <path d="M12 3L12 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 15L12 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    `,
    
    // SIK (Squeeze) - Güç/Enerji sembolü (yıldırım + yumruk)
    squeeze: `
        <path d="M13 2L8 12L12 12L11 22L19 10L14 10L13 2Z" fill="currentColor" opacity="0.9"/>
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.4"/>
    `,
    
    // MUM (Candle) - Alev sembolü
    candle: `
        <path d="M12 3C12 3 9 6 9 9C9 12 15 12 15 9C15 6 12 3 12 3Z" 
              fill="currentColor" opacity="0.8"/>
        <ellipse cx="12" cy="9" rx="2" ry="3" fill="currentColor" opacity="0.4"/>
        <rect x="10.5" y="10" width="3" height="11" rx="1.5" fill="currentColor" opacity="0.6"/>
        <ellipse cx="12" cy="21" rx="2.5" ry="1" fill="currentColor" opacity="0.5"/>
    `,
    
    // EKSTRA: Lotus (Meditasyon için)
    lotus: `
        <path d="M12 18C12 18 8 16 8 12C8 12 10 14 12 14C14 14 16 12 16 12C16 16 12 18 12 18Z" 
              fill="currentColor" opacity="0.7"/>
        <path d="M12 14C12 14 10 12 6 12C6 12 8 14 12 16C16 14 18 12 18 12C14 12 12 14 12 14Z" 
              fill="currentColor" opacity="0.5"/>
        <circle cx="12" cy="13" r="2" fill="currentColor"/>
    `,
    
    // EKSTRA: Dalga (Rezonans için)
    wave: `
        <path d="M2 12C4 8 6 8 8 12C10 16 12 16 14 12C16 8 18 8 20 12C22 16 24 16 24 12" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M2 12C4 8 6 8 8 12C10 16 12 16 14 12C16 8 18 8 20 12C22 16 24 16 24 12" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" 
              opacity="0.4" transform="translate(0, 4)"/>
    `
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
            { type: 'candle', duration: 8000, scale: 0.3, label: 'Üfle (İnce)' }
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