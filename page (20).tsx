"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield, Upload, Brain, Clock, Users, Pill, Bell,
  AlertCircle, Star, CheckCircle, ChevronRight,
  Zap, Heart, FileText, ArrowRight,
} from "lucide-react";
import { MarketingNav, MarketingFooter } from "@/components/layout/MarketingLayout";

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "256-bit encryption protects every document. Your health data stays private.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Gemini AI explains prescriptions in simple language and summarizes reports instantly.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: Users,
    title: "Full Family Coverage",
    description: "Manage health records for every family member — parents, kids, grandparents.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Upload,
    title: "Smart OCR Scanning",
    description: "Upload any photo or PDF. AI extracts doctor name, medicines and diagnosis automatically.",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: Clock,
    title: "Medical Timeline",
    description: "Visual chronological history of every visit, test and prescription in one place.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: AlertCircle,
    title: "Emergency Card",
    description: "One-tap emergency screen with blood group, allergies and critical medicines.",
    color: "text-error",
    bg: "bg-error/10",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss a dose or appointment. Intelligent reminders via push and email.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: Pill,
    title: "Medicine Vault",
    description: "Track all medicines, dosages, timings and expiry. Know exactly what you take.",
    color: "text-success",
    bg: "bg-success/10",
  },
];

const stats = [
  { value: "10K+", label: "Families Protected" },
  { value: "500K+", label: "Reports Stored" },
  { value: "99.9%", label: "Uptime" },
  { value: "0", label: "Data Breaches" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Mother of 3",
    avatar: "PS",
    text: "MedVault AI saved us during an emergency. The doctor instantly saw my father's complete history on the emergency card. I can't imagine life without it.",
    rating: 5,
  },
  {
    name: "Dr. Rajesh Kumar",
    role: "General Physician",
    avatar: "RK",
    text: "I recommend MedVault AI to all my patients. The AI summaries help me understand past treatments quickly, making consultations more effective.",
    rating: 5,
  },
  {
    name: "Ananya Patel",
    role: "Working Professional",
    avatar: "AP",
    text: "Finally! No more hunting through WhatsApp chats for lab reports. Everything is organized, searchable and accessible from my phone instantly.",
    rating: 5,
  },
];

