import fs from 'fs';
import path from 'path';

const premiumData = {
  email: "premium@medvault.ai",
  userName: "Arjun Sharma",
  userPhone: "+91 98765 43210",
  userAge: 34,
  userGender: "Male",
  userHeight: 178,
  userWeight: 74,
  userBloodGroup: "O+",
  userAddress: "402, Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103",
  plan: "PREMIUM",
  healthScore: 82,
  healthScoreReason: "Your overall family health score is 82/100 (Good Standing). Key positive factors include excellent medication adherence (96%), optimal thyroid control for Sunita, and clear pediatric vitals for Aarav and Ananya. Action areas: Rajesh's HbA1c is moderately elevated at 7.2% and Arjun's Vitamin D3 is deficient at 18.4 ng/mL.",
  
  settings: {
    darkMode: true,
    pinEnabled: true,
    autoLogoutEnabled: true,
    backupEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  },

  familyMembers: [
    {
      id: "fm-father",
      name: "Rajesh Sharma",
      relationship: "Father / Parent",
      age: 62,
      bloodGroup: "O+",
      height: 172,
      weight: 78,
      emergencyContact: "Priya Sharma (Wife)",
      emergencyPhone: "+91 98765 43210",
      allergies: ["Penicillin", "Dust Mites"],
      chronicDiseases: ["Type 2 Diabetes", "Hypertension"],
      currentMedicines: ["Metformin 500mg", "Amlodipine 5mg", "Atorvastatin 10mg", "Glimepiride 2mg", "Pantoprazole 40mg"],
      insuranceProvider: "HDFC ERGO Health Insurance",
      policyNumber: "HDFC-ERGO-998241",
      primaryDoctor: "Dr. Ramesh Mehta",
      doctorPhone: "+91 98450 12345",
      hospital: "Apollo Hospitals, Indiranagar, Bengaluru",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "fm-mother",
      name: "Sunita Sharma",
      relationship: "Mother / Parent",
      age: 58,
      bloodGroup: "B+",
      height: 160,
      weight: 65,
      emergencyContact: "Arjun Sharma (Son)",
      emergencyPhone: "+91 98765 43210",
      allergies: ["Sulfa Drugs"],
      chronicDiseases: ["Hypothyroidism", "Osteoarthritis"],
      currentMedicines: ["Thyronorm 50mcg", "Calperum D3"],
      insuranceProvider: "HDFC ERGO Health Insurance",
      policyNumber: "HDFC-ERGO-998242",
      primaryDoctor: "Dr. Ananya Rao",
      doctorPhone: "+91 98451 23456",
      hospital: "Fortis Hospital, Bannerghatta, Bengaluru",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "fm-wife",
      name: "Neha Sharma",
      relationship: "Wife / Spouse",
      age: 32,
      bloodGroup: "A+",
      height: 165,
      weight: 58,
      emergencyContact: "Arjun Sharma (Husband)",
      emergencyPhone: "+91 98765 43210",
      allergies: ["NSAIDs / Ibuprofen"],
      chronicDiseases: ["Episodic Migraine"],
      currentMedicines: ["Naproxen 250mg", "Folvite 5mg"],
      insuranceProvider: "HDFC ERGO Health Insurance",
      policyNumber: "HDFC-ERGO-998243",
      primaryDoctor: "Dr. Sunita Kapoor",
      doctorPhone: "+91 98452 34567",
      hospital: "Manipal Hospital, Old Airport Rd, Bengaluru",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "fm-son",
      name: "Aarav Sharma",
      relationship: "Son / Child",
      age: 7,
      bloodGroup: "O+",
      height: 122,
      weight: 23,
      emergencyContact: "Neha Sharma (Mother)",
      emergencyPhone: "+91 98765 43210",
      allergies: ["Peanuts"],
      chronicDiseases: ["Mild Pediatric Asthma"],
      currentMedicines: ["Levolin Inhaler 50mcg", "Cetirizine 10mg"],
      insuranceProvider: "HDFC ERGO Health Insurance",
      policyNumber: "HDFC-ERGO-998244",
      primaryDoctor: "Dr. Vikram Seth",
      doctorPhone: "+91 98453 45678",
      hospital: "Rainbow Children's Hospital, Marathahalli, Bengaluru",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "fm-daughter",
      name: "Ananya Sharma",
      relationship: "Daughter / Child",
      age: 3,
      bloodGroup: "B+",
      height: 95,
      weight: 14,
      emergencyContact: "Arjun Sharma (Father)",
      emergencyPhone: "+91 98765 43210",
      allergies: ["None Known"],
      chronicDiseases: ["None"],
      currentMedicines: ["Pediatric Multi-Vitamin Syrup"],
      insuranceProvider: "HDFC ERGO Health Insurance",
      policyNumber: "HDFC-ERGO-998245",
      primaryDoctor: "Dr. Vikram Seth",
      doctorPhone: "+91 98453 45678",
      hospital: "Rainbow Children's Hospital, Marathahalli, Bengaluru",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "fm-grandmother",
      name: "Kamala Sharma",
      relationship: "Grandmother",
      age: 84,
      bloodGroup: "AB+",
      height: 152,
      weight: 54,
      emergencyContact: "Rajesh Sharma (Son)",
      emergencyPhone: "+91 98765 43210",
      allergies: ["Codeine"],
      chronicDiseases: ["Osteoporosis", "Hypertension", "Mild Cataract"],
      currentMedicines: ["Amlodipine 2.5mg", "Shelcal 500", "Evion 400", "Telmisartan 40mg"],
      insuranceProvider: "Star Health Senior Citizen Insurance",
      policyNumber: "STAR-HEALTH-771204",
      primaryDoctor: "Dr. S. K. Gupta",
      doctorPhone: "+91 98100 55443",
      hospital: "Max Super Speciality Hospital, Saket, New Delhi",
      photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80"
    }
  ],

  reports: [
    {
      id: "rep-101",
      familyMemberId: "fm-father",
      familyMemberName: "Rajesh Sharma",
      title: "Complete Blood Count (CBC) & Hemogram",
      type: "LAB_REPORT",
      hospitalName: "Apollo Hospitals, Indiranagar",
      doctorName: "Dr. Ramesh Mehta",
      reportDate: "2026-07-28",
      diagnosis: "Mild Normocytic Anemia, Normal Leukocyte & Platelet Counts",
      summary: "Hemoglobin is 12.8 g/dL (slightly lower than normal range 13.5-17.5). White blood cell count and platelet counts are within optimal limits.",
      riskLevel: "Low",
      medicines: ["Iron Folate Tablet 100mg"],
      labParameters: [
        { name: "Hemoglobin", value: "12.8", unit: "g/dL", referenceRange: "13.5 - 17.5", status: "Low" },
        { name: "Total WBC Count", value: "7,400", unit: "cells/mcL", referenceRange: "4,000 - 11,000", status: "Normal" },
        { name: "Platelet Count", value: "245,000", unit: "/mcL", referenceRange: "150,000 - 450,000", status: "Normal" },
        { name: "Packed Cell Volume (PCV)", value: "39.2", unit: "%", referenceRange: "40 - 50", status: "Borderline" }
      ],
      aiExplanation: "The blood count reveals mild anemia with a hemoglobin of 12.8 g/dL. Compared to his previous CBC from February (12.2 g/dL), there is steady improvement. No infection markers present.",
      recommendations: "Include iron-rich foods such as pomegranate, spinach, and lentils. Recheck CBC in 3 months.",
      healthScoreImpact: "-2 points (Mild hemoglobin deficit)"
    },
    {
      id: "rep-102",
      familyMemberId: "fm-father",
      familyMemberName: "Rajesh Sharma",
      title: "HbA1c & Fasting Glycemic Evaluation",
      type: "LAB_REPORT",
      hospitalName: "Apollo Hospitals, Indiranagar",
      doctorName: "Dr. Ramesh Mehta",
      reportDate: "2026-07-15",
      diagnosis: "Type 2 Diabetes Mellitus - Moderately Controlled (HbA1c 7.2%)",
      summary: "Glycated Hemoglobin (HbA1c) is 7.2%. Fasting Blood Glucose is 138 mg/dL and Post-Prandial Blood Sugar is 182 mg/dL.",
      riskLevel: "Moderate",
      medicines: ["Metformin 500mg", "Glimepiride 2mg"],
      labParameters: [
        { name: "HbA1c", value: "7.2", unit: "%", referenceRange: "< 5.7% (Normal), 5.7-6.4% (Prediabetes)", status: "High" },
        { name: "Fasting Blood Sugar", value: "138", unit: "mg/dL", referenceRange: "70 - 99", status: "High" },
        { name: "Post-Prandial Glucose", value: "182", unit: "mg/dL", referenceRange: "< 140", status: "High" }
      ],
      aiExplanation: "HbA1c has improved from 7.8% in Feb 2026 to 7.2% today, demonstrating good response to Metformin 500mg and daily dietary regulation.",
      recommendations: "Maintain daily 30-minute post-dinner walk, restrict refined carbohydrates, and continue present oral hypoglycemic agents.",
      healthScoreImpact: "-4 points (Moderately elevated glycemic index)"
    },
    {
      id: "rep-103",
      familyMemberId: "fm-mother",
      familyMemberName: "Sunita Sharma",
      title: "Comprehensive Liver Function Test (LFT)",
      type: "LAB_REPORT",
      hospitalName: "Fortis Hospital, Bannerghatta",
      doctorName: "Dr. Ananya Rao",
      reportDate: "2026-06-20",
      diagnosis: "Optimal Hepatic Biomarkers & Normal Bilirubin Profile",
      summary: "Liver enzyme levels (SGPT/ALT: 22 U/L, SGOT/AST: 26 U/L) and Total Bilirubin (0.8 mg/dL) are well within optimal reference limits.",
      riskLevel: "Low",
      medicines: [],
      labParameters: [
        { name: "ALT / SGPT", value: "22", unit: "U/L", referenceRange: "7 - 56", status: "Normal" },
        { name: "AST / SGOT", value: "26", unit: "U/L", referenceRange: "10 - 40", status: "Normal" },
        { name: "Total Bilirubin", value: "0.8", unit: "mg/dL", referenceRange: "0.1 - 1.2", status: "Normal" },
        { name: "Serum Albumin", value: "4.2", unit: "g/dL", referenceRange: "3.5 - 5.2", status: "Normal" }
      ],
      aiExplanation: "All hepatic enzymes show clean metabolic clearance with zero signs of fatty liver infiltration or drug toxicity.",
      recommendations: "Continue current healthy Mediterranean-style diet and regular hydration.",
      healthScoreImpact: "+3 points (Optimal organ wellness)"
    },
    {
      id: "rep-104",
      familyMemberId: "fm-grandmother",
      familyMemberName: "Kamala Sharma",
      title: "Kidney Function & Electrolyte Panel",
      type: "LAB_REPORT",
      hospitalName: "Max Super Speciality Hospital, Saket",
      doctorName: "Dr. S. K. Gupta",
      reportDate: "2026-06-05",
      diagnosis: "Mild Age-Related Renal Clearance Reduction (Serum Creatinine 1.2 mg/dL)",
      summary: "Serum Creatinine is 1.2 mg/dL with Blood Urea Nitrogen (BUN) at 22 mg/dL. Electrolytes (Sodium, Potassium) are well balanced.",
      riskLevel: "Moderate",
      medicines: ["Amlodipine 2.5mg", "Telmisartan 40mg"],
      labParameters: [
        { name: "Serum Creatinine", value: "1.2", unit: "mg/dL", referenceRange: "0.6 - 1.1", status: "Slightly High" },
        { name: "eGFR", value: "58", unit: "mL/min/1.73m2", referenceRange: "> 60", status: "Borderline" },
        { name: "Serum Potassium", value: "4.3", unit: "mEq/L", referenceRange: "3.5 - 5.1", status: "Normal" },
        { name: "Serum Sodium", value: "139", unit: "mEq/L", referenceRange: "135 - 145", status: "Normal" }
      ],
      aiExplanation: "Serum Creatinine of 1.2 mg/dL reflects expected age-related physiological decline for an 84-year-old. Potassium is safely normal under ACE/ARB therapy.",
      recommendations: "Ensure 2 Liters of fluids daily, avoid OTC pain medications (NSAIDs), and recheck renal panel in 6 months.",
      healthScoreImpact: "-3 points (Age-adjusted renal monitoring)"
    },
    {
      id: "rep-105",
      familyMemberId: "fm-mother",
      familyMemberName: "Sunita Sharma",
      title: "Thyroid Profile (TSH, FT3, FT4)",
      type: "LAB_REPORT",
      hospitalName: "Fortis Hospital, Bannerghatta",
      doctorName: "Dr. Ananya Rao",
      reportDate: "2026-05-18",
      diagnosis: "Euthyroid State Maintained Under Thyronorm 50mcg",
      summary: "Thyroid Stimulating Hormone (TSH) is 2.4 uIU/mL. Free T4 is 1.3 ng/dL, indicating optimal dosage equilibrium.",
      riskLevel: "Low",
      medicines: ["Thyronorm 50mcg"],
      labParameters: [
        { name: "TSH", value: "2.4", unit: "uIU/mL", referenceRange: "0.4 - 4.2", status: "Normal" },
        { name: "Free T4", value: "1.3", unit: "ng/dL", referenceRange: "0.8 - 1.8", status: "Normal" },
        { name: "Free T3", value: "3.1", unit: "pg/mL", referenceRange: "2.3 - 4.2", status: "Normal" }
      ],
      aiExplanation: "Thyroid function is completely normalized. The current Thyronorm dosage of 50mcg daily is perfectly tailored.",
      recommendations: "Take Thyronorm daily early morning on an empty stomach with plain water at least 45 minutes before breakfast.",
      healthScoreImpact: "+4 points (Hormonal balance achieved)"
    },
    {
      id: "rep-106",
      familyMemberId: "fm-self",
      familyMemberName: "Arjun Sharma",
      title: "Vitamin D3 (25-OH) Quantitative Test",
      type: "LAB_REPORT",
      hospitalName: "Manipal Hospital, Old Airport Rd",
      doctorName: "Dr. Sunita Kapoor",
      reportDate: "2026-05-02",
      diagnosis: "Vitamin D Deficiency (18.4 ng/mL)",
      summary: "Serum 25-Hydroxy Vitamin D level is 18.4 ng/mL, which falls below the recommended 30-100 ng/mL sufficient range.",
      riskLevel: "Moderate",
      medicines: ["Vitamin D3 60,000 IU Capsule"],
      labParameters: [
        { name: "25-OH Vitamin D Total", value: "18.4", unit: "ng/mL", referenceRange: "30 - 100", status: "Deficient" }
      ],
      aiExplanation: "Vitamin D level is low at 18.4 ng/mL. This is very common in urban professionals working indoors.",
      recommendations: "Take Vitamin D3 60,000 IU weekly for 8 consecutive weeks, followed by monthly maintenance. Spend 15 minutes in morning sunlight.",
      healthScoreImpact: "-3 points (Nutritional deficiency detected)"
    },
    {
      id: "rep-107",
      familyMemberId: "fm-wife",
      familyMemberName: "Neha Sharma",
      title: "Serum Vitamin B12 & Folate Assessment",
      type: "LAB_REPORT",
      hospitalName: "Manipal Hospital, Old Airport Rd",
      doctorName: "Dr. Sunita Kapoor",
      reportDate: "2026-04-14",
      diagnosis: "Optimal Serum Vitamin B12 & Normal Folate Concentration",
      summary: "Vitamin B12 is 520 pg/mL (normal 200-900) and Serum Folate is 12.5 ng/mL (normal > 3.0 ng/mL).",
      riskLevel: "Low",
      medicines: ["Folvite 5mg"],
      labParameters: [
        { name: "Vitamin B12", value: "520", unit: "pg/mL", referenceRange: "200 - 900", status: "Normal" },
        { name: "Folate", value: "12.5", unit: "ng/mL", referenceRange: "> 3.0", status: "Normal" }
      ],
      aiExplanation: "Cobalamin and folate levels are robust, providing ideal nerve health and red blood cell maturation.",
      recommendations: "Continue current healthy vegetarian diet supplemented with green leafy vegetables and dairy.",
      healthScoreImpact: "+2 points"
    },
    {
      id: "rep-108",
      familyMemberId: "fm-father",
      familyMemberName: "Rajesh Sharma",
      title: "Comprehensive Lipid Profile & Cardiovascular Risk",
      type: "LAB_REPORT",
      hospitalName: "Apollo Hospitals, Indiranagar",
      doctorName: "Dr. Ramesh Mehta",
      reportDate: "2026-03-30",
      diagnosis: "Controlled Dyslipidemia on Atorvastatin 10mg Therapy",
      summary: "Total Cholesterol is 172 mg/dL, LDL Cholesterol is 94 mg/dL (target <100), and Triglycerides are 140 mg/dL.",
      riskLevel: "Low",
      medicines: ["Atorvastatin 10mg"],
      labParameters: [
        { name: "Total Cholesterol", value: "172", unit: "mg/dL", referenceRange: "< 200", status: "Desirable" },
        { name: "LDL Cholesterol", value: "94", unit: "mg/dL", referenceRange: "< 100", status: "Optimal" },
        { name: "HDL Cholesterol", value: "46", unit: "mg/dL", referenceRange: "> 40", status: "Normal" },
        { name: "Triglycerides", value: "140", unit: "mg/dL", referenceRange: "< 150", status: "Normal" }
      ],
      aiExplanation: "Significant improvement seen compared to December 2025 when LDL was 138 mg/dL. Atorvastatin 10mg has successfully reduced vascular risk.",
      recommendations: "Maintain Atorvastatin 10mg at night and continue low saturated fat diet.",
      healthScoreImpact: "+4 points (Vascular risk control)"
    },
    {
      id: "rep-109",
      familyMemberId: "fm-son",
      familyMemberName: "Aarav Sharma",
      title: "Chest X-Ray (PA View)",
      type: "SCAN",
      hospitalName: "Rainbow Children's Hospital, Marathahalli",
      doctorName: "Dr. Vikram Seth",
      reportDate: "2026-03-12",
      diagnosis: "Clear Lung Fields, Normal Broncho-vascular Markings",
      summary: "Digital Chest Radiograph reveals clear bilateral lung fields without focal consolidation, pleural effusion, or acute asthmatic hyperinflation.",
      riskLevel: "Low",
      medicines: ["Levolin Inhaler 50mcg"],
      labParameters: [
        { name: "Lung Parenchyma", value: "Clear Bilaterally", unit: "-", referenceRange: "Clear", status: "Normal" },
        { name: "Mediastinum & Heart", value: "Normal Contour", unit: "-", referenceRange: "Normal", status: "Normal" }
      ],
      aiExplanation: "Radiography confirms zero lower respiratory tract congestion or bronchial hyper-expansion.",
      recommendations: "Keep Levolin spacer inhaler accessible for seasonal allergy exposure.",
      healthScoreImpact: "+3 points"
    },
    {
      id: "rep-110",
      familyMemberId: "fm-father",
      familyMemberName: "Rajesh Sharma",
      title: "12-Lead Resting Electrocardiogram (ECG)",
      type: "SCAN",
      hospitalName: "Apollo Hospitals, Indiranagar",
      doctorName: "Dr. Ramesh Mehta",
      reportDate: "2026-02-25",
      diagnosis: "Normal Sinus Rhythm, HR 68 bpm, No ST-T Ischemic Changes",
      summary: "Resting 12-lead ECG shows normal sinus rhythm with heart rate of 68 bpm. PR, QRS, and QTc intervals are strictly normal.",
      riskLevel: "Low",
      medicines: ["Amlodipine 5mg"],
      labParameters: [
        { name: "Heart Rate", value: "68", unit: "bpm", referenceRange: "60 - 100", status: "Normal" },
        { name: "PR Interval", value: "152", unit: "ms", referenceRange: "120 - 200", status: "Normal" },
        { name: "QRS Duration", value: "88", unit: "ms", referenceRange: "80 - 120", status: "Normal" }
      ],
      aiExplanation: "Cardiac electrical conduction is healthy without any signs of myocardial strain or prior ischemia.",
      recommendations: "Routine annual cardiac follow-up.",
      healthScoreImpact: "+4 points (Normal cardiac electrophysiology)"
    },
    {
      id: "rep-111",
      familyMemberId: "fm-wife",
      familyMemberName: "Neha Sharma",
      title: "Neurology Consultation & Migraine Management",
      type: "PRESCRIPTION",
      hospitalName: "Manipal Hospital, Old Airport Rd",
      doctorName: "Dr. Sunita Kapoor",
      reportDate: "2026-02-10",
      diagnosis: "Episodic Migraine Without Aura",
      summary: "Clinical evaluation confirms episodic migraine triggered by dehydration and stress. Abortive medication prescribed.",
      riskLevel: "Low",
      medicines: ["Naproxen 250mg"],
      labParameters: [
        { name: "Monthly Frequency", value: "1-2 Episodes", unit: "episodes/mo", referenceRange: "< 4", status: "Mild" }
      ],
      aiExplanation: "Prescription tailored for acute episode relief. Patient advised on trigger tracking via digital journal.",
      recommendations: "Maintain consistent hydration (2.5L daily), limit caffeine intake, and ensure 7-8 hours sleep.",
      healthScoreImpact: "+1 point"
    },
    {
      id: "rep-112",
      familyMemberId: "fm-daughter",
      familyMemberName: "Ananya Sharma",
      title: "Pediatric Wellness & Immunization Clearance",
      type: "VACCINATION",
      hospitalName: "Rainbow Children's Hospital, Marathahalli",
      doctorName: "Dr. Vikram Seth",
      reportDate: "2026-02-01",
      diagnosis: "3-Year Developmental Milestones Met & Annual Flu Shot Completed",
      summary: "Growth percentiles: Height 65th percentile, Weight 58th percentile. Received Influenza Quadrivalent Vaccine.",
      riskLevel: "Low",
      medicines: ["Pediatric Multi-Vitamin Syrup"],
      labParameters: [
        { name: "Height Percentile", value: "65th", unit: "%ile", referenceRange: "15 - 85", status: "Normal" },
        { name: "Weight Percentile", value: "58th", unit: "%ile", referenceRange: "15 - 85", status: "Normal" }
      ],
      aiExplanation: "All milestone markers, cognitive progress, and vaccination schedules are up to date.",
      recommendations: "Schedule 4-year pediatric developmental review in Feb 2027.",
      healthScoreImpact: "+2 points"
    }
  ],

  medicines: [
    {
      id: "med-1",
      familyMemberId: "fm-father",
      familyMemberName: "Rajesh Sharma",
      member: "Rajesh Sharma",
      name: "Metformin ER",
      dosage: "500mg",
      morning: true,
      afternoon: false,
      night: true,
      startDate: "2026-01-15",
      isActive: true,
      reminderOn: true,
      notes: "Take immediately after breakfast and dinner",
      doctor: "Dr. Ramesh Mehta",
      purpose: "Type 2 Diabetes Blood Sugar Control",
      duration: "Ongoing"
    },
    {
      id: "med-2",
      familyMemberId: "fm-father",
      familyMemberName: "Rajesh Sharma",
      member: "Rajesh Sharma",
      name: "Amlodipine",
      dosage: "5mg",
      morning: true,
      afternoon: false,
      night: false,
      startDate: "2026-01-15",
      isActive: true,
      reminderOn: true,
      notes: "Take with morning glass of water",
      doctor: "Dr. Ramesh Mehta",
      purpose: "Hypertension / Blood Pressure Control",
      duration: "Ongoing"
    },
    {
      id: "med-3",
      familyMemberId: "fm-father",
      familyMemberName: "Rajesh Sharma",
      member: "Rajesh Sharma",
      name: "Atorvastatin",
      dosage: "10mg",
      morning: false,
      afternoon: false,
      night: true,
      startDate: "2026-01-15",
      isActive: true,
      reminderOn: true,
      notes: "Take at bedtime",
      doctor: "Dr. Ramesh Mehta",
      purpose: "Cholesterol & Vascular Health",
      duration: "Ongoing"
    },
    {
      id: "med-4",
      familyMemberId: "fm-father",
      familyMemberName: "Rajesh Sharma",
      member: "Rajesh Sharma",
      name: "Glimepiride",
      dosage: "2mg",
      morning: true,
      afternoon: false,
      night: false,
      startDate: "2026-02-01",
      isActive: true,
      reminderOn: true,
      notes: "Take 15 minutes before breakfast",
      doctor: "Dr. Ramesh Mehta",
      purpose: "Pancreatic Insulin Stimulation",
      duration: "Ongoing"
    },
    {
      id: "med-5",
      familyMemberId: "fm-mother",
      familyMemberName: "Sunita Sharma",
      member: "Sunita Sharma",
      name: "Thyronorm",
      dosage: "50mcg",
      morning: true,
      afternoon: false,
      night: false,
      startDate: "2025-11-10",
      isActive: true,
      reminderOn: true,
      notes: "Early morning on empty stomach with plain water",
      doctor: "Dr. Ananya Rao",
      purpose: "Hypothyroidism Hormone Balance",
      duration: "Ongoing"
    },
    {
      id: "med-6",
      familyMemberId: "fm-mother",
      familyMemberName: "Sunita Sharma",
      member: "Sunita Sharma",
      name: "Calperum D3",
      dosage: "500mg",
      morning: false,
      afternoon: true,
      night: false,
      startDate: "2026-02-15",
      isActive: true,
      reminderOn: true,
      notes: "Take after lunch",
      doctor: "Dr. Ananya Rao",
      purpose: "Bone Density & Osteoarthritis Support",
      duration: "6 Months"
    },
    {
      id: "med-7",
      familyMemberId: "fm-wife",
      familyMemberName: "Neha Sharma",
      member: "Neha Sharma",
      name: "Naproxen",
      dosage: "250mg",
      morning: false,
      afternoon: false,
      night: false,
      startDate: "2026-02-10",
      isActive: true,
      reminderOn: false,
      notes: "PRN - Take only during acute migraine onset after food",
      doctor: "Dr. Sunita Kapoor",
      purpose: "Acute Migraine Pain Abortive",
      duration: "As Needed"
    },
    {
      id: "med-8",
      familyMemberId: "fm-wife",
      familyMemberName: "Neha Sharma",
      member: "Neha Sharma",
      name: "Folvite",
      dosage: "5mg",
      morning: true,
      afternoon: false,
      night: false,
      startDate: "2026-03-01",
      isActive: true,
      reminderOn: true,
      notes: "Take after breakfast",
      doctor: "Dr. Sunita Kapoor",
      purpose: "Folic Acid Supplementation",
      duration: "3 Months"
    },
    {
      id: "med-9",
      familyMemberId: "fm-son",
      familyMemberName: "Aarav Sharma",
      member: "Aarav Sharma",
      name: "Levolin Inhaler",
      dosage: "50mcg",
      morning: false,
      afternoon: false,
      night: false,
      startDate: "2026-03-12",
      isActive: true,
      reminderOn: false,
      notes: "2 puffs with pediatric spacer during wheezing or allergen exposure",
      doctor: "Dr. Vikram Seth",
      purpose: "Asthma Bronchodilator",
      duration: "As Needed"
    },
    {
      id: "med-10",
      familyMemberId: "fm-grandmother",
      familyMemberName: "Kamala Sharma",
      member: "Kamala Sharma",
      name: "Shelcal 500",
      dosage: "500mg",
      morning: true,
      afternoon: false,
      night: false,
      startDate: "2025-08-01",
      isActive: true,
      reminderOn: true,
      notes: "Take after breakfast",
      doctor: "Dr. S. K. Gupta",
      purpose: "Osteoporosis Management",
      duration: "Ongoing"
    },
    {
      id: "med-11",
      familyMemberId: "fm-grandmother",
      familyMemberName: "Kamala Sharma",
      member: "Kamala Sharma",
      name: "Evion 400",
      dosage: "400mg",
      morning: false,
      afternoon: true,
      night: false,
      startDate: "2025-08-01",
      isActive: true,
      reminderOn: true,
      notes: "Take after lunch",
      doctor: "Dr. S. K. Gupta",
      purpose: "Vitamin E Antioxidant Support",
      duration: "Ongoing"
    },
    {
      id: "med-12",
      familyMemberId: "fm-self",
      familyMemberName: "Arjun Sharma",
      member: "Arjun Sharma",
      name: "Vitamin D3 60K IU",
      dosage: "60,000 IU",
      morning: true,
      afternoon: false,
      night: false,
      startDate: "2026-05-05",
      isActive: true,
      reminderOn: true,
      notes: "Weekly once on Sunday after breakfast",
      doctor: "Dr. Sunita Kapoor",
      purpose: "Vitamin D Deficiency Treatment",
      duration: "8 Weeks"
    },
    {
      id: "med-13",
      familyMemberId: "fm-father",
      familyMemberName: "Rajesh Sharma",
      member: "Rajesh Sharma",
      name: "Pantoprazole",
      dosage: "40mg",
      morning: true,
      afternoon: false,
      night: false,
      startDate: "2026-04-10",
      isActive: true,
      reminderOn: true,
      notes: "Take empty stomach before breakfast",
      doctor: "Dr. Ramesh Mehta",
      purpose: "Gastro-Protection & Acidity",
      duration: "1 Month"
    },
    {
      id: "med-14",
      familyMemberId: "fm-grandmother",
      familyMemberName: "Kamala Sharma",
      member: "Kamala Sharma",
      name: "Telmisartan",
      dosage: "40mg",
      morning: true,
      afternoon: false,
      night: false,
      startDate: "2025-10-15",
      isActive: true,
      reminderOn: true,
      notes: "Take with morning water",
      doctor: "Dr. S. K. Gupta",
      purpose: "Senior Hypertension Control",
      duration: "Ongoing"
    },
    {
      id: "med-15",
      familyMemberId: "fm-son",
      familyMemberName: "Aarav Sharma",
      member: "Aarav Sharma",
      name: "Cetirizine Syrup",
      dosage: "5ml",
      morning: false,
      afternoon: false,
      night: true,
      startDate: "2026-06-01",
      isActive: true,
      reminderOn: true,
      notes: "Take at bedtime during allergy seasonal changes",
      doctor: "Dr. Vikram Seth",
      purpose: "Allergic Rhinitis Symptom Control",
      duration: "14 Days"
    }
  ],

  reminders: [
    { id: "rem-1", title: "Metformin 500mg (Morning Dose)", time: "08:00 AM", type: "MEDICINE", isCompleted: true, date: "2026-08-04", memberName: "Rajesh Sharma" },
    { id: "rem-2", title: "Thyronorm 50mcg (Empty Stomach)", time: "07:00 AM", type: "MEDICINE", isCompleted: true, date: "2026-08-04", memberName: "Sunita Sharma" },
    { id: "rem-3", title: "Amlodipine 5mg (BP Check)", time: "08:30 AM", type: "MEDICINE", isCompleted: true, date: "2026-08-04", memberName: "Rajesh Sharma" },
    { id: "rem-4", title: "Telmisartan 40mg", time: "09:00 AM", type: "MEDICINE", isCompleted: true, date: "2026-08-04", memberName: "Kamala Sharma" },
    { id: "rem-5", title: "Calperum D3 (Post Lunch)", time: "01:30 PM", type: "MEDICINE", isCompleted: true, date: "2026-08-04", memberName: "Sunita Sharma" },
    { id: "rem-6", title: "Metformin 500mg & Atorvastatin 10mg (Night)", time: "08:30 PM", type: "MEDICINE", isCompleted: false, date: "2026-08-04", memberName: "Rajesh Sharma" },
    { id: "rem-7", title: "Cetirizine Syrup 5ml (Night)", time: "09:00 PM", type: "MEDICINE", isCompleted: false, date: "2026-08-04", memberName: "Aarav Sharma" },
    { id: "rem-8", title: "Cardiology Consult with Dr. Ramesh Mehta", time: "10:30 AM", type: "APPOINTMENT", isCompleted: false, date: "2026-08-10", memberName: "Rajesh Sharma" },
    { id: "rem-9", title: "HbA1c & Blood Sugar Lab Retest", time: "07:30 AM", type: "LAB_TEST", isCompleted: false, date: "2026-08-15", memberName: "Rajesh Sharma" },
    { id: "rem-10", title: "Thyroid TSH Follow-up Panel", time: "08:00 AM", type: "LAB_TEST", isCompleted: false, date: "2026-08-20", memberName: "Sunita Sharma" },
    { id: "rem-11", title: "Vitamin D3 Weekly Capsule (Sunday)", time: "09:00 AM", type: "MEDICINE", isCompleted: false, date: "2026-08-09", memberName: "Arjun Sharma" },
    { id: "rem-12", title: "Pediatric Growth Check with Dr. Seth", time: "04:00 PM", type: "APPOINTMENT", isCompleted: false, date: "2026-08-25", memberName: "Ananya Sharma" },
    { id: "rem-13", title: "Metformin 500mg (Morning)", time: "08:00 AM", type: "MEDICINE", isCompleted: true, date: "2026-08-03", memberName: "Rajesh Sharma" },
    { id: "rem-14", title: "Thyronorm 50mcg", time: "07:00 AM", type: "MEDICINE", isCompleted: true, date: "2026-08-03", memberName: "Sunita Sharma" },
    { id: "rem-15", title: "Shelcal 500 (Morning)", time: "08:30 AM", type: "MEDICINE", isCompleted: true, date: "2026-08-03", memberName: "Kamala Sharma" },
    { id: "rem-16", title: "Glimepiride 2mg (Pre-Breakfast)", time: "07:45 AM", type: "MEDICINE", isCompleted: true, date: "2026-08-03", memberName: "Rajesh Sharma" },
    { id: "rem-17", title: "Night Blood Pressure Check", time: "09:30 PM", type: "OTHER", isCompleted: false, date: "2026-08-02", memberName: "Kamala Sharma" },
    { id: "rem-18", title: "Evion 400 (Afternoon)", time: "02:00 PM", type: "MEDICINE", isCompleted: true, date: "2026-08-02", memberName: "Kamala Sharma" },
    { id: "rem-19", title: "Folvite 5mg", time: "08:30 AM", type: "MEDICINE", isCompleted: true, date: "2026-08-02", memberName: "Neha Sharma" },
    { id: "rem-20", title: "Pediatric Annual Flu Booster", time: "11:00 AM", type: "VACCINATION", isCompleted: true, date: "2026-02-01", memberName: "Ananya Sharma" }
  ],

  appointments: [
    {
      id: "app-1",
      memberName: "Rajesh Sharma",
      doctorName: "Dr. Ramesh Mehta",
      specialty: "Cardiology & Diabetology",
      hospitalName: "Apollo Hospitals, Indiranagar",
      date: "2026-08-10",
      time: "10:30 AM",
      status: "UPCOMING",
      reason: "Routine Quarterly Diabetes & Hypertension Review",
      notes: "Carry latest fasting blood sugar readings and HbA1c lab report."
    },
    {
      id: "app-2",
      memberName: "Sunita Sharma",
      doctorName: "Dr. Ananya Rao",
      specialty: "Endocrinology",
      hospitalName: "Fortis Hospital, Bannerghatta",
      date: "2026-08-20",
      time: "11:15 AM",
      status: "UPCOMING",
      reason: "Thyroid TSH Level Evaluation",
      notes: "Empty stomach blood draw before morning dosage."
    },
    {
      id: "app-3",
      memberName: "Ananya Sharma",
      doctorName: "Dr. Vikram Seth",
      specialty: "Pediatrics",
      hospitalName: "Rainbow Children's Hospital, Marathahalli",
      date: "2026-08-25",
      time: "04:00 PM",
      status: "UPCOMING",
      reason: "Routine Milestone Assessment",
      notes: "Bring immunization booklet."
    },
    {
      id: "app-4",
      memberName: "Rajesh Sharma",
      doctorName: "Dr. Ramesh Mehta",
      specialty: "Cardiology",
      hospitalName: "Apollo Hospitals, Indiranagar",
      date: "2026-07-15",
      time: "10:00 AM",
      status: "COMPLETED",
      reason: "HbA1c & Fasting Glucose Review",
      notes: "HbA1c improved to 7.2%. Dosage adjusted."
    },
    {
      id: "app-5",
      memberName: "Kamala Sharma",
      doctorName: "Dr. S. K. Gupta",
      specialty: "Geriatric Medicine & Nephrology",
      hospitalName: "Max Super Speciality Hospital, Saket",
      date: "2026-06-05",
      time: "02:30 PM",
      status: "COMPLETED",
      reason: "Kidney Function & Electrolyte Review",
      notes: "Creatinine 1.2 mg/dL stable. Advised hydration."
    },
    {
      id: "app-6",
      memberName: "Neha Sharma",
      doctorName: "Dr. Sunita Kapoor",
      specialty: "Neurology",
      hospitalName: "Manipal Hospital, Old Airport Rd",
      date: "2026-02-10",
      time: "11:00 AM",
      status: "COMPLETED",
      reason: "Migraine Evaluation",
      notes: "Prescribed Naproxen PRN."
    },
    {
      id: "app-7",
      memberName: "Arjun Sharma",
      doctorName: "Dr. Sunita Kapoor",
      specialty: "General Medicine",
      hospitalName: "Manipal Hospital, Old Airport Rd",
      date: "2026-05-02",
      time: "09:30 AM",
      status: "COMPLETED",
      reason: "Annual Executive Health Checkup",
      notes: "Vitamin D3 deficiency noted; prescribed weekly 60K IU."
    },
    {
      id: "app-8",
      memberName: "Aarav Sharma",
      doctorName: "Dr. Vikram Seth",
      specialty: "Pediatric Pulmonology",
      hospitalName: "Rainbow Children's Hospital, Marathahalli",
      date: "2026-03-12",
      time: "03:00 PM",
      status: "COMPLETED",
      reason: "Seasonal Asthma Evaluation",
      notes: "X-Ray clear. Levolin inhaler renewal."
    }
  ],

  aiChats: [
    {
      id: "chat-1",
      role: "assistant",
      content: "### 👋 Welcome Arjun! I am your AI Health Consultant.\n\nI have complete visibility over your family vault records (6 members, 12 reports, 15 active prescriptions). How can I assist you today?",
      timestamp: "Today, 08:00 AM"
    },
    {
      id: "chat-2",
      role: "user",
      content: "My father Rajesh's HbA1c came at 7.2% in the July report. Is this a good trend compared to his earlier tests?",
      timestamp: "Today, 08:02 AM"
    },
    {
      id: "chat-3",
      role: "assistant",
      content: "### 📊 HbA1c Trend Analysis for Rajesh Sharma\n\nYes, this is a **positive downward trend!**\n\n- **Feb 2026 HbA1c:** 7.8% (Uncontrolled)\n- **July 2026 HbA1c:** 7.2% (Moderately Controlled)\n\n**Key Takeaways:**\n1. Metformin 500mg ER and Glimepiride 2mg are demonstrating effective glycemic control.\n2. His target HbA1c set by Dr. Ramesh Mehta is **< 7.0%**.\n3. Keep continuing daily 30-minute walks and low-GI dietary habits.",
      timestamp: "Today, 08:02 AM"
    },
    {
      id: "chat-4",
      role: "user",
      content: "Is there any drug interaction between Rajesh's Metformin and Atorvastatin?",
      timestamp: "Today, 08:10 AM"
    },
    {
      id: "chat-5",
      role: "assistant",
      content: "### 💊 Drug Interaction Safety Check\n\n**No harmful interaction detected.**\n\n- **Metformin 500mg** (Biguanide for Diabetes) and **Atorvastatin 10mg** (Statin for Cholesterol) are routinely co-prescribed for diabetic patients to prevent cardiovascular risk.\n- Take Metformin after meals to avoid gastrointestinal upset and Atorvastatin at bedtime.",
      timestamp: "Today, 08:10 AM"
    },
    {
      id: "chat-6",
      role: "user",
      content: "What should we do if my son Aarav experiences sudden wheezing during outdoor play?",
      timestamp: "Today, 08:20 AM"
    },
    {
      id: "chat-7",
      role: "assistant",
      content: "### 🫁 Pediatric Asthma Action Plan for Aarav\n\n1. **Remain Calm & Sit Upright:** Help Aarav sit upright immediately.\n2. **Administer Levolin Inhaler:** Give 2 puffs of **Levolin 50mcg** using his pediatric spacer device.\n3. **Wait 5 Minutes:** If breathing remains tight, repeat 2 puffs.\n4. **Emergency Warning:** If breathing rate is >40 breaths/min, skin draws in around ribs, or lips turn pale/blue, call Emergency or visit **Rainbow Children's Hospital ER (+91 98453 45678)** immediately.",
      timestamp: "Today, 08:21 AM"
    },
    {
      id: "chat-8",
      role: "user",
      content: "Can you explain why my Vitamin D3 was 18.4 ng/mL and what foods I should eat?",
      timestamp: "Yesterday, 04:15 PM"
    },
    {
      id: "chat-9",
      role: "assistant",
      content: "### ☀️ Vitamin D Deficiency Explanation & Diet\n\nAt **18.4 ng/mL**, your level is deficient (<30 ng/mL is optimal). This happens due to indoor desk hours.\n\n**Dietary Sources:**\n- Fortified Milk & Curd\n- Egg Yolks & Fatty Fish (Salmon/Mackerel)\n- Button & Portobello Mushrooms\n\n**Supplement Plan:** Continue your weekly **60,000 IU capsule** every Sunday with a fat-containing meal for maximum absorption.",
      timestamp: "Yesterday, 04:16 PM"
    },
    {
      id: "chat-10",
      role: "user",
      content: "How is my mother Sunita's thyroid doing on Thyronorm 50mcg?",
      timestamp: "Jul 30, 2026"
    },
    {
      id: "chat-11",
      role: "assistant",
      content: "### 🦋 Thyroid Function Status\n\nSunita's TSH is **2.4 uIU/mL** (Normal Range: 0.4 - 4.2 uIU/mL).\n\nThis indicates **perfect euthyroid stabilization**. Continue her 50mcg dosage daily on an empty stomach with plain water.",
      timestamp: "Jul 30, 2026"
    },
    {
      id: "chat-12",
      role: "user",
      content: "Is my grandmother Kamala's Serum Creatinine of 1.2 mg/dL dangerous?",
      timestamp: "Jul 25, 2026"
    },
    {
      id: "chat-13",
      role: "assistant",
      content: "### 🩺 Geriatric Renal Evaluation\n\nAt age 84, a Serum Creatinine of **1.2 mg/dL** (eGFR ~58) is **expected and stable**.\n\n**Key Precautions:**\n- Avoid giving OTC pain relievers (like Ibuprofen/Combiflam).\n- Ensure she drinks 1.5 - 2 Liters of fluids daily.\n- Keep her blood pressure monitored under Telmisartan 40mg.",
      timestamp: "Jul 25, 2026"
    },
    {
      id: "chat-14",
      role: "user",
      content: "What home remedies help Neha with migraine headache prevention?",
      timestamp: "Jul 20, 2026"
    },
    {
      id: "chat-15",
      role: "assistant",
      content: "### 💆‍♀️ Migraine Trigger Management\n\n1. **Hydration Routine:** 2.5L water daily.\n2. **Magnesium & Riboflavin:** Include almonds, seeds, and spinach.\n3. **Dim Light & Cold Compress:** Apply a cool gel pack to forehead at onset.\n4. **Prevent Skip Meals:** Maintain strict meal timings.",
      timestamp: "Jul 20, 2026"
    },
    {
      id: "chat-16",
      role: "user",
      content: "What is the recommended resting heart rate during exercise for a 34-year-old?",
      timestamp: "Jul 15, 2026"
    },
    {
      id: "chat-17",
      role: "assistant",
      content: "### 💓 Target Heart Rate Zones\n\nFor a 34-year-old male:\n- **Resting HR Target:** 60 - 75 bpm (Your Apple Watch averages **68 bpm**).\n- **Max HR:** ~186 bpm\n- **Moderate Cardio Target:** 110 - 135 bpm\n- **Peak Cardio Target:** 140 - 160 bpm",
      timestamp: "Jul 15, 2026"
    },
    {
      id: "chat-18",
      role: "user",
      content: "Are my daughter Ananya's vaccinations complete?",
      timestamp: "Jul 10, 2026"
    },
    {
      id: "chat-19",
      role: "assistant",
      content: "### 👶 Immunization Verification\n\nYes! Ananya's 3-year flu booster and pediatric milestones are **100% complete** per Rainbow Children's Hospital record. Her next scheduled booster is at **Age 4 (Feb 2027)**.",
      timestamp: "Jul 10, 2026"
    },
    {
      id: "chat-20",
      role: "user",
      content: "What exercises are safest for my mother's knee osteoarthritis?",
      timestamp: "Jul 05, 2026"
    },
    {
      id: "chat-21",
      role: "assistant",
      content: "### 🦴 Low-Impact Osteoarthritis Exercises\n\n1. **Stationary Cycling:** Smooth knee flexion without impact.\n2. **Quadriceps Extension:** Seated leg lifts with 5-second hold.\n3. **Water Aerobics:** Hydro-buoyancy reduces joint pressure by 80%.\n4. **Avoid:** High-impact running or deep lunges.",
      timestamp: "Jul 05, 2026"
    },
    {
      id: "chat-22",
      role: "user",
      content: "Can you summarize all our active daily family prescriptions?",
      timestamp: "Jun 28, 2026"
    },
    {
      id: "chat-23",
      role: "assistant",
      content: "### 📋 Active Family Prescriptions Summary\n\n- **Rajesh:** Metformin 500mg, Amlodipine 5mg, Atorvastatin 10mg, Glimepiride 2mg, Pantoprazole 40mg\n- **Sunita:** Thyronorm 50mcg, Calperum D3\n- **Kamala:** Telmisartan 40mg, Shelcal 500, Evion 400, Amlodipine 2.5mg\n- **Neha:** Folvite 5mg, Naproxen (PRN)\n- **Arjun:** Vitamin D3 60K (Weekly)\n- **Aarav:** Levolin Inhaler (PRN), Cetirizine Syrup\n- **Ananya:** Pediatric Multi-Vitamin Syrup",
      timestamp: "Jun 28, 2026"
    },
    {
      id: "chat-24",
      role: "user",
      content: "How does MedVault AI protect my family's medical records?",
      timestamp: "Jun 20, 2026"
    },
    {
      id: "chat-25",
      role: "assistant",
      content: "### 🔒 Security & Privacy Standard\n\n- **Zero-Knowledge Encryption:** Data is encrypted at rest (AES-256) and in transit (TLS 1.3).\n- **Role-Based Audit Logging:** Every document view, export, and emergency share generates a cryptographically logged audit trail.\n- **HIPAA & GDPR Compliance:** Your health vault remains strictly isolated to your verified account credentials.",
      timestamp: "Jun 20, 2026"
    }
  ],

  wearables: [
    { id: "wear-1", name: "Apple Watch Series 9", brand: "Apple", connected: true, lastSynced: "5 mins ago", batteryLevel: 88 },
    { id: "wear-2", name: "Fitbit Charge 6", brand: "Fitbit", connected: true, lastSynced: "15 mins ago", batteryLevel: 72 },
    { id: "wear-3", name: "Google Health Connect", brand: "Google", connected: true, lastSynced: "1 min ago", batteryLevel: 95 },
    { id: "wear-4", name: "Garmin Forerunner 265", brand: "Garmin", connected: false, lastSynced: "3 days ago", batteryLevel: 100 },
    { id: "wear-5", name: "Samsung Galaxy Watch 6", brand: "Samsung", connected: false, lastSynced: "Never", batteryLevel: 100 }
  ],

  healthTelemetry: {
    steps: 8420,
    stepGoal: 10000,
    sleepHours: 7.8,
    sleepScore: 88,
    screenTimeMinutes: 185,
    heartRate: 68,
    caloriesBurned: 2150,
    activeMinutes: 45
  },

  referralData: {
    code: "MEDVAULT-ARJUN2026",
    link: "https://medvault-ai.com/signup?ref=MEDVAULT-ARJUN2026",
    completedCount: 18,
    targetCount: 20,
    proRewardClaimed: false,
    referredUsers: [
      { id: "ref-1", name: "Priya Sharma", email: "priya.s@gmail.com", date: "Jul 28, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-2", name: "Anil Kumar", email: "anil.k@yahoo.com", date: "Jul 26, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-3", name: "Sunita Verma", email: "sunita.v@outlook.com", date: "Jul 22, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-4", name: "Rohan Gupta", email: "rohan.g@gmail.com", date: "Jul 20, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-5", name: "Deepak Joshi", email: "deepak.j@hotmail.com", date: "Jul 18, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-6", name: "Kavita Nair", email: "kavita.nair@gmail.com", date: "Jul 15, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-7", name: "Suresh Menon", email: "suresh.m@yahoo.com", date: "Jul 12, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-8", name: "Meera Reddy", email: "meera.r@gmail.com", date: "Jul 10, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-9", name: "Vikram Malhotra", email: "vikram.m@outlook.com", date: "Jul 08, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-10", name: "Ananya Deshmukh", email: "ananya.d@gmail.com", date: "Jul 05, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-11", name: "Amitabh Sen", email: "amitabh.s@hotmail.com", date: "Jul 02, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-12", name: "Pooja Hegde", email: "pooja.h@gmail.com", date: "Jun 28, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-13", name: "Siddharth Rao", email: "siddharth.r@yahoo.com", date: "Jun 25, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-14", name: "Tarun Chawla", email: "tarun.c@gmail.com", date: "Jun 20, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-15", name: "Neha Saxena", email: "neha.s@outlook.com", date: "Jun 18, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-16", name: "Gaurav Agarwal", email: "gaurav.a@gmail.com", date: "Jun 15, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-17", name: "Ritu Kapoor", email: "ritu.k@yahoo.com", date: "Jun 10, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "ref-18", name: "Harsh Vardhan", email: "harsh.v@gmail.com", date: "Jun 05, 2026", status: "COMPLETED", reward: "1 Step toward Pro" }
    ]
  },

  notifications: Array.from({ length: 40 }, (_, i) => {
    const titles = [
      "Medicine Reminder Completed",
      "Lab Report Processed with AI",
      "Upcoming Doctor Consult",
      "Smartwatch Data Synced",
      "Emergency Card Shared",
      "Security PIN Verified",
      "Family Vault Member Updated",
      "Prescription Refill Reminder"
    ];
    const index = i % titles.length;
    return {
      id: `notif-${i + 1}`,
      title: titles[index],
      message: `Notification #${i + 1}: ${titles[index]} for MedVault Premium Account.`,
      time: i === 0 ? "5 mins ago" : i === 1 ? "1 hour ago" : `${Math.floor(i / 2) + 1} days ago`,
      unread: i < 5
    };
  }),

  auditLogs: [
    { id: "log-1", action: "Logged in via Google Authentication", device: "Chrome / macOS", ip: "103.21.124.89", time: "Today, 08:00 AM", status: "SUCCESS" },
    { id: "log-2", action: "Medicine Reminder Completed: Metformin 500mg", device: "Safari / iOS App", ip: "103.21.124.89", time: "Today, 08:05 AM", status: "SUCCESS" },
    { id: "log-3", action: "AI Assistant Query: HbA1c Trend Analysis", device: "Chrome / macOS", ip: "103.21.124.89", time: "Today, 08:02 AM", status: "SUCCESS" },
    { id: "log-4", action: "Uploaded Medical Report: Complete Blood Count (CBC)", device: "Chrome / macOS", ip: "103.21.124.89", time: "Jul 28, 2026, 04:30 PM", status: "SUCCESS" },
    { id: "log-5", action: "Emergency QR Card Generated for Rajesh Sharma", device: "Chrome / macOS", ip: "103.21.124.89", time: "Jul 27, 2026, 11:15 AM", status: "SUCCESS" },
    { id: "log-6", action: "Added Family Member: Kamala Sharma (Grandmother)", device: "Chrome / macOS", ip: "103.21.124.89", time: "Jul 25, 2026, 02:00 PM", status: "SUCCESS" },
    { id: "log-7", action: "Uploaded Medical Report: HbA1c & Fasting Glycemic Evaluation", device: "Chrome / macOS", ip: "103.21.124.89", time: "Jul 15, 2026, 05:00 PM", status: "SUCCESS" },
    { id: "log-8", action: "Booked Appointment: Dr. Ramesh Mehta (Cardiology)", device: "Chrome / macOS", ip: "103.21.124.89", time: "Jul 15, 2026, 10:15 AM", status: "SUCCESS" },
    { id: "log-9", action: "Smartwatch Telemetry Synced from Apple Watch Series 9", device: "Background Sync", ip: "103.21.124.89", time: "Jul 14, 2026, 09:00 PM", status: "SUCCESS" },
    { id: "log-10", action: "Exported Full Encrypted Health Vault PDF", device: "Chrome / macOS", ip: "103.21.124.89", time: "Jul 12, 2026, 03:40 PM", status: "SUCCESS" },
    { id: "log-11", action: "Added New Medicine: Atorvastatin 10mg", device: "Chrome / macOS", ip: "103.21.124.89", time: "Jul 10, 2026, 01:20 PM", status: "SUCCESS" },
    { id: "log-12", action: "Changed Vault Primary Language to English", device: "Chrome / macOS", ip: "103.21.124.89", time: "Jul 08, 2026, 10:00 AM", status: "SUCCESS" },
    { id: "log-13", action: "Uploaded Medical Report: Liver Function Test (LFT)", device: "Chrome / macOS", ip: "103.21.124.89", time: "Jun 20, 2026, 06:10 PM", status: "SUCCESS" },
    { id: "log-14", action: "Security PIN Enabled for Emergency Bypass", device: "Chrome / macOS", ip: "103.21.124.89", time: "Jun 18, 2026, 12:00 PM", status: "SUCCESS" },
    { id: "log-15", action: "Uploaded Medical Report: Renal Function Test", device: "Chrome / macOS", ip: "103.21.124.89", time: "Jun 05, 2026, 03:30 PM", status: "SUCCESS" },
    { id: "log-16", action: "AI Symptoms Analysis: Seasonal Pediatric Cough", device: "Safari / iOS App", ip: "103.21.124.89", time: "May 20, 2026, 08:45 PM", status: "SUCCESS" },
    { id: "log-17", action: "Uploaded Medical Report: Thyroid Profile", device: "Chrome / macOS", ip: "103.21.124.89", time: "May 18, 2026, 04:00 PM", status: "SUCCESS" },
    { id: "log-18", action: "Uploaded Medical Report: Vitamin D3 (25-OH)", device: "Chrome / macOS", ip: "103.21.124.89", time: "May 02, 2026, 11:30 AM", status: "SUCCESS" },
    { id: "log-19", action: "Uploaded Medical Report: Vitamin B12 & Folate", device: "Chrome / macOS", ip: "103.21.124.89", time: "Apr 14, 2026, 02:15 PM", status: "SUCCESS" },
    { id: "log-20", action: "Uploaded Medical Report: Lipid Profile", device: "Chrome / macOS", ip: "103.21.124.89", time: "Mar 30, 2026, 05:45 PM", status: "SUCCESS" },
    { id: "log-21", action: "Uploaded Medical Report: Chest X-Ray PA View", device: "Chrome / macOS", ip: "103.21.124.89", time: "Mar 12, 2026, 01:10 PM", status: "SUCCESS" },
    { id: "log-22", action: "Uploaded Medical Report: 12-Lead ECG", device: "Chrome / macOS", ip: "103.21.124.89", time: "Feb 25, 2026, 10:30 AM", status: "SUCCESS" },
    { id: "log-23", action: "Uploaded Medical Report: Migraine Prescription", device: "Chrome / macOS", ip: "103.21.124.89", time: "Feb 10, 2026, 03:00 PM", status: "SUCCESS" },
    { id: "log-24", action: "Uploaded Medical Report: Pediatric Immunization Record", device: "Chrome / macOS", ip: "103.21.124.89", time: "Feb 01, 2026, 11:00 AM", status: "SUCCESS" },
    { id: "log-25", action: "Premium Membership Activated & Unlimited Vault Storage Provisioned", device: "System Billing", ip: "103.21.124.89", time: "Feb 01, 2026, 09:00 AM", status: "SUCCESS" },
    ...Array.from({ length: 25 }, (_, idx) => ({
      id: `log-${26 + idx}`,
      action: `Automated Daily Backup & Health Index Calculation #${25 - idx}`,
      device: "System Scheduler",
      ip: "103.21.124.89",
      time: `${Math.floor((idx + 1) * 6)} days ago`,
      status: "SUCCESS"
    }))
  ],

  emailLogs: [
    { id: "email-1", recipient: "premium@medvault.ai", subject: "Medicine Reminder: Metformin 500mg Morning Dose", type: "MEDICINE_REMINDER", timestamp: "Today, 08:00 AM", status: "DELIVERED" },
    { id: "email-2", recipient: "premium@medvault.ai", subject: "Upcoming Appointment: Dr. Ramesh Mehta (Aug 10)", type: "APPOINTMENT", timestamp: "Yesterday, 06:00 PM", status: "DELIVERED" },
    { id: "email-3", recipient: "premium@medvault.ai", subject: "Security Alert: Login from Chrome / macOS", type: "SECURITY_OTP", timestamp: "Jul 28, 2026, 08:30 PM", status: "DELIVERED" }
  ]
};

const freeData = {
  email: "free@medvault.ai",
  userName: "Vikram Patel",
  userPhone: "+91 91234 56789",
  userAge: 29,
  userGender: "Male",
  userHeight: 175,
  userWeight: 70,
  userBloodGroup: "B+",
  userAddress: "102, Sunrise Apartments, Koramangala, Bengaluru, Karnataka 560034",
  plan: "FREE",
  healthScore: 75,
  healthScoreReason: "Your health score is 75/100. On the Free Plan, you have 1 family member registered. Upgrade to MedVault Premium to unlock unlimited family profiles, AI smart triage, and automated refill tracking.",

  settings: {
    darkMode: false,
    pinEnabled: false,
    autoLogoutEnabled: true,
    backupEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  },

  familyMembers: [
    {
      id: "free-fm-1",
      name: "Vikram Patel",
      relationship: "Self",
      age: 29,
      bloodGroup: "B+",
      height: 175,
      weight: 70,
      emergencyContact: "Anjali Patel (Sister)",
      emergencyPhone: "+91 91234 56780",
      allergies: ["Dust Allergies"],
      chronicDiseases: ["Mild Acid Reflux"],
      currentMedicines: ["Paracetamol 500mg", "Vitamin C 500mg", "Gelusil Antacid"],
      insuranceProvider: "Care Health Insurance",
      policyNumber: "CARE-FREE-110293",
      primaryDoctor: "Dr. A. K. Roy",
      doctorPhone: "+91 98200 11223",
      hospital: "Apollo Clinic, Koramangala, Bengaluru",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    }
  ],

  reports: [
    {
      id: "free-rep-1",
      familyMemberId: "free-fm-1",
      familyMemberName: "Vikram Patel",
      title: "Routine Complete Blood Count (CBC)",
      type: "LAB_REPORT",
      hospitalName: "Apollo Clinic, Koramangala",
      doctorName: "Dr. A. K. Roy",
      reportDate: "2026-07-20",
      diagnosis: "Normal Hemogram & Blood Parameters",
      summary: "Hemoglobin is 14.5 g/dL, WBC count 6,800 cells/mcL, Platelets 220,000 /mcL.",
      riskLevel: "Low",
      medicines: ["Vitamin C 500mg"],
      labParameters: [
        { name: "Hemoglobin", value: "14.5", unit: "g/dL", referenceRange: "13.5 - 17.5", status: "Normal" },
        { name: "Total WBC", value: "6,800", unit: "cells/mcL", referenceRange: "4,000 - 11,000", status: "Normal" }
      ],
      aiExplanation: "Overall blood counts are completely normal with zero active inflammatory signs.",
      recommendations: "Maintain balanced lifestyle and annual screening.",
      healthScoreImpact: "+2 points"
    },
    {
      id: "free-rep-2",
      familyMemberId: "free-fm-1",
      familyMemberName: "Vikram Patel",
      title: "Basic Lipid Screening",
      type: "LAB_REPORT",
      hospitalName: "Apollo Clinic, Koramangala",
      doctorName: "Dr. A. K. Roy",
      reportDate: "2026-06-10",
      diagnosis: "Mildly Elevated Triglycerides (165 mg/dL)",
      summary: "Total Cholesterol is 185 mg/dL, LDL is 112 mg/dL, Triglycerides are 165 mg/dL.",
      riskLevel: "Moderate",
      medicines: [],
      labParameters: [
        { name: "Triglycerides", value: "165", unit: "mg/dL", referenceRange: "< 150", status: "Slightly High" },
        { name: "LDL Cholesterol", value: "112", unit: "mg/dL", referenceRange: "< 100", status: "Borderline" }
      ],
      aiExplanation: "Triglycerides are slightly elevated due to dietary carbohydrates and sedentary hours.",
      recommendations: "Reduce sugary drinks, exercise 30 minutes daily, recheck in 6 months.",
      healthScoreImpact: "-2 points"
    }
  ],

  medicines: [
    {
      id: "free-med-1",
      familyMemberId: "free-fm-1",
      familyMemberName: "Vikram Patel",
      member: "Vikram Patel",
      name: "Paracetamol",
      dosage: "500mg",
      morning: true,
      afternoon: false,
      night: true,
      startDate: "2026-08-01",
      isActive: true,
      reminderOn: true,
      notes: "Take after meals during mild fever or fatigue",
      doctor: "Dr. A. K. Roy",
      purpose: "Fever & Body Ache Relief",
      duration: "5 Days"
    },
    {
      id: "free-med-2",
      familyMemberId: "free-fm-1",
      familyMemberName: "Vikram Patel",
      member: "Vikram Patel",
      name: "Vitamin C Chewable",
      dosage: "500mg",
      morning: false,
      afternoon: true,
      night: false,
      startDate: "2026-07-20",
      isActive: true,
      reminderOn: true,
      notes: "Chew 1 tablet daily after lunch",
      doctor: "Dr. A. K. Roy",
      purpose: "Immunity Support",
      duration: "30 Days"
    },
    {
      id: "free-med-3",
      familyMemberId: "free-fm-1",
      familyMemberName: "Vikram Patel",
      member: "Vikram Patel",
      name: "Gelusil Antacid",
      dosage: "10ml",
      morning: false,
      afternoon: false,
      night: true,
      startDate: "2026-08-01",
      isActive: true,
      reminderOn: false,
      notes: "Take bedtime if acidity flare-up occurs",
      doctor: "Dr. A. K. Roy",
      purpose: "Acid Reflux Relief",
      duration: "As Needed"
    }
  ],

  reminders: [
    { id: "free-rem-1", title: "Paracetamol 500mg (Morning)", time: "08:00 AM", type: "MEDICINE", isCompleted: true, date: "2026-08-04", memberName: "Vikram Patel" },
    { id: "free-rem-2", title: "Vitamin C 500mg (Afternoon)", time: "02:00 PM", type: "MEDICINE", isCompleted: false, date: "2026-08-04", memberName: "Vikram Patel" },
    { id: "free-rem-3", title: "Follow-up Consult with Dr. Roy", time: "11:00 AM", type: "APPOINTMENT", isCompleted: false, date: "2026-08-12", memberName: "Vikram Patel" }
  ],

  appointments: [
    {
      id: "free-app-1",
      memberName: "Vikram Patel",
      doctorName: "Dr. A. K. Roy",
      specialty: "General Medicine",
      hospitalName: "Apollo Clinic, Koramangala",
      date: "2026-08-12",
      time: "11:00 AM",
      status: "UPCOMING",
      reason: "Routine Wellness Follow-up",
      notes: "Discuss dietary changes for triglycerides."
    }
  ],

  aiChats: [
    {
      id: "free-chat-1",
      role: "user",
      content: "Is Paracetamol 500mg safe to take after food for mild fever?",
      timestamp: "Today, 09:15 AM"
    },
    {
      id: "free-chat-2",
      role: "assistant",
      content: "### 💊 Paracetamol Usage Guidance\n\nYes, **Paracetamol 500mg** is safe for adults when taken after meals for mild fever or muscle aches.\n\n- **Maximum Adult Dosage:** Do not exceed 4,000 mg (8 tablets) in 24 hours.\n- **Interval:** Maintain at least 4 to 6 hours between doses.\n- **Warning:** On the Free Plan, you have used 1 of your monthly AI queries. Upgrade to Premium for unlimited AI health consultations!",
      timestamp: "Today, 09:15 AM"
    }
  ],

  wearables: [
    { id: "free-wear-1", name: "Fitbit Inspire 3", brand: "Fitbit", connected: true, lastSynced: "1 hour ago", batteryLevel: 65 }
  ],

  healthTelemetry: {
    steps: 6200,
    stepGoal: 10000,
    sleepHours: 6.9,
    sleepScore: 78,
    screenTimeMinutes: 240,
    heartRate: 72,
    caloriesBurned: 1850,
    activeMinutes: 25
  },

  referralData: {
    code: "MEDVAULT-VIKRAM2026",
    link: "https://medvault-ai.com/signup?ref=MEDVAULT-VIKRAM2026",
    completedCount: 2,
    targetCount: 20,
    proRewardClaimed: false,
    referredUsers: [
      { id: "free-ref-1", name: "Rohan Patel", email: "rohan.p@gmail.com", date: "Jul 20, 2026", status: "COMPLETED", reward: "1 Step toward Pro" },
      { id: "free-ref-2", name: "Sanjay Shah", email: "sanjay.s@yahoo.com", date: "Jul 15, 2026", status: "COMPLETED", reward: "1 Step toward Pro" }
    ]
  },

  notifications: [
    { id: "free-notif-1", title: "Welcome to Free Vault", message: "You are on the Free Plan (1 Family Member limit). Upgrade for Premium features.", time: "2 days ago", unread: true },
    { id: "free-notif-2", title: "Medicine Reminder", message: "Paracetamol 500mg morning dose due.", time: "Today, 08:00 AM", unread: false },
    { id: "free-notif-3", title: "Report Processed", message: "Routine CBC uploaded successfully.", time: "Jul 20, 2026", unread: false },
    { id: "free-notif-4", title: "Free Plan Reached Limit", message: "Maximum family member capacity (1/1) reached.", time: "Jul 18, 2026", unread: true },
    { id: "free-notif-5", title: "Emergency QR Active", message: "Your emergency pass QR code is generated.", time: "Jul 15, 2026", unread: false }
  ],

  auditLogs: [
    { id: "free-log-1", action: "Free Account Initialized", device: "Chrome / Windows", ip: "103.21.124.90", time: "Jul 15, 2026", status: "SUCCESS" },
    { id: "free-log-2", action: "Emergency QR Card Generated", device: "Chrome / Windows", ip: "103.21.124.90", time: "Jul 15, 2026", status: "SUCCESS" },
    { id: "free-log-3", action: "Uploaded Report: Complete Blood Count", device: "Chrome / Windows", ip: "103.21.124.90", time: "Jul 20, 2026", status: "SUCCESS" },
    { id: "free-log-4", action: "Added Medicine: Paracetamol 500mg", device: "Chrome / Windows", ip: "103.21.124.90", time: "Aug 01, 2026", status: "SUCCESS" },
    { id: "free-log-5", action: "Medicine Reminder Completed: Paracetamol", device: "Chrome / Windows", ip: "103.21.124.90", time: "Today, 08:00 AM", status: "SUCCESS" }
  ],

  emailLogs: [
    { id: "free-email-1", recipient: "free@medvault.ai", subject: "Welcome to MedVault AI Free Plan", type: "SECURITY_OTP", timestamp: "Jul 15, 2026", status: "DELIVERED" }
  ]
};

// Ensure /data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'premium_user_data.json'), JSON.stringify(premiumData, null, 2));
fs.writeFileSync(path.join(dataDir, 'free_user_data.json'), JSON.stringify(freeData, null, 2));

console.log("Successfully created /data/premium_user_data.json and /data/free_user_data.json");
