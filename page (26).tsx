"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Plus, Clock, Pill, Calendar, Activity,
  Droplets, Trash2, X, Check, Pencil, UserPlus
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import { useLanguage } from "@/components/providers/LanguageContext";
import {
  getUserData,
  getFamilyMembersWithSelf,
  addReminder,
  updateReminder,
  toggleReminder,
  deleteReminder as removeReminder,
  addFamilyMember,
  Reminder,
  FamilyMember,
} from "@/lib/dataStore";
import { sendSystemEmail } from "@/lib/emailService";

const typeIconMap: Record<string, React.ElementType> = {
  MEDICINE: Pill,
  APPOINTMENT: Calendar,
  LAB_TEST: Activity,
  VACCINATION: Droplets,
  OTHER: Droplets,
};

const typeColorMap: Record<string, string> = {
  MEDICINE: "bg-primary/10 text-primary border-primary/20",
  APPOINTMENT: "bg-secondary/10 text-secondary border-secondary/20",
  LAB_TEST: "bg-warning/10 text-warning border-warning/20",
  VACCINATION: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200",
  OTHER: "bg-success/10 text-success border-success/20",
};

export default function RemindersPage() {
  const { t } = useLanguage();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);

  const loadData = useCallback(() => {
    const data = getUserData();
    setReminders(data.reminders || []);
    setMembers(getFamilyMembersWithSelf());
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("medvault_data_updated", handleUpdate);
    return () => window.removeEventListener("medvault_data_updated", handleUpdate);
  }, [loadData]);

  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  // New Reminder Form State
  const [formType, setFormType] = useState<Reminder["type"]>("MEDICINE");
  const [formTitle, setFormTitle] = useState("");
  const [formDosage, setFormDosage] = useState("");
  const [formMember, setFormMember] = useState("Self (Primary Account)");
  const [formTime, setFormTime] = useState("08:00 AM");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formFrequency, setFormFrequency] = useState("Daily");

  // Edit Form State
  const [editType, setEditType] = useState<Reminder["type"]>("MEDICINE");
  const [editTitle, setEditTitle] = useState("");
  const [editDosage, setEditDosage] = useState("");
  const [editMember, setEditMember] = useState("");
  const [editTime, setEditTime] = useState("08:00 AM");
  const [editDate, setEditDate] = useState("");
  const [editFrequency, setEditFrequency] = useState("Daily");
  const [editIsCompleted, setEditIsCompleted] = useState(false);

  // New Family Member Form
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRelation, setNewMemberRelation] = useState("Spouse");

  useEffect(() => {
    if (members.length > 0 && !formMember) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormMember(members[0].name);
    }
  }, [members, formMember]);

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error("Please enter a title or medicine name.");
      return;
    }

    const created = addReminder({
      type: formType,
      title: formTitle.trim(),
      dosage: formDosage.trim(),
      memberName: formMember || "Self",
      time: formTime,
      date: formDate,
      frequency: formFrequency,
      isCompleted: false,
    });

    const userData = getUserData();
    await sendSystemEmail({
      recipient: userData.email,
      subject: `Reminder Scheduled: ${created.title} (${formTime})`,
      body: `<p>Reminder for <strong>${formMember || "Self"}</strong> scheduled on <strong>${formDate}</strong> at <strong>${formTime}</strong>.</p>`,
      type: "MEDICINE_REMINDER",
    });

    loadData();
    setShowAddModal(false);
    setFormTitle("");
    setFormDosage("");
    toast.success("Reminder scheduled & email notification queued!");
  };

  const handleOpenEditModal = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setEditType(reminder.type || "MEDICINE");
    setEditTitle(reminder.title || "");
    setEditDosage(reminder.dosage || "");
    setEditMember(reminder.memberName || "Self");
    setEditTime(reminder.time || "08:00 AM");
    setEditDate(reminder.date || new Date().toISOString().split("T")[0]);
    setEditFrequency(reminder.frequency || "Daily");
    setEditIsCompleted(!!reminder.isCompleted);
  };

  const handleSaveEditedReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReminder || !editTitle.trim()) {
      toast.error("Please enter a valid title");
      return;
    }

    updateReminder(editingReminder.id, {
      type: editType,
      title: editTitle.trim(),
      dosage: editDosage.trim(),
      memberName: editMember || "Self",
      time: editTime,
      date: editDate,
      frequency: editFrequency,
      isCompleted: editIsCompleted,
    });

    loadData();
    setEditingReminder(null);
    toast.success("Reminder updated successfully!");
  };

  const handleQuickAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) {
      toast.error("Please enter family member name");
      return;
    }

    const newM = addFamilyMember({
      name: newMemberName.trim(),
      relationship: newMemberRelation,
      age: 30,
      bloodGroup: "O+",
      allergies: [],
      chronicDiseases: [],
      emergencyContact: newMemberName.trim(),
      emergencyPhone: "+91 98765 43210",
    });

    loadData();
    setFormMember(newM.name);
    setEditMember(newM.name);
    setNewMemberName("");
    setShowAddMemberModal(false);
    toast.success(`${newM.name} added to family members!`);
  };

  const handleToggleStatus = (id: string) => {
    const r = reminders.find((item) => item.id === id);
    toggleReminder(id);
    loadData();
    if (r) {
      toast.success(r.isCompleted ? "Reminder reactivated!" : "Reminder marked as completed! 🎉");
    }
  };

  const handleDelete = (id: string) => {
    removeReminder(id);
    loadData();
    toast.info("Reminder removed.");
  };

  const filteredReminders = reminders.filter((r) => activeTab === "ALL" || r.type === activeTab);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-accent dark:text-white flex items-center gap-3">
              <Bell className="w-8 h-8 text-warning" />
              {t("reminders") || "Reminders & Notifications"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Synchronized medication schedules, appointments, and lab test alerts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="btn-ghost text-xs flex items-center gap-1.5 py-2.5 px-3 border border-border dark:border-dark-border"
            >
              <UserPlus className="w-4 h-4 text-primary" />
              Add Member
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAddModal(true)}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Reminder
            </motion.button>
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap gap-2 bg-surface dark:bg-dark-surface p-1.5 rounded-2xl border border-border dark:border-dark-border">
          {[
            { id: "ALL", label: `All (${reminders.length})` },
            { id: "MEDICINE", label: `Medicines (${reminders.filter((r) => r.type === "MEDICINE").length})` },
            { id: "APPOINTMENT", label: `Appointments (${reminders.filter((r) => r.type === "APPOINTMENT").length})` },
            { id: "LAB_TEST", label: `Lab Tests (${reminders.filter((r) => r.type === "LAB_TEST").length})` },
            { id: "OTHER", label: `Other (${reminders.filter((r) => r.type === "OTHER").length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reminders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReminders.length === 0 ? (
            <div className="col-span-2 card p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto text-warning">
                <Bell className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-accent dark:text-white">No reminders in this category</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Enable reminders when adding medicines or click &quot;Add Reminder&quot; to schedule custom alerts.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary inline-flex items-center gap-2 text-xs"
              >
                <Plus className="w-4 h-4" />
                Schedule First Reminder
              </button>
            </div>
          ) : (
            filteredReminders.map((reminder) => {
              const Icon = typeIconMap[reminder.type] || Bell;
              const colorStyle = typeColorMap[reminder.type];
              const isDone = reminder.isCompleted;

              return (
                <motion.div
                  key={reminder.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`card-hover p-5 flex flex-col justify-between space-y-4 border ${
                    isDone ? "opacity-60 bg-background dark:bg-dark-bg" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${colorStyle}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {reminder.type} · {reminder.memberName || "Self"}
                          </span>
                          {reminder.frequency && (
                            <span className="badge bg-primary/10 text-primary text-[10px] py-0 px-1.5">
                              {reminder.frequency}
                            </span>
                          )}
                        </div>
                        <h3 className={`font-heading font-bold text-accent dark:text-white leading-tight mt-0.5 ${isDone ? "line-through" : ""}`}>
                          {reminder.title} {reminder.dosage ? `(${reminder.dosage})` : ""}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(reminder.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                        isDone
                          ? "bg-success text-white border-success"
                          : "border-border dark:border-dark-border hover:border-success hover:text-success"
                      }`}
                      title={isDone ? "Mark as active" : "Mark as completed"}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border dark:border-dark-border">
                    <div className="flex items-center gap-2 font-medium">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{reminder.date || "Today"} at {reminder.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(reminder)}
                        className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                        title="Edit Reminder"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="p-1.5 rounded-lg hover:bg-error/10 hover:text-error transition-colors text-muted-foreground"
                        title="Delete Reminder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Add Reminder Modal */}
        <AnimatePresence>
          {showAddModal && (
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
                <div className="flex items-center justify-between p-6 border-b border-border dark:border-dark-border bg-gradient-card">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white">
                      <Bell className="w-5 h-5" />
                    </div>
                    <h2 className="font-heading font-bold text-accent dark:text-white">Schedule New Reminder</h2>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl hover:bg-border transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateReminder} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Reminder Type</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: "MEDICINE", label: "Medicine" },
                        { id: "APPOINTMENT", label: "Doctor" },
                        { id: "LAB_TEST", label: "Lab Test" },
                        { id: "OTHER", label: "Other" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormType(t.id as Reminder["type"])}
                          className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                            formType === t.id
                              ? "bg-primary text-white border-primary"
                              : "border-border dark:border-dark-border text-muted-foreground hover:border-primary"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Title / Medicine Name *</label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Metformin or Dr. Visit"
                        className="input text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Dosage (Optional)</label>
                      <input
                        type="text"
                        value={formDosage}
                        onChange={(e) => setFormDosage(e.target.value)}
                        placeholder="e.g. 500mg, 1 tablet"
                        className="input text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-accent dark:text-white block">Family Member</label>
                        <button
                          type="button"
                          onClick={() => setShowAddMemberModal(true)}
                          className="text-[10px] text-primary hover:underline font-medium"
                        >
                          + Add New
                        </button>
                      </div>
                      <select
                        value={formMember}
                        onChange={(e) => setFormMember(e.target.value)}
                        className="input text-xs"
                      >
                        {members.map((m) => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Date</label>
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="input text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Time</label>
                      <input
                        type="text"
                        value={formTime}
                        onChange={(e) => setFormTime(e.target.value)}
                        placeholder="08:00 AM"
                        className="input text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Frequency</label>
                    <select
                      value={formFrequency}
                      onChange={(e) => setFormFrequency(e.target.value)}
                      className="input text-xs"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Morning">Morning Dose</option>
                      <option value="Afternoon">Afternoon Dose</option>
                      <option value="Night">Night Dose</option>
                      <option value="Weekly">Weekly</option>
                      <option value="One-time">One-time Appointment</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-primary w-full py-3 mt-4 text-sm font-semibold">
                    Schedule Reminder
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Reminder Modal */}
        <AnimatePresence>
          {editingReminder && (
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
                <div className="flex items-center justify-between p-6 border-b border-border dark:border-dark-border bg-gradient-card">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white">
                      <Pencil className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-accent dark:text-white">Edit Reminder</h2>
                      <p className="text-xs text-muted-foreground">Modify dosage, timing, or associated family member</p>
                    </div>
                  </div>
                  <button onClick={() => setEditingReminder(null)} className="p-2 rounded-xl hover:bg-border transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditedReminder} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Reminder Type</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: "MEDICINE", label: "Medicine" },
                        { id: "APPOINTMENT", label: "Doctor" },
                        { id: "LAB_TEST", label: "Lab Test" },
                        { id: "OTHER", label: "Other" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setEditType(t.id as Reminder["type"])}
                          className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                            editType === t.id
                              ? "bg-primary text-white border-primary"
                              : "border-border dark:border-dark-border text-muted-foreground hover:border-primary"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Title / Medicine Name *</label>
                      <input
                        type="text"
                        required
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="input text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Dosage</label>
                      <input
                        type="text"
                        value={editDosage}
                        onChange={(e) => setEditDosage(e.target.value)}
                        placeholder="e.g. 500mg, 1 tablet"
                        className="input text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Family Member</label>
                      <select
                        value={editMember}
                        onChange={(e) => setEditMember(e.target.value)}
                        className="input text-xs"
                      >
                        {members.map((m) => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Date</label>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="input text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Time</label>
                      <input
                        type="text"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        placeholder="08:00 AM"
                        className="input text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Frequency</label>
                      <select
                        value={editFrequency}
                        onChange={(e) => setEditFrequency(e.target.value)}
                        className="input text-xs"
                      >
                        <option value="Daily">Daily</option>
                        <option value="Morning">Morning Dose</option>
                        <option value="Afternoon">Afternoon Dose</option>
                        <option value="Night">Night Dose</option>
                        <option value="Weekly">Weekly</option>
                        <option value="One-time">One-time Appointment</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Status</label>
                      <button
                        type="button"
                        onClick={() => setEditIsCompleted(!editIsCompleted)}
                        className={`w-full py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          editIsCompleted
                            ? "bg-success/10 text-success border-success/30"
                            : "bg-primary/10 text-primary border-primary/30"
                        }`}
                      >
                        {editIsCompleted ? "✓ Completed" : "• Active"}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingReminder(null)}
                      className="btn-ghost flex-1 text-xs py-2.5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1 text-xs py-2.5 font-semibold"
                    >
                      Update Reminder
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Add Family Member Modal */}
        <AnimatePresence>
          {showAddMemberModal && (
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
                <div className="flex items-center justify-between p-6 border-b border-border dark:border-dark-border bg-gradient-card">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <h2 className="font-heading font-bold text-accent dark:text-white">Add Family Member</h2>
                  </div>
                  <button onClick={() => setShowAddMemberModal(false)} className="p-2 rounded-xl hover:bg-border transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleQuickAddMember} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="e.g. Priya Sharma, Arjun Patel"
                      className="input text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-accent dark:text-white block mb-1">Relationship</label>
                    <select
                      value={newMemberRelation}
                      onChange={(e) => setNewMemberRelation(e.target.value)}
                      className="input text-xs"
                    >
                      {["Spouse", "Child", "Parent", "Sibling", "Grandparent", "Other"].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMemberModal(false)}
                      className="btn-ghost flex-1 text-xs py-2.5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1 text-xs py-2.5 font-semibold"
                    >
                      Save Member
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
