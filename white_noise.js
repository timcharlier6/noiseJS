let audioContext;
let noiseBuffer;
let noiseSource;
let isPlaying = false;

function createWhiteNoise() {
    // Create a new audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create a buffer for white noise
    const bufferSize = 2 * audioContext.sampleRate; // 2 seconds buffer
    noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Fill the buffer with white noise
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; // Values between -1 and 1
    }
}

function playWhiteNoise() {
    if (isPlaying) return;

    createWhiteNoise();

    // Create a buffer source node
    noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true; // Set to loop indefinitely
    noiseSource.connect(audioContext.destination);

    // Start playing the noise
    noiseSource.start();
    isPlaying = true;
}

function stopWhiteNoise() {
    if (!isPlaying) return;

    // Stop the noise source
    noiseSource.stop();
    isPlaying = false;
}

document.getElementById('playButton').addEventListener('click', playWhiteNoise);
document.getElementById('stopButton').addEventListener('click', stopWhiteNoise);
