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

    // Varsayılan olarak ilk tekniği seç (veya 'calm')
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

// --- 4. Görselleştirme (GÜNCELLENDİ: Alt Alta Metin Yapısı) ---
function createPhaseIndicators() {
    phasesContainer.innerHTML = '';
    
    currentTechnique.cycle.forEach((phase, index) => {
        const bubble = document.createElement('div');
        bubble.className = 'phase-bubble';
        bubble.id = `phase-${index}`;
        
        // İkon dosya yolunu kontrol et
        const iconPath = iconFiles[phase.type];
        
        // 1. İkonu Ekle
        if (iconPath) {
            // PNG dosyası varsa
            const img = document.createElement('img');
            img.src = iconPath;
            img.alt = phase.label;
            img.className = 'phase-icon';
            
            // Yükleme hatası durumunda fallback SVG
            img.onerror = function() {
                const iconSvg = icons[phase.type] || icons['nefes_al'];
                bubble.innerHTML = `<svg viewBox="0 0 24 24">${iconSvg}</svg>`;
                appendSplitLabel(bubble, phase.label); // SVG durumunda etiketi tekrar ekle
            };
            
            bubble.appendChild(img);
        } else {
            // Fallback: data.js'teki inline SVG'leri kullan
            const iconSvg = icons[phase.type] || icons['nefes_al'];
            bubble.innerHTML = `<svg viewBox="0 0 24 24">${iconSvg}</svg>`;
        }
        
        // 2. Metni Ekle (Eğer img.onerror çalışmadıysa buradan ekleriz)
        // SetTimeout kullanmıyoruz, senkron ekliyoruz ama img tagı varsa kontrol ediyoruz
        if (!bubble.querySelector('.action-text')) {
             appendSplitLabel(bubble, phase.label);
        }
        
        phasesContainer.appendChild(bubble);
    });
}

// Yardımcı Fonksiyon: Metni "İşlem" ve "Süre" olarak ayırır
function appendSplitLabel(parent, fullText) {
    // Daha önce eklenmişse tekrar ekleme
    if(parent.querySelector('.action-text')) return;

    const span = document.createElement('span');
    
    // "Yumruk Sık (10s)" -> ["Yumruk Sık", "10s"]
    if (fullText.includes('(')) {
        const parts = fullText.split(' (');
        const actionText = parts[0]; 
        const timeText = parts[1].replace(')', ''); // Sondaki parantezi sil
        
        span.innerHTML = `
            <div class="action-text">${actionText}</div>
            <div class="time-text">${timeText}</div>
        `;
    } else {
        // Parantez yoksa düz yaz
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

    // Fazı aktif et
    document.querySelectorAll('.phase-bubble').forEach(b => b.classList.remove('active'));
    const activeBubble = document.getElementById(`phase-${stepIndex}`);
    if (activeBubble) {
        activeBubble.classList.add('active');
    }

    // Animasyonu uygula (Eğer süre 0 ise anlık geçiş yap)
    if (currentStep.duration > 0) {
        circle.style.transition = `transform ${currentStep.duration}ms linear`;
        circle.style.transform = `scale(${currentStep.scale})`;
    } else {
        circle.style.transition = 'none';
        circle.style.transform = `scale(${currentStep.scale})`;
    }

    // Sonraki adıma geç
    // Eğer süre 0 ise (örn: Yumruk Serbest), minimum bir bekleme (örn 100ms) verilebilir veya direkt geçilir.
    // Ancak data.js'de 0 yerine 500ms verdik, o yüzden direkt duration kullanıyoruz.
    timeouts.push(setTimeout(() => {
        runCycle(stepIndex + 1);
    }, currentStep.duration));
}

// Uygulamayı Başlat
init();