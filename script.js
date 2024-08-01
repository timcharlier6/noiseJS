let audioContext;
let noiseBuffer;
let noiseSource;
let isPlayingWhite = false;
let isPlayingBrown = false;
let isPlayingPink = false;

// White Noise Generator
function createWhiteNoise() {
    const bufferSize = 2 * audioContext.sampleRate; // 2 seconds buffer
    noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; // Values between -1 and 1
    }
}

// Brown Noise Generator
function createBrownNoise() {
    const bufferSize = 2 * audioContext.sampleRate; // 2 seconds buffer
    noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0;

    for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) + lastOut * 0.8; // Decaying white noise
        lastOut = output[i];
    }
}

// Pink Noise Generator
function createPinkNoise() {
    const bufferSize = 2 * audioContext.sampleRate; // 2 seconds buffer
    noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink noise generation
    let b0, b1, b2, b3, b4, b5, b6, white;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
        white = Math.random() * 2 - 1;

        b0 = 0.02109238 * white + b0 * 0.84089642;
        b1 = 0.07113478 * white + b1 * 0.81536655;
        b2 = 0.68873558 * white + b2 * 0.77148607;
        b3 = 0.88707209 * white + b3 * 0.67894303;
        b4 = 0.78996048 * white + b4 * 0.62695567;
        b5 = 0.36171658 * white + b5 * 0.58635600;
        b6 = white * 0.11592602 + b6 * 0.54009966;

        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6;
        output[i] *= 0.11; // Normalize
    }
}

// Play Noise Function
function playNoise(type) {
    if (type === 'white' && isPlayingWhite) return;
    if (type === 'brown' && isPlayingBrown) return;
    if (type === 'pink' && isPlayingPink) return;

    if (type === 'white') {
        createWhiteNoise();
    } else if (type === 'brown') {
        createBrownNoise();
    } else if (type === 'pink') {
        createPinkNoise();
    }

    noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true; // Set to loop indefinitely
    noiseSource.connect(audioContext.destination);

    noiseSource.start();
    if (type === 'white') {
        isPlayingWhite = true;
    } else if (type === 'brown') {
        isPlayingBrown = true;
    } else if (type === 'pink') {
        isPlayingPink = true;
    }
}

// Stop Noise Function
function stopNoise(type) {
    if (type === 'white' && !isPlayingWhite) return;
    if (type === 'brown' && !isPlayingBrown) return;
    if (type === 'pink' && !isPlayingPink) return;

    noiseSource.stop();
    if (type === 'white') {
        isPlayingWhite = false;
    } else if (type === 'brown') {
        isPlayingBrown = false;
    } else if (type === 'pink') {
        isPlayingPink = false;
    }
}

document.getElementById('playWhiteNoiseButton').addEventListener('click', () => playNoise('white'));
document.getElementById('stopWhiteNoiseButton').addEventListener('click', () => stopNoise('white'));
document.getElementById('playBrownNoiseButton').addEventListener('click', () => playNoise('brown'));
document.getElementById('stopBrownNoiseButton').addEventListener('click', () => stopNoise('brown'));
document.getElementById('playPinkNoiseButton').addEventListener('click', () => playNoise('pink'));
document.getElementById('stopPinkNoiseButton').addEventListener('click', () => stopNoise('pink'));

// Initialize the audio context
audioContext = new (window.AudioContext || window.webkitAudioContext)();

