"use client";

import { motion } from "framer-motion";
import { useCallback, useLayoutEffect, useState } from "react";

const SPLASH_KEY = "auragaze-splash-seen";
const MIN_DURATION_MS = 2800;
const EXIT_MS = 900;

const letters = "AURAGAZE".split("");

type Phase = "hidden" | "enter" | "exit";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<Phase>("enter");

  const finish = useCallback(() => {
    setPhase("hidden");
    document.body.style.overflow = "";
    onComplete();
  }, [onComplete]);

  useLayoutEffect(() => {
    const preload = (href: string, as: string, type?: string) => {
      if (document.querySelector(`link[rel="preload"][href="${href}"]`)) return;
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      document.head.appendChild(link);
    };

    preload("/hero-poster.jpg", "image", "image/jpeg");

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    preload(
      isMobile ? "/hero-frames-mobile/frame_0001.webp" : "/hero-frames/frame_0001.webp",
      "image",
      "image/webp",
    );

    if (sessionStorage.getItem(SPLASH_KEY)) {
      finish();
      return;
    }

    document.body.style.overflow = "hidden";

    const exitTimer = window.setTimeout(() => setPhase("exit"), MIN_DURATION_MS);
    const doneTimer = window.setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, "1");
      finish();
    }, MIN_DURATION_MS + EXIT_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, [finish]);

  if (phase === "hidden") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={
        phase === "exit" ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }
      }
      transition={{ duration: EXIT_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 bg-[#020617]" />

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(37,99,235,0.28) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(59,130,246,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        className="absolute rounded-full border border-blue-500/20"
        initial={{ width: 0, height: 0, opacity: 0.8 }}
        animate={{ width: 420, height: 420, opacity: 0 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0.2 }}
      />
      <motion.div
        className="absolute rounded-full border border-blue-400/15"
        initial={{ width: 0, height: 0, opacity: 0.6 }}
        animate={{ width: 560, height: 560, opacity: 0 }}
        transition={{ duration: 2.6, ease: "easeOut", delay: 0.5 }}
      />

      <div className="relative z-10 flex flex-col items-center px-6">
        <div className="flex tracking-[0.22em]" aria-label="AURAGAZE">
          {letters.map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: 0.35 + i * 0.07,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-heading text-[2.75rem] font-black text-white sm:text-5xl"
            >
              {char}
            </motion.span>
          ))}
        </div>

        <motion.div
          className="mt-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-blue-400 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 180, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.p
          className="mt-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-blue-300/80"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.6, ease: "easeOut" }}
        >
          Dress With Intention
        </motion.p>
      </div>

      <div className="absolute bottom-16 left-1/2 z-10 w-48 -translate-x-1/2">
        <div className="h-[2px] overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full origin-left rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: MIN_DURATION_MS / 1000 - 0.3,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.4,
            }}
          />
        </div>
        <motion.p
          className="mt-3 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.4 }}
        >
          Loading collection
        </motion.p>
      </div>

      <motion.div
        className="absolute left-6 top-6 h-8 w-8 border-l border-t border-blue-500/30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      />
      <motion.div
        className="absolute bottom-6 right-6 h-8 w-8 border-b border-r border-blue-500/30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      />
    </motion.div>
  );
}
