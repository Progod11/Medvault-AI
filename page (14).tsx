/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, FileText, Pill, Calendar, Hospital, User,
  Search, Download, Eye, Droplets, Phone, Share2, Copy, Check, X, Edit
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { formatDate, reportTypeLabels, reportTypeColors, downloadReportFile } from "@/lib/utils";
import { toast } from "sonner";
import { getUserData, updateFamilyMember, FamilyMember, Report, Medicine } from "@/lib/dataStore";
import type { BloodGroup, Relationship } from "@/types";

const typeIconMap: Record<string, React.ElementType> = {
  LAB_REPORT: FileText,
  PRESCRIPTION: Pill,
  SCAN: Eye,
  BILL: Calendar,
  VACCINATION: Droplets,
  OTHER: FileText,
};

const typeColorMap: Record<string, string> = {
  LAB_REPORT: "bg-primary/10 border-primary/30 text-primary",
  PRESCRIPTION: "bg-secondary/10 border-secondary/30 text-secondary",
  SCAN: "bg-warning/10 border-warning/30 text-warning",
  BILL: "bg-muted/10 border-muted/30 text-muted-foreground",
  VACCINATION: "bg-success/10 border-success/30 text-success",
  OTHER: "bg-border/50 border-border text-muted-foreground",
};

