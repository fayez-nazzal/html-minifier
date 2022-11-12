let audio: HTMLAudioElement | null = null;

export const playTrackWithLowVolume = (track: string) => {
  if (audio?.duration !== undefined && audio?.duration > 0 && !audio?.paused) {
    return;
  }

  audio = new Audio(track);
  audio.volume = 0.3;
  audio.play();
};
