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
    techniqueListContainer.innerHTML = '';
    
    for (const key in techniques) {
        const tech = techniques[key];
        const btn = document.createElement('button');
        btn.className = 'tech-btn';
        btn.innerText = tech.name;
        btn.onclick = () => setTechnique(key);
        btn.dataset.key = key;
        techniqueListContainer.appendChild(btn);
    }

    setTechnique('calm');
}

// --- 2. Teknik Seçimi ---
function setTechnique(key) {
    stopSession();
    
    document.querySelectorAll('.tech-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.dataset.key === key) btn.classList.add('active');
    });

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
    
    circle.style.transition = 'transform 0.5s ease-out';
    circle.style.transform = 'scale(0.3)';

    timeouts.push(setTimeout(() => {
        runCycle(0);
    }, 500));
}

function stopSession() {
    isActive = false;
    clearAllTimeouts();
    
    overlay.style.opacity = '1';
    overlayText.innerText = "BAŞLA";
    
    circle.style.transition = 'transform 0.8s ease-out';
    circle.style.transform = 'scale(1)';
    
    document.querySelectorAll('.phase-bubble').forEach(b => b.classList.remove('active'));
}

function clearAllTimeouts() {
    timeouts.forEach(id => clearTimeout(id));
    timeouts = [];
}

// --- 4. Görselleştirme (İkonları PNG Dosyalarından Yükle) ---
function createPhaseIndicators() {
    phasesContainer.innerHTML = '';
    
    currentTechnique.cycle.forEach((phase, index) => {
        const bubble = document.createElement('div');
        bubble.className = 'phase-bubble';
        bubble.id = `phase-${index}`;
        
        // İkon dosya yolunu kontrol et
        const iconPath = iconFiles[phase.type];
        
        if (iconPath) {
            // PNG dosyası varsa <img> tag ile yükle
            const img = document.createElement('img');
            img.src = iconPath;
            img.alt = phase.label;
            img.className = 'phase-icon';
            
            // Yükleme hatası durumunda fallback kullan
            img.onerror = function() {
                // Sessizce fallback'e geç
                const iconSvg = icons[phase.type] || icons['in'];
                bubble.innerHTML = `
                    <svg viewBox="0 0 24 24">${iconSvg}</svg>
                    <span>${phase.label}</span>
                `;
            };
            
            const span = document.createElement('span');
            span.textContent = phase.label;
            
            bubble.appendChild(img);
            bubble.appendChild(span);
        } else {
            // Fallback: data.js'teki inline SVG'leri kullan
            const iconSvg = icons[phase.type] || icons['in'];
            bubble.innerHTML = `
                <svg viewBox="0 0 24 24">${iconSvg}</svg>
                <span>${phase.label}</span>
            `;
        }
        
        phasesContainer.appendChild(bubble);
    });
}

// --- 5. Animasyon Döngüsü ---
function runCycle(stepIndex) {
    if (!isActive) return;

    const steps = currentTechnique.cycle;
    if (stepIndex >= steps.length) stepIndex = 0;

    const currentStep = steps[stepIndex];

    // Fazı aktif et
    document.querySelectorAll('.phase-bubble').forEach(b => b.classList.remove('active'));
    const activeBubble = document.getElementById(`phase-${stepIndex}`);
    if (activeBubble) {
        activeBubble.classList.add('active');
    }

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