"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, CheckCircle } from "lucide-react";
import { MarketingNav, MarketingFooter } from "@/components/layout/MarketingLayout";

const plans = [
  {
    name: "Free Plan",
    price: "₹0",
    period: "forever",
    description: "Ideal for individual users and small families",
    color: "border-border",
    features: [
      "Up to 2 Family Members",
      "5 GB Cloud Storage",
      "Standard OCR Report Scanning",
      "Medical Timeline",
      "Emergency Health Card",
      "Community & Email Support",
    ],
    cta: "Get Started Free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Premium Pro",
    price: "₹199",
    period: "month (or ₹1,890/year)",
    description: "Full AI power for complete family care",
    color: "border-primary",
    badge: "Special Offer: ₹1,890/year",
    features: [
      "Unlimited Family Members",
      "Unlimited Cloud Storage",
      "Advanced AI OCR & Report Extraction",
      "Gemini AI Medical Explainer",
      "Automated AI Timeline Summarizer",
      "Dynamic Emergency QR Code",
      "Smart Medicine & Refill Reminders",
      "24/7 Priority Support",
    ],
    cta: "Upgrade to Premium Pro",
    href: "/signup",
    highlight: true,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <MarketingNav />
      <section className="section">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 mb-16"
          >
            <span className="badge-primary">Simple Pricing</span>
            <h1 className="font-heading font-bold text-5xl text-accent dark:text-white">
              Plans for Every <span className="gradient-text">Family</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Start free. Upgrade anytime. No hidden fees. Cancel whenever.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`relative rounded-3xl border-2 ${plan.color} ${
                  plan.highlight
                    ? "bg-gradient-card shadow-glow"
                    : "bg-surface dark:bg-dark-surface"
                } p-8 space-y-6`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-primary text-white text-sm font-bold px-4 py-1 rounded-full shadow-glow">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="font-heading font-bold text-2xl text-accent dark:text-white">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
                </div>

                <div>
                  <span className="font-heading font-bold text-5xl text-accent dark:text-white">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className="block">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      plan.highlight
                        ? "btn-primary"
                        : "btn-outline"
                    }`}
                  >
                    {plan.cta}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <p className="text-muted-foreground">
                All plans include 256-bit encryption and HIPAA-compliant storage
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
