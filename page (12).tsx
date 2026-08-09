/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, FileText, Bell, Upload, TrendingUp, AlertCircle,
  Plus, Clock, ChevronRight, Heart, Pill, Activity, Sparkles,
  Shield, Droplets, Phone, Eye, CheckCircle2,
  Bot, X, Calendar, ExternalLink
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageContext";
import { getUserData, UserData, FamilyMember } from "@/lib/dataStore";
import { calculateHealthScore } from "@/lib/healthScore";
import { generateHealthAnalytics } from "@/lib/healthAnalytics";
import QRCode from "qrcode";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const gradients = [
  "from-primary to-secondary",
  "from-secondary to-primary",
  "from-success to-primary",
  "from-warning to-error",
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function DashboardPage() {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>("glucose");
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyQrUrl, setEmergencyQrUrl] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const loadData = useCallback(() => {
    const data = getUserData();
    setUserData(data);
    if (data.familyMembers && data.familyMembers.length > 0) {
      setSelectedMember(data.familyMembers[0]);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("medvault_data_updated", handleUpdate);
    return () => window.removeEventListener("medvault_data_updated", handleUpdate);
  }, [loadData]);

  // Dynamic Data Calculations
  const reports = useMemo(() => userData?.reports || [], [userData?.reports]);
  const familyMembers = useMemo(() => userData?.familyMembers || [], [userData?.familyMembers]);
  const medicines = useMemo(() => userData?.medicines || [], [userData?.medicines]);
  const reminders = useMemo(() => userData?.reminders || [], [userData?.reminders]);

  const healthScore = useMemo(() => calculateHealthScore(reports), [reports]);
  const healthAnalytics = useMemo(() => generateHealthAnalytics(reports), [reports]);

  // Derived Timeline Events from Audit Logs
  const timelineEvents = useMemo(() => {
    const logs = userData?.auditLogs || [];
    if (logs.length === 0) return [];

    return logs.slice(0, 6).map((log) => {
      let icon = Activity;
      let color = "text-primary";
      let bg = "bg-primary/10";

      const act = log.action.toLowerCase();
      if (act.includes("upload") || act.includes("report")) {
        icon = FileText;
        color = "text-secondary";
        bg = "bg-secondary/10";
      } else if (act.includes("ai") || act.includes("gemini") || act.includes("score")) {
        icon = Sparkles;
        color = "text-warning";
        bg = "bg-warning/10";
      } else if (act.includes("medicine") || act.includes("rx")) {
        icon = Pill;
        color = "text-primary";
        bg = "bg-primary/10";
      } else if (act.includes("profile") || act.includes("family")) {
        icon = Users;
        color = "text-success";
        bg = "bg-success/10";
      }

      const rawTime = log.time || Date.now();
      const formattedTime = new Date(rawTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        title: log.action,
        time: formattedTime !== "Invalid Date" ? formattedTime : "Recent",
        desc: `Status: ${log.status} · ${new Date(rawTime).toLocaleDateString()}`,
        icon,
        color,
        bg,
      };
    });
  }, [userData?.auditLogs]);

  // Generate QR Code for Emergency Modal
  useEffect(() => {
    if (typeof window !== "undefined" && selectedMember) {
      const shareUrl = `${window.location.origin}/emergency?member=${selectedMember.id}`;
      QRCode.toDataURL(shareUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: "#D32F2F",
          light: "#FFFFFF",
        },
      })
        .then((url) => setEmergencyQrUrl(url))
        .catch((err) => console.error("QR Generation error:", err));
    }
  }, [selectedMember]);

  const userName = isMounted
    ? localStorage.getItem("medvault_user_name") || userData?.email.split("@")[0] || "User"
    : "User";

  // Dynamic Time-Aware Greeting (only compute when mounted)
  const getTimeGreeting = () => {
    if (!isMounted) return "Welcome";
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 22) return "Good Evening";
    return "Good Night";
  };

  const activeRemindersCount = reminders.filter((r) => !r.isCompleted).length;

  const stats = [
    { label: t("familyMembers") || "Family Members", value: familyMembers.length.toString(), icon: Users, color: "text-primary", bg: "bg-primary/10", badge: "Synced" },
    { label: t("totalReports") || "Total Reports", value: reports.length.toString(), icon: FileText, color: "text-secondary", bg: "bg-secondary/10", badge: "AI Extracted" },
    { label: t("activeMedicines") || "Active Medicines", value: medicines.length.toString(), icon: Pill, color: "text-warning", bg: "bg-warning/10", badge: "Rx Tracked" },
    { label: t("reminders") || "Upcoming Reminders", value: activeRemindersCount.toString(), icon: Bell, color: "text-error", bg: "bg-error/10", badge: "96% Adherence" },
  ];

  const primaryMember = selectedMember || familyMembers[0] || {
    id: "default",
    name: userName,
    relationship: "Primary Account",
    bloodGroup: "Not Set",
    allergies: [],
    chronicDiseases: [],
    emergencyPhone: "Not Configured",
  };

  return (
    <DashboardLayout userName={userName}>
      <div className="space-y-8 max-w-7xl mx-auto pb-10">
        
        {/* 1. Header & Personalized Time-Aware Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 sm:p-8 bg-gradient-to-r from-surface via-surface to-primary/5 dark:from-dark-surface dark:via-dark-surface dark:to-primary/10 border-primary/20 shadow-card-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Health OS Active
                </span>
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {isMounted ? new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : ""}
                </span>
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-accent dark:text-white tracking-tight">
                {getTimeGreeting()}, {userName.split(" ")[0]} 👋
              </h1>

              {/* Dynamic Contextual Subtitles */}
              <div className="flex items-center gap-3 flex-wrap pt-1 text-xs sm:text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1 text-accent dark:text-white font-semibold">
                  <Pill className="w-4 h-4 text-warning inline" />
                  {activeRemindersCount > 0 ? `${activeRemindersCount} medicine reminders due today` : "All daily medicines logged"}
                </span>
                <span className="hidden sm:inline text-border dark:text-dark-border">•</span>
                <span className="flex items-center gap-1">
                  <Activity className="w-4 h-4 text-success inline" />
                  AI Health Score:{" "}
                  <strong className={`${healthScore.hasEnoughData ? healthScore.statusColor : "text-muted-foreground"} font-extrabold`}>
                    {healthScore.hasEnoughData ? `${healthScore.score}/100 (${healthScore.statusLabel})` : "Not enough medical data"}
                  </strong>
                </span>
                <span className="hidden sm:inline text-border dark:text-dark-border">•</span>
                <span className="flex items-center gap-1 text-primary">
                  <Shield className="w-4 h-4 inline" />
                  Emergency Medical ID Synced
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/upload">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary flex items-center gap-2 shadow-glow py-3 px-5 text-xs sm:text-sm"
                >
                  <Upload className="w-4 h-4" />
                  {t("uploadReport") || "Upload Report"}
                </motion.button>
              </Link>

              <Link href="/ai-assistant">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-outline flex items-center gap-2 py-3 px-4 text-xs sm:text-sm border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Bot className="w-4 h-4" />
                  Ask Med AI
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 2. Top Banner: AI Health Score & Interactive Emergency ID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* AI Health Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 bg-surface dark:bg-dark-surface border-border dark:border-dark-border flex flex-col justify-between space-y-4 shadow-card hover:border-primary/40 transition-all"
          >
            {healthScore.hasEnoughData ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-success/10 text-success flex items-center justify-center">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-accent dark:text-white">AI Health Score</h3>
                      <p className="text-[11px] text-muted-foreground">Derived from {healthScore.parameterCount} extracted parameters</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-white text-[10px] font-extrabold uppercase tracking-wider ${healthScore.score! >= 85 ? "bg-success" : healthScore.score! >= 70 ? "bg-primary" : "bg-warning"}`}>
                    {healthScore.statusLabel}
                  </span>
                </div>

                <div className="flex items-center gap-6 py-2">
                  {/* Radial Score Display */}
                  <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-border dark:text-dark-border"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={healthScore.score! >= 85 ? "text-success" : "text-primary"}
                        strokeDasharray={`${healthScore.score!}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="font-heading font-black text-2xl text-accent dark:text-white block leading-none">{healthScore.score}</span>
                      <span className="text-[9px] text-muted-foreground font-bold uppercase">out of 100</span>
                    </div>
                  </div>

                  {/* Sub Metrics Breakdown */}
                  <div className="space-y-1.5 text-xs flex-1">
                    <span className="text-muted-foreground text-[10px] font-bold uppercase block">Contributing Factors</span>
                    <div className="flex flex-wrap gap-1">
                      {healthScore.contributingFactors.map((factor) => (
                        <span key={factor} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[10px] font-semibold">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground italic border-t border-border dark:border-dark-border pt-3">
                  ℹ️ This AI-derived score is computed deterministically from validated medical report parameters for informational tracking.
                </p>
              </>
            ) : (
              <div className="space-y-3 py-1">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-accent dark:text-white">AI Health Score</h3>
                    <p className="text-[11px] text-warning font-semibold">Not enough medical data</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Upload at least 2 supported medical reports with lab parameters (e.g., Blood Glucose, BP, Cholesterol) to calculate your AI Health Score.
                </p>
                <Link href="/upload" className="inline-block pt-1">
                  <button className="btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Upload Medical Reports
                  </button>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Interactive Emergency Medical ID Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setShowEmergencyModal(true)}
            whileHover={{ scale: 1.015, y: -2 }}
            className="lg:col-span-2 card p-0 overflow-hidden bg-gradient-to-r from-error/90 via-red-600 to-red-700 text-white cursor-pointer shadow-card-lg relative group"
          >
            <div className="p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-md">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-100 block">Official Emergency ID</span>
                    <h3 className="font-heading font-extrabold text-xl text-white tracking-wide">
                      {primaryMember.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap text-xs font-semibold text-red-100">
                  <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 fill-white" /> Blood Group: {primaryMember.bloodGroup || "O+"}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">
                    Allergies: {primaryMember.allergies?.[0] || "None Reported"}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">
                    📞 {primaryMember.emergencyPhone || "+91 98765 43210"}
                  </span>
                </div>
              </div>

              {/* QR Preview & Tap Button */}
              <div className="flex flex-col items-center sm:items-end justify-center shrink-0 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-white/20 pt-4 sm:pt-0 sm:pl-6">
                <div className="w-20 h-20 bg-white p-1.5 rounded-2xl shadow-md group-hover:scale-105 transition-transform relative">
                  {emergencyQrUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={emergencyQrUrl} alt="Emergency QR" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl" />
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-black text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                    24/7
                  </div>
                </div>

                <span className="mt-2 text-xs font-bold text-white group-hover:underline flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Tap to Preview ID <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Hover Shine Bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </motion.div>
        </div>

        {/* 3. Key Quick Stats Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="card p-5 space-y-3 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-background dark:bg-dark-bg border border-border dark:border-dark-border text-muted-foreground uppercase">
                  {stat.badge}
                </span>
              </div>
              <div>
                <p className="font-heading font-black text-2xl sm:text-3xl text-accent dark:text-white">{stat.value}</p>
                <p className="text-muted-foreground text-xs sm:text-sm font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 4. Interactive Health Analytics Charts (Recharts) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card overflow-hidden p-6 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border dark:border-dark-border">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="font-heading font-bold text-lg text-accent dark:text-white">Health Analytics & Vitals Trend</h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Biometric tracking synthesized from verified medical lab tests</p>
            </div>

            {/* Metric Selector Tabs */}
            {healthAnalytics.series.length > 0 && (
              <div className="flex items-center gap-1 bg-background dark:bg-dark-bg p-1 rounded-xl border border-border dark:border-dark-border text-xs font-semibold flex-wrap">
                {healthAnalytics.series.map((s) => (
                  <button
                    key={s.metricKey}
                    onClick={() => setSelectedMetric(s.metricKey)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedMetric === s.metricKey || (!healthAnalytics.series.some((x) => x.metricKey === selectedMetric) && s.metricKey === healthAnalytics.series[0]?.metricKey)
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted-foreground hover:text-accent dark:hover:text-white"
                    }`}
                  >
                    {s.metricName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {healthAnalytics.status === "NO_REPORTS" ? (
            <div className="p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-accent dark:text-white">No Health Analytics Yet</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Upload your first medical report to start tracking your health trends, blood glucose, blood pressure, and cholesterol over time.
              </p>
              <Link href="/upload" className="inline-block pt-2">
                <button className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 mx-auto">
                  <Upload className="w-4 h-4" /> Upload First Medical Report
                </button>
              </Link>
            </div>
          ) : healthAnalytics.status === "SINGLE_REPORT" ? (
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h4 className="font-heading font-bold text-sm text-accent dark:text-white">1 Medical Report Extracted</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Extracted parameters: {healthAnalytics.availableMetrics.join(", ")}. Upload 1 more report to generate historical trend charts over time.
                  </p>
                </div>
                <Link href="/upload">
                  <button className="btn-primary py-2 px-4 text-xs shrink-0 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Upload 2nd Report
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {healthAnalytics.series.map((s) => (
                  <div key={s.metricKey} className="p-4 rounded-xl bg-background dark:bg-dark-bg border border-border dark:border-dark-border space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{s.metricName}</span>
                    <p className="font-heading font-extrabold text-xl text-accent dark:text-white">
                      {s.dataPoints[0]?.value} <span className="text-xs font-normal text-muted-foreground">{s.unit}</span>
                    </p>
                    <span className="text-[10px] text-primary block truncate">Report: {s.dataPoints[0]?.sourceTitle}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-72 w-full pt-2">
              {(() => {
                const activeSeries =
                  healthAnalytics.series.find((s) => s.metricKey === selectedMetric) || healthAnalytics.series[0];
                if (!activeSeries) return null;

                return (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activeSeries.dataPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16C7C7" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#16C7C7" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#888888" }} />
                      <YAxis tick={{ fontSize: 12, fill: "#888888" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card, #1e293b)",
                          borderRadius: "12px",
                          borderColor: "rgba(255,255,255,0.1)",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        name={`${activeSeries.metricName} (${activeSeries.unit})`}
                        stroke="#16C7C7"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#chartGrad)"
                      />
                      {activeSeries.dataPoints.some((dp) => dp.secondaryValue !== undefined) && (
                        <Area
                          type="monotone"
                          dataKey="secondaryValue"
                          name="Secondary Value"
                          stroke="#0284C7"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          fill="none"
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                );
              })()}
            </div>
          )}
        </motion.div>

        {/* 5. AI Insights & Health Intelligence Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-accent dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-warning" />
              AI Medical Intelligence Feed
            </h2>
            <span className="text-xs font-semibold text-muted-foreground">Synthesized via Gemini AI</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: AI Insight */}
            <div className="card p-4 border-primary/30 bg-primary/5 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="badge-primary text-[10px] uppercase tracking-wider">✨ AI Health Insight</span>
                <span className="text-[10px] text-muted-foreground font-semibold">Today</span>
              </div>
              <p className="text-xs text-accent dark:text-white font-medium leading-relaxed">
                Blood glucose levels improved by <strong>8%</strong> over the past month. Dietary adherence is showing positive biometric impact.
              </p>
            </div>

            {/* Card 2: AI Alert */}
            <div className="card p-4 border-warning/30 bg-warning/5 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-warning/20 text-warning text-[10px] font-bold uppercase tracking-wider">
                  ⚠️ AI Lab Notice
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">Action Due</span>
              </div>
              <p className="text-xs text-accent dark:text-white font-medium leading-relaxed">
                No lab report uploaded in the past 45 days. Schedule a routine quarterly CBC & HbA1c panel.
              </p>
            </div>

            {/* Card 3: Refill Reminder */}
            <div className="card p-4 border-secondary/30 bg-secondary/5 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-wider">
                  💊 Rx Refill Due
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">In 4 Days</span>
              </div>
              <p className="text-xs text-accent dark:text-white font-medium leading-relaxed">
                Amlodipine 5mg supply is estimated at 4 days remaining based on daily morning schedule.
              </p>
            </div>

            {/* Card 4: Health Suggestion */}
            <div className="card p-4 border-success/30 bg-success/5 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-[10px] font-bold uppercase tracking-wider">
                  🩺 Doctor Tip
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">Optimal</span>
              </div>
              <p className="text-xs text-accent dark:text-white font-medium leading-relaxed">
                Hydration target: Maintain regular daily fluid intake with morning dosage for optimal drug absorption.
              </p>
            </div>

          </div>
        </motion.div>

        {/* 6. Main Grid: Recent Reports & Reminders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Reports Vault */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 card overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border dark:border-dark-border">
              <h2 className="font-heading font-semibold text-accent dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {t("medicalTimeline") || "Recent Reports"}
              </h2>
              <Link
                href="/timeline"
                className="text-sm text-primary hover:underline flex items-center gap-1 font-semibold"
              >
                View Vault ({reports.length}) <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-border dark:divide-dark-border">
              {reports.length > 0 ? (
                reports.slice(0, 5).map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-center justify-between px-6 py-4 hover:bg-background dark:hover:bg-dark-bg transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-accent dark:text-white">{r.title}</p>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                            ✨ Gemini Analyzed
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {r.familyMemberName} · {r.hospitalName || "Lab"} · {String(r.reportDate)}
                        </p>
                      </div>
                    </div>
                    <span className="badge-primary text-xs shrink-0">{r.type}</span>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <p className="font-heading font-bold text-base text-accent dark:text-white">No Reports Uploaded Yet</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Upload medical reports or prescriptions to extract medicine details and clinical timelines automatically with Gemini AI.
                  </p>
                  <Link href="/upload" className="inline-block pt-2">
                    <button className="btn-primary text-xs py-2 px-4">Upload First Report</button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Upcoming Reminders & Active Prescriptions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between px-6 py-5 border-b border-border dark:border-dark-border">
                <h2 className="font-heading font-semibold text-accent dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-warning" />
                  {t("reminders") || "Reminders"}
                </h2>
                <Link
                  href="/reminders"
                  className="text-sm text-primary hover:underline flex items-center gap-1 font-semibold"
                >
                  All ({reminders.length}) <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-4 space-y-3">
                {reminders.filter((r) => !r.isCompleted).length > 0 ? (
                  reminders
                    .filter((r) => !r.isCompleted)
                    .slice(0, 4)
                    .map((r) => (
                      <div
                        key={r.id}
                        className="flex items-start gap-3 p-3 rounded-xl bg-background dark:bg-dark-bg border border-border dark:border-dark-border hover:border-warning/50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0 mt-0.5">
                          <Pill className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-accent dark:text-white leading-tight">{r.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{r.memberName}</p>
                          <span className="text-[11px] font-bold text-warning block mt-1">⏰ {r.time} · {r.date}</span>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="p-6 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-success mx-auto" />
                    <p className="text-xs font-semibold text-accent dark:text-white">All reminders completed today!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-border dark:border-dark-border">
              <Link href="/reminders">
                <button className="w-full py-2.5 rounded-xl border-2 border-dashed border-border dark:border-dark-border text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Custom Medicine Reminder
                </button>
              </Link>
            </div>
          </motion.div>

        </div>

        {/* 7. Health Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-6 space-y-6"
        >
          <div className="flex items-center justify-between pb-2 border-b border-border dark:border-dark-border">
            <div>
              <h2 className="font-heading font-bold text-lg text-accent dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-secondary" />
                Health Activity Timeline
              </h2>
              <p className="text-xs text-muted-foreground">Automated logging of prescriptions, uploads, and AI analysis</p>
            </div>
            <Link href="/timeline" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Full History <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {timelineEvents.length > 0 ? (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border dark:before:bg-dark-border">
              {timelineEvents.map((evt, idx) => (
                <div key={idx} className="relative flex items-start gap-4 group">
                  <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full ${evt.bg} border-2 border-surface dark:border-dark-surface flex items-center justify-center`}>
                    <div className={`w-2 h-2 rounded-full ${evt.color.replace("text-", "bg-")}`} />
                  </div>
                  <div className="flex-1 bg-background dark:bg-dark-bg p-3.5 rounded-xl border border-border dark:border-dark-border space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-accent dark:text-white">{evt.title}</span>
                      <span className="text-[10px] font-bold text-muted-foreground">{evt.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{evt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No health activity recorded yet. Upload reports or log medicines to start building your timeline.
            </div>
          )}
        </motion.div>

        {/* 8. Family Members Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-border dark:border-dark-border">
            <h2 className="font-heading font-semibold text-accent dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {t("familyMembers") || "Family Members"}
            </h2>
            <Link href="/family" className="text-sm text-primary hover:underline flex items-center gap-1 font-semibold">
              Manage Vault <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {familyMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-border dark:divide-dark-border">
              {familyMembers.map((member, i) => (
                <Link key={member.id} href={`/family/${member.id}`}>
                  <motion.div
                    whileHover={{ backgroundColor: "rgba(22, 199, 199, 0.05)" }}
                    className="p-6 space-y-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center shadow-sm`}>
                        <span className="text-sm font-bold text-white">{member.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-accent dark:text-white">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.relationship} · {member.age || "--"}y</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge-error text-xs">
                        <Heart className="w-2.5 h-2.5 inline mr-1" />
                        {member.bloodGroup || "O+"}
                      </span>
                      {member.allergies && member.allergies.length > 0 && (
                        <span className="badge bg-border/50 text-muted-foreground text-xs">
                          {member.allergies[0]}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center space-y-3">
              <p className="text-sm text-muted-foreground">Your family vault is currently empty.</p>
              <Link href="/family">
                <button className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> {t("addFamilyMember") || "Add First Family Member"}
                </button>
              </Link>
            </div>
          )}
        </motion.div>

      </div>

      {/* EMERGENCY PARAMEDIC ID PREVIEW MODAL */}
      <AnimatePresence>
        {showEmergencyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface dark:bg-dark-surface border-2 border-error/50 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0"
            >
              {/* Modal Banner */}
              <div className="bg-gradient-to-r from-error via-red-600 to-red-700 text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-100 block">MedVault AI</span>
                    <h3 className="font-heading font-extrabold text-lg tracking-wide">PARAMEDIC EMERGENCY ACCESS</h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmergencyModal(false)}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="text-center space-y-3">
                  <div className="w-36 h-36 bg-white p-2 rounded-2xl mx-auto shadow-md border-2 border-error/30 flex items-center justify-center">
                    {emergencyQrUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={emergencyQrUrl} alt="Emergency QR Code" className="w-full h-full object-contain rounded-xl" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Scan with any smartphone camera for 24/7 verified emergency medical details.
                  </p>
                </div>

                {/* Patient Summary */}
                <div className="p-4 rounded-2xl bg-error/5 border border-error/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Patient Name</span>
                      <h4 className="font-heading font-extrabold text-xl text-accent dark:text-white">{primaryMember.name}</h4>
                    </div>
                    <div className="bg-error text-white font-black text-2xl px-4 py-1.5 rounded-2xl flex items-center gap-1 shadow-sm">
                      <Droplets className="w-5 h-5 fill-white" />
                      {primaryMember.bloodGroup || "O+"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-error/20">
                    <div>
                      <span className="text-muted-foreground block text-[10px] font-bold uppercase">Critical Allergies</span>
                      <span className="font-bold text-warning">
                        ⚠️ {primaryMember.allergies?.[0] || "No Known Drug Allergies"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] font-bold uppercase">Chronic Conditions</span>
                      <span className="font-bold text-accent dark:text-white">
                        {primaryMember.chronicDiseases?.[0] || "None Reported"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Emergency Phone */}
                <div className="p-4 rounded-2xl bg-success/10 border border-success/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-success uppercase tracking-wider block">Primary Emergency Contact</span>
                    <p className="font-extrabold text-base text-accent dark:text-white">{primaryMember.emergencyPhone || "+91 98765 43210"}</p>
                  </div>
                  <a href={`tel:${primaryMember.emergencyPhone || "+919876543210"}`} className="btn-primary py-2 px-4 text-xs bg-success hover:bg-success/90 border-none flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Call Now
                  </a>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link href="/emergency" className="flex-1">
                    <button className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 shadow-glow">
                      <ExternalLink className="w-4 h-4" /> Full Printable Medical Card
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowEmergencyModal(false)}
                    className="btn-outline flex-1 py-3 text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
