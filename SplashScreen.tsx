"use client";

import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles, HeartPulse, Lock, CheckCircle2, Activity } from "lucide-react";
import { SyncContext } from "@/components/providers/FirebaseSyncProvider";

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const { isSynced } = useContext(SyncContext);
  const [showSplash, setShowSplash] = useState<boolean>(false);
  const [stepText, setStepText] = useState("Initializing Encrypted Health Vault...");
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if splash was already played
    if (sessionStorage.getItem("medvault_splash_seen") === "true") {
      return;
    }

    // Since it's the first visit, enable the splash screen on mount safely
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowSplash(true);

    // Step 1: Initial load
    const timer1 = setTimeout(() => {
      setProgress(45);
      setStepText("Syncing Family Health Records & Medicines...");
    }, 600);

    // Step 2: AI Engine load
    const timer2 = setTimeout(() => {
      setProgress(80);
      setStepText("Connecting Med AI Symptoms Engine...");
    }, 1300);

    // Step 3: Vault Ready
    const timer3 = setTimeout(() => {
      setProgress(100);
      setStepText("Vault Unlocked & Secure");
    }, 1900);

    // Step 4: Dismiss splash ONLY when synced
    let timer4: NodeJS.Timeout;
    if (isSynced) {
      timer4 = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("medvault_splash_seen", "true");
      }, 2500);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (timer4) clearTimeout(timer4);
    };
  }, [isSynced]);

  const handleSkip = () => {
    setShowSplash(false);
    sessionStorage.setItem("medvault_splash_seen", "true");
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden select-none"
          >
            {/* Ambient Animated Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Central Content Box */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full">
              {/* Logo Badge Icon */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
                className="relative mb-6"
              >
                {/* Pulsing ring around icon */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-sky-500 to-teal-400 blur-md opacity-60 animate-ping" />

                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-600 via-teal-500 to-emerald-400 p-0.5 shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center relative overflow-hidden">
                    <Shield className="w-11 h-11 text-teal-400 stroke-[1.75]" />
                    <HeartPulse className="w-6 h-6 text-sky-400 absolute animate-bounce stroke-[2]" />
                  </div>
                </div>
              </motion.div>

              {/* Title & Slogan */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-2 mb-8"
              >
                <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-sky-200">
                  MedVault <span className="text-teal-400 font-black">AI</span>
                </h1>
                <p className="text-xs font-medium text-slate-400 tracking-wider uppercase flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3 text-teal-400" />
                  <span>256-Bit Encrypted Family Health Vault</span>
                </p>
              </motion.div>

              {/* Animated ECG Pulse Line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full flex items-center justify-center gap-2 text-sky-400/80 mb-6"
              >
                <Activity className="w-5 h-5 animate-pulse" />
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
                <Sparkles className="w-4 h-4 text-teal-400" />
              </motion.div>

              {/* Progress Bar & Status */}
              <div className="w-full space-y-3">
                <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                  <motion.div
                    className="h-full bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.4 }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                  <span className="flex items-center gap-1.5">
                    {progress === 100 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                    )}
                    {stepText}
                  </span>
                  <span className="font-mono text-teal-400 font-bold">{progress}%</span>
                </div>
              </div>

              {/* Quick Skip Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={handleSkip}
                className="mt-8 text-[11px] text-slate-500 hover:text-slate-300 underline underline-offset-4 transition-colors cursor-pointer"
              >
                Enter Vault Directly &rarr;
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Children */}
      {children}
    </>
  );
}
