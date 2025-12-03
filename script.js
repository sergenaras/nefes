const circle = document.getElementById('breathing-circle');
const instructionText = document.getElementById('instruction-text');
const techniqueDesc = document.getElementById('technique-desc');
const techniqueSteps = document.getElementById('technique-steps');
const currentTitle = document.getElementById('current-technique-title');
const buttons = document.querySelectorAll('.tech-btn');

// Tekniklerin Veritabanı
const techniques = {
    calm: {
        name: "4-7-8 Rahatlama",
        desc: "Sinir sistemini yatıştırır, uykuya geçişi kolaylaştırır ve anksiyeteyi azaltır.",
        steps: "Al: 4sn | Tut: 7sn | Ver: 8sn",
        inhale: 4000,
        hold: 7000,
        exhale: 8000,
        holdEmpty: 0
    },
    box: {
        name: "Kutu Tekniği",
        desc: "Navy SEALs tarafından kullanılan odaklanma ve stres yönetimi tekniği.",
        steps: "Al: 4sn | Tut: 4sn | Ver: 4sn | Tut: 4sn",
        inhale: 4000,
        hold: 4000,
        exhale: 4000,
        holdEmpty: 4000
    },
    energy: {
        name: "Enerji / Isınma",
        desc: "Vücut ısısını artırır (Termojenez) ve uyanıklık sağlar. Videodaki tekniktir.",
        steps: "Al: 6sn | Sık(Tut): 10sn | Ver: 6sn | Sık(Tut): 10sn",
        inhale: 6000,
        hold: 10000,
        exhale: 6000,
        holdEmpty: 10000,
        customText: { hold: "SIK!", holdEmpty: "SIK!" } // Özel metinler
    },
    coherence: {
        name: "Rezonans (Denge)",
        desc: "Kalp ritmi değişkenliğini (HRV) düzenler, bedeni dengeye sokar.",
        steps: "Al: 5.5sn | Ver: 5.5sn (Duraklama yok)",
        inhale: 5500,
        hold: 0,
        exhale: 5500,
        holdEmpty: 0
    }
};

let currentTechnique = techniques.calm;
let isRunning = false;
let timeouts = [];

function clearAllTimeouts() {
    timeouts.forEach(id => clearTimeout(id));
    timeouts = [];
}

function setTechnique(key) {
    clearAllTimeouts();
    
    // Aktif butonu güncelle
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`button[onclick="setTechnique('${key}')"]`).classList.add('active');

    // Verileri yükle
    currentTechnique = techniques[key];
    currentTitle.innerText = currentTechnique.name;
    techniqueDesc.innerText = currentTechnique.desc;
    techniqueSteps.innerText = currentTechnique.steps;

    // Döngüyü sıfırla ve başlat
    resetCircle();
    startBreathing();
}

function resetCircle() {
    circle.style.transition = 'transform 0.5s';
    circle.style.transform = 'scale(0.3)';
    instructionText.innerText = "Hazır...";
}

function startBreathing() {
    runCycle();
}

function runCycle() {
    const t = currentTechnique;
    // Toplam döngü süresi hesaplamaya gerek yok, zincirleme timeout kullanacağız.
    
    // 1. NEFES AL (Genişle)
    instructionText.innerText = "Nefes Al";
    circle.style.transition = `transform ${t.inhale}ms linear`;
    circle.style.transform = 'scale(1)'; // Tam doluluk

    let delay = t.inhale;

    // 2. TUT (Dolu)
    if (t.hold > 0) {
        timeouts.push(setTimeout(() => {
            instructionText.innerText = t.customText?.hold || "Tut";
        }, delay));
        delay += t.hold;
    }

    // 3. NEFES VER (Daral)
    timeouts.push(setTimeout(() => {
        instructionText.innerText = "Ver";
        circle.style.transition = `transform ${t.exhale}ms linear`;
        circle.style.transform = 'scale(0.3)'; // Boşalmış hali
    }, delay));
    delay += t.exhale;

    // 4. TUT (Boş - Varsa)
    if (t.holdEmpty > 0) {
        timeouts.push(setTimeout(() => {
            instructionText.innerText = t.customText?.holdEmpty || "Tut";
        }, delay));
        delay += t.holdEmpty;
    }

    // 5. DÖNGÜYÜ TEKRARLA
    timeouts.push(setTimeout(runCycle, delay));
}

// Başlangıç
setTechnique('calm');