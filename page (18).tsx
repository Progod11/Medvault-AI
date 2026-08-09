"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Mail, Lock, Globe, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = email.toLowerCase().trim();

    try {
      if (cleanEmail.includes("demo") || cleanEmail.includes("premium") || cleanEmail.includes("free")) {
        const isPremium = cleanEmail.includes("premium");
        const userPlan = isPremium ? "PREMIUM" : "FREE";
        
        // Ensure Demo Account has a stable Firebase identity for cloud persistence
        await signInWithEmailAndPassword(auth, cleanEmail, "demo123");
        
        localStorage.setItem("medvault_user_plan", userPlan);
        localStorage.setItem("medvault_user_email", cleanEmail);
        localStorage.setItem("medvault_user_name", isPremium ? "Rajesh Sharma (Premium Pro)" : "Demo User");
        toast.success(`Logged in as ${isPremium ? "Premium Pro" : "Free"} Demo user!`);
        router.push("/dashboard");
        return;
      }

      // Firebase Email/Password Sign In
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      localStorage.setItem("medvault_user_email", cleanEmail);
      localStorage.setItem("medvault_user_name", cleanEmail.split("@")[0]);
      // getUserData will be triggered by onAuthStateChanged in Provider
      toast.success("Successfully signed in!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const firebaseError = err as { message?: string };
      console.warn("Firebase sign in error:", firebaseError);
      toast.error(firebaseError?.message || "Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = (result.user.email || "google_user@medvault.ai").toLowerCase().trim();
      const userName = result.user.displayName || userEmail.split("@")[0];
      localStorage.setItem("medvault_user_email", userEmail);
      localStorage.setItem("medvault_user_name", userName);
      toast.success(`Welcome, ${userName}! Signed in via Google.`);
      router.push("/dashboard");
    } catch (error: unknown) {
      const firebaseError = error as { message?: string };
      console.error("Google sign in popup error:", firebaseError);
      toast.error(firebaseError?.message || "Google sign in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const setDemoAccount = (type: "PREMIUM" | "FREE") => {
    if (type === "PREMIUM") {
      setEmail("premium@medvault.ai");
      setPassword("demo123");
      toast.info("Selected Premium Pro Demo Account");
    } else {
      setEmail("free@medvault.ai");
      setPassword("demo123");
      toast.info("Selected Free Demo Account");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-dark-surface border border-white/10 rounded-3xl p-8 shadow-card-lg backdrop-blur-sm space-y-8">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-2xl text-white">
                MedVault <span className="gradient-text">AI</span>
              </span>
            </div>
            <h1 className="font-heading font-bold text-xl text-white mt-4">Welcome Back</h1>
            <p className="text-slate-400 text-sm">Sign in or pick a Demo Account below</p>
          </div>

          {/* Quick Demo Accounts */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Quick Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoAccount("PREMIUM")}
                className="px-3 py-2 rounded-xl bg-primary/20 border border-primary/40 hover:bg-primary/30 transition-all text-xs font-bold text-primary text-center"
              >
                🌟 Premium Pro
                <span className="block text-[10px] font-normal text-slate-300">premium@medvault.ai</span>
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount("FREE")}
                className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all text-xs font-bold text-white text-center"
              >
                🌱 Free Plan
                <span className="block text-[10px] font-normal text-slate-300">free@medvault.ai</span>
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-500">Password for both: <code className="text-primary font-mono">demo123</code></p>
          </div>

          {/* Google OAuth */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-all font-medium"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Globe className="w-5 h-5 text-emerald-400" />
            )}
            {googleLoading ? "Signing in with Google..." : "Continue with Google"}
          </motion.button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-dark-border/50 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-dark-border/50 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Create one free
            </Link>
          </p>
        </div>

        {/* Security note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-slate-600 mt-4 flex items-center justify-center gap-1"
        >
          <Shield className="w-3 h-3 text-primary" />
          256-bit encrypted · Your data stays private
        </motion.p>
      </motion.div>
    </div>
  );
}

