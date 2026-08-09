"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi" | "mr" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    aiAssistant: "Med AI Symptoms & Reports",
    familyMembers: "Family Members",
    medicalTimeline: "Medical Timeline",
    uploadReport: "Upload Report",
    medicineVault: "Medicine Vault",
    reminders: "Reminders",
    wearables: "Smartwatch & Health",
    autoAppointments: "Auto Appointments",
    doctorConsultation: "Doctor Consultation",
    referral: "Refer & Earn",
    emergencyCard: "Emergency Card",
    emergencyQr: "Emergency QR Scanner",
    settings: "Settings",
    signOut: "Sign Out",
    welcomeBack: "Welcome back",
    healthVault: "Health Vault",
    overviewHeading: "Your family's health overview at a glance",
    addFamilyMember: "Add Family Member",
    quickActions: "Quick Actions",
    emergencyCardTitle: "Emergency Health Card",
    scanForEmergency: "Scan in case of emergency to access vital medical history",
    freePlan: "Free Plan",
    premiumPlan: "Premium Pro",
    upgradeToPremium: "Upgrade to Premium Pro",
    memberLimitReached: "Free Plan allows maximum 2 family members. Upgrade to Premium Pro for unlimited members!",
    searchPlaceholder: "Search reports, medicines, doctors...",
    languageChanged: "Language updated successfully",
    shareMember: "Share Member Details",
    sharePublicLink: "Share Public Link",
    fullDetails: "Full Medical Details",
    contactSupport: "Contact Support",
    saveChanges: "Save Changes",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    aiAssistant: "मेड AI लक्षण व रिपोर्ट",
    familyMembers: "परिवार के सदस्य",
    medicalTimeline: "मेडिकल टाइमलाइन",
    uploadReport: "रिपोर्ट अपलोड करें",
    medicineVault: "दवा तिजोरी",
    reminders: "रिमाइंडर्स",
    doctorConsultation: "डॉक्टर परामर्श",
    emergencyCard: "इमरजेंसी कार्ड",
    emergencyQr: "इमरजेंसी क्यूआर स्कैनर",
    settings: "सेटिंग्स",
    signOut: "साइन आउट",
    welcomeBack: "नमस्ते",
    healthVault: "स्वास्थ्य तिजोरी",
    overviewHeading: "आपके परिवार के स्वास्थ्य का अवलोकन",
    addFamilyMember: "सदस्य जोड़ें",
    quickActions: "त्वरित कार्रवाई",
    emergencyCardTitle: "आपातकालीन स्वास्थ्य कार्ड",
    scanForEmergency: "आपात स्थिति में महत्वपूर्ण स्वास्थ्य जानकारी के लिए स्कैन करें",
    freePlan: "फ्री प्लान",
    premiumPlan: "प्रीमियम प्रो",
    upgradeToPremium: "प्रीमियम प्रो में अपग्रेड करें",
    memberLimitReached: "फ्री प्लान में केवल 2 परिवार के सदस्यों की अनुमति है। असीमित सदस्यों के लिए प्रीमियम प्रो में अपग्रेड करें!",
    searchPlaceholder: "रिपोर्ट, दवाइयां, डॉक्टर खोजें...",
    languageChanged: "भाषा सफलतापूर्वक बदल दी गई है",
    shareMember: "सदस्य की जानकारी साझा करें",
    sharePublicLink: "पब्लिक लिंक साझा करें",
    fullDetails: "पूर्ण चिकित्सा विवरण",
    contactSupport: "सहायता केंद्र",
    saveChanges: "परिवर्तन सहेजें",
  },
  mr: {
    dashboard: "डॅशबोर्ड",
    aiAssistant: "मेड AI लक्षणे व अहवाल",
    familyMembers: "कुटुंबातील सदस्य",
    medicalTimeline: "वैद्यकीय टाइमलाइन",
    uploadReport: "रिपोर्ट अपलोड करा",
    medicineVault: "औषध व्हॉल्ट",
    reminders: "स्मरणपत्रे",
    doctorConsultation: "डॉक्टर सल्ला मसलत",
    emergencyCard: "आणीबाणी कार्ड",
    emergencyQr: "आणीबाणी क्यूआर स्कॅनर",
    settings: "सेटिंग्ज",
    signOut: "साइन आउट",
    welcomeBack: "नमस्कार",
    healthVault: "आरोग्य व्हॉल्ट",
    overviewHeading: "तुमच्या कुटुंबाच्या आरोग्याचा आढावा",
    addFamilyMember: "सदस्य जोडा",
    quickActions: "जलद कृती",
    emergencyCardTitle: "आणीबाणी आरोग्य कार्ड",
    scanForEmergency: "आणीबाणीच्या वेळी महत्त्वाच्या वैद्यकीय माहितीसाठी स्कॅन करा",
    freePlan: "मोफत प्लॅन",
    premiumPlan: "प्रीमियम प्रो",
    upgradeToPremium: "प्रीमियम प्रो मध्ये अपग्रेड करा",
    memberLimitReached: "मोफत प्लॅनमध्ये कमाल २ सदस्यांना परवानगी आहे. अमर्याद सदस्यांसाठी प्रीमियम प्रो वर अपग्रेड करा!",
    searchPlaceholder: "रिपोर्ट, औषधे, डॉक्टर शोधा...",
    languageChanged: "भाषा यशस्वीरित्या बदलली",
    shareMember: "सदस्याची माहिती शेअर करा",
    sharePublicLink: "पब्लिक लिंक शेअर करा",
    fullDetails: "संपूर्ण वैद्यकीय तपशील",
    contactSupport: "संपर्क केंद्र",
    saveChanges: "बदल जतन करा",
  },
  es: {
    dashboard: "Panel",
    aiAssistant: "Síntomas e Informes IA",
    familyMembers: "Miembros de la Familia",
    medicalTimeline: "Historial Médico",
    uploadReport: "Subir Informe",
    medicineVault: "Bóveda de Medicamentos",
    reminders: "Recordatorios",
    doctorConsultation: "Consulta Médica",
    emergencyCard: "Tarjeta de Emergencia",
    emergencyQr: "Escáner QR de Emergencia",
    settings: "Configuración",
    signOut: "Cerrar Sesión",
    welcomeBack: "Bienvenido de nuevo",
    healthVault: "Bóveda de Salud",
    overviewHeading: "Resumen de salud familiar de un vistazo",
    addFamilyMember: "Añadir Miembro",
    quickActions: "Acciones Rápidas",
    emergencyCardTitle: "Tarjeta Médica de Emergencia",
    scanForEmergency: "Escanear en caso de emergencia para acceder a datos vitales",
    freePlan: "Plan Gratuito",
    premiumPlan: "Premium Pro",
    upgradeToPremium: "Actualizar a Premium Pro",
    memberLimitReached: "El Plan Gratuito permite máximo 2 miembros. ¡Actualiza a Premium Pro para miembros ilimitados!",
    searchPlaceholder: "Buscar informes, medicamentos, médicos...",
    languageChanged: "Idioma actualizado con éxito",
    shareMember: "Compartir Detalles del Miembro",
    sharePublicLink: "Compartir Enlace Público",
    fullDetails: "Detalles Médicos Completos",
    contactSupport: "Contacto y Soporte",
    saveChanges: "Guardar Cambios",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("medvault_language") as Language;
      if (savedLang && translations[savedLang]) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLanguageState(savedLang);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("medvault_language", lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
