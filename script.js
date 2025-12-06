// DOM Elementleri
const circle = document.getElementById('breathing-circle');
const phasesContainer = document.getElementById('phases-container');
const techniqueDesc = document.getElementById('technique-desc');
const techniqueSteps = document.getElementById('technique-steps');
const currentDescMini = document.getElementById('current-technique-desc'); // Yeni mini açıklama alanı
const sidebarTitle = document.getElementById('sidebar-title');
const techniqueSelect = document.getElementById('technique-select'); // Yeni Dropdown
const overlay = document.getElementById('start-overlay');
const overlayText = document.getElementById('overlay-text');

let currentTechnique = null;
let timeouts = [];
let isActive = false;

// --- 1. Başlangıç: Dropdown Doldur ---
function init() {
    techniqueSelect.innerHTML = '';
    
    for (const key in techniques) {
        const tech = techniques[key];
        const option = document.createElement('option');
        option.value = key;
        option.innerText = tech.name;
        techniqueSelect.appendChild(option);
    }

    // Dropdown değiştiğinde çalışacak olay
    techniqueSelect.addEventListener('change', (e) => {
        setTechnique(e.target.value);
    });

    // Varsayılan olarak ilk tekniği seç
    setTechnique('calm');
}

// --- 2. Teknik Seçimi ---
function setTechnique(key) {
    stopSession();
    
    // Dropdown değerini güncelle (JS ile çağrılırsa diye)
    techniqueSelect.value = key;

    currentTechnique = techniques[key];
    
    // Yazı güncellemeleri
    if(sidebarTitle) sidebarTitle.innerText = currentTechnique.name;
    if(techniqueDesc) techniqueDesc.innerText = currentTechnique.desc;
    if(techniqueSteps) techniqueSteps.innerText = currentTechnique.stepsDisplay;
    
    // Üst kısımdaki mini açıklama
    if(currentDescMini) currentDescMini.innerText = currentTechnique.desc;

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

// --- 4. Görselleştirme ---
function createPhaseIndicators() {
    phasesContainer.innerHTML = '';
    
    currentTechnique.cycle.forEach((phase, index) => {
        const bubble = document.createElement('div');
        bubble.className = 'phase-bubble';
        bubble.id = `phase-${index}`;
        
        // İkon dosya yolunu kontrol et
        const iconPath = iconFiles[phase.type];
        
        if (iconPath) {
            const img = document.createElement('img');
            img.src = iconPath;
            img.alt = phase.label;
            img.className = 'phase-icon';
            
            img.onerror = function() {
                const iconSvg = icons[phase.type] || icons['nefes_al'];
                bubble.innerHTML = `<svg viewBox="0 0 24 24">${iconSvg}</svg>`;
                appendSplitLabel(bubble, phase.label);
            };
            
            bubble.appendChild(img);
        } else {
            const iconSvg = icons[phase.type] || icons['nefes_al'];
            bubble.innerHTML = `<svg viewBox="0 0 24 24">${iconSvg}</svg>`;
        }
        
        // Metni Ekle
        if (!bubble.querySelector('.action-text')) {
             appendSplitLabel(bubble, phase.label);
        }
        
        phasesContainer.appendChild(bubble);
    });
}

function appendSplitLabel(parent, fullText) {
    if(parent.querySelector('.action-text')) return;

    const span = document.createElement('span');
    
    if (fullText.includes('(')) {
        const parts = fullText.split(' (');
        const actionText = parts[0]; 
        const timeText = parts[1].replace(')', '');
        
        span.innerHTML = `
            <div class="action-text">${actionText}</div>
            <div class="time-text">${timeText}</div>
        `;
    } else {
        span.innerHTML = `<div class="action-text">${fullText}</div>`;
    }
    
    parent.appendChild(span);
}

// --- 5. Animasyon Döngüsü ---
function runCycle(stepIndex) {
    if (!isActive) return;

    const steps = currentTechnique.cycle;
    if (stepIndex >= steps.length) stepIndex = 0;

    const currentStep = steps[stepIndex];

    document.querySelectorAll('.phase-bubble').forEach(b => b.classList.remove('active'));
    const activeBubble = document.getElementById(`phase-${stepIndex}`);
    if (activeBubble) {
        activeBubble.classList.add('active');
    }

    if (currentStep.duration > 0) {
        circle.style.transition = `transform ${currentStep.duration}ms linear`;
        circle.style.transform = `scale(${currentStep.scale})`;
    } else {
        circle.style.transition = 'none';
        circle.style.transform = `scale(${currentStep.scale})`;
    }

    timeouts.push(setTimeout(() => {
        runCycle(stepIndex + 1);
    }, currentStep.duration));
}

// Uygulamayı Başlat
init();