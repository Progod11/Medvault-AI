import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  if (!isValid(d)) return "—";
  return format(d, "MMM dd, yyyy");
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  if (!isValid(d)) return "—";
  return format(d, "MMM dd, yyyy • hh:mm a");
}

export function formatRelative(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  if (!isValid(d)) return "—";
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatRelativeTime(timeInput?: string | Date | number | null): string {
  if (!timeInput) return "Just now";

  let date: Date;
  if (timeInput instanceof Date) {
    date = timeInput;
  } else if (typeof timeInput === "number") {
    date = new Date(timeInput);
  } else if (typeof timeInput === "string") {
    if (/^\d{13}$/.test(timeInput)) {
      date = new Date(Number(timeInput));
    } else {
      const parsed = new Date(timeInput);
      if (isValid(parsed)) {
        date = parsed;
      } else {
        if (timeInput.toLowerCase().includes("just now")) {
          return "Just now";
        }
        return timeInput;
      }
    }
  } else {
    return "Just now";
  }

  if (!isValid(date)) return "Just now";

  const now = Date.now();
  const diffMs = now - date.getTime();
  if (diffMs < 0) return "Just now";

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 45) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return format(date, "MMM d, yyyy");
}

export function calculateAge(dateOfBirth: Date | string | null | undefined): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (!isValid(dob)) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}

export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const relationships = [
  "Self", "Spouse", "Child", "Parent", "Sibling", "Grandparent", "Other"
] as const;

export const reportTypeLabels: Record<string, string> = {
  LAB_REPORT: "Lab Report",
  PRESCRIPTION: "Prescription",
  SCAN: "Scan/X-Ray",
  BILL: "Hospital Bill",
  VACCINATION: "Vaccination",
  OTHER: "Other",
};

export const reminderTypeLabels: Record<string, string> = {
  MEDICINE: "Medicine",
  APPOINTMENT: "Appointment",
  LAB_TEST: "Lab Test",
  VACCINATION: "Vaccination",
  OTHER: "Other",
};

export const reportTypeColors: Record<string, string> = {
  LAB_REPORT: "badge-primary",
  PRESCRIPTION: "badge-secondary",
  SCAN: "badge-warning",
  BILL: "badge-error",
  VACCINATION: "badge-success",
  OTHER: "badge",
};

export function downloadReportFile(report: {
  title: string;
  familyMemberName?: string;
  reportDate?: string | Date;
  hospitalName?: string;
  doctorName?: string;
  diagnosis?: string;
  summary?: string;
  medicines?: string[];
  type?: string;
  fileData?: string;
  fileUrl?: string;
}) {
  const fileSource = report.fileData || report.fileUrl;
  if (fileSource) {
    const a = document.createElement("a");
    a.href = fileSource;
    let ext = "png";
    if (fileSource.startsWith("data:image/jpeg") || fileSource.startsWith("data:image/jpg")) ext = "jpg";
    if (fileSource.startsWith("data:application/pdf")) ext = "pdf";
    a.download = `${slugify(report.title || "medical-report")}_${report.reportDate || "report"}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  const dateStr = formatDate(report.reportDate);
  const content = `=====================================================
MEDVAULT AI - MEDICAL REPORT VAULT RECORD
=====================================================

Patient Name : ${report.familyMemberName}
Report Title : ${report.title}
Report Type  : ${reportTypeLabels[report.type || "LAB_REPORT"] || report.type || "Medical Record"}
Date         : ${dateStr}
Facility/Hosp: ${report.hospitalName || "N/A"}
Doctor Name  : ${report.doctorName || "N/A"}

-----------------------------------------------------
DIAGNOSIS & CLINICAL SUMMARY
-----------------------------------------------------
${report.diagnosis || report.summary || "No specific diagnosis provided."}

-----------------------------------------------------
PRESCRIBED MEDICINES
-----------------------------------------------------
${report.medicines && report.medicines.length > 0 ? report.medicines.map((m, i) => `${i + 1}. ${m}`).join("\n") : "None listed."}

-----------------------------------------------------
Generated & Exported from MedVault AI Vault on ${new Date().toLocaleString()}
=====================================================`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugify(report.title || "medical-report")}_${report.reportDate || "report"}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
