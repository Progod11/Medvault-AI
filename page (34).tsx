"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MarketingNav, MarketingFooter } from "@/components/layout/MarketingLayout";
import {
  Zap,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Lock,
  Sparkles,
  ArrowRight,
  Check,
  Building2,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getUserData, saveUserData } from "@/lib/dataStore";

type BillingCycle = "monthly" | "yearly";
type PaymentMethod = "card" | "upi" | "paypal";

const plans = [
  {
    id: "free",
    name: "Basic Vault",
    priceMonthly: "$0",
    priceYearly: "$0",
    description: "Essential medical record storage for single individuals.",
    features: [
      "Up to 2 Family Members",
      "10 Document Uploads / Month",
      "Standard Gemini OCR Parsing",
      "Manual Reminder Notifications",
      "Emergency Card PDF Export",
    ],
    cta: "Current Plan",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro Family Vault",
    priceMonthly: "$9.99",
    priceYearly: "$89.99",
    billingNoteYearly: "Billed annually ($7.49/mo)",
    description: "Complete health vault with AI insights for growing families.",
    features: [
      "Unlimited Family Members",
      "Unlimited Document Uploads",
      "Advanced Gemini 3.5 AI Analysis",
      "Real-time Firestore Database Sync",
      "Automated WhatsApp & SMS Medicine Alerts",
      "24/7 Priority Emergency QR Scanner",
      "Full History Export & CSV Backups",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "lifetime",
    name: "Family Lifetime",
    priceMonthly: "$199",
    priceYearly: "$199",
    billingNoteYearly: "One-time payment, forever access",
    description: "Lifetime health security and maximum storage guarantee.",
    features: [
      "Everything in Pro Family Vault",
      "Lifetime Zero-Recurring Fees",
      "Dedicated HIPAA Vault Instance",
      "1-on-1 Personal Health Data Onboarding",
      "VIP Priority Customer Support",
    ],
    cta: "Get Lifetime Pass",
    popular: false,
  },
];

export default function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[1] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptTxId, setReceiptTxId] = useState("");

  // Card form state
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardName, setCardName] = useState("Arjun Sharma");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("•••");
  const [upiId, setUpiId] = useState("arjun@upi");

  const handleOpenCheckout = (plan: typeof plans[0]) => {
    if (plan.id === "free") return;
    setSelectedPlan(plan);
    setShowModal(true);
    setPaymentSuccess(false);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      const txId = "TXN-" + Math.floor(10000000 + Math.random() * 90000000);
      setReceiptTxId(txId);

      // Update local storage plan state
      if (typeof window !== "undefined") {
        localStorage.setItem("medvault_user_plan", "PREMIUM");
        const userData = getUserData();
        userData.plan = "PREMIUM";
        userData.notifications.unshift({
          id: Date.now().toString(),
          title: "Plan Upgraded to Pro",
          message: `Your account has been upgraded to ${selectedPlan?.name}. Transaction ID: ${txId}`,
          time: "Just now",
          unread: true,
        });
        saveUserData(userData);
      }

      toast.success("Payment Successful! Welcome to MedVault Pro.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg text-foreground transition-colors flex flex-col justify-between">
      <MarketingNav />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-4 h-4" /> MedVault Premium Plans
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight">
            Unlock Full Family Health Protection
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Upgrade your vault for unlimited AI report scanning, real-time database sync, and emergency medical card generation.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-foreground font-bold" : "text-muted-foreground"}`}>
              Monthly Billing
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="w-14 h-8 bg-primary/20 rounded-full p-1 transition-colors relative flex items-center"
            >
              <div
                className={`w-6 h-6 bg-primary rounded-full shadow-md transform transition-transform ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-foreground font-bold" : "text-muted-foreground"}`}>
              Annual Billing
              <span className="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs px-2 py-0.5 font-bold">
                Save 25%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, idx) => {
            const price = billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative bg-card dark:bg-dark-card border rounded-3xl p-8 flex flex-col justify-between shadow-lg transition-all ${
                  plan.popular
                    ? "border-primary ring-2 ring-primary/20 scale-105 z-10"
                    : "border-border dark:border-dark-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-heading font-bold">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-heading font-extrabold">{price}</span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {plan.id === "lifetime" ? " / once" : billingCycle === "yearly" ? " / year" : " / month"}
                    </span>
                  </div>

                  {billingCycle === "yearly" && plan.billingNoteYearly && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {plan.billingNoteYearly}
                    </p>
                  )}

                  <div className="space-y-3 pt-4 border-t border-border dark:border-dark-border">
                    <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Features included:</p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    type="button"
                    disabled={plan.id === "free"}
                    onClick={() => handleOpenCheckout(plan)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      plan.id === "free"
                        ? "bg-secondary/10 text-muted-foreground cursor-not-allowed"
                        : plan.popular
                        ? "btn-primary shadow-glow"
                        : "btn-outline hover:bg-primary/5"
                    }`}
                  >
                    {plan.cta} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Security Trust Note */}
        <div className="max-w-2xl mx-auto text-center space-y-2 border-t border-border dark:border-dark-border pt-8">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>30-Day Money-Back Guarantee · Cancel Anytime · AES-256 Encrypted Payments</span>
          </div>
        </div>
      </main>

      {/* Checkout Payment Dialog Modal */}
      <AnimatePresence>
        {showModal && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-border/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {!paymentSuccess ? (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold">Upgrade to {selectedPlan.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Total Amount:{" "}
                        <span className="font-bold text-foreground">
                          {billingCycle === "yearly" ? selectedPlan.priceYearly : selectedPlan.priceMonthly}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-secondary/10 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === "card" ? "bg-card shadow text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("upi")}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === "upi" ? "bg-card shadow text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" /> UPI / QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("paypal")}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === "paypal" ? "bg-card shadow text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" /> PayPal
                    </button>
                  </div>

                  <form onSubmit={handleProcessPayment} className="space-y-4">
                    {paymentMethod === "card" && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Cardholder Name</label>
                          <input
                            type="text"
                            required
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="input-field text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Card Number</label>
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="input-field text-sm mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Expires</label>
                            <input
                              type="text"
                              required
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value)}
                              className="input-field text-sm mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">CVV</label>
                            <input
                              type="password"
                              required
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              className="input-field text-sm mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "upi" && (
                      <div className="space-y-3 text-center py-2">
                        <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mx-auto border">
                          <QrCode className="w-32 h-32 text-slate-800" />
                        </div>
                        <p className="text-xs text-muted-foreground">Scan QR with Google Pay, PhonePe, or Paytm</p>
                        <div className="pt-2 text-left">
                          <label className="text-xs font-medium text-muted-foreground">Or Enter UPI ID</label>
                          <input
                            type="text"
                            required
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="input-field text-sm mt-1"
                            placeholder="username@upi"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === "paypal" && (
                      <div className="bg-secondary/10 rounded-2xl p-6 text-center space-y-3">
                        <p className="text-sm text-foreground font-semibold">PayPal Express Checkout</p>
                        <p className="text-xs text-muted-foreground">
                          You will be securely redirected to PayPal to complete your purchase.
                        </p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-border dark:border-dark-border flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Lock className="w-3.5 h-3.5 text-emerald-500" /> 256-Bit SSL Encrypted
                      </div>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                          </>
                        ) : (
                          `Pay ${billingCycle === "yearly" ? selectedPlan.priceYearly : selectedPlan.priceMonthly}`
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Payment Success View */
                <div className="text-center py-4 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-2xl font-bold">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-extrabold text-foreground">
                      Upgrade Confirmed!
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Welcome to <span className="font-bold text-primary">{selectedPlan.name}</span>. Your account now has full access to all Pro features.
                    </p>
                  </div>

                  <div className="bg-secondary/10 rounded-2xl p-4 text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Receipt No:</span>
                      <span className="font-mono font-bold">{receiptTxId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-bold text-emerald-500">Paid & Activated</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Billing Cycle:</span>
                      <span className="capitalize">{billingCycle}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowModal(false)}
                      className="btn-primary py-3 text-sm text-center"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MarketingFooter />
    </div>
  );
}