const faqs = [
  {
    q: "Is my medical data safe?",
    a: "Yes. We use 256-bit AES encryption, the same standard used by banks. Your data is stored in Supabase with row-level security, and we never sell or share your health information.",
  },
  {
    q: "Can I use MedVault AI for my entire family?",
    a: "Absolutely! You can add unlimited family members — each with their own profile, timeline, medicines, and reports. Perfect for managing parents, children, and grandparents.",
  },
  {
    q: "How does the AI explain medicines?",
    a: "Our Gemini AI reads the medicine name from your prescription and explains usage, side effects and precautions in simple, everyday language — always with a medical disclaimer.",
  },
  {
    q: "What file types can I upload?",
    a: "You can upload PDFs, JPG, PNG, and HEIC images. Our OCR engine automatically extracts text, doctor names, medicines, and diagnosis details.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes! Our free plan includes 1 family member, 5 GB storage, and core features. Upgrade to Premium for unlimited members, unlimited storage, and priority AI processing.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <MarketingNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-accent dark:bg-dark-bg min-h-[90vh] flex items-center">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-8"
            >
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium">
                  <Zap className="w-3.5 h-3.5" />
                  AI-Powered Health Management
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight"
              >
                Never Lose A{" "}
                <span className="gradient-text">Medical Report</span>{" "}
                Again
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-slate-300 text-xl leading-relaxed max-w-lg"
              >
                Your Family. Your Health. Securely Together.
                <br />
                Store prescriptions, lab reports, and medical history for every
                family member — all in one AI-powered vault.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary text-base px-8 py-4 flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    Start Free Today
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {["AS", "PK", "RM", "NJ"].map((initials, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full bg-gradient-primary border-2 border-accent flex items-center justify-center"
                    >
                      <span className="text-xs font-bold text-white">{initials}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-warning fill-warning" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-400">
                    Trusted by <span className="text-white font-medium">10,000+</span> families
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right — Dashboard preview */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Mock dashboard card */}
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="rounded-3xl border border-white/10 bg-dark-surface/80 backdrop-blur-lg shadow-card-lg overflow-hidden"
                >
                  {/* Window chrome */}
                  <div className="flex items-center gap-2 px-5 py-3 bg-dark-border/50 border-b border-white/10">
                    <div className="w-3 h-3 rounded-full bg-error/70" />
                    <div className="w-3 h-3 rounded-full bg-warning/70" />
                    <div className="w-3 h-3 rounded-full bg-success/70" />
                    <span className="ml-3 text-xs text-slate-500 font-mono">medvault-ai.com/dashboard</span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Good morning 👋</p>
                        <h3 className="font-heading font-bold text-white">Sharma Family Vault</h3>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-success/20 text-success text-xs font-medium">
                        All Synced ✓
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Members", value: "4", icon: Users, color: "text-primary" },
                        { label: "Reports", value: "47", icon: FileText, color: "text-secondary" },
                        { label: "Reminders", value: "3", icon: Bell, color: "text-warning" },
                      ].map((s) => (
                        <div key={s.label} className="bg-dark-border/40 rounded-xl p-3 text-center">
                          <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1`} />
                          <p className="text-lg font-bold text-white">{s.value}</p>
                          <p className="text-xs text-slate-500">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Recent reports */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Recent Reports</p>
                      {[
                        { name: "Blood CBC Test", date: "Today", type: "Lab Report", color: "bg-primary/20 text-primary" },
                        { name: "Cardiology Scan", date: "Yesterday", type: "Scan", color: "bg-warning/20 text-warning" },
                        { name: "Dr. Mehta Rx", date: "Jul 20", type: "Prescription", color: "bg-secondary/20 text-secondary" },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center justify-between bg-dark-border/30 rounded-xl px-3 py-2.5">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="text-sm font-medium text-white">{r.name}</p>
                              <p className="text-xs text-slate-500">{r.date}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.color}`}>
                            {r.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Floating medicine reminder card */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-6 -left-6 bg-dark-surface border border-white/10 rounded-2xl p-4 shadow-card-lg w-52"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Pill className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Reminder</p>
                      <p className="text-sm font-semibold text-white">Metformin</p>
                      <p className="text-xs text-primary">8:00 AM · Morning</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating AI badge */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -top-4 -right-4 bg-gradient-primary rounded-2xl px-4 py-2 shadow-glow"
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-white" />
                    <span className="text-xs font-semibold text-white">AI Analyzed</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-surface dark:bg-dark-surface border-y border-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-1"
              >
                <p className="font-heading font-bold text-4xl gradient-text">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="section">
        <div className="container-app">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center space-y-4 mb-16"
          >
            <motion.span variants={fadeUp} className="badge-primary text-sm">
              Everything You Need
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-4xl md:text-5xl text-accent dark:text-white">
              Healthcare Management,{" "}
              <span className="gradient-text">Reimagined</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-xl max-w-2xl mx-auto">
              From prescription tracking to AI-powered analysis — everything your family needs, in one elegant vault.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="card-hover p-6 space-y-4"
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-heading font-semibold text-lg text-accent dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Feature Highlight */}
      <section className="section bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute left-1/4 top-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="container-app relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* AI card preview */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="rounded-3xl bg-dark-surface border border-white/10 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">AI Medicine Explainer</p>
                    <p className="text-xs text-slate-400">Powered by Gemini AI</p>
                  </div>
                </div>

                <div className="bg-dark-border/50 rounded-xl p-4 space-y-2">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Medicine</p>
                  <p className="font-semibold text-white text-lg">Metformin 500mg</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "What it does", text: "Controls blood sugar levels in Type 2 diabetes by reducing glucose production in the liver." },
                    { label: "Side effects", text: "Mild nausea, stomach upset (usually improves after 1–2 weeks). Rarely: lactic acidosis." },
                    { label: "Precaution", text: "Take with food. Avoid alcohol. Inform doctor before any surgery or scan with contrast dye." },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg bg-dark-border/30 px-4 py-3">
                      <p className="text-xs text-primary font-medium mb-1">{item.label}</p>
                      <p className="text-sm text-slate-300">{item.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-2 p-3 rounded-xl bg-warning/10 border border-warning/20">
                  <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-warning">
                    This information is for educational purposes only and is not a substitute for professional medical advice.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="space-y-6"
            >
              <motion.span variants={fadeUp} className="badge bg-primary/20 border border-primary/30 text-primary">
                <Brain className="w-3.5 h-3.5 mr-1.5" />
                Gemini AI Integration
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-heading font-bold text-4xl md:text-5xl text-white">
                Your AI Health{" "}
                <span className="gradient-text">Assistant</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-300 text-lg leading-relaxed">
                Upload any prescription and instantly get a clear, jargon-free explanation. Understand what each medicine does, its side effects, and important precautions — in your language.
              </motion.p>
              <motion.ul variants={stagger} className="space-y-3">
                {[
                  "Medicine explanation in simple language",
                  "Report summarization with key findings",
                  "Natural language timeline search",
                  "Automatic report categorization",
                ].map((item) => (
                  <motion.li key={item} variants={fadeUp} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div variants={fadeUp}>
                <Link href="/signup" className="btn-primary inline-flex items-center gap-2">
                  Try AI Features Free
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency Card Preview */}
      <section className="section">
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="space-y-6"
            >
              <motion.span variants={fadeUp} className="badge-error text-sm">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                Emergency Ready
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-heading font-bold text-4xl md:text-5xl text-accent dark:text-white">
                Life-Saving Info,{" "}
                <span className="gradient-text">One Tap Away</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground text-lg leading-relaxed">
                In emergencies, seconds matter. Your Emergency Card shows critical health information to first responders instantly — no login needed.
              </motion.p>
              <motion.ul variants={stagger} className="space-y-3">
                {[
                  "Blood group, allergies, and conditions",
                  "Current medicines and dosages",
                  "Emergency contacts",
                  "Shareable QR code",
                ].map((item) => (
                  <motion.li key={item} variants={fadeUp} className="flex items-center gap-3 text-accent dark:text-slate-300">
                    <CheckCircle className="w-5 h-5 text-error flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Emergency card preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-3xl border-2 border-error/30 bg-gradient-to-br from-error/5 to-error/10 p-8 space-y-6 shadow-card-lg max-w-sm mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-error flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xl text-accent dark:text-white">Emergency Card</p>
                    <p className="text-sm text-error">Rajesh Sharma</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Blood Group", value: "B+", icon: Heart, color: "text-error" },
                    { label: "Age", value: "54 yrs", icon: Users, color: "text-primary" },
                  ].map((item) => (
                    <div key={item.label} className="bg-surface dark:bg-dark-surface rounded-xl p-3 text-center">
                      <item.icon className={`w-5 h-5 ${item.color} mx-auto mb-1`} />
                      <p className="text-lg font-bold text-accent dark:text-white">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-error uppercase tracking-wide">⚠ Allergies</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="badge-error text-xs">Penicillin</span>
                    <span className="badge-error text-xs">Sulfa drugs</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-accent dark:text-white uppercase tracking-wide">Current Medicines</p>
                  <div className="space-y-1">
                    {["Metformin 500mg", "Atorvastatin 20mg"].map((m) => (
                      <div key={m} className="flex items-center gap-2 text-sm text-accent dark:text-slate-300">
                        <Pill className="w-3.5 h-3.5 text-primary" />
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button className="btn-primary flex-1 text-sm py-2.5">Share</button>
                  <button className="btn-outline flex-1 text-sm py-2.5">Download PDF</button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-background dark:bg-dark-bg">
        <div className="container-app">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center space-y-4 mb-16"
          >
            <motion.span variants={fadeUp} className="badge-primary">Loved by Families</motion.span>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-4xl md:text-5xl text-accent dark:text-white">
              Real Stories, Real <span className="gradient-text">Impact</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card p-6 space-y-4"
              >
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border dark:border-dark-border">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-accent dark:text-white">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container-app max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center space-y-4 mb-16"
          >
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-4xl text-accent dark:text-white">
              Frequently Asked <span className="gradient-text">Questions</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-4"
          >
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="card p-6 space-y-3"
              >
                <h3 className="font-heading font-semibold text-accent dark:text-white flex items-start gap-2">
                  <span className="text-primary font-bold">Q.</span>
                  {faq.q}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed pl-5">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 text-center shadow-glow"
          >
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium">
                <Heart className="w-4 h-4" />
                Start protecting your family today
              </span>
              <h2 className="font-heading font-bold text-4xl md:text-5xl text-white">
                Your Family Deserves Better Healthcare Management
              </h2>
              <p className="text-white/80 text-xl max-w-xl mx-auto">
                Join 10,000+ families who never lose a medical report again.
                Free to start. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-white text-primary font-bold px-10 py-4 rounded-xl hover:bg-white/90 transition-all shadow-lg text-lg w-full sm:w-auto"
                  >
                    Get Started Free
                  </motion.button>
                </Link>
                <Link href="/pricing">
                  <button className="border-2 border-white/30 text-white font-semibold px-10 py-4 rounded-xl hover:bg-white/10 transition-all text-lg w-full sm:w-auto">
                    View Pricing
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
