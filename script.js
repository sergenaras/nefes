const circle = document.getElementById('breathing-circle');
const phasesContainer = document.getElementById('phases-container');
const techniqueDesc = document.getElementById('technique-desc');
const techniqueSteps = document.getElementById('technique-steps');
const currentTitle = document.getElementById('current-technique-title');
const buttons = document.querySelectorAll('.tech-btn');
const overlay = document.getElementById('start-overlay');
const overlayText = document.getElementById('overlay-text');

// İkonlar
const icons = {
    in: '<path d="M12 2L12 22M12 2L5 9M12 2L19 9" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    out: '<path d="M12 2L12 22M12 22L5 15M12 22L19 15" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    hold: '<path d="M10 9v6m4-6v6" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>',
    squeeze: '<path d="M18 12a6 6 0 0 1-6 6v0a6 6 0 0 1-6-6v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2z" fill="currentColor"/><path d="M8 8L6 6m10 2l2-2" stroke="currentColor" stroke-width="2"/>'
};

const techniques = {
    calm: {
        name: "4-7-8 Sakinleşme",
        desc: "Uyku ve derin gevşeme için.",
        stepsDisplay: "Al 4s - Tut 7s - Ver 8s",
        cycle: [
            { type: 'in', duration: 4000, scale: 1, label: 'Al (4s)' },
            { type: 'hold', duration: 7000, scale: 1, label: 'Tut (7s)' },
            { type: 'out', duration: 8000, scale: 0.3, label: 'Ver (8s)' }
        ]
    },
    box: {
        name: "Kutu Tekniği",
        desc: "Odaklanma ve stres kontrolü.",
        stepsDisplay: "Al 4 - Tut 4 - Ver 4 - Tut 4",
        cycle: [
            { type: 'in', duration: 4000, scale: 1, label: 'Al' },
            { type: 'hold', duration: 4000, scale: 1, label: 'Tut' },
            { type: 'out', duration: 4000, scale: 0.3, label: 'Ver' },
            { type: 'hold', duration: 4000, scale: 0.3, label: 'Tut' }
        ]
    },
    energy: {
        name: "Isınma (Enerji)",
        desc: "Vücut ısısını artırır. Tutma sırasında kaslarını sık.",
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
        desc: "Kalp ritmi dengesi.",
        stepsDisplay: "Al 5.5s - Ver 5.5s",
        cycle: [
            { type: 'in', duration: 5500, scale: 1, label: 'Al' },
            { type: 'out', duration: 5500, scale: 0.3, label: 'Ver' }
        ]
    }
};

let currentTechnique = null;
let timeouts = [];
let isActive = false; // Egzersiz çalışıyor mu?

function clearAllTimeouts() {
    timeouts.forEach(id => clearTimeout(id));
    timeouts = [];
}

function setTechnique(key) {
    stopSession(); // Önce durdur
    
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`button[onclick="setTechnique('${key}')"]`).classList.add('active');

    currentTechnique = techniques[key];
    currentTitle.innerText = currentTechnique.name;
    techniqueDesc.innerText = currentTechnique.desc;
    techniqueSteps.innerText = currentTechnique.stepsDisplay;

    createPhaseIndicators();
}

// Ana Başlat/Durdur Fonksiyonu
function toggleSession() {
    if (isActive) {
        stopSession();
    } else {
        startSession();
    }
}

function startSession() {
    isActive = true;
    overlay.style.opacity = '0'; // Yazıyı gizle
    
    // 1. Önce topu aniden küçült (Boş ciğer başlangıcı)
    circle.style.transition = 'transform 0.5s ease-out';
    circle.style.transform = 'scale(0.3)';

    // 2. Küçülme animasyonu bitince (0.5s sonra) döngüyü başlat
    timeouts.push(setTimeout(() => {
        runCycle(0);
    }, 500));
}

function stopSession() {
    isActive = false;
    clearAllTimeouts();
    
    // UI Sıfırla
    overlay.style.opacity = '1';
    overlayText.innerText = "BAŞLA";
    
    // Topu FULL hale getir
    circle.style.transition = 'transform 0.8s ease-out';
    circle.style.transform = 'scale(1)';
    
    // Fazları temizle
    document.querySelectorAll('.phase-bubble').forEach(b => b.classList.remove('active'));
}

function createPhaseIndicators() {
    phasesContainer.innerHTML = '';
    currentTechnique.cycle.forEach((phase, index) => {
        const bubble = document.createElement('div');
        bubble.className = 'phase-bubble';
        bubble.id = `phase-${index}`;
        const svgHTML = `<svg viewBox="0 0 24 24">${icons[phase.type]}</svg>`;
        bubble.innerHTML = `${svgHTML}<span>${phase.label}</span>`;
        phasesContainer.appendChild(bubble);
    });
}

function runCycle(stepIndex) {
    if (!isActive) return;

    const steps = currentTechnique.cycle;
    if (stepIndex >= steps.length) stepIndex = 0;

    const currentStep = steps[stepIndex];

    // Aktif Fazı İşaretle
    document.querySelectorAll('.phase-bubble').forEach(b => b.classList.remove('active'));
    document.getElementById(`phase-${stepIndex}`).classList.add('active');

    // Animasyonu Uygula
    circle.style.transition = `transform ${currentStep.duration}ms linear`;
    circle.style.transform = `scale(${currentStep.scale})`;

    // Sonraki adım
    timeouts.push(setTimeout(() => {
        runCycle(stepIndex + 1);
    }, currentStep.duration));
}

// Başlangıç Ayarı
setTechnique('calm');