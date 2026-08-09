"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pill, Plus, Search, ToggleLeft, ToggleRight, Trash2,
  X, AlertCircle, Brain, Clock,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import { useLanguage } from "@/components/providers/LanguageContext";
import {
  getUserData,
  getFamilyMembersWithSelf,
  addMedicine,
  deleteMedicine as removeMedicine,
  updateMedicine,
  Medicine,
  FamilyMember,
} from "@/lib/dataStore";

function MedicineCard({
  med,
  onToggleReminder,
  onDelete,
  onAiExplain,
}: {
  med: Medicine;
  onToggleReminder: (id: string) => void;
  onDelete: (id: string) => void;
  onAiExplain: (target: { name: string; dosage?: string }) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`card overflow-hidden ${!med.isActive ? "opacity-60" : ""}`}
    >
      <div className={`h-1.5 ${med.isActive ? "bg-gradient-primary" : "bg-border dark:bg-dark-border"}`} />
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${med.isActive ? "bg-primary/10" : "bg-border/50 dark:bg-dark-border/50"}`}>
              <Pill className={`w-5 h-5 ${med.isActive ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="font-heading font-bold text-accent dark:text-white">{med.name}</p>
              <p className="text-sm text-muted-foreground">{med.dosage} · {med.familyMemberName}</p>
            </div>
          </div>
          <span className={`badge text-xs ${med.isActive ? "badge-success" : "bg-border/50 dark:bg-dark-border/50 text-muted-foreground"}`}>
            {med.isActive ? "Active" : "Stopped"}
          </span>
        </div>

        {/* Timing pills */}
        <div className="grid grid-cols-3 gap-2">
          {(["Morning", "Afternoon", "Night"] as const).map((time) => {
            const key = time.toLowerCase() as "morning" | "afternoon" | "night";
            return (
              <div
                key={time}
                className={`flex flex-col items-center py-2 rounded-xl text-xs font-medium ${
                  med[key] ? "bg-primary/10 text-primary" : "bg-border/30 dark:bg-dark-border/30 text-muted-foreground/50"
                }`}
              >
                <Clock className="w-3.5 h-3.5 mb-1" />
                {time}
              </div>
            );
          })}
        </div>



        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border dark:border-dark-border">
          <button
            onClick={() => onToggleReminder(med.id)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {med.reminderOn ? (
              <ToggleRight className="w-5 h-5 text-primary" />
            ) : (
              <ToggleLeft className="w-5 h-5" />
            )}
            Reminder {med.reminderOn ? "On" : "Off"}
          </button>
          <div className="flex gap-1.5">
            <button
              onClick={() => onAiExplain(med)}
              className="p-2 rounded-lg hover:bg-secondary/10 hover:text-secondary transition-all"
              title="AI Explain"
            >
              <Brain className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(med.id)}
              className="p-2 rounded-lg hover:bg-error/10 hover:text-error transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AddMedicineModal({
  members,
  onClose,
  onAdd,
}: {
  members: FamilyMember[];
  onClose: () => void;
  onAdd: (m: Omit<Medicine, "id" | "isActive">) => void;
}) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    dosage: "500mg",
    member: members[0]?.name || "Self",
    morning: true,
    afternoon: false,
    night: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      familyMemberId: members.find(m => m.name === form.member)?.id || "",
      familyMemberName: form.member,
      name: form.name,
      dosage: form.dosage,
      morning: form.morning,
      afternoon: form.afternoon,
      night: form.night,
      reminderOn: true,
      startDate: new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  return (
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
        className="w-full max-w-md bg-surface dark:bg-dark-surface rounded-3xl border border-border dark:border-dark-border shadow-card-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border dark:border-dark-border">
          <h3 className="font-heading font-bold text-xl text-accent dark:text-white">{t("addMedicine") || "Add Medicine"}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-border dark:hover:bg-dark-border transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-accent dark:text-white">Medicine Name *</label>
            <input required className="input" placeholder="e.g., Metformin, Paracetamol" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-accent dark:text-white">Dosage</label>
              <input required className="input" placeholder="e.g. 500mg, 1 tablet" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-accent dark:text-white">Family Member</label>
              <select className="input" value={form.member} onChange={(e) => setForm({ ...form, member: e.target.value })}>
                {members.length > 0 ? (
                  members.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)
                ) : (
                  <option value="Self">Self</option>
                )}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-accent dark:text-white">Daily Timing</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-accent dark:text-white cursor-pointer">
                <input type="checkbox" checked={form.morning} onChange={(e) => setForm({ ...form, morning: e.target.checked })} />
                Morning
              </label>
              <label className="flex items-center gap-2 text-sm text-accent dark:text-white cursor-pointer">
                <input type="checkbox" checked={form.afternoon} onChange={(e) => setForm({ ...form, afternoon: e.target.checked })} />
                Afternoon
              </label>
              <label className="flex items-center gap-2 text-sm text-accent dark:text-white cursor-pointer">
                <input type="checkbox" checked={form.night} onChange={(e) => setForm({ ...form, night: e.target.checked })} />
                Night
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Save Medicine</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function AiExplanationModal({ medicineName, dosage, onClose }: { medicineName: string; dosage?: string; onClose: () => void }) {
  const [data, setData] = useState<{ usage: string; sideEffects: string[]; precautions: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExplanation() {
      setLoading(true);
      try {
        const res = await fetch("/api/gemini/explain-medicine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ medicineName, dosage }),
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Explain error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchExplanation();
  }, [medicineName, dosage]);

  return (
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
        className="w-full max-w-lg bg-surface dark:bg-dark-surface rounded-3xl border border-border dark:border-dark-border shadow-card-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border dark:border-dark-border bg-gradient-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-accent dark:text-white">{medicineName} {dosage || ""}</h3>
              <p className="text-xs text-muted-foreground">Gemini AI Clinical Guide</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-border dark:hover:bg-dark-border transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-10 space-y-3">
              <Brain className="w-12 h-12 text-primary mx-auto animate-pulse" />
              <p className="text-sm font-semibold text-accent dark:text-white">Analyzing drug properties with Gemini AI...</p>
            </div>
          ) : data ? (
            <>
              <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 space-y-2">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">What it does & Primary Uses</p>
                <p className="text-sm text-accent dark:text-white leading-relaxed">{data.usage}</p>
              </div>

              {data.sideEffects && data.sideEffects.length > 0 && (
                <div className="rounded-xl bg-warning/10 border border-warning/20 p-4 space-y-3">
                  <p className="text-xs font-semibold text-warning uppercase tracking-wide">Possible Side Effects</p>
                  <ul className="space-y-1.5">
                    {data.sideEffects.map((s, idx) => (
                      <li key={idx} className="text-sm text-accent dark:text-white flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.precautions && (
                <div className="rounded-xl bg-secondary/10 border border-secondary/20 p-4 space-y-2">
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wide">Precautions & Warnings</p>
                  <p className="text-sm text-accent dark:text-white leading-relaxed">{data.precautions}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-sm text-muted-foreground">Unable to load information for {medicineName}.</p>
          )}

          <div className="flex items-start gap-2 p-3 rounded-xl bg-error/10 border border-error/20">
            <AlertCircle className="w-4 h-4 text-error mt-0.5 flex-shrink-0" />
            <p className="text-xs text-error">
              This information is AI-generated for educational purposes only. Always verify with a certified physician or pharmacist.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MedicinesPage() {
  const { t } = useLanguage();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [search, setSearch] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [showActive, setShowActive] = useState(true);
  const [aiMedicine, setAiMedicine] = useState<{ name: string; dosage?: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadData = useCallback(() => {
    const data = getUserData();
    setMedicines(data.medicines || []);
    setFamilyMembers(getFamilyMembersWithSelf());
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("medvault_data_updated", handleUpdate);
    return () => window.removeEventListener("medvault_data_updated", handleUpdate);
  }, [loadData]);

  const filtered = medicines.filter((m) => {
    const searchTarget = search.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(searchTarget) || (m.familyMemberName || "").toLowerCase().includes(searchTarget);
    const matchActive = showActive ? m.isActive : !m.isActive;
    return matchSearch && matchActive;
  });

  const activeMeds = medicines.filter((m) => m.isActive);
  const expiredMeds = medicines.filter((m) => !m.isActive);

  const handleToggleReminder = (id: string) => {
    const med = medicines.find(m => m.id === id);
    if (med) {
      const nextState = !med.reminderOn;
      updateMedicine(id, { reminderOn: nextState });
      if (nextState) {
        toast.success(`Reminders turned ON for ${med.name}`);
      } else {
        toast.info(`Reminders turned OFF for ${med.name}`);
      }
      loadData();
    }
  };

  const handleDeleteMedicine = (id: string) => {
    removeMedicine(id);
    loadData();
    toast.success("Medicine removed");
  };

  const handleAddMedicine = (newMed: Omit<Medicine, "id" | "isActive">) => {
    addMedicine({ ...newMed, isActive: true });
    loadData();
    toast.success(`${newMed.name} added to medicine vault!`);
  };

  const handleAiSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiMedicine({ name: aiQuery.trim() });
  };

  return (
    <DashboardLayout>
      <AnimatePresence>
        {aiMedicine && (
          <AiExplanationModal
            medicineName={aiMedicine.name}
            dosage={aiMedicine.dosage}
            onClose={() => setAiMedicine(null)}
          />
        )}
        {showAddModal && (
          <AddMedicineModal
            members={familyMembers}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddMedicine}
          />
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-accent dark:text-white flex items-center gap-2">
              <Pill className="w-8 h-8 text-primary" />
              {t("medicineVault") || "Medicine Vault"} & AI Search
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeMeds.length} active · {expiredMeds.length} discontinued · Search any drug for AI insights
            </p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {t("addMedicine") || "Add Medicine"}
          </button>
        </div>

        {/* AI Medicine Search Box */}
        <div className="card p-5 bg-gradient-card border border-primary/20 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-accent dark:text-white">AI Drug Information Search</h2>
              <p className="text-xs text-muted-foreground">Search any prescription or OTC drug for uses, dosage, side effects & precautions</p>
            </div>
          </div>
          <form onSubmit={handleAiSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Type drug name (e.g., Paracetamol, Metformin, Amoxicillin, Cetirizine)..."
                className="input pl-10 pr-4 py-2.5 text-sm"
              />
            </div>
            <button type="submit" className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2 flex-shrink-0">
              <Brain className="w-4 h-4" />
              Ask AI
            </button>
          </form>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground pt-1">
            <span>Popular:</span>
            {["Paracetamol", "Metformin", "Amoxicillin", "Atorvastatin", "Cetirizine"].map((drug) => (
              <button
                key={drug}
                type="button"
                onClick={() => setAiMedicine({ name: drug })}
                className="px-2.5 py-1 rounded-lg bg-surface dark:bg-dark-surface border border-border dark:border-dark-border hover:border-primary text-accent dark:text-white transition-all"
              >
                {drug}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Morning doses", value: medicines.filter(m => m.morning && m.isActive).length, color: "text-warning" },
            { label: "Afternoon doses", value: medicines.filter(m => m.afternoon && m.isActive).length, color: "text-primary" },
            { label: "Night doses", value: medicines.filter(m => m.night && m.isActive).length, color: "text-secondary" },
            { label: "Reminders active", value: medicines.filter(m => m.reminderOn && m.isActive).length, color: "text-success" },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center space-y-1">
              <p className={`font-heading font-bold text-2xl ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input className="input pl-11" placeholder="Search medicines..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowActive(true)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${showActive ? "bg-primary text-white" : "bg-border/50 text-muted-foreground hover:bg-primary/10 hover:text-primary"}`}
            >
              Active ({activeMeds.length})
            </button>
            <button
              onClick={() => setShowActive(false)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!showActive ? "bg-primary text-white" : "bg-border/50 text-muted-foreground hover:bg-primary/10 hover:text-primary"}`}
            >
              History ({expiredMeds.length})
            </button>
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((med) => (
              <MedicineCard
                key={med.id}
                med={med}
                onToggleReminder={handleToggleReminder}
                onDelete={handleDeleteMedicine}
                onAiExplain={setAiMedicine}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-16 space-y-4 card p-8">
            <Pill className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground font-medium">No medicines in this view.</p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary inline-flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" />
              Add First Medicine
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
