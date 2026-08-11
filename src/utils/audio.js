let isAudioEnabled = true;
let currentAudio = null;

export const setAudioEnabled = (enabled) => {
  isAudioEnabled = enabled;
  if (!enabled) {
    stopNarration();
  }
};

export const getAudioEnabled = () => isAudioEnabled;

export const narrateText = (audioFileId) => {
  if (!isAudioEnabled) return;
  
  // Always stop previous audio before starting new to prevent overlapping
  stopNarration();
  
  // Create and play new audio. Append a version string to bypass any cached old robotic files.
  const audio = new Audio(`/audio/${audioFileId}?v=${new Date().getTime()}`);
  audio.play().catch(e => console.error("Audio play failed:", e));
  
  currentAudio = audio;
};

export const stopNarration = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};
