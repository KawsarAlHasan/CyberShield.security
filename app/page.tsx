"use client";

import { useEffect, useRef, useState } from "react";
import UrlForm from "@/components/UrlForm";
import ResultCard from "@/components/ResultCard";
import { AnalysisResult } from "@/types/security";
import { calculateRisk } from "@/lib/riskCalculator";

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const chars = "アァカサタナハマヤラワガザダバパ01アBCDEFঅআইকখগঘ0110";
    const fontSize = 14;
    let drops: number[] = [];

    const init = () => {
      const cols = Math.floor(canvas.width / fontSize);
      drops = Array(cols).fill(1);
    };
    init();

    const draw = () => {
      ctx.fillStyle = "rgba(10, 20, 40, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0e7490";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.95 ? "#67e8f9" : "#0e7490";
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    const handleResize = () => { resize(); init(); };
    window.addEventListener("resize", handleResize);
    return () => { clearInterval(interval); window.removeEventListener("resize", handleResize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-20 pointer-events-none" />;
}

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = (url: string) => {
    setIsLoading(true);
    setResult(null);
    // Simulate async analysis with slight delay for UX
    setTimeout(() => {
      const analysis = calculateRisk(url);
      setResult(analysis);
      setIsLoading(false);
    }, 900);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="relative min-h-screen bg-[#08111f] overflow-hidden">
      <MatrixRain />

      {/* Ambient glow blobs */}
      <div className="fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-cyan-900/20 blur-[80px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-blue-900/20 blur-[80px] pointer-events-none" />

      {/* Main layout */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-12">
        {/* Header */}
        <header className="w-full max-w-2xl mb-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/30 text-cyan-400 text-[11px] font-mono tracking-widest uppercase mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Heuristic Phishing Engine — Browser Only
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 ring-1 ring-cyan-500/30">
              <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Cyber<span className="text-cyan-400">Shield</span>
            </h1>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
            Paste any URL to instantly scan for phishing indicators, suspicious patterns,
            and threat signals — no data leaves your browser.
          </p>

          {/* Stats bar */}
          <div className="flex items-center justify-center gap-6 pt-1">
            {[
              { label: "Rules", value: "9" },
              { label: "Signals", value: "20+" },
              { label: "On-device", value: "100%" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-lg font-black text-cyan-400">{value}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </header>

        {/* Main card */}
        <main className="w-full max-w-2xl">
          <div className="rounded-2xl bg-white/[0.03] ring-1 ring-white/10 backdrop-blur-md p-6 shadow-2xl space-y-6">
            {!result ? (
              <UrlForm onAnalyze={handleAnalyze} isLoading={isLoading} />
            ) : (
              <ResultCard result={result} onReset={handleReset} />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center space-y-1">
          <p className="text-[11px] text-slate-600 font-mono">
            CyberShield · Browser-based heuristic analysis · No data transmitted
          </p>
          <p className="text-[10px] text-slate-700">
            For educational purposes. Always verify URLs with official threat intelligence platforms.
          </p>
        </footer>
      </div>
    </div>
  );
}
