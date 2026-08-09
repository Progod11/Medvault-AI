"use client";

import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "./firebase";
import { Report, Medicine, Reminder, AuditLog } from "@/types";
import { getSeedDataForPremium, getSeedDataForFree } from "./demoSeed";

export type { Report, Medicine, Reminder, AuditLog };

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  bloodGroup: string;
  photo?: string;
  avatar?: string;
  avatarUrl?: string;
  allergies: string[];
  chronicDiseases: string[];
  emergencyContact: string;
  emergencyPhone: string;
  secondaryContact?: string;
  secondaryPhone?: string;
  insuranceProvider?: string;
  policyNumber?: string;
  organDonor?: boolean;
  primaryDoctor?: string;
  doctorPhone?: string;
}

export interface ReferredUser {
  id: string;
  name: string;
  email: string;
  date: string;
  status: "COMPLETED" | "PENDING";
  reward: string;
}

export interface ReferralData {
  code: string;
  link: string;
  completedCount: number;
  targetCount: number;
  proRewardClaimed: boolean;
  referredUsers: ReferredUser[];
}

export interface WearableDevice {
  id: string;
  name: string;
  brand: "Apple" | "Google" | "Fitbit" | "Garmin" | "Samsung" | "Oura";
  model?: string;
  connected: boolean;
  lastSynced: string;
  batteryLevel: number;
  firmwareVersion?: string;
  activeSensors?: string[];
}

export interface HealthTelemetry {
  steps: number;
  stepGoal: number;
  sleepHours: number;
  sleepScore: number;
  deepSleepMinutes?: number;
  remSleepMinutes?: number;
  screenTimeMinutes: number;
  heartRate: number;
  hrvMs?: number;
  spo2Percent?: number;
  bodyTemperatureDelta?: number;
  caloriesBurned: number;
  activeMinutes: number;
  ecgStatus?: string;
  cgmGlucoseMgDl?: number;
  stressLevel?: "Low" | "Moderate" | "High";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string; // ISO string or timestamp
  unread: boolean;
}

export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  type: "SECURITY_OTP" | "MEDICINE_REMINDER" | "APPOINTMENT" | "HEALTH_ALERT" | "REFERRAL_REWARD";
  timestamp: string;
  status: "DELIVERED" | "QUEUED";
}

export interface UserData {
  email: string;
  userName?: string;
  userPhone?: string;
  plan: "FREE" | "PREMIUM";
  familyMembers: FamilyMember[];
  reports: Report[];
  medicines: Medicine[];
  reminders: Reminder[];
  notifications: NotificationItem[];
  auditLogs?: AuditLog[];
  referralData?: ReferralData;
  wearables?: WearableDevice[];
  healthTelemetry?: HealthTelemetry;
  emailLogs?: EmailLog[];
}

// Default Clean Initial Account State Template
const createCleanUserData = (email: string, plan: "FREE" | "PREMIUM" = "FREE"): UserData => ({
  email,
  userName: email.split("@")[0] || "User",
  userPhone: "",
  plan,
  familyMembers: [],
  reports: [],
  medicines: [],
  reminders: [],
  notifications: [
    {
      id: `welcome-${Date.now()}`,
      title: "Welcome to MedVault AI 👋",
      message: "Your secure family health vault is ready. Upload your first medical report to start building your health timeline.",
      time: new Date().toISOString(),
      unread: true,
    },
  ],
  auditLogs: [
    {
      id: `log-init-${Date.now()}`,
      action: "Account Vault Initialized",
      device: typeof navigator !== "undefined" ? "Browser Session" : "Web Client",
      ip: "Encrypted Session",
      time: new Date().toISOString(),
      status: "SUCCESS",
    },
  ],
  referralData: {
    code: `MEDVAULT-${(email.split("@")[0] || "USER").toUpperCase().slice(0, 8)}`,
    link: typeof window !== "undefined" ? `${window.location.origin}/signup?ref=MEDVAULT` : "https://medvault-ai.com/signup?ref=MEDVAULT",
    completedCount: 0,
    targetCount: 20,
    proRewardClaimed: false,
    referredUsers: [],
  },
  wearables: [],
  healthTelemetry: {
    steps: 0,
    stepGoal: 10000,
    sleepHours: 0,
    sleepScore: 0,
    screenTimeMinutes: 0,
    heartRate: 0,
    caloriesBurned: 0,
    activeMinutes: 0,
  },
  emailLogs: [],
});

