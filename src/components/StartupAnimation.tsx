"use client";

import { useEffect, useState, useRef } from "react";
import { GhostLogo } from "./GhostLogo";

interface Props {
  onComplete: () => void;
}

export function StartupAnimation({ onComplete }: Props) {
  const [phase, setPhase] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];
    
    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.7 ? "#e50914" : "#ff4444",
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(")", `, ${p.alpha})`).replace("rgb", "rgba").replace("#e50914", "rgba(229, 9, 20").replace("#ff4444", "rgba(255, 68, 68");
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.002;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        if (p.alpha <= 0) {
          p.alpha = Math.random() * 0.5 + 0.3;
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
        }
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    // INTENSE audio
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const now = ctx.currentTime;

      // MASSIVE sub bass hit
      const subBass = ctx.createOscillator();
      const subGain = ctx.createGain();
      subBass.type = "sine";
      subBass.frequency.setValueAtTime(20, now);
      subBass.frequency.exponentialRampToValueAtTime(35, now + 0.5);
      subBass.frequency.setValueAtTime(25, now + 1);
      subGain.gain.setValueAtTime(0, now);
      subGain.gain.linearRampToValueAtTime(1, now + 0.1);
      subGain.gain.setValueAtTime(0.8, now + 0.5);
      subGain.gain.exponentialRampToValueAtTime(0.01, now + 3);
      subBass.connect(subGain);
      subGain.connect(ctx.destination);
      subBass.start(now);
      subBass.stop(now + 3);

      // Multiple bass impacts like thunder
      [0, 0.3, 0.5, 0.8, 1.2].forEach((delay, i) => {
        const impact = ctx.createOscillator();
        const impactGain = ctx.createGain();
        impact.type = "sine";
        impact.frequency.setValueAtTime(40 - i * 3, now + delay);
        impact.frequency.exponentialRampToValueAtTime(18, now + delay + 0.4);
        impactGain.gain.setValueAtTime(0, now + delay);
        impactGain.gain.linearRampToValueAtTime(0.7 - i * 0.1, now + delay + 0.02);
        impactGain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.5);
        impact.connect(impactGain);
        impactGain.connect(ctx.destination);
        impact.start(now + delay);
        impact.stop(now + delay + 0.6);
      });

      // Distorted growl
      const growl = ctx.createOscillator();
      const growlGain = ctx.createGain();
      const growlDist = ctx.createWaveShaper();
      const distCurve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i - 128) / 128;
        distCurve[i] = Math.tanh(x * 3);
      }
      growlDist.curve = distCurve;
      growl.type = "sawtooth";
      growl.frequency.setValueAtTime(60, now);
      growl.frequency.exponentialRampToValueAtTime(30, now + 2);
      growlGain.gain.setValueAtTime(0, now + 0.5);
      growlGain.gain.linearRampToValueAtTime(0.15, now + 1);
      growlGain.gain.linearRampToValueAtTime(0, now + 2.5);
      growl.connect(growlDist);
      growlDist.connect(growlGain);
      growlGain.connect(ctx.destination);
      growl.start(now);
      growl.stop(now + 3);

      // Cinematic rise
      const rise = ctx.createOscillator();
      const riseGain = ctx.createGain();
      const riseFilter = ctx.createBiquadFilter();
      rise.type = "sawtooth";
      rise.frequency.setValueAtTime(80, now);
      rise.frequency.exponentialRampToValueAtTime(400, now + 2);
      riseFilter.type = "lowpass";
      riseFilter.frequency.setValueAtTime(100, now);
      riseFilter.frequency.exponentialRampToValueAtTime(2000, now + 2);
      riseGain.gain.setValueAtTime(0, now);
      riseGain.gain.linearRampToValueAtTime(0.1, now + 1.5);
      riseGain.gain.linearRampToValueAtTime(0, now + 2.5);
      rise.connect(riseFilter);
      riseFilter.connect(riseGain);
      riseGain.connect(ctx.destination);
      rise.start(now);
      rise.stop(now + 3);

      // BOOM at the end
      setTimeout(() => {
        if (!audioCtxRef.current) return;
        const c = audioCtxRef.current;
        const n = c.currentTime;
        
        const boom = c.createOscillator();
        const boomGain = c.createGain();
        boom.type = "sine";
        boom.frequency.setValueAtTime(50, n);
        boom.frequency.exponentialRampToValueAtTime(20, n + 0.5);
        boomGain.gain.setValueAtTime(1, n);
        boomGain.gain.exponentialRampToValueAtTime(0.01, n + 0.8);
        boom.connect(boomGain);
        boomGain.connect(c.destination);
        boom.start(n);
        boom.stop(n + 1);

        // White noise burst
        const noiseLen = c.sampleRate * 0.3;
        const noiseBuf = c.createBuffer(1, noiseLen, c.sampleRate);
        const nd = noiseBuf.getChannelData(0);
        for (let i = 0; i < noiseLen; i++) {
          nd[i] = (Math.random() * 2 - 1) * Math.exp(-i / (c.sampleRate * 0.05));
        }
        const ns = c.createBufferSource();
        ns.buffer = noiseBuf;
        const nf = c.createBiquadFilter();
        nf.type = "lowpass";
        nf.frequency.value = 500;
        const ng = c.createGain();
        ng.gain.value = 0.4;
        ns.connect(nf);
        nf.connect(ng);
        ng.connect(c.destination);
        ns.start(n);
      }, 2000);

    } catch {
      // Audio context not available
    }

    // Phase transitions
    setTimeout(() => setPhase(1), 200);
    setTimeout(() => setPhase(2), 800);
    setTimeout(() => setPhase(3), 1500);
    setTimeout(() => setPhase(4), 2200);
    setTimeout(() => setPhase(5), 3000);
    setTimeout(() => onComplete(), 3500);
  }, [onComplete]);

  return (
    <div className={`startup-overlay ${phase >= 5 ? "hidden" : ""}`}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Red pulse overlay */}
      <div 
        className="absolute inset-0 z-10 transition-opacity duration-500"
        style={{
          background: phase >= 2 ? "radial-gradient(circle at center, transparent 0%, rgba(229,9,20,0.2) 50%, rgba(0,0,0,0.8) 100%)" : "transparent",
          opacity: phase >= 2 ? 1 : 0,
        }}
      />

      {/* Lightning flashes */}
      {phase >= 2 && phase < 4 && (
        <div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: "white",
            animation: "flash 0.1s ease-out",
            opacity: 0,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-30 flex flex-col items-center justify-center">
        {/* Ghost Logo with effects */}
        <div
          className="relative transition-all duration-700"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: `scale(${phase >= 3 ? 1 : 0.3}) translateY(${phase >= 2 ? 0 : 50}px)`,
            filter: phase >= 3 
              ? "drop-shadow(0 0 60px rgba(229,9,20,1)) drop-shadow(0 0 120px rgba(229,9,20,0.5))" 
              : "none",
          }}
        >
          {/* Pulsing ring */}
          {phase >= 2 && (
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                border: "3px solid rgba(229,9,20,0.5)",
                transform: "scale(2)",
                animation: "pulse-ring 1s ease-out infinite",
              }}
            />
          )}
          <GhostLogo size={phase >= 3 ? 150 : 100} animated={phase >= 3} />
        </div>

        {/* Title with glitch effect */}
        <h1
          className="mt-8 text-5xl md:text-7xl font-black tracking-widest relative"
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: `translateY(${phase >= 2 ? 0 : 30}px)`,
            transition: "all 0.5s ease-out",
            color: "#e50914",
            textShadow: phase >= 3 
              ? "0 0 20px rgba(229,9,20,0.8), 0 0 40px rgba(229,9,20,0.5), 0 0 80px rgba(229,9,20,0.3)" 
              : "none",
          }}
        >
          {phase >= 3 && (
            <>
              <span className="absolute inset-0 text-cyan-400 opacity-70" style={{ transform: "translateX(-2px)", clipPath: "inset(0 0 50% 0)" }}>GHOSTSTREAM</span>
              <span className="absolute inset-0 text-red-600 opacity-70" style={{ transform: "translateX(2px)", clipPath: "inset(50% 0 0 0)" }}>GHOSTSTREAM</span>
            </>
          )}
          GHOSTSTREAM
        </h1>

        {/* Tagline */}
        <p
          className="mt-4 text-gray-500 text-sm uppercase tracking-[0.5em] transition-all duration-500"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: `translateY(${phase >= 3 ? 0 : 20}px)`,
          }}
        >
          Fear The Stream
        </p>

        {/* Loading bar */}
        <div
          className="mt-8 w-64 h-1 bg-white/10 rounded-full overflow-hidden transition-opacity duration-500"
          style={{ opacity: phase >= 2 ? 1 : 0 }}
        >
          <div
            className="h-full bg-gradient-to-r from-[#e50914] via-[#ff4444] to-[#e50914] rounded-full transition-all duration-1000"
            style={{ 
              width: `${Math.min(100, (phase - 1) * 33)}%`,
              boxShadow: "0 0 20px rgba(229,9,20,0.8)",
            }}
          />
        </div>
      </div>

      {/* Cinematic bars */}
      <div 
        className="absolute top-0 left-0 right-0 bg-black z-40 transition-all duration-1000"
        style={{ height: phase >= 4 ? "0%" : "15%" }}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 bg-black z-40 transition-all duration-1000"
        style={{ height: phase >= 4 ? "0%" : "15%" }}
      />

      <style jsx>{`
        @keyframes pulse-ring {
          0% { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes flash {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
