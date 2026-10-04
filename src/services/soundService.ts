/**
 * FieldOps Pro - Synthesized Web Audio Notification Service
 * Generates crisp, immediate, low-latency audio chimes without relying on external media files.
 */

export class SoundService {
  private audioCtx: AudioContext | null = null;
  private volume: number = 0.75;
  private enabled: boolean = true;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  play(type: 'default' | 'urgent' | 'success' | 'warning' = 'default') {
    if (!this.enabled || this.volume <= 0) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(this.volume * 0.3, now);
      gainNode.connect(ctx.destination);

      if (type === 'urgent') {
        // High-low alert siren tone (SLA breach / critical)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(880, now); // A5
        osc1.frequency.setValueAtTime(587.33, now + 0.12); // D5
        osc1.frequency.setValueAtTime(880, now + 0.24);
        osc1.frequency.setValueAtTime(587.33, now + 0.36);
        osc2.frequency.setValueAtTime(440, now);

        gainNode.gain.setValueAtTime(this.volume * 0.35, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.5);
        osc2.stop(now + 0.5);

        this.vibrate([120, 80, 120]);
      } else if (type === 'success') {
        // Ascending major chord (C5 -> E5 -> G5 -> C6) for job completion / bKash payment
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          noteGain.gain.setValueAtTime(0, now);
          noteGain.gain.setValueAtTime(this.volume * 0.25, now + idx * 0.08);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

          osc.connect(noteGain);
          noteGain.connect(ctx.destination);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.4);
        });

        this.vibrate([40, 60, 40]);
      } else if (type === 'warning') {
        // Double amber chime
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.setValueAtTime(523.25, now + 0.15); // C5

        gainNode.gain.setValueAtTime(this.volume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.35);

        this.vibrate(100);
      } else {
        // Standard pleasant glass chime (G5 -> C6)
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(783.99, now); // G5
        osc.frequency.setValueAtTime(1046.5, now + 0.09); // C6

        gainNode.gain.setValueAtTime(this.volume * 0.25, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.35);

        this.vibrate(40);
      }
    } catch {
      // Audio context error or autoplay block
    }
  }

  setVolume(volumePct: number) {
    this.volume = Math.max(0, Math.min(1, volumePct / 100));
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  vibrate(pattern: number | number[] = 100) {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Haptics not allowed
      }
    }
  }
}

export const soundService = new SoundService();
