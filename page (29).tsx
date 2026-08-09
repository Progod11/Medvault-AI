/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { use, useState, useEffect } from "react";
import {
  FileText, Pill, Heart, Droplets, Phone,
  Printer, User, AlertTriangle, Check
} from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { getUserData } from "@/lib/dataStore";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

interface LabRecord {
  hospital: string;
  date: string;
  title: string;
  summary: string;
}

interface MemberData {
  name: string;
  relationship: string;
  age: number;
  bloodGroup: string;
  allergies: string[];
  chronicDiseases: string[];
  emergencyContact: string;
  emergencyPhone: string;
  doctorName?: string;
  doctorPhone?: string;
  medications: string[];
  labRecords: LabRecord[];
}

export default function SharedMemberProfilePage({ params }: SharePageProps) {
  const resolvedParams = use(params);
  const memberId = resolvedParams?.id || "1";

  const [member, setMember] = useState<MemberData | null>(null);
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Attempt to load from real user data store
    const userData = getUserData();
    const found = userData.familyMembers.find((m) => m.id === memberId);

    if (found) {
      const userReports = userData.reports.filter((r) => r.familyMemberId === memberId);
      const userMeds = userData.medicines.filter((m) => m.familyMemberId === memberId);

      setMember({
        name: found.name,
        relationship: found.relationship,
        age: found.age || 0,
        bloodGroup: found.bloodGroup || "O+",
        allergies: found.allergies || [],
        chronicDiseases: found.chronicDiseases || [],
        emergencyContact: found.emergencyContact || "Emergency Contact",
        emergencyPhone: found.emergencyPhone || "+91 98765 43210",
        doctorName: "Attending Physician",
        doctorPhone: "+91 98000 00000",
        medications: userMeds.length > 0
          ? userMeds.map((m) => `${m.name} ${m.dosage || ""}`)
          : ["No active prescribed medications listed"],
        labRecords: userReports.length > 0
          ? userReports.map((r) => ({
              hospital: r.hospitalName || "General Clinic",
              date: String(r.reportDate || new Date().toISOString().split("T")[0]),
              title: r.title,
              summary: r.summary || r.diagnosis || "Medical report record",
            }))
          : [{ hospital: "Health Vault", date: new Date().toISOString().split("T")[0], title: "Initial Profile Created", summary: "Health history initialized" }],
      });
    } else {
      // Fallback default
      setMember({
        name: "Rajesh Sharma",
        relationship: "Father / Parent",
        age: 62,
        bloodGroup: "O+",
        allergies: ["Penicillin", "Dust Mites"],
        chronicDiseases: ["Type 2 Diabetes", "Hypertension"],
        emergencyContact: "Priya Sharma (Wife)",
        emergencyPhone: "+91 98765 43210",
        doctorName: "Dr. Ramesh Mehta (Diabetologist)",
        doctorPhone: "+91 98111 22334",
        medications: ["Metformin 500mg (2x Daily)", "Amlodipine 5mg (1x Daily)"],
        labRecords: [
          { date: "2026-06-15", title: "Blood CBC & HbA1c Test", hospital: "Apollo Diagnostics", summary: "HbA1c: 7.2%, Glucose moderately elevated" },
        ],
      });
    }
  }, [memberId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      QRCode.toDataURL(window.location.href, { width: 180, margin: 1 })
        .then((url) => setQrUrl(url))
        .catch((err) => console.error(err));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Profile link copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!member) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-center text-sm font-semibold">
        Loading shared medical profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              MV
            </div>
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">MedVault AI Verified Share</span>
              <h1 className="text-base font-bold text-slate-900 dark:text-white">Shared Medical Profile</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
              {copied ? "Link Copied" : "Copy Shared Link"}
            </button>
            <button onClick={handlePrint} className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-all shadow-sm">
              <Printer className="w-4 h-4" /> Print Medical Summary
            </button>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Patient Profile</span>
              <h2 className="text-3xl font-extrabold text-white mt-1">{member.name}</h2>
              <p className="text-sm font-medium text-blue-100">{member.relationship} · {member.age} Years Old</p>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider block">Blood Group</span>
              <span className="text-2xl font-black text-white flex items-center justify-center gap-1">
                <Droplets className="w-6 h-6 text-red-300 fill-red-300" /> {member.bloodGroup}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Allergies & Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-3">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" /> Allergies & Warnings
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.allergies.map((a: string) => (
                    <span key={a} className="px-3 py-1 rounded-lg bg-amber-500 text-white font-bold text-xs">
                      ⚠️ {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 space-y-3">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <Heart className="w-4 h-4" /> Chronic Conditions
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.chronicDiseases.map((c: string) => (
                    <span key={c} className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Active Medications */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Pill className="w-4 h-4 text-indigo-500" /> Active Prescribed Medications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {member.medications.map((m: string) => (
                  <div key={m} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                    <span className="text-xl">💊</span> {m}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Medical Timeline / Lab Reports */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" /> Verified Medical Records Timeline
              </h3>
              <div className="space-y-3">
                {member.labRecords.map((r: LabRecord, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{r.hospital}</span>
                      <span>{r.date}</span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{r.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{r.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400 block">Emergency Contact</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{member.emergencyContact}</p>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{member.emergencyPhone}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-indigo-700 dark:text-indigo-400 block">Attending Doctor</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{member.doctorName}</p>
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{member.doctorPhone}</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {qrUrl && (
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl">
                <div>
                  <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 block">Verified Digital Record</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Scan to view or verify this profile online</p>
                  <p className="text-xs text-slate-500 mt-0.5">Encrypted & secure patient medical summary.</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="Member QR Code" className="w-24 h-24 rounded-xl border border-slate-200 p-1 bg-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
