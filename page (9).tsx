"use client";

import React from "react";
import { motion } from "framer-motion";
import { MarketingNav, MarketingFooter } from "@/components/layout/MarketingLayout";
import { Sparkles, CheckCircle2, Zap } from "lucide-react";

const releases = [
  {
    version: "v1.2.0",
    date: "July 2026",
    title: "Firebase Real-Time Data Sync & Emergency Pass Engine",
    description:
      "Integrated live multi-device database synchronization, Google OAuth 2.0 authentication, and instant QR Code Emergency Health Cards.",
    changes: [
      "Real-time Firestore database synchronization across all family members.",
      "Google OAuth 2.0 sign-in with instant profile setup.",
      "Emergency Emergency Health Card with customizable blood group & allergy badges.",
      "Upgraded Gemini AI document recognition for multi-page lab reports and prescriptions.",
      "New interactive Pro & Family upgrade payment gateway modal with instant receipt generation.",
    ],
    badge: "Latest Release",
  },
  {
    version: "v1.1.0",
    date: "June 2026",
    title: "Smart Medication Reminders & AI Health Timeline",
    description:
      "Introduced automated medicine dosage tracking, interactive timeline search, and multi-language support.",
    changes: [
      "Automated dosage schedules (Morning, Afternoon, Night reminders).",
      "Interactive timeline search filtering by doctor, hospital, and diagnosis.",
      "Multi-language support (English, Hindi, Marathi, Spanish).",
      "Export medical history as PDF or secure JSON backup.",
    ],
    badge: "Major Update",
  },
  {
    version: "v1.0.0",
    date: "May 2026",
    title: "Initial Launch of MedVault AI",
    description:
      "The official hackathon release of MedVault AI — Your secure family health vault.",
    changes: [
      "Family member management with customized medical profiles.",
      "Drag-and-drop document upload with Gemini AI OCR parsing.",
      "Dark mode and responsive mobile optimization.",
      "Interactive dashboard analytics and health summary statistics.",
    ],
    badge: "Platform Launch",
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg text-foreground transition-colors flex flex-col justify-between">
      <MarketingNav />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Continuous Platform Evolution
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight">
            Changelog & Product Updates
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Follow our progress as we build the smartest, most secure platform for family health record management.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative border-l-2 border-border dark:border-dark-border ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          {releases.map((rel, idx) => (
            <motion.div
              key={rel.version}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold ring-4 ring-background dark:ring-dark-bg">
                <Zap className="w-3.5 h-3.5" />
              </div>

              <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border dark:border-dark-border pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-extrabold text-xl sm:text-2xl text-primary">
                      {rel.version}
                    </span>
                    <span className="badge bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                      {rel.badge}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{rel.date}</span>
                </div>

                <h3 className="text-lg font-heading font-bold">{rel.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{rel.description}</p>

                <div className="pt-2 space-y-2">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-muted-foreground">What&apos;s New:</h4>
                  <ul className="space-y-2">
                    {rel.changes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
