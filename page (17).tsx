"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { addEmailLog, addAuditLog } from "@/lib/dataStore";

type Step = "email" | "otp" | "success";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    addEmailLog(`Your Password Reset OTP is: ${code}`, "SECURITY_OTP", email);
    addAuditLog(`OTP Password Reset Requested (${email})`, "SUCCESS");
    toast.success(`OTP sent to ${email}! (Demo Code: ${code})`);
    setStep("otp");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setStep("success");
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-dark-surface border border-white/10 rounded-3xl p-8 shadow-card-lg backdrop-blur-sm space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-2xl text-white">
                MedVault <span className="gradient-text">AI</span>
              </span>
            </div>
          </div>

          {/* Step: Email */}
          {step === "email" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-heading font-bold text-xl text-white">Forgot Password?</h1>
                <p className="text-slate-400 text-sm">
                  Enter your email and we&apos;ll send you a 6-digit OTP to reset your password.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                      placeholder="your@email.com"
                    />
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
                      Send OTP
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          )}

          {/* Step: OTP */}
          {step === "otp" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="font-heading font-bold text-xl text-white">Enter OTP</h2>
                <p className="text-slate-400 text-sm">
                  We sent a 6-digit code to <span className="text-primary">{email}</span>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="flex gap-3 justify-center">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-dark-border/50 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || otp.some((d) => !d)}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-40"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Verify & Reset Password"
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </form>
            </div>
          )}

          {/* Step: Success */}
          {step === "success" && (
            <div className="text-center space-y-6 py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto"
              >
                <CheckCircle className="w-12 h-12 text-success" />
              </motion.div>
              <div className="space-y-2">
                <h2 className="font-heading font-bold text-2xl text-white">Password Reset!</h2>
                <p className="text-slate-400 text-sm">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
              </div>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                >
                  Sign In Now
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          )}

          {step !== "success" && (
            <p className="text-center text-sm text-slate-400">
              Remember your password?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
