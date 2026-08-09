"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Search, Filter, Sparkles, FileText, Pill, Eye, Calendar,
  Droplets, Download, X, Brain,
  TrendingUp, CheckCircle, AlertCircle, Pencil, Trash2
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { reportTypeLabels, formatDate, downloadReportFile } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { getUserData, saveUserData, Report, FamilyMember } from "@/lib/dataStore";

const typeIconMap: Record<string, React.ElementType> = {
  LAB_REPORT: FileText,
  PRESCRIPTION: Pill,
  SCAN: Eye,
  BILL: Calendar,
  VACCINATION: Droplets,
};

interface AISummary {
  summary: string;
  keyFindings?: string[];
  actionItems?: string[];
  disclaimer?: string;
}

export default function TimelinePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  
  const loadData = useCallback(() => {
    const data = getUserData();
    setReports(data.reports || []);
    setMembers(data.familyMembers || []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("medvault_data_updated", handleUpdate);
    return () => window.removeEventListener("medvault_data_updated", handleUpdate);
  }, [loadData]);

  const [search, setSearch] = useState("");
  const [memberFilter, setMemberFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");
  const [aiSearching, setAiSearching] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Report | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const [editingRecord, setEditingRecord] = useState<Report | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editType, setEditType] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editMemberId, setEditMemberId] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editMedicines, setEditMedicines] = useState("");

  const handleDeleteRecord = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this medical record?")) return;
    const data = getUserData();
    data.reports = (data.reports || []).filter(r => r.id !== id);
    saveUserData(data);
    loadData();
    toast.success("Medical record deleted successfully");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    const data = getUserData();
    const member = members.find(m => m.id === editMemberId);
    
    data.reports = (data.reports || []).map(r => {
      if (r.id === editingRecord.id) {
        return {
          ...r,
          title: editTitle.trim() || r.title,
          type: editType,
          reportDate: editDate,
          familyMemberId: editMemberId,
          familyMemberName: member?.name || r.familyMemberName,
          summary: editSummary.trim(),
          medicines: editMedicines ? editMedicines.split(",").map(m => m.trim()).filter(Boolean) : [],
        };
      }
      return r;
    });

    saveUserData(data);
    loadData();
    setEditingRecord(null);
    toast.success("Medical record updated successfully");
  };

  // Natural Language Search via AI endpoint or local filter fallback
  const handleAiSearch = async () => {
    if (!search.trim()) return;
    setAiSearching(true);
    try {
      const res = await fetch("/api/gemini/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: search, items: reports }),
      });
      const data: { matchingIds?: string[] } = await res.json();
      if (data.matchingIds) {
        toast.success(`Found ${data.matchingIds.length} matching record(s) for "${search}"`);
      }
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setAiSearching(false);
    }
  };

  const generateReportSummary = async (record: Report) => {
    setGeneratingSummary(true);
    try {
      const res = await fetch("/api/gemini/summarize-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportTitle: record.title,
          reportType: record.type,
          diagnosis: record.summary || "No extracted diagnosis available.",
          hospital: "Not specified",
          doctor: "Not specified",
        }),
      });
      const data = await res.json();
      setAiSummary(data);
    } catch (e: unknown) {
      console.error(e);
      toast.error("Failed to generate AI summary.");
    } finally {
      setGeneratingSummary(false);
    }
  };

  const filteredRecords = reports.filter((record) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      record.title.toLowerCase().includes(q) ||
      (record.summary && record.summary.toLowerCase().includes(q)) ||
      (record.diagnosis && record.diagnosis.toLowerCase().includes(q)) ||
      (record.hospitalName && record.hospitalName.toLowerCase().includes(q)) ||
      (record.doctorName && record.doctorName.toLowerCase().includes(q));

    const matchMember = memberFilter === "ALL" || record.familyMemberId === memberFilter;
    const matchType = typeFilter === "ALL" || record.type === typeFilter;
    const matchYear = yearFilter === "ALL" || String(record.reportDate).startsWith(yearFilter);

    return matchSearch && matchMember && matchType && matchYear;
  });

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const timeA = new Date(a.reportDate || 0).getTime();
    const timeB = new Date(b.reportDate || 0).getTime();
    return timeB - timeA;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-accent dark:text-white flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary" />
              Medical Timeline
            </h1>
            <p className="text-muted-foreground mt-1">
              Chronological history of all medical visits, lab tests, prescriptions and scans
            </p>
          </div>
          <Link href="/upload">
            <button className="btn-primary text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Upload New Record
            </button>
          </Link>
        </div>

        {/* Natural Language AI Search Bar */}
        <div className="card p-4 space-y-3 bg-gradient-card border-primary/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide">
            <Sparkles className="w-4 h-4" />
            Natural Language AI Search
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
                placeholder='Try: "Show all diabetes reports", "MRI in 2024", or "Dr. Mehta prescriptions"'
                className="input pl-11 pr-4 py-3"
              />
            </div>
            <button
              onClick={handleAiSearch}
              disabled={aiSearching}
              className="btn-secondary text-sm flex items-center justify-center gap-2 px-6"
            >
              {aiSearching ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  AI Query
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-3 bg-surface dark:bg-dark-surface p-4 rounded-2xl border border-border dark:border-dark-border">
          <div className="flex items-center gap-2 text-sm font-medium text-accent dark:text-white mr-2">
            <Filter className="w-4 h-4 text-primary" />
            Filters:
          </div>

          {/* Member Filter */}
          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="input text-xs py-2 px-3 w-auto"
          >
            <option value="ALL">All Members</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.relationship})</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input text-xs py-2 px-3 w-auto"
          >
            <option value="ALL">All Document Types</option>
            <option value="LAB_REPORT">Lab Reports</option>
            <option value="PRESCRIPTION">Prescriptions</option>
            <option value="SCAN">Scans & X-Rays</option>
            <option value="VACCINATION">Vaccinations</option>
            <option value="BILL">Bills & Invoices</option>
          </select>

          {/* Year Filter */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="input text-xs py-2 px-3 w-auto"
          >
            <option value="ALL">All Years</option>
            {Array.from(new Set(reports.map(r => String(r.reportDate).split('-')[0]))).sort().reverse().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {(memberFilter !== "ALL" || typeFilter !== "ALL" || yearFilter !== "ALL" || search) && (
            <button
              onClick={() => {
                setMemberFilter("ALL");
                setTypeFilter("ALL");
                setYearFilter("ALL");
                setSearch("");
              }}
              className="text-xs text-primary hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Timeline list */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-primary/30 space-y-8">
          {sortedRecords.length === 0 ? (
            <div className="card p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-accent dark:text-white">No records found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                No medical documents found. Upload a medical report, prescription, or lab result to begin building your timeline.
              </p>
              <Link href="/upload" className="inline-block pt-2">
                <button className="btn-primary text-xs px-5 py-2.5 inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Upload First Report
                </button>
              </Link>
            </div>
          ) : (
            sortedRecords.map((record, index) => {
              const Icon = (record.type && typeIconMap[record.type]) || FileText;

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative group"
                >
                  {/* Timeline dot node */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-surface dark:bg-dark-surface border-2 border-primary flex items-center justify-center shadow-md">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  </div>

                  <div className="card-hover p-6 space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5" />
                          {(record.type && reportTypeLabels[record.type]) || record.type || "Medical Record"}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(record.reportDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-primary text-white text-xs font-bold flex items-center justify-center">
                          {(record.familyMemberName || "M").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold text-accent dark:text-white">{record.familyMemberName || "Member"}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="font-heading font-bold text-lg text-accent dark:text-white group-hover:text-primary transition-colors">
                        {record.title}
                      </h3>
                    </div>

                    {record.summary && (
                      <p className="text-sm text-accent dark:text-white bg-background dark:bg-dark-bg p-3.5 rounded-xl border border-border dark:border-dark-border leading-relaxed">
                        {record.summary}
                      </p>
                    )}

                    {(record.fileData || record.fileUrl) && (
                      <div className="rounded-xl overflow-hidden border border-border dark:border-dark-border max-h-48 bg-black/5 flex items-center justify-center p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={record.fileData || record.fileUrl}
                          alt={record.title}
                          className="max-h-44 object-contain rounded-lg cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => {
                            setSelectedRecord(record);
                            setAiSummary(null);
                            generateReportSummary(record);
                          }}
                        />
                      </div>
                    )}

                    {/* Prescribed Medicines */}
                    {record.medicines && record.medicines.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                          <Pill className="w-3.5 h-3.5 text-secondary" /> Prescribed Medicines
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {record.medicines.map((med) => (
                            <span key={med} className="badge bg-secondary/10 text-secondary text-xs">
                              {med}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border dark:border-dark-border">
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setAiSummary(null);
                          generateReportSummary(record);
                        }}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5"
                      >
                        <Brain className="w-4 h-4" />
                        View AI Summary & Analysis
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingRecord(record);
                            setEditTitle(record.title);
                            setEditType(record.type || "LAB_REPORT");
                            setEditDate(typeof record.reportDate === "string" ? record.reportDate.split("T")[0] : new Date().toISOString().split("T")[0]);
                            setEditMemberId(record.familyMemberId || members[0]?.id || "");
                            setEditSummary(record.summary || "");
                            setEditMedicines(record.medicines ? record.medicines.join(", ") : "");
                          }}
                          className="btn-ghost py-1.5 px-2.5 text-xs flex items-center gap-1 hover:text-primary"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="btn-ghost py-1.5 px-2.5 text-xs flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                        <button
                          onClick={() => {
                            downloadReportFile(record);
                            toast.success("Downloading report vault document...");
                          }}
                          className="btn-ghost py-1.5 px-3 text-xs flex items-center gap-1 hover:text-primary"
                        >
                          <Download className="w-3.5 h-3.5" /> Download Report
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Edit Record Modal */}
        <AnimatePresence>
          {editingRecord && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95 }}
                className="w-full max-w-lg bg-surface dark:bg-dark-surface rounded-3xl border border-border dark:border-dark-border shadow-card-lg overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between p-6 border-b border-border dark:border-dark-border bg-gradient-card">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white">
                      <Pencil className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-accent dark:text-white">Edit Medical Record</h2>
                      <p className="text-xs text-muted-foreground">Update timeline details</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingRecord(null)}
                    className="p-2 rounded-xl hover:bg-border dark:hover:bg-dark-border transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-accent dark:text-white uppercase tracking-wider">Record Title</label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="input w-full"
                      placeholder="e.g. Annual Blood Panel"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-accent dark:text-white uppercase tracking-wider">Document Type</label>
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        className="input w-full text-xs"
                      >
                        <option value="LAB_REPORT">Lab Report</option>
                        <option value="PRESCRIPTION">Prescription</option>
                        <option value="SCAN">Scan & X-Ray</option>
                        <option value="VACCINATION">Vaccination</option>
                        <option value="BILL">Bill & Invoice</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-accent dark:text-white uppercase tracking-wider">Date</label>
                      <input
                        type="date"
                        required
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="input w-full text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-accent dark:text-white uppercase tracking-wider">Family Member</label>
                    <select
                      value={editMemberId}
                      onChange={(e) => setEditMemberId(e.target.value)}
                      className="input w-full text-xs"
                    >
                      {members.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.relationship})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-accent dark:text-white uppercase tracking-wider">Diagnosis / Summary</label>
                    <textarea
                      rows={3}
                      value={editSummary}
                      onChange={(e) => setEditSummary(e.target.value)}
                      className="input w-full text-xs"
                      placeholder="Enter clinical notes or summary..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-accent dark:text-white uppercase tracking-wider">Prescribed Medicines (comma separated)</label>
                    <input
                      type="text"
                      value={editMedicines}
                      onChange={(e) => setEditMedicines(e.target.value)}
                      className="input w-full text-xs"
                      placeholder="e.g. Metformin 500mg, Atorvastatin 10mg"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-border dark:border-dark-border">
                    <button
                      type="button"
                      onClick={() => setEditingRecord(null)}
                      className="btn-ghost text-xs px-4 py-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary text-xs px-6 py-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Record Detail Modal with AI Analysis */}
        <AnimatePresence>
          {selectedRecord && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95 }}
                className="w-full max-w-2xl bg-surface dark:bg-dark-surface rounded-3xl border border-border dark:border-dark-border shadow-card-lg overflow-hidden max-h-[90vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-border dark:border-dark-border bg-gradient-card">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-accent dark:text-white">{selectedRecord.title}</h2>
                      <p className="text-xs text-muted-foreground">{selectedRecord.familyMemberName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        downloadReportFile(selectedRecord);
                        toast.success("Downloading report...");
                      }}
                      className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                    <button
                      onClick={() => setSelectedRecord(null)}
                      className="p-2 rounded-xl hover:bg-border dark:hover:bg-dark-border transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                  {(selectedRecord.fileData || selectedRecord.fileUrl) && (
                    <div className="p-4 bg-black/5 rounded-2xl border border-border dark:border-dark-border space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Uploaded Document Image</p>
                      <div className="rounded-xl overflow-hidden max-h-72 bg-black/20 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedRecord.fileData || selectedRecord.fileUrl}
                          alt={selectedRecord.title}
                          className="max-h-72 object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* Basic Details */}
                  <div className="grid grid-cols-2 gap-4 text-xs bg-background dark:bg-dark-bg p-4 rounded-xl border border-border dark:border-dark-border">
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-semibold text-accent dark:text-white">{formatDate(selectedRecord.reportDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Extracted Type</p>
                      <p className="font-semibold text-accent dark:text-white">{selectedRecord.type}</p>
                    </div>
                  </div>

                  {/* AI Summary Loading State or Content */}
                  {generatingSummary ? (
                    <div className="p-8 text-center space-y-3">
                      <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm font-semibold text-accent dark:text-white">Analyzing report with Gemini AI...</p>
                      <p className="text-xs text-muted-foreground">Extracting key clinical metrics and recommendations</p>
                    </div>
                  ) : aiSummary ? (
                    <div className="space-y-4">
                      {/* Executive Summary */}
                      <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
                        <p className="text-xs font-bold text-primary uppercase tracking-wide flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" /> AI Executive Summary
                        </p>
                        <p className="text-sm text-accent dark:text-white leading-relaxed">{aiSummary.summary}</p>
                      </div>

                      {/* Key Findings */}
                      {aiSummary.keyFindings && (
                        <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20 space-y-2">
                          <p className="text-xs font-bold text-secondary uppercase tracking-wide flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4" /> Key Findings & Values
                          </p>
                          <ul className="space-y-1.5 text-sm text-accent dark:text-white">
                            {aiSummary.keyFindings.map((finding: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                                {finding}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Items */}
                      {aiSummary.actionItems && (
                        <div className="p-4 rounded-2xl bg-warning/10 border border-warning/20 space-y-2">
                          <p className="text-xs font-bold text-warning uppercase tracking-wide flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" /> Actionable Recommendations
                          </p>
                          <ul className="space-y-1.5 text-sm text-accent dark:text-white">
                            {aiSummary.actionItems.map((item: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <p className="text-[11px] text-muted-foreground text-center italic">
                        {aiSummary.disclaimer || "This information is generated for educational purposes only."}
                      </p>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
