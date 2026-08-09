"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Plus, Search, Phone, Edit, Trash2, Eye,
  Calendar, Droplets, X, User,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import Link from "next/link";
import type { BloodGroup, Relationship } from "@/types";
import { useLanguage } from "@/components/providers/LanguageContext";
import {
  getUserData,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  FamilyMember,
} from "@/lib/dataStore";

const gradients = [
  "from-primary to-secondary",
  "from-secondary to-primary",
  "from-success to-primary",
  "from-warning to-error",
];

const bloodGroupColors: Record<string, string> = {
  "A+": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "A-": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "B+": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "B-": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "AB+": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "AB-": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "O+": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "O-": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

function MemberCard({
  member,
  index,
  onEdit,
  onDelete,
}: {
  member: FamilyMember;
  index: number;
  onEdit: (member: FamilyMember) => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useLanguage();
  const name = member?.name || "Family Member";
  const relationship = member?.relationship || "Family";
  const age = member?.age;
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "FM";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card overflow-hidden group border border-border dark:border-dark-border bg-surface dark:bg-dark-surface"
    >
      {/* Top gradient bar */}
      <div className={`h-2 bg-gradient-to-r ${gradients[index % gradients.length]}`} />

      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {member.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.avatar}
                alt={name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-primary/20 shadow-glow"
              />
            ) : (
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center shadow-glow shrink-0`}>
                <span className="font-bold text-xl text-white">{initials}</span>
              </div>
            )}
            <div>
              <h3 className="font-heading font-bold text-lg text-accent dark:text-white">{name}</h3>
              <p className="text-muted-foreground text-sm">{relationship}</p>
            </div>
          </div>
        </div>

        {/* Info pills */}
        <div className="flex flex-wrap gap-2">
          {age !== null && age !== undefined && (
            <span className="badge bg-border/60 text-muted-foreground text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {age} years
            </span>
          )}
          {member.bloodGroup && (
            <span className={`badge text-xs font-semibold flex items-center gap-1 ${bloodGroupColors[member.bloodGroup] || "badge-error"}`}>
              <Droplets className="w-3 h-3" />
              {member.bloodGroup}
            </span>
          )}
        </div>

        {/* Conditions */}
        {member.chronicDiseases && member.chronicDiseases.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Conditions</p>
            <div className="flex flex-wrap gap-1.5">
              {member.chronicDiseases.map((d) => (
                <span key={d} className="badge bg-error/10 text-error text-xs">{d}</span>
              ))}
            </div>
          </div>
        )}

        {/* Allergies */}
        {member.allergies && member.allergies.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">⚠ Allergies</p>
            <div className="flex flex-wrap gap-1.5">
              {member.allergies.map((a) => (
                <span key={a} className="badge bg-warning/10 text-warning text-xs">{a}</span>
              ))}
            </div>
          </div>
        )}

        {/* Emergency contact */}
        {member.emergencyContact && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="w-3.5 h-3.5 text-success shrink-0" />
            <span className="truncate">{member.emergencyContact} · {member.emergencyPhone}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border dark:border-dark-border">
          <Link href={`/family/${member.id}`} className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full btn-primary text-sm py-2.5 flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              {t("viewProfile") || "View Profile"}
            </motion.button>
          </Link>
          <button
            onClick={() => onEdit(member)}
            title="Edit Member"
            className="p-2.5 rounded-xl border border-border dark:border-dark-border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(member.id)}
            title="Delete Member"
            className="p-2.5 rounded-xl border border-border dark:border-dark-border hover:bg-error/10 hover:text-error hover:border-error transition-all flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function MemberFormModal({
  member,
  onClose,
  onSave,
}: {
  member?: FamilyMember | null;
  onClose: () => void;
  onSave: (data: Partial<FamilyMember>) => void;
}) {
  const { t } = useLanguage();
  const isEditing = Boolean(member);

  const [form, setForm] = useState({
    name: member?.name || "",
    relationship: (member?.relationship || "Child") as Relationship,
    bloodGroup: (member?.bloodGroup || "O+") as BloodGroup,
    age: member?.age?.toString() || "",
    emergencyContact: member?.emergencyContact || "",
    emergencyPhone: member?.emergencyPhone || "",
    chronicDiseases: member?.chronicDiseases?.join(", ") || "",
    allergies: member?.allergies?.join(", ") || "",
    primaryDoctor: member?.primaryDoctor || "",
    doctorPhone: member?.doctorPhone || "",
    insuranceProvider: member?.insuranceProvider || "",
    policyNumber: member?.policyNumber || "",
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
            {isEditing ? "Edit Family Member Profile" : t("addFamilyMember") || "Add Family Member"}
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
              {isEditing ? "Save Changes" : "Add Member"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function FamilyPage() {
  const { t } = useLanguage();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [mounted, setMounted] = useState(false);

  const loadMembers = useCallback(() => {
    const userData = getUserData();
    setMembers(userData?.familyMembers || []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    loadMembers();
    const handleUpdate = () => loadMembers();
    window.addEventListener("medvault_data_updated", handleUpdate);
    return () => window.removeEventListener("medvault_data_updated", handleUpdate);
  }, [loadMembers]);

  const filtered = members.filter((m) =>
    (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.relationship || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteFamilyMember(id);
    loadMembers();
    toast.success("Member removed from vault");
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setShowModal(true);
  };

  const handleOpenEdit = (m: FamilyMember) => {
    setEditingMember(m);
    setShowModal(true);
  };

  const handleSaveMember = (data: Partial<FamilyMember>) => {
    if (editingMember) {
      updateFamilyMember(editingMember.id, data);
      toast.success(`${data.name || editingMember.name}'s profile updated successfully!`);
    } else {
      addFamilyMember({
        name: data.name!,
        relationship: data.relationship || "Other",
        age: data.age || 0,
        bloodGroup: data.bloodGroup || "O+",
        allergies: data.allergies || [],
        chronicDiseases: data.chronicDiseases || [],
        emergencyContact: data.emergencyContact || data.name || "",
        emergencyPhone: data.emergencyPhone || "+91 98765 43210",
        primaryDoctor: data.primaryDoctor || "",
        doctorPhone: data.doctorPhone || "",
        insuranceProvider: data.insuranceProvider || "",
        policyNumber: data.policyNumber || "",
      });
      toast.success(`${data.name} added to your family vault!`);
    }
    loadMembers();
  };

  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="space-y-8 max-w-7xl mx-auto">
          <div className="h-10 w-48 bg-border/40 animate-pulse rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 card bg-border/20 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-accent dark:text-white flex items-center gap-2">
              <Users className="w-8 h-8 text-primary" />
              {t("familyMembers") || "Family Members"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage health profiles, blood groups, emergency cards, and records
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenAdd}
            className="btn-primary flex items-center gap-2 shadow-glow"
          >
            <Plus className="w-4 h-4" />
            {t("addFamilyMember") || "Add Family Member"}
          </motion.button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search member by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((member, i) => (
              <MemberCard
                key={member.id || `member-${i}`}
                member={member}
                index={i}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
              <User className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-xl text-accent dark:text-white">
              {search ? "No members match your search" : "No Family Members Added"}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Add your family members to organize medical records, manage prescription vaults, and create instant emergency QR cards.
            </p>
            {!search && (
              <button onClick={handleOpenAdd} className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add First Member
              </button>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <MemberFormModal
            member={editingMember}
            onClose={() => setShowModal(false)}
            onSave={handleSaveMember}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
