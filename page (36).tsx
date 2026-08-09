"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Watch,
  Activity,
  Heart,
  Moon,
  Zap,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Battery,
  Flame,
  Footprints,
  Clock,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import {
  getUserData,
  toggleWearableConnection,
  addAuditLog,
  WearableDevice,
  HealthTelemetry,
} from "@/lib/dataStore";

export default function WearablesPage() {
  const [wearables, setWearables] = useState<WearableDevice[]>([]);
  const [telemetry, setTelemetry] = useState<HealthTelemetry>({
    steps: 8420,
    stepGoal: 10000,
    sleepHours: 7.5,
    sleepScore: 88,
    screenTimeMinutes: 195,
    heartRate: 68,
    caloriesBurned: 2150,
    activeMinutes: 45,
  });
  const [syncing, setSyncing] = useState(false);
  const [doctorConsent, setDoctorConsent] = useState(true);

  const loadData = () => {
    const data = getUserData();
    if (data.wearables && data.wearables.length > 0) {
      setWearables(data.wearables);
    }
    if (data.healthTelemetry) {
      setTelemetry(data.healthTelemetry);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    window.addEventListener("medvault_data_updated", loadData);
    return () => window.removeEventListener("medvault_data_updated", loadData);
  }, []);

  const handleToggleConnect = (id: string, name: string) => {
    toggleWearableConnection(id);
    loadData();
    toast.success(`Updated connection for ${name}`);
  };

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setTelemetry((prev) => ({
        ...prev,
        steps: Math.min(prev.stepGoal, prev.steps + Math.floor(Math.random() * 250) + 50),
        heartRate: 65 + Math.floor(Math.random() * 8),
        caloriesBurned: prev.caloriesBurned + 35,
      }));
      addAuditLog("Manual Health Telemetry Sync Triggered from Wearables", "SUCCESS");
      toast.success("Health telemetry synced successfully!");
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border dark:border-dark-border pb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center text-white shadow-glow">
                <Watch className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-accent dark:text-white">
                Smartwatch & Health Integration
              </h1>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                COMING SOON
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Connect your smartwatch and health monitors to continuously stream steps, sleep, heart rate, and vital metrics into your vault.
            </p>
          </div>

          <button
            onClick={handleSyncNow}
            disabled={syncing}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-glow self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing Live Data..." : "Sync Wearables Now"}
          </button>
        </div>

        {/* Coming Soon Feature Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-primary/10 to-indigo-500/10 border border-amber-500/30 space-y-4 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-xs font-bold uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5" /> Coming Soon - Version 2.0 Feature
              </div>
              <h3 className="text-xl font-heading font-bold text-accent dark:text-white">
                Automated Direct Hardware Sync & Continuous Vital Monitoring
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We are building direct native Bluetooth LE and Cloud API integrations for Apple HealthKit, Fitbit Cloud, Samsung Health, Garmin Connect, and Oura Ring. Automatic ECG arrhythmia detection, Continuous Glucose Monitoring (CGM), and oxygen saturation drop alerts will sync seamlessly to your doctor.
              </p>
            </div>
            <button
              onClick={() => {
                toast.success("🚀 You are registered for the Wearables V2.0 Beta Access Waitlist!");
                addAuditLog("Registered for Wearables Beta Waitlist", "SUCCESS");
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap self-start md:self-center"
            >
              Join Beta Waitlist
            </button>
          </div>
        </div>

        {/* Live Health Telemetry Dashboard */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-bold text-accent dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Live Health Telemetry & Vitals Stream
            </h2>
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Real-time Hardware Feed Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Steps */}
            <motion.div
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Daily Steps</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Footprints className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent dark:text-white">{telemetry.steps.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ {telemetry.stepGoal.toLocaleString()}</span></p>
                <div className="w-full bg-border dark:bg-dark-border rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((telemetry.steps / telemetry.stepGoal) * 100))}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{Math.round((telemetry.steps / telemetry.stepGoal) * 100)}% of daily goal reached</p>
            </motion.div>

            {/* Heart Rate */}
            <motion.div
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resting Heart Rate</span>
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center animate-pulse">
                  <Heart className="w-4 h-4 fill-rose-500" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent dark:text-white">{telemetry.heartRate} <span className="text-xs font-normal text-muted-foreground">BPM</span></p>
                <p className="text-xs text-muted-foreground mt-1">Normal Resting Range (60-100 BPM)</p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                  Optimal Rhythm
                </span>
                {telemetry.hrvMs && (
                  <span className="text-muted-foreground font-semibold">HRV: {telemetry.hrvMs} ms</span>
                )}
              </div>
            </motion.div>

            {/* Sleep */}
            <motion.div
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sleep Duration</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent dark:text-white">{telemetry.sleepHours} hrs <span className="text-xs font-normal text-muted-foreground">({telemetry.sleepScore}% Score)</span></p>
                <p className="text-xs text-muted-foreground mt-1">
                  Deep: {telemetry.deepSleepMinutes ? `${Math.floor(telemetry.deepSleepMinutes / 60)}h ${telemetry.deepSleepMinutes % 60}m` : "1h 52m"} · REM: {telemetry.remSleepMinutes ? `${Math.floor(telemetry.remSleepMinutes / 60)}h ${telemetry.remSleepMinutes % 60}m` : "1h 38m"}
                </p>
              </div>
              <span className="inline-block px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                Restful Sleep Cycle
              </span>
            </motion.div>

            {/* Calories & Active */}
            <motion.div
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Calories</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent dark:text-white">{telemetry.caloriesBurned} <span className="text-xs font-normal text-muted-foreground">kcal</span></p>
                <p className="text-xs text-muted-foreground mt-1">{telemetry.activeMinutes} Active Workout Minutes</p>
              </div>
              <span className="inline-block px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium">
                Burn Goal Active
              </span>
            </motion.div>
          </div>

          {/* Secondary Vitals Grid (SpO2, ECG Rhythm, CGM Stream, Stress) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* SpO2 Blood Oxygen */}
            <div className="p-4 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Blood Oxygen (SpO2)</span>
                <p className="font-heading font-extrabold text-lg text-accent dark:text-white">
                  {telemetry.spo2Percent || 99}% <span className="text-xs text-emerald-500 font-semibold">Normal</span>
                </p>
              </div>
            </div>

            {/* Cardiac ECG Rhythm */}
            <div className="p-4 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div className="truncate">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">ECG Cardiac Rhythm</span>
                <p className="font-heading font-bold text-xs text-accent dark:text-white truncate">
                  {telemetry.ecgStatus || "Normal Sinus Rhythm"}
                </p>
              </div>
            </div>

            {/* CGM Blood Glucose Stream */}
            <div className="p-4 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">CGM Glucose Stream</span>
                <p className="font-heading font-extrabold text-lg text-accent dark:text-white">
                  {telemetry.cgmGlucoseMgDl || 96} <span className="text-xs font-normal text-muted-foreground">mg/dL</span>
                </p>
              </div>
            </div>

            {/* Stress Level */}
            <div className="p-4 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <Battery className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Stress & Body Battery</span>
                <p className="font-heading font-extrabold text-lg text-emerald-500">
                  {telemetry.stressLevel || "Low"} <span className="text-xs font-normal text-muted-foreground">(Recovery State)</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wearables List */}
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-bold text-accent dark:text-white flex items-center gap-2">
            <Watch className="w-5 h-5 text-primary" />
            Connected Devices & Platform Monitors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wearables.map((device) => (
              <div
                key={device.id}
                className="p-5 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      device.connected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      <Watch className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-accent dark:text-white text-base">{device.name}</h3>
                        {device.model && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-semibold">
                            {device.model}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Synced: {device.lastSynced}
                        </span>
                        {device.connected && (
                          <span className="flex items-center gap-1 text-emerald-500 font-medium">
                            <Battery className="w-3 h-3" /> {device.batteryLevel}%
                          </span>
                        )}
                        {device.firmwareVersion && (
                          <span className="text-[10px] text-muted-foreground">Firmware: {device.firmwareVersion}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleConnect(device.id, device.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      device.connected
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                        : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                    }`}
                  >
                    {device.connected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Connected
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" /> Connect
                      </>
                    )}
                  </button>
                </div>

                {/* Active Hardware Sensors */}
                {device.activeSensors && device.activeSensors.length > 0 && (
                  <div className="pt-2 border-t border-border dark:border-dark-border flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">Sensors:</span>
                    {device.activeSensors.map((sensor) => (
                      <span key={sensor} className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-semibold border border-primary/10">
                        {sensor}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Sharing & Consent */}
        <div className="p-6 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-accent dark:text-white text-base">Doctor & Emergency Telemetry Consent</h3>
              <p className="text-xs text-muted-foreground">
                When enabled, your live smartwatch telemetry (heart rate alerts, step count, sleep consistency) will be included in your emergency card for medical responders.
              </p>
            </div>
            <button
              onClick={() => {
                setDoctorConsent(!doctorConsent);
                addAuditLog(`Wearable Consent ${!doctorConsent ? "Enabled" : "Disabled"}`, "SUCCESS");
                toast.info(`Doctor & Emergency consent ${!doctorConsent ? "enabled" : "disabled"}`);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                doctorConsent ? "bg-primary" : "bg-border dark:bg-dark-border"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  doctorConsent ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}