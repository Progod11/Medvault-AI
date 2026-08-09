"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Sparkles,
  Stethoscope,
  TestTube,
  Truck,
  Building2,
  Clock,
  Send,
  CheckCircle2,
  Bell,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import { addEmailLog, addAuditLog, getCurrentUserEmail } from "@/lib/dataStore";

export default function AppointmentsPage() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [queueNumber, setQueueNumber] = useState(1482);

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    const userEmail = email.trim() || getCurrentUserEmail();
    setJoined(true);
    setQueueNumber((prev) => prev + 1);

    addEmailLog(
      `MedVault AI: Early Access Confirmation for Auto Appointments`,
      "APPOINTMENT",
      userEmail
    );
    addAuditLog(`Joined Early Access Waitlist for Auto Appointments (${userEmail})`, "SUCCESS");

    toast.success("You are registered! Check your email for early access confirmation.");
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-indigo-600 to-purple-600 p-8 sm:p-12 text-white shadow-2xl">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              SOON – AUTO BOOKING ENGINE
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold leading-tight">
                Auto Medical & Medicine Appointment Engine
              </h1>
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-extrabold tracking-widest uppercase">
                SOON
              </span>
            </div>

            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              We are building the future of automated healthcare booking. Soon you will be able to schedule doctor consults, order diagnostic lab tests, and get prescription medicines delivered directly to your home — all automatically managed from your family health vault.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-medium text-white/80">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-300" /> Launching Q4 2026
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-300" /> Powered by Gemini AI
              </span>
            </div>
          </div>
        </div>

        {/* Vision Pillars */}
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-bold text-accent dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            What You Can Book Automatically
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pillar 1: Doctors */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-accent dark:text-white text-base">Doctor Appointments</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Instant booking with certified specialists and tele-consultants matching your medical history.
              </p>
            </motion.div>

            {/* Pillar 2: Diagnostics */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <TestTube className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-accent dark:text-white text-base">Diagnostic Tests</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Home blood sample collection and diagnostic scan appointments with accredited pathology labs.
              </p>
            </motion.div>

            {/* Pillar 3: Medicine Delivery */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-accent dark:text-white text-base">Medicine Refills</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Auto-order monthly prescription refills before your medicine runs out according to your schedule.
              </p>
            </motion.div>

            {/* Pillar 4: Health Services */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-accent dark:text-white text-base">Care Services</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Physiotherapy, home nurse support, and specialized elderly care assistance on demand.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Join Early Access Waitlist */}
        <div className="p-8 rounded-3xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl font-heading font-bold text-accent dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Get Priority Early Access
              </h3>
              <p className="text-xs text-muted-foreground">
                Be the first to unlock automated doctor appointments & medicine refills when we launch.
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-primary/10 text-primary font-bold text-xs flex items-center gap-2 self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4" />
              Queue Spot: #{queueNumber}
            </div>
          </div>

          {joined ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 space-y-2 text-center"
            >
              <CheckCircle2 className="w-8 h-8 mx-auto" />
              <h4 className="font-bold text-base">You are on the VIP Waitlist!</h4>
              <p className="text-xs max-w-md mx-auto">
                We have sent an early access confirmation email to your address. You will receive an invite token as soon as beta testing opens.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for VIP invite..."
                className="flex-1 px-4 py-3 rounded-xl bg-background dark:bg-dark-bg border border-border dark:border-dark-border text-sm focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-primary text-white font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-glow"
              >
                <Send className="w-4 h-4" />
                Reserve My Spot
              </button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}