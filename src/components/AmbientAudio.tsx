"use client";

import { useEffect, useRef } from "react";

interface Props {
  muted: boolean;
}

export function AmbientAudio({ muted }: Props) {
  const ctxRef = useRef<AudioContext | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (muted || startedRef.current) return;

    function startAmbient() {
      if (startedRef.current) return;
      startedRef.current = true;

      try {
        const ctx = new AudioContext();
        ctxRef.current = ctx;
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.04; // Very low volume
        masterGain.connect(ctx.destination);

        // SCARY MONSTER BASS - Deep rumbling presence
        const monsterOsc = ctx.createOscillator();
        const monsterGain = ctx.createGain();
        const monsterFilter = ctx.createBiquadFilter();
        monsterOsc.type = "sine";
        monsterOsc.frequency.value = 22; // Sub-bass
        monsterFilter.type = "lowpass";
        monsterFilter.frequency.value = 60;
        monsterGain.gain.value = 0.5;
        
        // LFO to make it pulse like breathing
        const breathLfo = ctx.createOscillator();
        const breathGain = ctx.createGain();
        breathLfo.frequency.value = 0.15; // Slow breathing
        breathGain.gain.value = 0.3;
        breathLfo.connect(breathGain);
        breathGain.connect(monsterGain.gain);
        breathLfo.start();
        
        monsterOsc.connect(monsterFilter);
        monsterFilter.connect(monsterGain);
        monsterGain.connect(masterGain);
        monsterOsc.start();

        // Eerie low frequency sweep
        const eerieOsc = ctx.createOscillator();
        const eerieGain = ctx.createGain();
        const eerieFilter = ctx.createBiquadFilter();
        eerieOsc.type = "sawtooth";
        eerieOsc.frequency.value = 40;
        eerieFilter.type = "lowpass";
        eerieFilter.frequency.value = 100;
        eerieGain.gain.value = 0.15;
        
        // Slow pitch wobble
        const wobbleLfo = ctx.createOscillator();
        const wobbleGain = ctx.createGain();
        wobbleLfo.frequency.value = 0.08;
        wobbleGain.gain.value = 8;
        wobbleLfo.connect(wobbleGain);
        wobbleGain.connect(eerieOsc.frequency);
        wobbleLfo.start();
        
        eerieOsc.connect(eerieFilter);
        eerieFilter.connect(eerieGain);
        eerieGain.connect(masterGain);
        eerieOsc.start();

        // Random deep thuds - like distant monster footsteps
        function playThud() {
          if (!ctxRef.current || ctxRef.current.state === "closed") return;
          const c = ctxRef.current;
          const now = c.currentTime;

          const thudOsc = c.createOscillator();
          const thudGain = c.createGain();
          thudOsc.type = "sine";
          thudOsc.frequency.setValueAtTime(35, now);
          thudOsc.frequency.exponentialRampToValueAtTime(18, now + 0.8);
          thudGain.gain.setValueAtTime(0, now);
          thudGain.gain.linearRampToValueAtTime(0.6, now + 0.02);
          thudGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          thudOsc.connect(thudGain);
          thudGain.connect(masterGain);
          thudOsc.start(now);
          thudOsc.stop(now + 1.3);

          // Next thud
          setTimeout(playThud, 4000 + Math.random() * 6000);
        }
        setTimeout(playThud, 2000);

        // Creepy whisper wind
        function playWhisper() {
          if (!ctxRef.current || ctxRef.current.state === "closed") return;
          const c = ctxRef.current;
          
          const windLen = c.sampleRate * 3;
          const windBuf = c.createBuffer(1, windLen, c.sampleRate);
          const wd = windBuf.getChannelData(0);
          for (let i = 0; i < windLen; i++) {
            wd[i] = Math.random() * 2 - 1;
          }
          const ws = c.createBufferSource();
          ws.buffer = windBuf;
          const wf = c.createBiquadFilter();
          wf.type = "bandpass";
          wf.frequency.value = 150 + Math.random() * 200;
          wf.Q.value = 10;
          const wg = c.createGain();
          wg.gain.setValueAtTime(0, c.currentTime);
          wg.gain.linearRampToValueAtTime(0.15, c.currentTime + 1.5);
          wg.gain.linearRampToValueAtTime(0, c.currentTime + 3);
          ws.connect(wf);
          wf.connect(wg);
          wg.connect(masterGain);
          ws.start();
          ws.stop(c.currentTime + 3);
          
          setTimeout(playWhisper, 6000 + Math.random() * 8000);
        }
        setTimeout(playWhisper, 4000);

      } catch {
        // Web Audio not available
      }
    }

    // Start on first user interaction
    const handler = () => {
      startAmbient();
      document.removeEventListener("click", handler);
      document.removeEventListener("keydown", handler);
    };
    document.addEventListener("click", handler);
    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("click", handler);
      document.removeEventListener("keydown", handler);
    };
  }, [muted]);

  return null;
}