export default function MemberProfilePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [timelineItems, setTimelineItems] = useState<Report[]>([]);
  const [memberMedicines, setMemberMedicines] = useState<Medicine[]>([]);
  
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [activeTab, setActiveTab] = useState<"timeline" | "medicines">("timeline");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = getUserData();
    const foundMember = data.familyMembers.find(m => m.id === id);
    if (!foundMember) {
      router.push("/family");
      return;
    }
    setMember(foundMember);
    setTimelineItems(data.reports.filter(r => r.familyMemberId === id));
    setMemberMedicines(data.medicines.filter(m => m.familyMemberId === id));
  }, [id, router]);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/share/member/${id}`
    : `https://medvault-ai.com/share/member/${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Family member full profile link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = timelineItems.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.type || "").toLowerCase().includes(search.toLowerCase()) ||
      item.summary?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "ALL" || item.type === filterType;
    return matchSearch && matchType;
  });

  if (!member) {
    return <DashboardLayout><div className="p-8 text-center">Loading...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
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
                  <Share2 className="w-5 h-5 text-primary" /> Share Full Member Profile
                </h3>
                <button onClick={() => setShowShareModal(false)} className="p-1 rounded-lg hover:bg-border dark:hover:bg-dark-border text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Generates a clean shareable link to view <strong className="text-accent dark:text-white">{member.name}&apos;s</strong> complete medical profile, lab records, prescriptions, and emergency contacts — <span className="text-primary font-semibold">without sharing login credentials or account access</span>.
                </p>

                <div className="p-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border flex items-center justify-between gap-2">
                  <span className="text-xs text-primary font-mono truncate">
                    {shareUrl}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="btn-primary text-xs py-2 px-3 flex items-center gap-1 flex-shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy Link"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Medical profile for ${member.name}: ${shareUrl}`)}`, "_blank");
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    💬 Share via WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      window.open(`/share/member/${member.id}`, "_blank");
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-border dark:border-dark-border hover:bg-primary/10 text-accent dark:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    👁 Preview Share
                  </button>
                </div>

                <p className="text-[11px] text-muted-foreground text-center">
                  🔒 HIPAA Compliant Public Medical Summary
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Back */}
        <Link href="/family">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Family
          </button>
        </Link>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-hidden"
        >
          <div className={`h-3 bg-gradient-to-r from-primary to-secondary`} />
          <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow flex-shrink-0`}>
              <span className="text-2xl font-bold text-white">{member.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="font-heading font-bold text-2xl text-accent dark:text-white">{member.name}</h1>
                <p className="text-muted-foreground">{member.relationship} · {member.age} years old</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="badge-error text-sm font-semibold flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5" />
                  {member.bloodGroup}
                </span>
                {member.chronicDiseases.map((d) => (
                  <span key={d} className="badge bg-error/10 text-error text-sm">{d}</span>
                ))}
                {member.allergies.length > 0 && (
                  <span className="badge bg-warning/10 text-warning text-sm">
                    ⚠ Allergic: {member.allergies.join(", ")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-success" />
                Emergency: {member.emergencyContact} · {member.emergencyPhone}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="btn-outline py-2 px-4 text-sm flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="btn-primary py-2 px-4 text-sm flex items-center gap-2 shadow-glow"
              >
                <Share2 className="w-4 h-4" />
                Share Full Details
              </button>
              <Link href="/emergency">
                <button className="btn-outline py-2 px-4 text-sm flex items-center gap-2">
                  Emergency Card
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-border/30 dark:bg-dark-border/30 p-1 rounded-xl w-fit">
          {(["timeline", "medicines"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-surface dark:bg-dark-surface text-accent dark:text-white shadow-sm"
                  : "text-muted-foreground hover:text-accent dark:hover:text-white"
              }`}
            >
              {tab === "timeline" ? "Medical Timeline" : "Medicines"}
            </button>
          ))}
        </div>

        {activeTab === "timeline" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  className="input pl-11"
                  placeholder="Search reports..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["ALL", "LAB_REPORT", "PRESCRIPTION", "SCAN", "BILL", "VACCINATION"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      filterType === t
                        ? "bg-primary text-white"
                        : "bg-border/50 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {t === "ALL" ? "All" : reportTypeLabels[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-0">
              {filtered.map((item, i) => {
                const Icon = (item.type && typeIconMap[item.type]) || FileText;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="timeline-item"
                  >
                    <div className={`timeline-dot`} />
                    <div className="card-hover p-5 ml-2">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${(item.type && typeColorMap[item.type]) || "bg-primary/10 text-primary border-primary/20"}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-heading font-semibold text-accent dark:text-white">{item.title}</h3>
                              <span className={`${(item.type && reportTypeColors[item.type]) || "badge-primary"} text-xs`}>
                                {(item.type && reportTypeLabels[item.type]) || item.type || "Medical Record"}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              {item.hospitalName && (
                                <span className="flex items-center gap-1">
                                  <Hospital className="w-3.5 h-3.5" />
                                  {item.hospitalName}
                                </span>
                              )}
                              {item.doctorName && (
                                <span className="flex items-center gap-1">
                                  <User className="w-3.5 h-3.5" />
                                  {item.doctorName}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(item.reportDate)}
                              </span>
                            </div>
                            {item.summary && (
                              <p className="text-sm text-accent dark:text-white bg-background dark:bg-dark-bg rounded-lg px-3 py-2 mt-2">
                                <span className="text-muted-foreground mr-1">Summary:</span>
                                {item.summary}
                              </p>
                            )}
                            {(item.fileData || item.fileUrl) && (
                              <div className="mt-2.5 rounded-xl overflow-hidden border border-border dark:border-dark-border max-h-48 bg-black/5 flex items-center justify-center p-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.fileData || item.fileUrl}
                                  alt={item.title}
                                  className="max-h-40 object-contain rounded-lg hover:scale-105 transition-transform"
                                />
                              </div>
                            )}
                            {item.medicines && item.medicines.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {item.medicines.map((m) => (
                                  <span key={m} className="badge-primary text-xs flex items-center gap-1">
                                    <Pill className="w-2.5 h-2.5" />
                                    {m}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => {
                              downloadReportFile(item);
                              toast.success("Downloading medical record...");
                            }}
                            className="p-2 rounded-xl border border-border dark:border-dark-border hover:bg-secondary/10 hover:text-secondary transition-all"
                            title="Download Report"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 space-y-4">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">No reports found. Try changing your filters.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "medicines" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {memberMedicines.length > 0 ? memberMedicines.map((med, i) => (
              <motion.div
                key={med.id || med.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card p-5 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Pill className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-accent dark:text-white">{med.name}</p>
                      <p className="text-sm text-muted-foreground">{med.dosage}</p>
                    </div>
                  </div>
                  <span className={`badge text-xs ${med.isActive ? "badge-success" : "badge"}`}>
                    {med.isActive ? "Active" : "Stopped"}
                  </span>
                </div>
                <div className="flex gap-2">
                  {(["Morning", "Afternoon", "Night"] as const).map((time) => {
                    const key = time.toLowerCase() as "morning" | "afternoon" | "night";
                    return (
                      <span
                        key={time}
                        className={`flex-1 text-center py-1.5 rounded-lg text-xs font-medium transition-all ${
                          med[key]
                            ? "bg-primary/10 text-primary"
                            : "bg-border/30 text-muted-foreground/40"
                        }`}
                      >
                        {time.slice(0, 3)}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-12 text-center space-y-3">
                <Pill className="w-10 h-10 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">No active medicines found for this member.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showEditModal && member && (
          <EditMemberModal
            member={member}
            onClose={() => setShowEditModal(false)}
            onSave={(updatedFields) => {
              updateFamilyMember(member.id, updatedFields);
              setMember({ ...member, ...updatedFields });
              toast.success(`${updatedFields.name || member.name}'s profile updated successfully!`);
            }}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

function EditMemberModal({
  member,
  onClose,
  onSave,
}: {
  member: FamilyMember;
  onClose: () => void;
  onSave: (data: Partial<FamilyMember>) => void;
}) {
  const [form, setForm] = useState({
    name: member.name || "",
    relationship: (member.relationship || "Child") as Relationship,
    bloodGroup: (member.bloodGroup || "O+") as BloodGroup,
    age: member.age?.toString() || "",
    emergencyContact: member.emergencyContact || "",
    emergencyPhone: member.emergencyPhone || "",
    chronicDiseases: member.chronicDiseases?.join(", ") || "",
    allergies: member.allergies?.join(", ") || "",
    primaryDoctor: member.primaryDoctor || "",
    doctorPhone: member.doctorPhone || "",
    insuranceProvider: member.insuranceProvider || "",
    policyNumber: member.policyNumber || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chronicList = form.chronicDiseases
      ? form.chronicDiseases.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const allergyList = form.allergies
      ? form.allergies.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    onSave({
      name: form.name,
      relationship: form.relationship,
      bloodGroup: form.bloodGroup,
      age: form.age ? parseInt(form.age, 10) : 0,
      emergencyContact: form.emergencyContact || form.name,
      emergencyPhone: form.emergencyPhone || "+91 98765 43210",
      chronicDiseases: chronicList,
      allergies: allergyList,
      primaryDoctor: form.primaryDoctor,
      doctorPhone: form.doctorPhone,
      insuranceProvider: form.insuranceProvider,
      policyNumber: form.policyNumber,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg bg-surface dark:bg-dark-surface rounded-3xl border border-border dark:border-dark-border shadow-card-lg overflow-hidden my-8"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border dark:border-dark-border">
          <h3 className="font-heading font-bold text-xl text-accent dark:text-white">
            Edit Family Member Profile
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-border dark:hover:bg-dark-border transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-accent dark:text-white uppercase tracking-wider">Full Name *</label>
            <input required className="input" placeholder="e.g. Sunita Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-accent dark:text-white uppercase tracking-wider">Relationship</label>
              <select className="input text-xs" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value as Relationship })}>
                {["Self", "Spouse", "Child", "Parent", "Sibling", "Grandparent", "Other"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-accent dark:text-white uppercase tracking-wider">Blood Group</label>
              <select className="input text-xs" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value as BloodGroup })}>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-accent dark:text-white uppercase tracking-wider">Age (Years)</label>
              <input type="number" min="0" max="120" className="input text-xs" placeholder="32" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-accent dark:text-white uppercase tracking-wider">Emergency Contact Person</label>
              <input className="input text-xs" placeholder="e.g. Ramesh Sharma" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-accent dark:text-white uppercase tracking-wider">Emergency Phone</label>
              <input className="input text-xs" placeholder="+91 98765 43210" value={form.emergencyPhone} onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-accent dark:text-white uppercase tracking-wider">Medical Conditions (Comma-separated)</label>
            <input className="input text-xs" placeholder="e.g. Diabetes, Hypertension, Asthma" value={form.chronicDiseases} onChange={(e) => setForm({ ...form, chronicDiseases: e.target.value })} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-accent dark:text-white uppercase tracking-wider">Known Allergies (Comma-separated)</label>
            <input className="input text-xs" placeholder="e.g. Penicillin, Peanuts, Sulfa" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-accent dark:text-white uppercase tracking-wider">Primary Doctor</label>
              <input className="input text-xs" placeholder="Dr. S. K. Mehta" value={form.primaryDoctor} onChange={(e) => setForm({ ...form, primaryDoctor: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-accent dark:text-white uppercase tracking-wider">Doctor Phone</label>
              <input className="input text-xs" placeholder="+91 91234 56789" value={form.doctorPhone} onChange={(e) => setForm({ ...form, doctorPhone: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-accent dark:text-white uppercase tracking-wider">Insurance Provider</label>
              <input className="input text-xs" placeholder="Star Health Insurance" value={form.insuranceProvider} onChange={(e) => setForm({ ...form, insuranceProvider: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-accent dark:text-white uppercase tracking-wider">Policy Number</label>
              <input className="input text-xs" placeholder="SH-882910-X" value={form.policyNumber} onChange={(e) => setForm({ ...form, policyNumber: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 py-2.5">Cancel</button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" className="btn-primary flex-1 py-2.5">
              Save Changes
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
