import { UserData, FamilyMember } from "./dataStore";
import { Report } from "../types";

export function getSeedDataForPremium(): UserData {
  const email = "premium@medvault.ai";
  
  const familyMembers: FamilyMember[] = [
    {
      id: "fm-p1",
      name: "Ananya Sharma",
      relationship: "Spouse",
      age: 38,
      bloodGroup: "B+",
      allergies: ["Penicillin"],
      chronicDiseases: ["None"],
      emergencyContact: "Rajesh Sharma",
      emergencyPhone: "+91 98765 43210",
    },
    {
      id: "fm-p2",
      name: "Vihaan Sharma",
      relationship: "Child",
      age: 10,
      bloodGroup: "O+",
      allergies: ["Dust", "Pollen"],
      chronicDiseases: ["Mild Asthma"],
      emergencyContact: "Ananya Sharma",
      emergencyPhone: "+91 98765 43211",
    },
    {
      id: "fm-p3",
      name: "Ishaan Sharma",
      relationship: "Parent",
      age: 70,
      bloodGroup: "A+",
      allergies: ["None"],
      chronicDiseases: ["Hypertension", "Type 2 Diabetes"],
      emergencyContact: "Rajesh Sharma",
      emergencyPhone: "+91 98765 43210",
    },
    {
      id: "fm-p4",
      name: "Kavita Sharma",
      relationship: "Parent",
      age: 68,
      bloodGroup: "A+",
      allergies: ["Sulfa drugs"],
      chronicDiseases: ["Arthritis"],
      emergencyContact: "Rajesh Sharma",
      emergencyPhone: "+91 98765 43210",
    },
    {
      id: "fm-p5",
      name: "Rohan Sharma",
      relationship: "Sibling",
      age: 32,
      bloodGroup: "B+",
      allergies: ["Peanuts"],
      chronicDiseases: ["None"],
      emergencyContact: "Rajesh Sharma",
      emergencyPhone: "+91 98765 43210",
    },
    {
      id: "fm-p6",
      name: "Sneha Sharma",
      relationship: "Other", // Sister-in-law
      age: 30,
      bloodGroup: "O-",
      allergies: ["None"],
      chronicDiseases: ["None"],
      emergencyContact: "Rohan Sharma",
      emergencyPhone: "+91 98765 43215",
    }
  ];

  const reports: Report[] = [];
  
  // Add 2 reports for each member
  familyMembers.forEach((member, index) => {
    reports.push({
      id: `rep-p${index + 1}-1`,
      familyMemberId: member.id,
      familyMemberName: member.name,
      title: `${member.name}'s Annual Wellness Checkup`,
      type: "LAB_REPORT",
      date: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      status: "COMPLETED",
      hospitalName: "Apollo Hospitals",
      doctorName: "Dr. Arvind Mehta",
      summary: "All vital signs within normal range. Recommended continued balanced diet and regular exercise.",
    });
    
    reports.push({
      id: `rep-p${index + 1}-2`,
      familyMemberId: member.id,
      familyMemberName: member.name,
      title: `${member.name}'s Specialized Blood Panel`,
      type: "LAB_REPORT",
      date: new Date(Date.now() - (15 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      status: "COMPLETED",
      hospitalName: "Max Healthcare",
      doctorName: "Dr. Sangeeta Rao",
      summary: "Vitamin D levels slightly low. Suggested supplements for 3 months.",
    });
  });

  return {
    email,
    userName: "Rajesh Sharma",
    userPhone: "+91 98765 43210",
    plan: "PREMIUM",
    familyMembers,
    reports,
    medicines: [],
    reminders: [],
    notifications: [
      {
        id: `welcome-${Date.now()}`,
        title: "Premium Vault Activated 🌟",
        message: "Your family's health data is now fully synchronized across all devices.",
        time: new Date().toISOString(),
        unread: true,
      },
    ],
    auditLogs: [
      {
        id: `log-init-${Date.now()}`,
        action: "Premium Account Seeded",
        device: "System",
        ip: "Internal",
        time: new Date().toISOString(),
        status: "SUCCESS",
      },
    ],
    referralData: {
      code: "MEDVAULT-RAJESH",
      link: "https://medvault-ai.com/signup?ref=MEDVAULT-RAJESH",
      completedCount: 5,
      targetCount: 20,
      proRewardClaimed: true,
      referredUsers: [],
    },
    wearables: [],
    healthTelemetry: {
      steps: 8420,
      stepGoal: 10000,
      sleepHours: 7.5,
      sleepScore: 82,
      screenTimeMinutes: 240,
      heartRate: 72,
      caloriesBurned: 2100,
      activeMinutes: 45,
    },
    emailLogs: [],
  };
}

export function getSeedDataForFree(): UserData {
  const email = "free@medvault.ai";
  
  const familyMembers: FamilyMember[] = [
    {
      id: "fm-f1",
      name: "Aarav Patel",
      relationship: "Child",
      age: 12,
      bloodGroup: "O+",
      allergies: ["None"],
      chronicDiseases: ["None"],
      emergencyContact: "Priya Patel",
      emergencyPhone: "+91 98111 00000",
    },
    {
      id: "fm-f2",
      name: "Meera Patel",
      relationship: "Parent",
      age: 65,
      bloodGroup: "B-",
      allergies: ["Dust"],
      chronicDiseases: ["None"],
      emergencyContact: "Priya Patel",
      emergencyPhone: "+91 98111 00000",
    }
  ];

  const reports: Report[] = [];
  
  // Add 2 reports for each member
  familyMembers.forEach((member, index) => {
    reports.push({
      id: `rep-f${index + 1}-1`,
      familyMemberId: member.id,
      familyMemberName: member.name,
      title: `${member.name}'s General Checkup`,
      type: "LAB_REPORT",
      date: new Date(Date.now() - (60 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      status: "COMPLETED",
      hospitalName: "Civil Hospital",
      doctorName: "Dr. K.P. Singh",
      summary: "Patient is healthy. Regular vaccinations up to date.",
    });
    
    reports.push({
      id: `rep-f${index + 1}-2`,
      familyMemberId: member.id,
      familyMemberName: member.name,
      title: `${member.name}'s Routine Blood Test`,
      type: "LAB_REPORT",
      date: new Date(Date.now() - (20 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      status: "COMPLETED",
      hospitalName: "Pathology Lab",
      doctorName: "Dr. Anita Desai",
      summary: "Hemoglobin and other parameters are normal.",
    });
  });

  return {
    email,
    userName: "Priya Patel",
    userPhone: "+91 98111 00000",
    plan: "FREE",
    familyMembers,
    reports,
    medicines: [],
    reminders: [],
    notifications: [
      {
        id: `welcome-${Date.now()}`,
        title: "Welcome to MedVault AI 👋",
        message: "Your secure family health vault is ready.",
        time: new Date().toISOString(),
        unread: true,
      },
    ],
    auditLogs: [
      {
        id: `log-init-${Date.now()}`,
        action: "Free Account Seeded",
        device: "System",
        ip: "Internal",
        time: new Date().toISOString(),
        status: "SUCCESS",
      },
    ],
    referralData: {
      code: "MEDVAULT-PRIYA",
      link: "https://medvault-ai.com/signup?ref=MEDVAULT-PRIYA",
      completedCount: 0,
      targetCount: 20,
      proRewardClaimed: false,
      referredUsers: [],
    },
    wearables: [],
    healthTelemetry: {
      steps: 4200,
      stepGoal: 10000,
      sleepHours: 6.5,
      sleepScore: 65,
      screenTimeMinutes: 320,
      heartRate: 78,
      caloriesBurned: 1600,
      activeMinutes: 20,
    },
    emailLogs: [],
  };
}
