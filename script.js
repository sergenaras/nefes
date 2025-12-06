// DOM Elementleri
const circle = document.getElementById('breathing-circle');
const phasesContainer = document.getElementById('phases-container');
const techniqueDesc = document.getElementById('technique-desc');
const techniqueSteps = document.getElementById('technique-steps');
const currentDescMini = document.getElementById('current-technique-desc');
const sidebarTitle = document.getElementById('sidebar-title');
const techniqueSelect = document.getElementById('technique-select');
const overlay = document.getElementById('start-overlay');
const overlayText = document.getElementById('overlay-text');

let currentTechnique = null;
let timeouts = [];
let isActive = false;

// --- 1. Başlangıç: Dropdown Doldur ---
function init() {
    // Dropdown içeriğini temizle ve yeniden doldur
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

    // Varsayılan olarak ilk tekniği seç (Genellikle 'calm')
    setTechnique('calm');
}

// --- 2. Teknik Seçimi ---
function setTechnique(key) {
    // Eğer oturum açıksa durdur
    stopSession();
    
    // Dropdown değerini güncelle (Kod içinden manuel çağrılırsa senkron olsun)
    if(techniqueSelect) techniqueSelect.value = key;

    currentTechnique = techniques[key];
    
    // Metin alanlarını güncelle
    if(sidebarTitle) sidebarTitle.innerText = currentTechnique.name;
    if(techniqueDesc) techniqueDesc.innerText = currentTechnique.desc;
    if(techniqueSteps) techniqueSteps.innerText = currentTechnique.stepsDisplay;
    
    // Üst kısımdaki mini açıklama
    if(currentDescMini) currentDescMini.innerText = currentTechnique.desc;

    // --- GOOGLE ANALYTICS: Teknik Seçimi Takibi ---
    // Hangi tekniğin seçildiğini raporlar
    if (typeof gtag !== 'undefined') {
        gtag('event', 'teknik_secildi', {
            'event_category': 'Nefes',
            'event_label': currentTechnique.name,
            'teknik_id': key
        });
    }

    // Alt kısımdaki ikonları oluştur
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
    
    // --- GOOGLE ANALYTICS: Egzersiz Başladı Takibi ---
    // Kullanıcının gerçekten egzersize başladığını raporlar
    if (typeof gtag !== 'undefined') {
        gtag('event', 'egzersiz_basladi', {
            'event_category': 'Aksiyon',
            'event_label': currentTechnique.name
        });
    }
    
    // Topu küçült (Hazırlık)
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
    
    // Arayüzü sıfırla
    overlay.style.opacity = '1';
    overlayText.innerText = "BAŞLA";
    
    circle.style.transition = 'transform 0.8s ease-out';
    circle.style.transform = 'scale(1)';
    
    // Aktif ikon işaretini kaldır
    document.querySelectorAll('.phase-bubble').forEach(b => b.classList.remove('active'));
}

function clearAllTimeouts() {
    timeouts.forEach(id => clearTimeout(id));
    timeouts = [];
}

// --- 4. Görselleştirme (İkonlar ve Metinler) ---
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
            
            // Eğer resim yüklenemezse SVG kullan (Fallback)
            img.onerror = function() {
                const iconSvg = icons[phase.type] || icons['nefes_al'];
                bubble.innerHTML = `<svg viewBox="0 0 24 24">${iconSvg}</svg>`;
                appendSplitLabel(bubble, phase.label);
            };
            
            bubble.appendChild(img);
        } else {
            // Doğrudan SVG kullanımı
            const iconSvg = icons[phase.type] || icons['nefes_al'];
            bubble.innerHTML = `<svg viewBox="0 0 24 24">${iconSvg}</svg>`;
        }
        
        // Metni Ekle (Eğer henüz eklenmediyse)
        if (!bubble.querySelector('.action-text')) {
             appendSplitLabel(bubble, phase.label);
        }
        
        phasesContainer.appendChild(bubble);
    });
}

// Yardımcı Fonksiyon: Metni "İşlem" ve "Süre" olarak ayırır
function appendSplitLabel(parent, fullText) {
    if(parent.querySelector('.action-text')) return;

    const span = document.createElement('span');
    
    // Örnek: "Yumruk Sık (10s)" -> ["Yumruk Sık", "10s"]
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
    // Döngü bittiyse başa dön
    if (stepIndex >= steps.length) stepIndex = 0;

    const currentStep = steps[stepIndex];

    // İlgili fazı aktif et (Highlight)
    document.querySelectorAll('.phase-bubble').forEach(b => b.classList.remove('active'));
    const activeBubble = document.getElementById(`phase-${stepIndex}`);
    if (activeBubble) {
        activeBubble.classList.add('active');
    }

    // Nefes topu animasyonu
    if (currentStep.duration > 0) {
        circle.style.transition = `transform ${currentStep.duration}ms linear`;
        circle.style.transform = `scale(${currentStep.scale})`;
    } else {
        // Anlık değişim (Duration 0 ise)
        circle.style.transition = 'none';
        circle.style.transform = `scale(${currentStep.scale})`;
    }

    // Bir sonraki adım için zamanlayıcı kur
    timeouts.push(setTimeout(() => {
        runCycle(stepIndex + 1);
    }, currentStep.duration));
}

// Uygulamayı Başlat
init();