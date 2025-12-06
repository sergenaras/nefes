// DOM Elementleri
const circle = document.getElementById('breathing-circle');
const phasesContainer = document.getElementById('phases-container');
const techniqueDesc = document.getElementById('technique-desc');
const techniqueSteps = document.getElementById('technique-steps');
const currentTitle = document.getElementById('current-technique-title');
const techniqueListContainer = document.getElementById('technique-list-container');
const overlay = document.getElementById('start-overlay');
const overlayText = document.getElementById('overlay-text');

let currentTechnique = null;
let timeouts = [];
let isActive = false;

// --- 1. Başlangıç: Butonları Oluştur ---
function init() {
    techniqueListContainer.innerHTML = ''; // Temizle
    
    // data.js içindeki 'techniques' objesindeki her anahtar için buton yap
    for (const key in techniques) {
        const tech = techniques[key];
        const btn = document.createElement('button');
        btn.className = 'tech-btn';
        btn.innerText = tech.name;
        btn.onclick = () => setTechnique(key);
        btn.dataset.key = key; // Referans için
        techniqueListContainer.appendChild(btn);
    }

    // Varsayılan olarak ilk tekniği seç (Genelde 'calm' veya 'candle')
    setTechnique('calm');
}

// --- 2. Teknik Seçimi ---
function setTechnique(key) {
    stopSession();
    
    // Buton stillerini güncelle
    document.querySelectorAll('.tech-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.dataset.key === key) btn.classList.add('active');
    });

    // Veriyi çek
    currentTechnique = techniques[key];
    currentTitle.innerText = currentTechnique.name;
    techniqueDesc.innerText = currentTechnique.desc;
    techniqueSteps.innerText = currentTechnique.stepsDisplay;

    createPhaseIndicators();
}

// --- 3. Oturum Yönetimi (Başla/Dur) ---
function toggleSession() {
    if (isActive) {
        stopSession();
    } else {
        startSession();
    }
}

function startSession() {
    isActive = true;
    overlay.style.opacity = '0';
    
    // Hazırlık: Önce küçült
    circle.style.transition = 'transform 0.5s ease-out';
    circle.style.transform = 'scale(0.3)';

    // Döngüyü başlat
    timeouts.push(setTimeout(() => {
        runCycle(0);
    }, 500));
}

function stopSession() {
    isActive = false;
    clearAllTimeouts();
    
    overlay.style.opacity = '1';
    overlayText.innerText = "BAŞLA";
    
    // Reset: Full dolu göster
    circle.style.transition = 'transform 0.8s ease-out';
    circle.style.transform = 'scale(1)';
    
    document.querySelectorAll('.phase-bubble').forEach(b => b.classList.remove('active'));
}

function clearAllTimeouts() {
    timeouts.forEach(id => clearTimeout(id));
    timeouts = [];
}

// --- 4. Görselleştirme ---
function createPhaseIndicators() {
    phasesContainer.innerHTML = '';
    currentTechnique.cycle.forEach((phase, index) => {
        const bubble = document.createElement('div');
        bubble.className = 'phase-bubble';
        bubble.id = `phase-${index}`;
        
        // Eğer data.js'te tanımlı olmayan bir ikon tipi gelirse varsayılanı kullan
        const iconSvg = icons[phase.type] || icons['in'];
        
        const svgHTML = `<svg viewBox="0 0 24 24">${iconSvg}</svg>`;
        bubble.innerHTML = `${svgHTML}<span>${phase.label}</span>`;
        phasesContainer.appendChild(bubble);
    });
}

function runCycle(stepIndex) {
    if (!isActive) return;

    const steps = currentTechnique.cycle;
    if (stepIndex >= steps.length) stepIndex = 0;

    const currentStep = steps[stepIndex];

    // Fazı aktif et
    document.querySelectorAll('.phase-bubble').forEach(b => b.classList.remove('active'));
    document.getElementById(`phase-${stepIndex}`).classList.add('active');

    // Animasyonu uygula
    circle.style.transition = `transform ${currentStep.duration}ms linear`;
    circle.style.transform = `scale(${currentStep.scale})`;

    // Sonraki adıma geç
    timeouts.push(setTimeout(() => {
        runCycle(stepIndex + 1);
    }, currentStep.duration));
}

// Uygulamayı Başlat
init();