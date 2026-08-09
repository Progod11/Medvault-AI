"use client";

import React from "react";
import { motion } from "framer-motion";
import { MarketingNav, MarketingFooter } from "@/components/layout/MarketingLayout";
import { Shield, Lock } from "lucide-react";

export default function PrivacyPage() {
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
              <Shield className="w-4 h-4" /> Legal & Transparency
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Last updated: July 28, 2026 · Effective immediately for all registered users and visitors.
            </p>
          </div>

          <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-6 sm:p-10 space-y-8 leading-relaxed text-sm sm:text-base">
            <section className="space-y-3">
              <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" /> 1. Overview & Commitment
              </h2>
              <p className="text-muted-foreground">
                At MedVault AI, we consider your medical records and family health history to be strictly confidential. We pledge to never sell, rent, monetise, or distribute your personal health data to insurance providers, marketers, or third-party advertisers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-heading font-bold text-foreground">2. Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect information necessary to deliver personalized health record management:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                <li>Account credentials (Email, Name, Encrypted Password, Google Auth token)</li>
                <li>Family member profiles (Name, Age, Blood Group, Emergency Contact details)</li>
                <li>Uploaded health documents (Prescriptions, Lab Reports, Hospital Summaries)</li>
                <li>AI OCR Metadata extracted from document parsing</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-heading font-bold text-foreground">3. How We Use Your Data</h2>
              <p className="text-muted-foreground">
                Your data is exclusively utilized to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                <li>Provide intelligent document search and OCR summary extractions via Gemini AI.</li>
                <li>Schedule dosage reminders and follow-up medical appointments.</li>
                <li>Generate secure emergency QR cards for quick clinical reference.</li>
                <li>Maintain account security and verify login authorization.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-heading font-bold text-foreground">4. Encryption & Storage Standards</h2>
              <p className="text-muted-foreground">
                All records stored within MedVault AI are protected using 256-bit AES encryption at rest and TLS 1.3 encryption in transit. Firestore security rules enforce strict role-based data partitioning per authenticated user account.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-heading font-bold text-foreground">5. Your Data Rights</h2>
              <p className="text-muted-foreground">
                You maintain complete ownership of your medical history. You may export your entire vault records at any time or request complete account and document erasure from our servers via Account Settings.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-border dark:border-dark-border">
              <h2 className="text-lg font-heading font-bold text-foreground">Questions or Data Inquiries?</h2>
              <p className="text-muted-foreground text-sm">
                Contact our Data Protection Officer at <span className="font-semibold text-primary">progod.coder@gmail.com</span> or call <span className="font-semibold">+91 9028190291</span>.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      <MarketingFooter />
    </div>
  );
}