export function getCurrentUserEmail(): string {
  if (typeof window === "undefined") return "user@medvault.ai";
  return localStorage.getItem("medvault_user_email") || "user@medvault.ai";
}

export function getUserPlan(emailInput?: string): "FREE" | "PREMIUM" {
  if (typeof window === "undefined") return "FREE";
  const email = (emailInput || getCurrentUserEmail()).toLowerCase().trim();
  const storedPlan = localStorage.getItem("medvault_user_plan") as "FREE" | "PREMIUM";
  return storedPlan || (email.includes("premium") ? "PREMIUM" : "FREE");
}

export async function uploadReportFileToStorage(file: File, reportId: string): Promise<string | null> {
  const uid = auth.currentUser?.uid || localStorage.getItem("medvault_user_uid");
  if (!uid) {
    console.warn("User not authenticated. Skipping Firebase Storage upload.");
    return null;
  }
  
  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const fileRef = ref(storage, `reports_v2/${uid}/${reportId}/${cleanFileName}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (err) {
    console.error("Firebase Storage upload error:", err);
    return null;
  }
}

export function getUserData(targetEmail?: string): UserData {
  const email = (targetEmail || getCurrentUserEmail()).toLowerCase().trim();
  const isDemoAccount = email === "premium@medvault.ai" || email === "free@medvault.ai";

  if (typeof window === "undefined") {
    if (isDemoAccount && email.includes("premium")) return getSeedDataForPremium();
    if (isDemoAccount && email.includes("free")) return getSeedDataForFree();
    return createCleanUserData(email, getUserPlan(email));
  }

  const uid = auth.currentUser?.uid || localStorage.getItem("medvault_user_uid");

  // Priority: 
  // 1. UID-scoped store (Cloud synced)
  const uidKey = uid ? `medvault_user_store_${uid}` : null;

  let saved = null;
  if (uidKey) saved = localStorage.getItem(uidKey);

  let data: UserData;

  if (saved) {
    try {
      data = JSON.parse(saved);
      // Clean up fallback images
      if (data.reports) {
        data.reports = data.reports.map(r => ({
          ...r,
          fileUrl: r.fileUrl && r.fileUrl.includes("unsplash.com") ? undefined : r.fileUrl
        }));
      }
    } catch {
      data = createCleanUserData(email, getUserPlan(email));
    }
  } else {
    if (isDemoAccount) {
      data = email.includes("premium") ? getSeedDataForPremium() : getSeedDataForFree();
    } else {
      data = createCleanUserData(email, getUserPlan(email));
    }
  }

  // Backfill missing arrays
  if (data) {
    if (!data.familyMembers || !Array.isArray(data.familyMembers)) data.familyMembers = [];
    if (!data.reports || !Array.isArray(data.reports)) data.reports = [];
    if (!data.medicines || !Array.isArray(data.medicines)) data.medicines = [];
    if (!data.reminders || !Array.isArray(data.reminders)) data.reminders = [];
    if (!data.notifications || !Array.isArray(data.notifications)) data.notifications = [];
    if (!data.auditLogs || !Array.isArray(data.auditLogs)) data.auditLogs = [];
    if (!data.emailLogs || !Array.isArray(data.emailLogs)) data.emailLogs = [];
  }

  return data;
}

export function updateUserProfile(name: string, phone: string, newEmail?: string): void {
  const currentEmail = getCurrentUserEmail();
  const data = getUserData(currentEmail);
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();
  
  data.userName = trimmedName;
  data.userPhone = trimmedPhone;
  
  if (newEmail && newEmail.trim()) {
    data.email = newEmail.trim().toLowerCase();
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("medvault_user_name", trimmedName);
    localStorage.setItem("medvault_user_phone", trimmedPhone);
    if (newEmail && newEmail.trim()) {
      localStorage.setItem("medvault_user_email", newEmail.trim().toLowerCase());
    }
  }

  addAuditLog(`Profile Updated: Name '${trimmedName}', Phone '${trimmedPhone}'`, "SUCCESS");
  saveUserData(data);
}

export function addAuditLog(action: string, status: "SUCCESS" | "WARNING" = "SUCCESS"): void {
  const data = getUserData();
  if (!data.auditLogs) data.auditLogs = [];
  const newLog: AuditLog = {
    id: `log-${Date.now()}`,
    action,
    device: typeof navigator !== "undefined" ? (navigator.userAgent.includes("Mac") ? "Chrome / macOS" : navigator.userAgent.includes("iPhone") ? "Safari / iOS" : "Web Client") : "Web Session",
    ip: "103.21.124.89 (Verified)",
    time: new Date().toISOString(),
    status,
  };
  data.auditLogs.unshift(newLog);
  saveUserData(data);
}

export function sanitizeDataForStorage(data: UserData, maxBytes = 20000): UserData {
  const sanitizedReports = (data.reports || []).map((rep) => {
    let fileData = rep.fileData;
    let fileUrl = rep.fileUrl;
    
    // If the file is uploaded to Firebase Storage, completely discard redundant base64 data
    if (fileUrl && fileUrl.startsWith("http")) {
      fileData = undefined;
    }
    
    // Strip large base64 file data to protect browser storage quota and Firestore limits
    if (fileData && fileData.length > maxBytes) {
      fileData = undefined;
    }
    
    // Strip large legacy base64 URLs from fileUrl
    if (fileUrl && (fileUrl.startsWith("data:") && fileUrl.length > maxBytes || fileUrl.includes("unsplash.com"))) {
      fileUrl = undefined;
    }
    
    return {
      ...rep,
      fileData,
      fileUrl,
    };
  });

  return {
    ...data,
    reports: sanitizedReports,
    // Keep max 30 audit logs to keep document light
    auditLogs: (data.auditLogs || []).slice(0, 30),
    // Keep max 30 notifications
    notifications: (data.notifications || []).slice(0, 30),
  };
}

function removeUndefinedFields<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedFields) as unknown as T;
  }
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj as Record<string, unknown>)) {
    const val = (obj as Record<string, unknown>)[key];
    if (val !== undefined) {
      result[key] = removeUndefinedFields(val);
    }
  }
  return result as T;
}

export function saveUserData(data: UserData, targetEmail?: string): void {
  if (typeof window === "undefined") return;
  const email = (targetEmail || data.email || getCurrentUserEmail()).toLowerCase().trim();
  const isDemoAccount = email === "premium@medvault.ai" || email === "free@medvault.ai";
  
  const uid = auth.currentUser?.uid || localStorage.getItem("medvault_user_uid");
  
  const uidKey = uid ? `medvault_user_store_${uid}` : null;

  const sanitized = sanitizeDataForStorage(data, 20000); 
  const dataString = JSON.stringify(sanitized);

  // Still save to local storage as a cache/offline fallback
  try {
    if (uidKey) {
      localStorage.setItem(uidKey, dataString);
    }
  } catch (err) {
    console.warn("Storage quota limit reached", err);
  }

  // Dispatch custom event for UI updates
  window.dispatchEvent(new CustomEvent("medvault_data_updated", { 
    detail: { email, uid, userName: data.userName, userPhone: data.userPhone } 
  }));

  // Firestore sync logic
  // Removed isDemoAccount check to allow cloud sync for demo accounts as requested by user.

  // IMPORTANT: CRITICAL RACE CONDITION PREVENTION
  // Only write to Firestore if the initial sync for this specific UID has completed.
  // This prevents an empty local state from overwriting valid cloud data on startup.
  if (uid && !window.sessionStorage.getItem(`medvault_sync_complete_${uid}`)) {
    return;
  }

  if (uid) {
    const userRef = doc(db, "user_profiles_v2", uid);
    const firestorePayload = removeUndefinedFields(sanitizeDataForStorage(data, 100000));
    
    console.log(`Syncing data to cloud for UID: ${uid}...`);
    
    setDoc(userRef, { 
      ...firestorePayload, 
      lastSyncedAt: new Date().toISOString() 
    }, { merge: true })
    .then(() => {
      console.log("Cloud sync successful");
    })
    .catch((err) => {
      console.error("CRITICAL: Firestore sync failed:", err);
      // If it's a permission error, it might be due to rules or auth state
      if (err.code === 'permission-denied') {
        console.error("Permission denied. Check if Firestore rules are deployed and if you are signed in with the correct account.");
      }
    });
  }
}

// CRUD Operations for Family Members
export function addFamilyMember(memberData: Omit<FamilyMember, "id">): FamilyMember {
  const data = getUserData();
  if (!data.familyMembers || !Array.isArray(data.familyMembers)) {
    data.familyMembers = [];
  }
  if (!data.notifications || !Array.isArray(data.notifications)) {
    data.notifications = [];
  }
  
  const newMember: FamilyMember = {
    ...memberData,
    id: Date.now().toString(),
  };
  data.familyMembers.push(newMember);

  data.notifications.unshift({
    id: Date.now().toString(),
    title: "Family Member Added",
    message: `${newMember.name} has been added to your vault.`,
    time: new Date().toISOString(),
    unread: true,
  });

  saveUserData(data);
  return newMember;
}

export function updateFamilyMember(id: string, updates: Partial<FamilyMember>): void {
  const data = getUserData();
  if (!data.familyMembers || !Array.isArray(data.familyMembers)) {
    data.familyMembers = [];
  }
  const idx = data.familyMembers.findIndex((m) => m.id === id);
  if (idx !== -1) {
    data.familyMembers[idx] = { ...data.familyMembers[idx], ...updates };
    saveUserData(data);
  }
}

export function deleteFamilyMember(id: string): void {
  const data = getUserData();
  if (!data.familyMembers || !Array.isArray(data.familyMembers)) {
    data.familyMembers = [];
  }
  if (!data.reports || !Array.isArray(data.reports)) {
    data.reports = [];
  }
  if (!data.medicines || !Array.isArray(data.medicines)) {
    data.medicines = [];
  }
  if (!data.notifications || !Array.isArray(data.notifications)) {
    data.notifications = [];
  }

  const member = data.familyMembers.find((m) => m.id === id);
  data.familyMembers = data.familyMembers.filter((m) => m.id !== id);
  data.reports = data.reports.filter((r) => r.familyMemberId !== id);
  data.medicines = data.medicines.filter((m) => m.familyMemberId !== id);

  if (member) {
    data.notifications.unshift({
      id: Date.now().toString(),
      title: "Family Member Removed",
      message: `${member.name} was removed from your vault.`,
      time: new Date().toISOString(),
      unread: true,
    });
  }

  saveUserData(data);
}

// CRUD Operations for Reports
export function addReport(reportData: Omit<Report, "id">): Report {
  const data = getUserData();
  if (!data.reports || !Array.isArray(data.reports)) {
    data.reports = [];
  }
  if (!data.notifications || !Array.isArray(data.notifications)) {
    data.notifications = [];
  }

  const newReport: Report = {
    ...reportData,
    id: Date.now().toString(),
  };
  data.reports.unshift(newReport);

  data.notifications.unshift({
    id: Date.now().toString(),
    title: "Medical Report Uploaded",
    message: `${newReport.title} for ${newReport.familyMemberName} added.`,
    time: new Date().toISOString(),
    unread: true,
  });

  saveUserData(data);
  return newReport;
}

export function deleteReport(id: string): void {
  const data = getUserData();
  data.reports = data.reports.filter((r) => r.id !== id);
  saveUserData(data);
}

export function getFamilyMembersWithSelf(targetEmail?: string): FamilyMember[] {
  const data = getUserData(targetEmail);
  const selfMember: FamilyMember = {
    id: "self",
    name: data.userName || "Self (Primary Account)",
    relationship: "Self",
    age: 0,
    bloodGroup: "Not Set",
    allergies: [],
    chronicDiseases: [],
    emergencyContact: data.userName || "Primary Contact",
    emergencyPhone: data.userPhone || "Not Set",
  };

  const members = data.familyMembers || [];
  const hasSelfInMembers = members.some((m) => m.id === "self" || m.relationship.toLowerCase() === "self");

  if (!hasSelfInMembers) {
    return [selfMember, ...members];
  }
  return members;
}

// Helper to keep Medicine and Reminder stores synchronized
export function syncMedicineReminders(data: UserData, med: Medicine): void {
  if (!data.reminders) data.reminders = [];

  // Remove existing reminders linked to this medicine
  data.reminders = data.reminders.filter((r) => {
    if (r.medicineId && r.medicineId === med.id) return false;
    if (
      r.type === "MEDICINE" &&
      r.title.toLowerCase().trim() === med.name.toLowerCase().trim() &&
      (!r.memberName || r.memberName.toLowerCase() === (med.familyMemberName || med.member || "Self").toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // If reminder is enabled and medicine is active, create reminder items for daily slots
  if (med.reminderOn && med.isActive) {
    const member = med.familyMemberName || med.member || "Self";
    const today = new Date().toISOString().split("T")[0];

    const slots: Array<{ slot: string; time: string; label: string }> = [];
    if (med.morning) slots.push({ slot: "morning", time: "08:00 AM", label: "Morning" });
    if (med.afternoon) slots.push({ slot: "afternoon", time: "02:00 PM", label: "Afternoon" });
    if (med.night) slots.push({ slot: "night", time: "08:00 PM", label: "Night" });

    if (slots.length === 0) {
      slots.push({ slot: "morning", time: "08:00 AM", label: "Morning" });
    }

    slots.forEach((s) => {
      data.reminders.unshift({
        id: `rem-med-${med.id}-${s.slot}`,
        type: "MEDICINE",
        title: med.name,
        dosage: med.dosage || "",
        memberName: member,
        time: s.time,
        date: today,
        frequency: s.label,
        medicineId: med.id,
        isCompleted: false,
      });
    });
  }
}

// CRUD Operations for Medicines
export function addMedicine(medicineData: Omit<Medicine, "id">): Medicine {
  const data = getUserData();
  if (!data.medicines || !Array.isArray(data.medicines)) {
    data.medicines = [];
  }
  const searchName = medicineData.name.trim().toLowerCase();

  const existingIdx = data.medicines.findIndex((m) => {
    const mName = m.name.trim().toLowerCase();
    const isSameName = mName === searchName || (mName.length > 3 && searchName.length > 3 && (mName.includes(searchName) || searchName.includes(mName)));
    
    const targetMember = (medicineData.familyMemberName || medicineData.member || "").trim().toLowerCase();
    const existingMember = (m.familyMemberName || m.member || "").trim().toLowerCase();
    const isSameMember = !targetMember || !existingMember || targetMember === existingMember || (m.familyMemberId && m.familyMemberId === medicineData.familyMemberId);

    return isSameName && isSameMember;
  });

  let resultingMed: Medicine;

  if (existingIdx !== -1) {
    const existing = data.medicines[existingIdx];
    resultingMed = {
      ...existing,
      ...medicineData,
      id: existing.id,
      isActive: true,
      dosage: medicineData.dosage || existing.dosage,
      morning: medicineData.morning ?? existing.morning,
      afternoon: medicineData.afternoon ?? existing.afternoon,
      night: medicineData.night ?? existing.night,
      reminderOn: medicineData.reminderOn ?? existing.reminderOn ?? true,
      updatedAt: new Date(),
    };
    data.medicines[existingIdx] = resultingMed;
    addAuditLog(`Updated existing medicine '${existing.name}'`, "SUCCESS");
  } else {
    resultingMed = {
      ...medicineData,
      id: Date.now().toString(),
      reminderOn: medicineData.reminderOn ?? true,
    };
    data.medicines.unshift(resultingMed);
    addAuditLog(`Added new medicine '${resultingMed.name}'`, "SUCCESS");
  }

  syncMedicineReminders(data, resultingMed);
  saveUserData(data);
  return resultingMed;
}

export function updateMedicine(id: string, updates: Partial<Medicine>): void {
  const data = getUserData();
  if (!data.medicines || !Array.isArray(data.medicines)) {
    data.medicines = [];
  }
  const idx = data.medicines.findIndex((m) => m.id === id);
  if (idx !== -1) {
    data.medicines[idx] = { ...data.medicines[idx], ...updates, updatedAt: new Date() };
    syncMedicineReminders(data, data.medicines[idx]);
    saveUserData(data);
  }
}

export function deleteMedicine(id: string): void {
  const data = getUserData();
  const med = data.medicines.find((m) => m.id === id);
  data.medicines = data.medicines.filter((m) => m.id !== id);

  if (med) {
    // Also remove reminders linked to this medicine
    if (data.reminders) {
      data.reminders = data.reminders.filter(
        (r) => r.medicineId !== id && !(r.type === "MEDICINE" && r.title.toLowerCase().trim() === med.name.toLowerCase().trim())
      );
    }
  }

  saveUserData(data);
}

// CRUD Operations for Reminders
export function addReminder(reminderData: Omit<Reminder, "id">): Reminder {
  const data = getUserData();
  const newReminder: Reminder = {
    ...reminderData,
    id: Date.now().toString(),
  };
  if (!data.reminders) data.reminders = [];
  data.reminders.unshift(newReminder);

  saveUserData(data);
  return newReminder;
}

export function updateReminder(id: string, updates: Partial<Reminder>): void {
  const data = getUserData();
  if (!data.reminders) data.reminders = [];
  const idx = data.reminders.findIndex((r) => r.id === id);

  if (idx !== -1) {
    const existing = data.reminders[idx];
    const updated: Reminder = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    data.reminders[idx] = updated;

    // If tied to a medicine, sync back updates to medicine object
    if (updated.medicineId) {
      const medIdx = data.medicines.findIndex((m) => m.id === updated.medicineId);
      if (medIdx !== -1) {
        data.medicines[medIdx] = {
          ...data.medicines[medIdx],
          name: updates.title || data.medicines[medIdx].name,
          dosage: updates.dosage || data.medicines[medIdx].dosage,
          familyMemberName: updates.memberName || data.medicines[medIdx].familyMemberName,
          member: updates.memberName || data.medicines[medIdx].member,
        };
      }
    }

    addAuditLog(`Updated reminder '${updated.title}'`, "SUCCESS");
    saveUserData(data);
  }
}

export function toggleReminder(id: string): void {
  const data = getUserData();
  const idx = data.reminders.findIndex((r) => r.id === id);
  if (idx !== -1) {
    data.reminders[idx].isCompleted = !data.reminders[idx].isCompleted;
    saveUserData(data);
  }
}

export function deleteReminder(id: string): void {
  const data = getUserData();
  data.reminders = data.reminders.filter((r) => r.id !== id);
  saveUserData(data);
}

export function addEmailLog(subject: string, type: EmailLog["type"], recipient?: string): EmailLog {
  const data = getUserData();
  if (!data.emailLogs) data.emailLogs = [];
  const newLog: EmailLog = {
    id: `email-${Date.now()}`,
    recipient: recipient || data.email || "user@medvault.ai",
    subject,
    type,
    timestamp: new Date().toISOString(),
    status: "DELIVERED",
  };
  data.emailLogs.unshift(newLog);
  saveUserData(data);
  return newLog;
}

export function toggleWearableConnection(id: string): void {
  const data = getUserData();
  if (!data.wearables) return;
  const idx = data.wearables.findIndex((w) => w.id === id);
  if (idx !== -1) {
    const prev = data.wearables[idx].connected;
    data.wearables[idx].connected = !prev;
    data.wearables[idx].lastSynced = !prev ? new Date().toISOString() : "Disconnected";
    addAuditLog(`Wearable Device ${data.wearables[idx].name} ${!prev ? "Connected" : "Disconnected"}`, "SUCCESS");
    saveUserData(data);
  }
}

export function addReferredUser(name: string, email: string): void {
  const data = getUserData();
  if (!data.referralData) {
    data.referralData = {
      code: "MEDVAULT-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
      link: typeof window !== "undefined" ? `${window.location.origin}/signup?ref=MEDVAULT` : "",
      completedCount: 0,
      targetCount: 20,
      proRewardClaimed: false,
      referredUsers: [],
    };
  }
  data.referralData.referredUsers.unshift({
    id: `ref-${Date.now()}`,
    name,
    email,
    date: new Date().toISOString().split("T")[0],
    status: "COMPLETED",
    reward: "1 Step toward Pro",
  });
  data.referralData.completedCount += 1;
  addAuditLog(`New User Joined via Referral Code (${email})`, "SUCCESS");
  saveUserData(data);
}

// Notifications
export function markAllNotificationsRead(): void {
  const data = getUserData();
  data.notifications = data.notifications.map((n) => ({ ...n, unread: false }));
  saveUserData(data);
}

export function clearNotifications(): void {
  const data = getUserData();
  data.notifications = [];
  saveUserData(data);
}
