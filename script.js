const statusBox = document.getElementById('status');
const logArea = document.getElementById('log');
const frameContainer = document.getElementById('hidden-frames');
const mascotStage = document.getElementById('mascot-stage');
const capyEyes = document.getElementById('capy-eyes');
const capyMouth = document.getElementById('capy-mouth');

let checkInterval;

const endpoints = [
    "http://neverssl.com",
    "http://captive.apple.com/hotspot-detect.html",
    "http://connectivitycheck.gstatic.com/generate_204",
    "http://www.msftconnecttest.com/connecttest.txt"
];

function log(msg) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    const time = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    entry.textContent = `[${time}] ${msg}`;
    logArea.prepend(entry);
}

// Altera a expressão e o humor da capivara
function setCapyMood(mood) {
    mascotStage.className = `mascot-stage mood-${mood}`;

    if (mood === 'intercepted') {
        // Olhinhos arregalados / alerta fofo
        capyEyes.innerHTML = `
            <circle cx="72" cy="73" r="5" fill="#382010" />
            <circle cx="74" cy="71" r="1.8" fill="#ffffff" />
            <circle cx="108" cy="73" r="5" fill="#382010" />
            <circle cx="110" cy="71" r="1.8" fill="#ffffff" />
        `;
        if (capyMouth) capyMouth.setAttribute('d', 'M 87 107 A 3 3 0 1 0 93 107 Z');
    } else if (mood === 'online') {
        // Olhinhos felizes estilo anime (^ _ ^)
        capyEyes.innerHTML = `
            <path d="M 64 77 Q 72 68 80 77" stroke="#382010" stroke-width="3.5" fill="none" stroke-linecap="round" />
            <path d="M 100 77 Q 108 68 116 77" stroke="#382010" stroke-width="3.5" fill="none" stroke-linecap="round" />
        `;
        if (capyMouth) capyMouth.setAttribute('d', 'M 83 105 Q 90 114 97 105');
    } else {
        // Modo Zen / Observando
        capyEyes.innerHTML = `
            <path d="M 64 74 Q 72 70 80 74" stroke="#382010" stroke-width="3.5" fill="none" stroke-linecap="round" />
            <path d="M 100 74 Q 108 70 116 74" stroke="#382010" stroke-width="3.5" fill="none" stroke-linecap="round" />
        `;
        if (capyMouth) capyMouth.setAttribute('d', 'M 85 107 Q 90 111 95 107');
    }
}

// Detecta interceptação via fetch HTTP
function checkInterception() {
    const cb = new Date().getTime();
    const target = `http://connectivitycheck.gstatic.com/generate_204?ts=${cb}`;
    
    fetch(target, { mode: 'no-cors', cache: 'no-store' })
        .then(() => {
            // O roteador interceptou o tráfego e devolveu HTML / 302
            log("Portal detectado! O roteador fisgou o tráfego.");
            statusBox.textContent = "Rede presa no portal! Clique para logar.";
            statusBox.className = "status-box intercepted";
            setCapyMood('intercepted');
            floodNetwork();
        })
        .catch(() => {
            log("Sem rota externa direta. Aguardando login...");
            statusBox.textContent = "Sem conexão. Capivara esperando login.";
            statusBox.className = "status-box offline";
            setCapyMood('zen');
        });
        
    // Valida se o tráfego HTTPS real já flui
    const img = new Image();
    img.onload = () => {
        log("HTTPS liberado! Internet em harmonia.");
        statusBox.textContent = "Conectado! A capivara está em paz total.";
        statusBox.className = "status-box online";
        setCapyMood('online');
        clearInterval(checkInterval);
    };
    img.onerror = () => {
        // Ainda sem conexão completa
    };
    img.src = `https://www.google.com/favicon.ico?ts=${cb}`;
}

// Disparo contínuo de iframes leves para forçar o sensor do sistema a reagir
function floodNetwork() {
    frameContainer.innerHTML = '';
    log("Capivara mergulhando: disparando requisições...");
    
    endpoints.forEach((url) => {
        const iframe = document.createElement('iframe');
        const cb = new Date().getTime();
        iframe.src = `${url}?ts=${cb}`;
        frameContainer.appendChild(iframe);
    });
}

window.onload = function() {
    log("Capivara iniciou a ronda na lagoa da rede...");
    setCapyMood('zen');
    checkInterception();
    checkInterval = setInterval(checkInterception, 4000);
    
    setTimeout(floodNetwork, 1000); 
};
