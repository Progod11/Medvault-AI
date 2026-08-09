"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield, Eye, EyeOff, Mail, Lock, Globe, User, ArrowRight, CheckCircle, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

const passwordChecks = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = email.toLowerCase().trim();
    const userName = name.trim() || cleanEmail.split("@")[0];

    try {
      // Firebase User Creation
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: userName });
      }

      localStorage.setItem("medvault_user_plan", "FREE");
      localStorage.setItem("medvault_user_name", userName);
      localStorage.setItem("medvault_user_email", cleanEmail);

      toast.success("Account created! Welcome to MedVault AI 🎉");
      router.push("/dashboard");
    } catch (err: unknown) {
      const firebaseError = err as { message?: string };
      console.warn("Firebase signup error:", firebaseError);
      toast.error(firebaseError?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = (result.user.email || "google_user@medvault.ai").toLowerCase().trim();
      const userName = result.user.displayName || userEmail.split("@")[0];
      localStorage.setItem("medvault_user_email", userEmail);
      localStorage.setItem("medvault_user_name", userName);
      localStorage.setItem("medvault_user_plan", "FREE");

      toast.success(`Welcome, ${userName}! Account created via Google.`);
      router.push("/dashboard");
    } catch (error: unknown) {
      const firebaseError = error as { message?: string };
      console.error("Google sign up popup error:", firebaseError);
      toast.error(firebaseError?.message || "Google sign up failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const allChecks = passwordChecks.every((c) => c.test(password));

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-dark-surface border border-white/10 rounded-3xl p-8 shadow-card-lg backdrop-blur-sm space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-2xl text-white">
                MedVault <span className="gradient-text">AI</span>
              </span>
            </div>
            <h1 className="font-heading font-bold text-xl text-white mt-4">Create Your Vault</h1>
            <p className="text-slate-400 text-sm">Free forever. No credit card required.</p>
          </div>

          {/* Google OAuth */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-all font-medium"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Globe className="w-5 h-5 text-emerald-400" />
            )}
            {googleLoading ? "Connecting Google..." : "Sign up with Google"}
          </motion.button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-dark-border/50 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Arjun Sharma"
                />
              </div>
            </div>

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
                  placeholder="arjun@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-dark-border/50 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength */}
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-1.5 pt-1"
                >
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-2">
                      <CheckCircle
                        className={`w-3.5 h-3.5 ${
                          check.test(password) ? "text-success" : "text-slate-600"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          check.test(password) ? "text-success" : "text-slate-500"
                        }`}
                      >
                        {check.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            <p className="text-xs text-slate-500">
              By signing up, you agree to our{" "}
              <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !allChecks}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-40"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Free Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-slate-600 mt-4 flex items-center justify-center gap-1"
        >
          <Shield className="w-3 h-3 text-primary" />
          256-bit encrypted · HIPAA compliant · Your data stays private
        </motion.p>
      </motion.div>
    </div>
  );
}

