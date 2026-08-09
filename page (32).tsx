"use client";

import React from "react";
import { motion } from "framer-motion";
import { MarketingNav, MarketingFooter } from "@/components/layout/MarketingLayout";
import { FileText, AlertCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg text-foreground transition-colors flex flex-col justify-between">
      <MarketingNav />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-4 border-b border-border dark:border-dark-border pb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              <FileText className="w-4 h-4" /> Legal Agreement
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Last updated: July 28, 2026 · Please review these terms carefully before accessing MedVault AI.
            </p>
          </div>

          <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-6 sm:p-10 space-y-8 leading-relaxed text-sm sm:text-base">
            <section className="space-y-3">
              <h2 className="text-xl font-heading font-bold text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By creating an account, uploading records, or using MedVault AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please refrain from using the platform.
              </p>
            </section>

            <section className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 space-y-2">
              <h3 className="text-base font-heading font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" /> Important Medical Disclaimer
              </h3>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                MedVault AI is an administrative document management and organization tool powered by artificial intelligence. It is NOT a medical device and does NOT provide medical advice, diagnosis, or treatment recommendations. Always consult a qualified physician for any health-related concerns or before changing prescribed medications.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-heading font-bold text-foreground">2. User Account Responsibilities</h2>
              <p className="text-muted-foreground">
                You are responsible for safeguarding your authentication credentials and for ensuring that information uploaded to your family vault is accurate and lawfully possessed.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-heading font-bold text-foreground">3. Subscriptions & Payments</h2>
              <p className="text-muted-foreground">
                MedVault AI offers Free and Pro / Family Premium plans. Paid plans grant unlimited OCR parsing, priority processing, and expanded family member profiles. Billing terms and refund policies apply as outlined during checkout.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-heading font-bold text-foreground">4. Termination & Service Availability</h2>
              <p className="text-muted-foreground">
                We reserve the right to suspend or terminate accounts that violate terms or attempt unauthorized platform abuse. We strive for 99.9% uptime but cannot guarantee uninterrupted availability during emergency maintenance.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-border dark:border-dark-border">
              <h2 className="text-lg font-heading font-bold text-foreground">Contact Legal Team</h2>
              <p className="text-muted-foreground text-sm">
                For questions regarding these terms, email <span className="font-semibold text-primary">progod.coder@gmail.com</span>.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      <MarketingFooter />
    </div>
  );
}
