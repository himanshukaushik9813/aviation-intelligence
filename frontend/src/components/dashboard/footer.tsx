"use client";

import { Github, Linkedin, Mail, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#050B1A]/80 backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Built by Badge */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Built with</span>
            <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400 animate-pulse" />
            <span className="text-slate-500">by</span>
            <a
              href="https://github.com/himanshukaushik9813"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Himanshu Kaushik
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/himanshukaushik9813/aviation-intelligence"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all text-xs text-slate-400 hover:text-cyan-400"
              title="View on GitHub"
            >
              <Github className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="mailto:himanshukaushik9813@gmail.com"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all text-xs text-slate-400 hover:text-cyan-400"
              title="Email"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Contact</span>
            </a>
          </div>
        </div>

        {/* Project Info */}
        <div className="mt-3 pt-3 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
          <p>Aviation Disruption Intelligence Platform © 2024</p>
          <p className="font-mono">ML-Powered Flight Analytics</p>
        </div>
      </div>
    </footer>
  );
}
