import numpy as np
import sounddevice as sd

# Parameters
sample_rate = 44100  # Sample rate in Hz
duration = 5  # Duration of the pink noise buffer in seconds

# Generate white noise
white_noise = np.random.normal(0, 1, sample_rate * duration)

# Apply a filter to generate pink noise
def generate_pink_noise(white_noise):
    # Perform FFT
    f = np.fft.rfft(white_noise)
    
    # Create frequency array
    freqs = np.fft.rfftfreq(len(white_noise), d=1/sample_rate)
    
    # Apply the 1/f filter
    f = f / (freqs + 1e-10)  # Avoid division by zero
    
    # Perform inverse FFT
    pink_noise = np.fft.irfft(f)
    
    return pink_noise

pink_noise = generate_pink_noise(white_noise)

# Normalize the pink noise
pink_noise = pink_noise / np.max(np.abs(pink_noise))

# Convert the pink noise to a 16-bit format
pink_noise = (pink_noise * 2**15).astype(np.int16)

# Reshape the noise array to match the required shape for the stream
pink_noise = pink_noise.reshape(-1, 1)

# Initialize the position in the noise buffer
position = 0

# Function to play pink noise continuously
def callback(outdata, frames, time, status):
    global position
    if status:
        print(status)
    # Wrap around the position index when reaching the end of the noise buffer
    if position + frames > pink_noise.shape[0]:
        remaining = pink_noise.shape[0] - position
        outdata[:remaining] = pink_noise[position:]
        outdata[remaining:] = pink_noise[:frames - remaining]
        position = frames - remaining
    else:
        outdata[:] = pink_noise[position:position + frames]
        position += frames

# Create an output stream
stream = sd.OutputStream(callback=callback, channels=1, samplerate=sample_rate, dtype='int16')

# Start the stream and play pink noise indefinitely
with stream:
    print("Playing pink noise. Press Ctrl+C to stop.")
    try:
        while True:
            sd.sleep(1000)
    except KeyboardInterrupt:
        print("Stopped.")
