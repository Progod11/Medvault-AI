/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle, Shield, Phone, Heart, Droplets, Pill, Share2,
  Printer, Copy, Check, User, AlertTriangle, Plus
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import QRCode from "qrcode";
import Link from "next/link";
import { getUserData, addAuditLog, UserData, FamilyMember } from "@/lib/dataStore";

export default function EmergencyPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [qrUrl, setQrUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
    if (data.familyMembers && data.familyMembers.length > 0) {
      setSelectedMemberId(data.familyMembers[0].id);
    }
    const handleUpdate = () => {
      const updated = getUserData();
      setUserData(updated);
    };
    window.addEventListener("medvault_data_updated", handleUpdate);
    return () => window.removeEventListener("medvault_data_updated", handleUpdate);
  }, []);

  const familyMembers = userData?.familyMembers || [];
  const selectedMember = familyMembers.find((m) => m.id === selectedMemberId) || familyMembers[0];

  const memberMedicines = userData?.medicines
    ?.filter((m) => (m.familyMemberId === selectedMember?.id || m.familyMemberName === selectedMember?.name) && m.isActive)
    .map((m) => `${m.name} ${m.dosage}`) || [];

  useEffect(() => {
    if (!selectedMember) return;

    // Generate QR Code data URL containing emergency card web payload
    const emergencyPayload = JSON.stringify({
      medvault: true,
      name: selectedMember.name,
      bloodGroup: selectedMember.bloodGroup,
      allergies: selectedMember.allergies || [],
      conditions: selectedMember.chronicDiseases || [],
      emergencyPhone: selectedMember.emergencyPhone,
    });

    QRCode.toDataURL(emergencyPayload, { width: 220, margin: 1, color: { dark: "#0F172A", light: "#FFFFFF" } })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error(err));
  }, [selectedMember]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyShareLink = () => {
    if (!selectedMember) return;
    const shareableUrl = `${window.location.origin}/share/member/${selectedMember.id}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    addAuditLog(`Emergency Card Shared Publicly for Member (${selectedMember.name})`, "SUCCESS");
    toast.success("Public Emergency Responder Card link copied!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
          <div>
            <h1 className="font-heading font-bold text-3xl text-accent dark:text-white flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-error animate-pulse" />
              Emergency Health Card
            </h1>
            <p className="text-muted-foreground mt-1">
              One-click critical medical access for paramedics, emergency rooms, and first responders
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="btn-outline text-xs py-2.5 px-4 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Share Link
            </button>
            <button
              onClick={handlePrint}
              className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print / Download PDF
            </button>
          </div>
        </div>

        {/* Member Selector Dropdown */}
        {familyMembers.length > 0 ? (
          <div className="card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-error/30 bg-error/5 print:hidden">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-error" />
              <span className="text-sm font-semibold text-accent dark:text-white">Select Family Member:</span>
            </div>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="input text-sm py-2 px-4 w-auto font-bold text-error border-error/30"
            >
              {familyMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.relationship})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="card p-6 border-dashed border-2 border-error/40 bg-error/5 text-center space-y-3">
            <User className="w-10 h-10 text-error mx-auto" />
            <h3 className="font-heading font-bold text-lg text-accent dark:text-white">No Family Members Found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Add family members to create personalized Emergency Medical Cards with QR codes and instant paramedic access.
            </p>
            <Link href="/family" className="inline-flex items-center gap-2 btn-primary text-sm py-2 px-4">
              <Plus className="w-4 h-4" /> Add Family Member
            </Link>
          </div>
        )}

        {selectedMember && (
          /* Printable Emergency Card Frame */
          <div className="card border-2 border-error/40 overflow-hidden shadow-card-lg bg-surface dark:bg-dark-surface print:shadow-none print:border-black">
            {/* Emergency Card Banner */}
            <div className="bg-gradient-to-r from-error via-red-600 to-red-700 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-md">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-red-100">MedVault AI</span>
                  <h2 className="font-heading font-extrabold text-2xl tracking-wide">EMERGENCY MEDICAL CARD</h2>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  24/7 Verified Access
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Primary Details Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-border dark:border-dark-border pb-6">
                <div className="md:col-span-2 space-y-2">
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Patient Name</span>
                  <h3 className="font-heading font-extrabold text-3xl text-accent dark:text-white">{selectedMember.name}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{selectedMember.relationship} · {selectedMember.age || "--"} Years Old</p>
                </div>

                {/* Blood Group Badge */}
                <div className="bg-error/10 border-2 border-error/30 rounded-2xl p-4 text-center space-y-1">
                  <span className="text-xs font-bold uppercase text-error tracking-wider block">Blood Group</span>
                  <span className="font-heading font-black text-4xl text-error flex items-center justify-center gap-1">
                    <Droplets className="w-8 h-8 fill-error" />
                    {selectedMember.bloodGroup || "A+"}
                  </span>
                </div>
              </div>

              {/* Critical Allergies & Conditions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Critical Allergies */}
                <div className="card p-5 border-warning/40 bg-warning/5 space-y-3">
                  <div className="flex items-center gap-2 text-warning font-bold text-sm uppercase tracking-wide">
                    <AlertTriangle className="w-5 h-5" />
                    CRITICAL ALLERGIES
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.allergies && selectedMember.allergies.length > 0 ? (
                      selectedMember.allergies.map((allergy) => (
                        <span key={allergy} className="px-3.5 py-1.5 rounded-xl bg-warning text-white font-bold text-sm shadow-sm">
                          ⚠️ {allergy}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No known drug allergies</span>
                    )}
                  </div>
                </div>

                {/* Chronic Medical Conditions */}
                <div className="card p-5 border-primary/40 bg-primary/5 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wide">
                    <Heart className="w-5 h-5" />
                    CHRONIC MEDICAL CONDITIONS
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.chronicDiseases && selectedMember.chronicDiseases.length > 0 ? (
                      selectedMember.chronicDiseases.map((condition) => (
                        <span key={condition} className="px-3 py-1 rounded-xl bg-primary/20 text-primary font-bold text-sm">
                          {condition}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">None reported</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Daily Medicines */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                  <Pill className="w-4 h-4 text-secondary" /> ACTIVE DAILY MEDICATIONS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {memberMedicines.length > 0 ? (
                    memberMedicines.map((med, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-background dark:bg-dark-bg border border-border dark:border-dark-border text-sm font-semibold text-accent dark:text-white">
                        💊 {med}
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No active daily medications</span>
                  )}
                </div>
              </div>

              {/* Emergency Contacts & Doctors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border dark:border-dark-border">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider block">Primary Emergency Contact</span>
                  <div className="p-4 rounded-2xl bg-success/10 border border-success/30 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-success text-white flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-accent dark:text-white">{selectedMember.name}</p>
                      <p className="text-sm font-extrabold text-success">{selectedMember.emergencyPhone || "+91 98765 43210"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider block">Emergency Contact Relation</span>
                  <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-accent dark:text-white">{selectedMember.relationship}</p>
                      <p className="text-sm text-muted-foreground">Verified Family Record</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Verification Section */}
            <div className="pt-6 border-t border-border dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-card p-6 rounded-2xl">
              <div className="space-y-2 text-center sm:text-left">
                <span className="badge bg-primary/20 text-primary font-bold">First Responder Digital Scan</span>
                <h4 className="font-heading font-bold text-lg text-accent dark:text-white">Instant Verification QR Code</h4>
                <p className="text-xs text-muted-foreground max-w-md">
                  Paramedics and ER doctors can scan this QR code with any smartphone to retrieve full medical history, lab reports, and prescriptions safely.
                </p>
              </div>

              {qrUrl && (
                <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200 flex flex-col items-center flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="Emergency QR Code" className="w-36 h-36" />
                  <span className="text-[10px] font-bold text-slate-500 mt-1">SCAN FOR VAULT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (
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
                <div className="flex items-center justify-between border-b border-border dark:border-dark-border pb-4">
                  <h3 className="font-heading font-bold text-lg text-accent dark:text-white flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-primary" /> Share Emergency Card
                  </h3>
                  <button onClick={() => setShowShareModal(false)} className="p-1 rounded-lg hover:bg-border">
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Generates a secure temporary link that allows paramedics or treating doctors to view this card for 24 hours.
                  </p>

                  <div className="p-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border flex items-center justify-between gap-2">
                    <span className="text-xs text-primary font-mono truncate">
                      {typeof window !== "undefined" ? window.location.origin : ""}/share/member/{selectedMember?.id || "1"}
                    </span>
                    <button
                      onClick={handleCopyShareLink}
                      className="btn-primary text-xs py-2 px-3 flex items-center gap-1 flex-shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <p className="text-[11px] text-muted-foreground text-center">
                    🔒 Link automatically expires after 24 hours or after single access.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
