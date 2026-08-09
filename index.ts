// MedVault AI — TypeScript Types

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type Relationship =
  | 'Self'
  | 'Spouse'
  | 'Child'
  | 'Parent'
  | 'Sibling'
  | 'Grandparent'
  | 'Other';

export type ReportType =
  | 'LAB_REPORT'
  | 'PRESCRIPTION'
  | 'SCAN'
  | 'BILL'
  | 'VACCINATION'
  | 'OTHER';

export type ReminderType =
  | 'MEDICINE'
  | 'APPOINTMENT'
  | 'LAB_TEST'
  | 'VACCINATION'
  | 'OTHER';

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name?: string;
  avatar?: string;
  language: string;
  darkMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FamilyMember {
  id: string;
  userId?: string;
  name: string;
  relationship: Relationship;
  dateOfBirth?: Date;
  age?: number;
  bloodGroup?: BloodGroup;
  photo?: string;
  avatar?: string;
  allergies: string[];
  chronicDiseases: string[];
  emergencyContact?: string;
  emergencyPhone?: string;
  createdAt?: Date;
  updatedAt?: Date;
  reports?: Report[];
  medicines?: Medicine[];
  visits?: Visit[];
}

export interface ReportParameter {
  name: string;
  value: number;
  unit: string;
  referenceRange?: string;
  isNormal?: boolean;
  date?: string;
  sourceReportId?: string;
  sourceReportTitle?: string;
}

export interface Report {
  id: string;
  familyMemberId: string;
  familyMemberName?: string;
  title: string;
  type?: ReportType | string;
  category?: string;
  date?: string;
  uploadDate?: string;
  fileUrl?: string;
  fileData?: string;
  fileType?: string;
  fileSize?: string;
  status?: string;
  hospitalName?: string;
  doctorName?: string;
  diagnosis?: string;
  summary?: string;
  medicines?: string[];
  notes?: string;
  reportDate?: string | Date;
  ocrText?: string;
  aiSummary?: string;
  tags?: string[];
  keyValues?: Record<string, string>;
  keyLabResults?: Array<{ testName: string; result: string; reference: string }>;
  aiAnalysis?: Record<string, unknown>;
  extractedParameters?: ReportParameter[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Medicine {
  id: string;
  familyMemberId: string;
  familyMemberName?: string;
  memberName?: string;
  member?: string;
  name: string;
  dosage: string;
  frequency?: string;
  time?: string;
  timing?: string;
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  startDate?: string | Date;
  endDate?: string | Date;
  isActive: boolean;
  reminderOn: boolean;
  prescribedBy?: string;
  purpose?: string;
  instructions?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Visit {
  id: string;
  familyMemberId: string;
  doctorName: string;
  hospitalName?: string;
  visitDate?: string | Date;
  reason?: string;
  notes?: string;
  nextVisit?: string | Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Reminder {
  id: string;
  userId?: string;
  title: string;
  type: ReminderType;
  scheduledAt?: string | Date;
  time?: string;
  date?: string;
  category?: string;
  person?: string;
  memberName?: string;
  dosage?: string;
  medicineId?: string;
  frequency?: string;
  isCompleted: boolean;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource?: string;
  details?: string;
  ipAddress?: string;
  device?: string;
  ip?: string;
  time?: string;
  status?: "SUCCESS" | "WARNING" | string;
  createdAt?: Date;
}

export interface OCRResult {
  text: string;
  doctorName?: string;
  hospitalName?: string;
  medicines: string[];
  diagnosis?: string;
  date?: string;
  confidence: number;
}

export interface AIExplanation {
  medicineName: string;
  usage: string;
  sideEffects: string[];
  precautions: string[];
  simpleSummary: string;
}

export interface DashboardStats {
  totalMembers: number;
  totalReports: number;
  upcomingReminders: number;
  storageUsed: number;
  storageLimit: number;
}
