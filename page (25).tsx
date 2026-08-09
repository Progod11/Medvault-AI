"use client";

import { useState, useEffect } from "react";
import {
  Gift,
  Share2,
  Copy,
  Check,
  Users,
  Award,
  Sparkles,
  MessageSquare,
  Mail,
  Send,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import {
  getUserData,
  addReferredUser,
  addAuditLog,
  addEmailLog,
  saveUserData,
  ReferralData,
} from "@/lib/dataStore";

export default function ReferralPage() {
  const [referral, setReferral] = useState<ReferralData>({
    code: "MEDVAULT-ARJUN2026",
    link: "https://medvault-ai.com/signup?ref=MEDVAULT-ARJUN2026",
    completedCount: 14,
    targetCount: 20,
    proRewardClaimed: false,
    referredUsers: [
      { id: "ref1", name: "Priya Sharma", email: "priya.s@gmail.com", date: "Jul 28, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref2", name: "Anil Kumar", email: "anil.k@yahoo.com", date: "Jul 26, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref3", name: "Sunita Verma", email: "sunita.v@outlook.com", date: "Jul 22, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref4", name: "Rohan Gupta", email: "rohan.g@gmail.com", date: "Jul 20, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref5", name: "Deepak Joshi", email: "deepak.j@hotmail.com", date: "Jul 18, 2026", status: "PENDING", reward: "Awaiting Sign Up" },
    ],
  });
  const [copied, setCopied] = useState(false);
  const [simName, setSimName] = useState("");
  const [simEmail, setSimEmail] = useState("");

  const loadData = () => {
    const data = getUserData();
    if (data.referralData) {
      if (typeof window !== "undefined") {
        data.referralData.link = `${window.location.origin}/signup?ref=${data.referralData.code}`;
      }
      setReferral(data.referralData);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    window.addEventListener("medvault_data_updated", loadData);
    return () => window.removeEventListener("medvault_data_updated", loadData);
  }, []);

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(referral.link);
      setCopied(true);
      toast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Join me on MedVault AI to secure your family's health records with AI. Sign up using my referral code ${referral.code}: ${referral.link}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent("Invite: Secure your family health records on MedVault AI");
    const body = encodeURIComponent(
      `Hi,\n\nI am using MedVault AI to manage my family's health reports, medicines, and emergency cards safely. Join using my referral link:\n${referral.link}\n\nReferral Code: ${referral.code}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleShareSMS = () => {
    const text = encodeURIComponent(
      `Join MedVault AI to manage family health records safely: ${referral.link} (Code: ${referral.code})`
    );
    window.open(`sms:?body=${text}`, "_blank");
  };

  const handleSimulateSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simName || !simEmail) return;
    addReferredUser(simName, simEmail);
    setSimName("");
    setSimEmail("");
    loadData();
    toast.success(`Simulated referral signup for ${simName}!`);
  };

  const handleClaimReward = () => {
    const data = getUserData();
    data.plan = "PREMIUM";
    if (data.referralData) {
      data.referralData.proRewardClaimed = true;
    }
    saveUserData(data);
    addAuditLog("Claimed 1 Month Free Pro Membership via 20 Referrals", "SUCCESS");
    addEmailLog("MedVault AI: 1 Month Pro Membership Activated!", "REFERRAL_REWARD");
    loadData();
    toast.success("Congratulations! 1 Month Pro Membership activated!");
  };

  const progressPercent = Math.min(100, Math.round((referral.completedCount / referral.targetCount) * 100));

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Hero Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white">
                <Gift className="w-3.5 h-3.5" />
                Refer & Earn Program
              </div>
              <h1 className="text-3xl font-heading font-extrabold">
                Invite 20 Friends & Get 1 Month Pro Free
              </h1>
              <p className="text-white/90 text-sm leading-relaxed">
                Share MedVault AI with your family, friends, and community. When 20 users sign up using your referral code, unlock full Premium Pro features for an entire month at zero cost!
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-3 shrink-0">
              <Award className="w-10 h-10 mx-auto text-amber-300" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/80">Current Reward Goal</p>
                <p className="text-xl font-extrabold text-white">1 Month Pro Membership</p>
              </div>
              {referral.completedCount >= referral.targetCount && !referral.proRewardClaimed ? (
                <button
                  onClick={handleClaimReward}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-sm hover:bg-amber-300 transition-all shadow-lg animate-bounce"
                >
                  Claim 1 Month Pro Free!
                </button>
              ) : referral.proRewardClaimed ? (
                <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Pro Activated
                </span>
              ) : (
                <p className="text-xs text-white/80 font-medium">
                  {referral.targetCount - referral.completedCount} more signups needed
                </p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Referral Progress</span>
              <span>{referral.completedCount} / {referral.targetCount} Referred Users ({progressPercent}%)</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-amber-400 transition-all duration-500 shadow-glow"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Share Referral Link Box */}
        <div className="p-6 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border space-y-4">
          <h2 className="text-lg font-heading font-bold text-accent dark:text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Your Unique Referral Code & Link
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
            <div className="lg:col-span-2 p-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border flex items-center justify-between gap-3 font-mono text-xs text-primary truncate">
              <span className="truncate">{referral.link}</span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-primary text-white font-sans text-xs font-semibold hover:opacity-90 transition-all shrink-0 flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </button>
              <button
                onClick={handleShareEmail}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5"
              >
                <Mail className="w-4 h-4" /> Email
              </button>
              <button
                onClick={handleShareSMS}
                className="px-3 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" /> SMS
              </button>
            </div>
          </div>
        </div>

        {/* Test Referral Simulator */}
        <div className="p-6 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border space-y-4">
          <h2 className="text-base font-heading font-bold text-accent dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Test Referral Engine (Simulate New Referred Sign Up)
          </h2>
          <form onSubmit={handleSimulateSignup} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="Friend Name..."
              value={simName}
              onChange={(e) => setSimName(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-background dark:bg-dark-bg border border-border dark:border-dark-border text-xs focus:outline-none focus:border-primary"
            />
            <input
              type="email"
              required
              placeholder="Friend Email..."
              value={simEmail}
              onChange={(e) => setSimEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-background dark:bg-dark-bg border border-border dark:border-dark-border text-xs focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:opacity-90 transition-all shrink-0"
            >
              Simulate Friend Sign Up
            </button>
          </form>
        </div>

        {/* Referral History Table */}
        <div className="p-6 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border space-y-4">
          <h2 className="text-lg font-heading font-bold text-accent dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Referral History & Reward Status
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-muted-foreground">
              <thead className="border-b border-border dark:border-dark-border text-accent dark:text-white uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Referred User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reward Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-dark-border">
                {referral.referredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-background/50 dark:hover:bg-dark-bg/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-accent dark:text-white">{user.name}</td>
                    <td className="py-3 px-4 font-mono">{user.email}</td>
                    <td className="py-3 px-4">{user.date}</td>
                    <td className="py-3 px-4">
                      {user.status === "COMPLETED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-accent dark:text-white">{user.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}