
import { BGM_URLS, SFX_URLS } from '../constants';

class AudioService {
  private bgmAudio: HTMLAudioElement | null = null;
  private currentBgmKey: string | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.4;
  private initialized: boolean = false;

  constructor() {
    this.bgmAudio = new Audio();
    this.bgmAudio.loop = true;
  }

  // Must be called on user interaction to unlock audio context
  init() {
    if (!this.initialized) {
      this.initialized = true;
      // Try to play silent to unlock
      this.playSFX('click', true);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgmAudio) {
      this.bgmAudio.muted = this.isMuted;
    }
    return this.isMuted;
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.bgmAudio) this.bgmAudio.volume = this.volume;
  }

  playBGM(key: string) {
    if (!this.initialized) return; // Wait for interaction
    
    // Check if URL exists for key, otherwise default to map or silence
    const url = BGM_URLS[key] || BGM_URLS['map'];

    if (this.currentBgmKey === key) return; // Already playing

    // Fade out current if playing
    if (this.bgmAudio && !this.bgmAudio.paused) {
      // Simple fade out simulation by swapping src
      this.bgmAudio.src = url;
      this.bgmAudio.play().catch(e => console.warn("Audio autoplay blocked", e));
    } else {
      if (this.bgmAudio) {
        this.bgmAudio.src = url;
        this.bgmAudio.volume = this.volume;
        this.bgmAudio.muted = this.isMuted;
        this.bgmAudio.play().catch(e => console.warn("Audio autoplay blocked", e));
      }
    }
    this.currentBgmKey = key;
  }

  playSFX(key: keyof typeof SFX_URLS, silent: boolean = false) {
    if (this.isMuted && !silent) return;
    
    const url = SFX_URLS[key];
    if (!url) return;

    const audio = new Audio(url);
    audio.volume = silent ? 0 : this.volume + 0.2; // SFX slightly louder
    audio.play().catch(e => console.warn("SFX play failed", e));
  }

  stopBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.currentBgmKey = null;
    }
  }
}

export const audioService = new AudioService();
