"use client";

import React from "react";
import { motion } from "framer-motion";
import { MarketingNav, MarketingFooter } from "@/components/layout/MarketingLayout";
import { Shield, Lock, Key, Server, Eye, FileCheck, CheckCircle2, Cpu } from "lucide-react";
import Link from "next/link";

const securityFeatures = [
  {
    icon: Lock,
    title: "256-Bit AES & TLS 1.3 Encryption",
    description:
      "All medical documents, prescriptions, and health metrics are encrypted both in transit and at rest using bank-grade AES-256 standards.",
  },
  {
    icon: Shield,
    title: "HIPAA & GDPR Compliance Framework",
    description:
      "Built according to rigorous international patient data protection guidelines, ensuring zero unauthorized disclosure of your sensitive records.",
  },
  {
    icon: Key,
    title: "Isolated Zero-Knowledge Data Vaults",
    description:
      "Each user account maintains an isolated data store partition. Your family health records are accessible strictly by you and authorized members.",
  },
  {
    icon: Server,
    title: "Continuous Firebase Automated Backups",
    description:
      "Redundant multi-region database replication guarantees 99.99% availability with instant failover and point-in-time recovery.",
  },
  {
    icon: Eye,
    title: "Granular Privacy & Sharing Controls",
    description:
      "Share emergency QR passes or specific report summaries with doctors or relatives without handing over full account credentials.",
  },
  {
    icon: Cpu,
    title: "Sandboxed AI OCR Processing",
    description:
      "Document ingestion and medical entity extraction run inside isolated server environments with strict non-retention policies.",
  },
];

const auditPoints = [
  "Annual Third-Party Penetration Testing",
  "Real-Time Anomaly & Intrusion Detection System",
  "Automated Database Role-Based Access Security Rules",
  "2FA Multi-Factor Authentication Protection",
  "Encrypted End-to-End Emergency QR Key Validation",
  "Full Audit Trail Logging for Record Access",
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg text-foreground transition-colors flex flex-col justify-between">
      <MarketingNav />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4" /> Uncompromising Data Protection
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight">
            Security & Privacy Architecture
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Your family&apos;s health data deserves the highest level of security. MedVault AI employs enterprise-grade security protocols to keep your medical records private and protected.
          </p>
        </motion.div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {securityFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-6 hover:shadow-lg transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-bold">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Compliance & Audit Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-accent to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-16 shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-primary font-bold">
                Audited & Verified
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold">
                Rigorous Defense in Depth
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                We continuously audit our systems against evolving cybersecurity benchmarks so that you can store health histories with absolute peace of mind.
              </p>
              <div className="pt-2 flex items-center gap-4">
                <Link href="/contact" className="btn-primary py-3 px-6 text-sm">
                  Contact Security Team
                </Link>
                <Link href="/privacy" className="btn-outline border-slate-700 text-slate-200 hover:bg-slate-800 py-3 px-6 text-sm">
                  View Privacy Policy
                </Link>
              </div>
            </div>

            <div className="bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-3">
              <h4 className="font-heading font-bold text-sm text-slate-200 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" /> Key Infrastructure Controls
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {auditPoints.map((point) => (
                  <div key={point} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <MarketingFooter />
    </div>
  );
}
