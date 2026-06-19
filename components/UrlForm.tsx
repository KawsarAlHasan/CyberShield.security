"use client";

import { useState, FormEvent } from "react";

interface UrlFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const EXAMPLE_URLS = [
  "https://google.com",
  "http://paypa1-secure-login.xyz/verify/account",
  "http://192.168.1.1/banking/signin",
];

export default function UrlForm({ onAnalyze, isLoading }: UrlFormProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validate = (value: string): string => {
    if (!value.trim()) return "Please enter a URL to analyze.";
    // Allow with or without protocol
    const testUrl = value.startsWith("http") ? value : `http://${value}`;
    try {
      new URL(testUrl);
      return "";
    } catch {
      return "Invalid URL format. Example: https://example.com";
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const err = validate(url);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    onAnalyze(url.trim());
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-cyan-500/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError("");
            }}
            placeholder="Paste any URL to scan — e.g. https://suspicious-site.xyz"
            className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.05] text-slate-200 placeholder:text-slate-500
              text-sm font-mono ring-1 outline-none transition-all
              ${
                error
                  ? "ring-red-500/60 focus:ring-red-500"
                  : "ring-white/10 focus:ring-cyan-500/60"
              }`}
            disabled={isLoading}
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1.5 px-1">
            <span>⚠</span> {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide
            bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400
            text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2 ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {isLoading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Analyzing Threat Vectors...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Analyze URL
            </>
          )}
        </button>
      </form>

      {/* Example URLs */}
      <div className="space-y-1.5">
        <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
          Try an example:
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_URLS.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setUrl(ex);
                setError("");
              }}
              disabled={isLoading}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.04]
                hover:bg-white/[0.08] ring-1 ring-white/10 text-slate-400
                hover:text-slate-200 transition-all truncate max-w-[200px]"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
