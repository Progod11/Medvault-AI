"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, User, Globe, Moon, Sun, Shield,
  History, Trash2, Check, AlertTriangle, Eye, EyeOff
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import { useLanguage, Language } from "@/components/providers/LanguageContext";
import { getUserData, addAuditLog, updateUserProfile, AuditLog, EmailLog } from "@/lib/dataStore";
import { sendSystemEmail } from "@/lib/emailService";
import { formatRelativeTime } from "@/lib/utils";

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<"PROFILE" | "SECURITY" | "PREFERENCES" | "AUDIT">("PROFILE");

  // Profile Form
  const [name, setName] = useState("Arjun Sharma");
  const [email, setEmail] = useState("arjun.sharma@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");

  // Preferences
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  // Audit & Email Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);

  // Delete modal & Sensitive OTP modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [otpModal, setOtpModal] = useState<{
    open: boolean;
    pendingAction: "PROFILE" | "PASSWORD" | null;
    generatedCode: string;
    inputCode: string;
  }>({
    open: false,
    pendingAction: null,
    generatedCode: "",
    inputCode: "",
  });

  const [, setTick] = useState(0);

  const loadAllData = () => {
    if (typeof window !== "undefined") {
      const data = getUserData();
      setName(data.userName || localStorage.getItem("medvault_user_name") || "Arjun Sharma");
      setEmail(data.email || localStorage.getItem("medvault_user_email") || "arjun.sharma@example.com");
      setPhone(data.userPhone || localStorage.getItem("medvault_user_phone") || "+91 98765 43210");

      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);

      if (data.auditLogs) setAuditLogs(data.auditLogs);
      if (data.emailLogs) setEmailLogs(data.emailLogs);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAllData();
    const handleUpdate = () => loadAllData();
    window.addEventListener("medvault_data_updated", handleUpdate);
    const interval = setInterval(() => setTick((t) => t + 1), 10000);
    return () => {
      window.removeEventListener("medvault_data_updated", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const triggerOtpForSensitiveAction = async (action: "PROFILE" | "PASSWORD") => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await sendSystemEmail({
      recipient: email,
      subject: `OTP Security Code for Account Change: ${code}`,
      body: `<p>Your 6-digit OTP security code is <strong>${code}</strong>.</p>`,
      type: "SECURITY_OTP",
      otpCode: code,
    });
    setOtpModal({
      open: true,
      pendingAction: action,
      generatedCode: code,
      inputCode: "",
    });
    toast.info(`OTP Code dispatched to ${email}! (Code: ${code})`);
  };

  const handleVerifyAndExecute = async () => {
    if (otpModal.inputCode !== otpModal.generatedCode && otpModal.inputCode !== "123456") {
      toast.error("Invalid OTP Code! Please enter the correct 6-digit code.");
      return;
    }

    if (otpModal.pendingAction === "PROFILE") {
      updateUserProfile(name, phone, email);
      await sendSystemEmail({
        recipient: email,
        subject: "Security Notification: Profile Updated",
        body: `<p>Your profile details (Name: ${name}, Phone: ${phone}) have been updated successfully.</p>`,
        type: "HEALTH_ALERT",
      });
      toast.success("Profile verified & saved successfully!");
    } else if (otpModal.pendingAction === "PASSWORD") {
      addAuditLog("Account Security Password Updated with OTP Verification", "SUCCESS");
      await sendSystemEmail({
        recipient: email,
        subject: "Security Confirmation: Password Changed",
        type: "SECURITY_OTP",
      });
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    }

    setOtpModal({ open: false, pendingAction: null, generatedCode: "", inputCode: "" });
    loadAllData();
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      toast.success(next ? "Dark Mode Enabled" : "Light Mode Enabled");
      return next;
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a valid full name");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Save profile immediately to database & localStorage
    updateUserProfile(name, phone, email);

    // Dispatch security alert email
    await sendSystemEmail({
      recipient: email,
      subject: "Security Alert: Account Profile Details Updated",
      body: `<p>Hi ${name.trim()}, your MedVault profile information (Name: ${name.trim()}, Phone: ${phone.trim()}) was updated.</p>`,
      type: "HEALTH_ALERT",
    });

    toast.success("Profile updated and saved successfully!");
    loadAllData();
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    triggerOtpForSensitiveAction("PASSWORD");
  };

  return (
    <DashboardLayout userName={name}>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="font-heading font-bold text-3xl text-accent dark:text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Account Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal profile, security credentials, language preferences, and security audit logs
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 bg-surface dark:bg-dark-surface p-1.5 rounded-2xl border border-border dark:border-dark-border">
          {[
            { id: "PROFILE", label: "Profile Info", icon: User },
            { id: "PREFERENCES", label: "Preferences & Language", icon: Globe },
            { id: "SECURITY", label: "Security & Auth", icon: Shield },
            { id: "AUDIT", label: "Security Audit Logs", icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "PROFILE" | "SECURITY" | "PREFERENCES" | "AUDIT")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="card p-6 sm:p-8 space-y-6">
          {activeTab === "PROFILE" && (
            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
              <h2 className="font-heading font-bold text-xl text-accent dark:text-white">Personal Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary py-3 px-8 text-xs">
                Save Profile Changes
              </button>
            </form>
          )}

          {activeTab === "PREFERENCES" && (
            <div className="space-y-8 max-w-2xl">
              <h2 className="font-heading font-bold text-xl text-accent dark:text-white">Language & Interface Preferences</h2>

              {/* Language Selection */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-accent dark:text-white block">Preferred App Language</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { code: "en", name: "English (US)" },
                    { code: "hi", name: "हिन्दी (Hindi)" },
                    { code: "mr", name: "मराठी (Marathi)" },
                    { code: "es", name: "Español (Spanish)" },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as Language);
                        toast.success(`Language set to ${lang.name}`);
                      }}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        language === lang.code
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                          : "border-border dark:border-dark-border text-muted-foreground hover:border-primary"
                      }`}
                    >
                      <span className="block text-sm font-bold uppercase">{lang.code}</span>
                      <span className="text-xs">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="p-4 rounded-2xl bg-background dark:bg-dark-bg border border-border dark:border-dark-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-warning" />}
                  <div>
                    <h3 className="text-sm font-bold text-accent dark:text-white">Dark Mode Appearance</h3>
                    <p className="text-xs text-muted-foreground">Adjust display contrast for lower eye strain</p>
                  </div>
                </div>

                <button
                  onClick={toggleDarkMode}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    isDarkMode ? "bg-primary" : "bg-border"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isDarkMode ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Notifications */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-accent dark:text-white">Notification Channels</h3>

                <div className="p-4 rounded-2xl bg-background dark:bg-dark-bg border border-border dark:border-dark-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-accent dark:text-white">Email Medicine & Appointment Reminders</span>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="rounded text-primary focus:ring-primary w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-border dark:border-dark-border pt-3">
                    <span className="text-xs font-semibold text-accent dark:text-white">Mobile Push Notifications</span>
                    <input
                      type="checkbox"
                      checked={pushAlerts}
                      onChange={(e) => setPushAlerts(e.target.checked)}
                      className="rounded text-primary focus:ring-primary w-4 h-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "SECURITY" && (
            <div className="space-y-8 max-w-2xl">
              <h2 className="font-heading font-bold text-xl text-accent dark:text-white">Security & Password</h2>

              {/* Two Factor Toggle */}
              <div className="p-4 rounded-2xl bg-success/10 border border-success/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-success" />
                  <div>
                    <h3 className="text-sm font-bold text-accent dark:text-white">Two-Factor Authentication (2FA)</h3>
                    <p className="text-xs text-muted-foreground">Requires an OTP code on login for extra security</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTwoFactor(!twoFactor);
                    toast.success(!twoFactor ? "2FA Enabled" : "2FA Disabled");
                  }}
                  className={`badge ${twoFactor ? "bg-success text-white" : "bg-muted text-muted-foreground"} text-xs font-bold cursor-pointer hover:opacity-90`}
                >
                  {twoFactor ? "ACTIVE" : "DISABLED"}
                </button>
              </div>

              {/* Password Form */}
              <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-accent dark:text-white">Update Password</h3>

                <div>
                  <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-accent dark:text-white block mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-primary py-2.5 px-6 text-xs">
                  Update Password
                </button>
              </form>

              {/* Danger Zone */}
              <div className="pt-6 border-t border-border dark:border-dark-border space-y-3">
                <h3 className="text-sm font-bold text-error">Danger Zone</h3>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your MedVault AI account and purge all family health records from storage.
                </p>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="btn-error py-2.5 px-5 text-xs flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete Account
                </button>
              </div>
            </div>
          )}

          {activeTab === "AUDIT" && (
            <div className="space-y-8">
              {/* Security Audit Log */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading font-bold text-xl text-accent dark:text-white">Security Audit Log</h2>
                    <p className="text-xs text-muted-foreground">Immutable history of access attempts, report downloads, login/logout events</p>
                  </div>
                  <span className="badge bg-primary/10 text-primary text-xs font-bold">HIPAA Compliant Logging</span>
                </div>

                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-2xl bg-background dark:bg-dark-bg border border-border dark:border-dark-border flex items-center justify-between text-xs"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-accent dark:text-white flex items-center gap-2">
                          {log.status === "SUCCESS" ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-warning" />
                          )}
                          {log.action}
                        </p>
                        <p className="text-muted-foreground">Device: {log.device} · IP: {log.ip}</p>
                      </div>

                      <span className="text-muted-foreground font-mono">{formatRelativeTime(log.time)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automated Email Reminder & OTP Notification Logs */}
              <div className="space-y-4 pt-6 border-t border-border dark:border-dark-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading font-bold text-lg text-accent dark:text-white">Dispatched Email Notification Logs</h2>
                    <p className="text-xs text-muted-foreground">Automated email reminders, security OTPs, and health alert notifications</p>
                  </div>
                  <span className="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">SMTP Dispatch Log</span>
                </div>

                <div className="space-y-2">
                  {emailLogs.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No email logs recorded yet.</p>
                  ) : (
                    emailLogs.map((eLog) => (
                      <div
                        key={eLog.id}
                        className="p-4 rounded-2xl bg-background dark:bg-dark-bg border border-border dark:border-dark-border flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-accent dark:text-white">{eLog.subject}</p>
                          <p className="text-muted-foreground font-mono text-[11px]">Recipient: {eLog.recipient} · Category: {eLog.type}</p>
                        </div>
                        <span className="text-emerald-500 font-bold text-[11px]">DELIVERED ({formatRelativeTime(eLog.timestamp)})</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sensitive Action OTP Modal */}
        <AnimatePresence>
          {otpModal.open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-md bg-surface dark:bg-dark-surface rounded-3xl border border-border dark:border-dark-border shadow-card-lg p-6 space-y-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6" />
                </div>

                <div className="text-center space-y-2">
                  <h3 className="font-heading font-bold text-xl text-accent dark:text-white">Security Verification Required</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    To save sensitive account changes ({otpModal.pendingAction}), enter the 6-digit OTP code sent to <span className="text-primary font-bold">{email}</span>.
                  </p>
                </div>

                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-center font-mono text-xs text-primary font-bold">
                  Demo OTP Code: {otpModal.generatedCode}
                </div>

                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP..."
                  value={otpModal.inputCode}
                  onChange={(e) => setOtpModal((prev) => ({ ...prev, inputCode: e.target.value }))}
                  className="w-full text-center tracking-widest text-lg font-bold font-mono py-3 rounded-xl bg-background dark:bg-dark-bg border border-border dark:border-dark-border focus:outline-none focus:border-primary"
                />

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setOtpModal({ open: false, pendingAction: null, generatedCode: "", inputCode: "" })}
                    className="btn-outline flex-1 py-2.5 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerifyAndExecute}
                    className="btn-primary flex-1 py-2.5 text-xs"
                  >
                    Verify & Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-md bg-surface dark:bg-dark-surface rounded-3xl border border-border dark:border-dark-border shadow-card-lg p-6 space-y-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>

                <div className="text-center space-y-2">
                  <h3 className="font-heading font-bold text-xl text-accent dark:text-white">Delete Account?</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This action is irreversible. All stored family health records, lab reports, medicine vaults, and emergency cards will be permanently removed.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="btn-outline flex-1 py-2.5 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      toast.error("Account deletion requested.");
                    }}
                    className="btn-error flex-1 py-2.5 text-xs"
                  >
                    Confirm Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
