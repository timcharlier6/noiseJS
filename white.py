import numpy as np
import sounddevice as sd

# Parameters
sample_rate = 44100  # Sample rate in Hz
duration = 5  # Duration of the white noise buffer in seconds

# Generate white noise
noise = np.random.normal(0, 1, sample_rate * duration)

# Normalize the white noise
noise = noise / np.max(np.abs(noise))

# Convert the white noise to a 16-bit format
noise = (noise * 2**15).astype(np.int16)

# Reshape the noise array to match the required shape for the stream
noise = noise.reshape(-1, 1)

# Initialize the position in the noise buffer
position = 0

# Function to play white noise continuously
def callback(outdata, frames, time, status):
    global position
    if status:
        print(status)
    # Wrap around the position index when reaching the end of the noise buffer
    if position + frames > noise.shape[0]:
        remaining = noise.shape[0] - position
        outdata[:remaining] = noise[position:]
        outdata[remaining:] = noise[:frames - remaining]
        position = frames - remaining
    else:
        outdata[:] = noise[position:position + frames]
        position += frames

# Create an output stream
stream = sd.OutputStream(callback=callback, channels=1, samplerate=sample_rate, dtype='int16')

# Start the stream and play white noise indefinitely
with stream:
    print("Playing white noise. Press Ctrl+C to stop.")
    try:
        while True:
            sd.sleep(1000)
    except KeyboardInterrupt:
        print("Stopped.")

