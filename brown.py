import numpy as np
import sounddevice as sd

# Parameters
sample_rate = 44100  # Sample rate in Hz
duration = 5  # Duration of the brown noise buffer in seconds

# Generate white noise
white_noise = np.random.normal(0, 1, sample_rate * duration)

# Generate brown noise by integrating white noise
brown_noise = np.cumsum(white_noise)
brown_noise = brown_noise - np.mean(brown_noise)  # Remove DC offset
brown_noise = brown_noise / np.max(np.abs(brown_noise))  # Normalize

# Convert the brown noise to a 16-bit format
brown_noise = (brown_noise * 2**15).astype(np.int16)

# Reshape the noise array to match the required shape for the stream
brown_noise = brown_noise.reshape(-1, 1)

# Initialize the position in the noise buffer
position = 0

# Function to play brown noise continuously
def callback(outdata, frames, time, status):
    global position
    if status:
        print(status)
    # Wrap around the position index when reaching the end of the noise buffer
    if position + frames > brown_noise.shape[0]:
        remaining = brown_noise.shape[0] - position
        outdata[:remaining] = brown_noise[position:]
        outdata[remaining:] = brown_noise[:frames - remaining]
        position = frames - remaining
    else:
        outdata[:] = brown_noise[position:position + frames]
        position += frames

# Create an output stream
stream = sd.OutputStream(callback=callback, channels=1, samplerate=sample_rate, dtype='int16')

# Start the stream and play brown noise indefinitely
with stream:
    print("Playing brown noise. Press Ctrl+C to stop.")
    try:
        while True:
            sd.sleep(1000)
    except KeyboardInterrupt:
        print("Stopped.")
