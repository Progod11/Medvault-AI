"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/components/providers/LanguageContext";
import { getCurrentUserEmail, addAuditLog } from "@/lib/dataStore";
import { toast } from "sonner";
import {
  Stethoscope,
  MessageSquare,
  Video,
  FileText,
  Pill,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Bell,
  X,
  ChevronDown,
  ChevronUp,
  UserCheck,
  HeartPulse,
  Brain,
  Baby,
  Smile,
  Activity,
  Users,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  Zap,
  Phone,
  Award,
  Star,
  Check,
  Hospital,
  Bot,
  Heart,
  Microscope,
} from "lucide-react";

// --- Data Constants ---

const CONSULTATION_MODES = [
  {
    id: "chat",
    title: "Chat Consultation",
    icon: MessageSquare,
    badgeEmoji: "💬",
    description: "Secure chat with certified doctors for quick queries and prescription guidance.",
    estimatedPrice: "₹199",
    status: "Coming Soon",
  },
  {
    id: "audio",
    title: "Audio Consultation",
    icon: Phone,
    badgeEmoji: "📞",
    description: "Voice consultation with healthcare professionals for in-depth discussion.",
    estimatedPrice: "₹299",
    status: "Coming Soon",
  },
  {
    id: "video",
    title: "Video Consultation",
    icon: Video,
    badgeEmoji: "🎥",
    description: "HD video consultation with specialists for comprehensive clinical evaluation.",
    estimatedPrice: "₹499",
    status: "Coming Soon",
  },
];

const SPECIALTIES = [
  { id: "gp", name: "General Physician", icon: Stethoscope, desc: "Fever, cold, general health & wellness" },
  { id: "cardio", name: "Cardiologist", icon: HeartPulse, desc: "Heart health, blood pressure & ECG" },
  { id: "derma", name: "Dermatologist", icon: Sparkles, desc: "Skin rashes, hair fall & acne care" },
  { id: "ortho", name: "Orthopedic", icon: Activity, desc: "Bone, joint & muscle pain specialist" },
  { id: "neuro", name: "Neurologist", icon: Brain, desc: "Headache, nerve issues & brain health" },
  { id: "pedia", name: "Pediatrician", icon: Baby, desc: "Infant, child & adolescent health" },
  { id: "gynae", name: "Gynecologist", icon: UserCheck, desc: "Women's reproductive health & pregnancy" },
  { id: "ent", name: "ENT Specialist", icon: Smile, desc: "Ear, nose, throat & sinus conditions" },
  { id: "dentist", name: "Dentist", icon: Microscope, desc: "Dental hygiene, toothache & gums" },
  { id: "psychiatrist", name: "Psychiatrist", icon: Heart, desc: "Mental health, stress & anxiety" },
];

const DOCTOR_PREVIEWS = [
  {
    id: "doc1",
    name: "Dr. Ramesh Mehta",
    qualification: "MD, DM (Cardiology)",
    hospital: "Apollo Healthcare Center",
    experience: "14+ Years",
    rating: "4.9",
    fee: "₹499",
    language: "English, Hindi",
    specialty: "Cardiologist",
  },
  {
    id: "doc2",
    name: "Dr. Ananya Sharma",
    qualification: "MBBS, MD (General Medicine)",
    hospital: "Max Super Specialty Hospital",
    experience: "10+ Years",
    rating: "4.8",
    fee: "₹299",
    language: "English, Hindi",
    specialty: "General Physician",
  },
  {
    id: "doc3",
    name: "Dr. Vikram Sethi",
    qualification: "MD (Dermatology & Venereology)",
    hospital: "Fortis Skin & Aesthetics Clinic",
    experience: "12+ Years",
    rating: "4.9",
    fee: "₹399",
    language: "English, Punjabi",
    specialty: "Dermatologist",
  },
  {
    id: "doc4",
    name: "Dr. Sunita Rao",
    qualification: "MS, DNB (Obstetrics & Gynecology)",
    hospital: "Cloudnine Hospital",
    experience: "16+ Years",
    rating: "5.0",
    fee: "₹499",
    language: "English, Hindi, Kannada",
    specialty: "Gynecologist",
  },
  {
    id: "doc5",
    name: "Dr. Rajesh Kulkarni",
    qualification: "MD (Pediatrics), DCH",
    hospital: "Rainbow Children's Hospital",
    experience: "11+ Years",
    rating: "4.8",
    fee: "₹349",
    language: "English, Hindi, Marathi",
    specialty: "Pediatrician",
  },
  {
    id: "doc6",
    name: "Dr. Priya Nair",
    qualification: "MD (Psychiatry), DPM",
    hospital: "MindCare Wellness Institute",
    experience: "9+ Years",
    rating: "4.9",
    fee: "₹499",
    language: "English, Malayalam",
    specialty: "Psychiatrist",
  },
  {
    id: "doc7",
    name: "Dr. Arjun Kapoor",
    qualification: "MS (Orthopedics), M.Ch",
    hospital: "Artemis Joint Replacement Institute",
    experience: "15+ Years",
    rating: "4.9",
    fee: "₹599",
    language: "English, Hindi",
    specialty: "Orthopedic",
  },
  {
    id: "doc8",
    name: "Dr. Neha Verma",
    qualification: "MS (ENT), Fellowship in Sinus Surgery",
    hospital: "Medanta - The Medicity",
    experience: "8+ Years",
    rating: "4.7",
    fee: "₹399",
    language: "English, Hindi",
    specialty: "ENT Specialist",
  },
];

const FIVE_STEP_WORKFLOW = [
  { step: "Step 1", title: "Select Doctor", desc: "Choose specialty or preferred doctor from verified network.", icon: Stethoscope },
  { step: "Step 2", title: "Upload Medical Reports", desc: "Select existing MedVault records or AI summaries to attach.", icon: FileText },
  { step: "Step 3", title: "Doctor Reviews AI Summary", desc: "Practitioner views AI-structured timeline before connecting.", icon: Bot },
  { step: "Step 4", title: "Video Consultation", desc: "Consult live over encrypted video or secure audio session.", icon: Video },
  { step: "Step 5", title: "Digital Prescription", desc: "Receive digital Rx automatically saved into your MedVault.", icon: Pill },
];

const WHY_MEDVAULT = [
  { title: "AI Medical Summary", desc: "Instant structured clinical summary shared automatically upon approval.", icon: Bot },
  { title: "Previous Reports", desc: "Lab tests, scans, and discharge summaries accessible instantly.", icon: FileCheck },
  { title: "Medicine History", desc: "Active dosages and adherence tracking shared with practitioner.", icon: Pill },
  { title: "Allergy Alerts", desc: "Automatic warnings for drug sensitivities to avoid complications.", icon: AlertTriangle },
  { title: "Emergency Records", desc: "Critical blood group, ICD code alerts, and emergency contact context.", icon: ShieldAlert },
  { title: "Family Health History", desc: "Hereditary risk context available for holistic clinical care.", icon: Users },
];

const PREMIUM_BENEFITS = [
  "Unlimited Consultations Access",
  "Priority Doctor Matching",
  "Free 7-Day Follow-up Sessions",
  "Automated AI Health Summary Reports",
  "Discounted Consultation Fees across Network",
  "Priority Appointment Booking Slots",
];

const FAQS = [
  {
    q: "When will Doctor Consultation launch?",
    a: "Doctor Consultation is currently under development. Launch timing will be announced after the platform is ready.",
  },
  {
    q: "Will doctors be verified?",
    a: "The planned platform will include a doctor verification process.",
  },
  {
    q: "Can doctors see all my medical records?",
    a: "No. The planned experience will allow users to control which relevant information they share.",
  },
  {
    q: "Will video consultation be supported?",
    a: "Video consultation is planned as part of the future roadmap.",
  },
  {
    q: "Will prescriptions be stored in MedVault?",
    a: "Digital prescription storage is planned for the consultation experience.",
  },
];

export default function DoctorConsultationPage() {
  const { t } = useLanguage();
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    const currentEmail = getCurrentUserEmail();
    if (currentEmail && currentEmail !== "free@medvault.ai" && currentEmail !== "premium@medvault.ai") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmailInput(currentEmail);
    }
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.trim())) {
      toast.error("Please enter a valid email address format");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      addAuditLog(`Notification Interest Saved: Doctor Consultation launch update for '${emailInput.trim()}'`, "SUCCESS");
      toast.success("You're on the notification list! 🎉");
    }, 600);
  };

  const openNotifyModal = () => {
    setIsSubscribed(false);
    setIsNotifyModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-12 pb-16">
        
        {/* Header Badge & Title */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs">
              <span>🚧</span>
              <span>COMING SOON</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              Future Module Roadmap
            </span>
          </div>

          <div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-accent dark:text-white flex items-center gap-3">
              <Stethoscope className="w-8 h-8 text-primary" />
              {t("doctorConsultation") || "Doctor Consultation"}
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mt-2 max-w-3xl">
              Connect with healthcare professionals for personalized medical guidance — coming soon.
            </p>
          </div>

          <p className="text-sm text-primary font-medium">
            Connect with Verified Doctors Anytime, Anywhere.
          </p>

          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 text-sm text-accent dark:text-gray-200">
            <strong>MedVault AI</strong> is building a secure consultation experience that connects your health records with professional healthcare support.
          </div>
        </motion.div>

        {/* Hero Landing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card overflow-hidden bg-gradient-to-br from-surface via-surface to-primary/5 dark:from-dark-surface dark:via-dark-surface dark:to-primary/10 border border-border dark:border-dark-border p-6 sm:p-10 relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Vault-Connected Healthcare
              </div>

              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-accent dark:text-white leading-tight">
                Talk to Certified Doctors Online
              </h2>

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Consult verified doctors through Chat, Audio, or Video using your existing medical history stored inside MedVault AI.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <span className="px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
                  🚧 Coming Soon
                </span>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openNotifyModal}
                  className="btn-primary px-6 py-3 text-sm font-semibold flex items-center gap-2 shadow-glow cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  Notify Me
                </motion.button>
              </div>
            </div>

            {/* Illustration Concept Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-surface/80 dark:bg-dark-bg/80 border border-primary/20 p-6 space-y-4 shadow-xl backdrop-blur-md relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-border dark:border-dark-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-accent dark:text-white">Future Concept</span>
                  </div>
                  <span className="badge bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20">SOON</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-background dark:bg-dark-surface border border-border dark:border-dark-border">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-accent dark:text-white">Patient Context</p>
                      <p className="text-muted-foreground text-[11px]">MedVault Records & History</p>
                    </div>
                  </div>

                  <div className="flex justify-center text-primary">
                    <Zap className="w-4 h-4 animate-bounce" />
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-background dark:bg-dark-surface border border-border dark:border-dark-border">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-accent dark:text-white">Encrypted Vault Layer</p>
                      <p className="text-muted-foreground text-[11px]">User-Controlled Sharing</p>
                    </div>
                  </div>

                  <div className="flex justify-center text-primary">
                    <Zap className="w-4 h-4 animate-bounce" />
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-background dark:bg-dark-surface border border-border dark:border-dark-border">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-accent dark:text-white">Verified Practitioner</p>
                      <p className="text-muted-foreground text-[11px]">Professional Guidance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards (Chat, Audio, Video) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-accent dark:text-white">
              Consultation Modes
            </h2>
            <span className="text-xs text-muted-foreground font-medium">Estimated Pricing Framework</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONSULTATION_MODES.map((mode, idx) => {
              const Icon = mode.icon;
              return (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="card p-6 space-y-4 hover:border-primary/40 transition-all relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="badge bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20">
                        {mode.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-heading font-bold text-accent dark:text-white text-lg flex items-center gap-2">
                        <span>{mode.badgeEmoji}</span>
                        <span>{mode.title}</span>
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                        {mode.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border dark:border-dark-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Est. Fee</span>
                      <p className="font-heading font-extrabold text-lg text-primary">{mode.estimatedPrice}</p>
                    </div>
                    <button
                      onClick={openNotifyModal}
                      className="btn-secondary px-4 py-2 text-xs font-semibold cursor-pointer"
                    >
                      Notify Me
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Specialties */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-accent dark:text-white">
                Planned Specialties
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Specialized clinical departments under integration
              </p>
            </div>
            <span className="badge bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
              Coming Soon
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SPECIALTIES.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.id}
                  className="card p-4 hover:border-primary/30 transition-all space-y-2 bg-surface dark:bg-dark-surface"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      Soon
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-accent dark:text-white text-xs truncate">
                      {spec.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{spec.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Doctor Preview Section */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-accent dark:text-white">
                Verified Doctor Network Preview
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Illustrative preview of participating practitioners under onboarding
              </p>
            </div>
            <span className="badge bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
              Future Provider Network
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DOCTOR_PREVIEWS.map((doc) => (
              <div
                key={doc.id}
                className="card p-5 space-y-3 hover:border-primary/40 transition-all relative bg-surface dark:bg-dark-surface flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                      {doc.name.split(" ")[1]?.slice(0, 2) || "DR"}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <Check className="w-3 h-3" />
                        Verified
                      </span>
                      <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        Coming Soon
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-accent dark:text-white text-sm">{doc.name}</h3>
                    <p className="text-[11px] text-primary font-medium">{doc.specialty}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{doc.qualification}</p>
                  </div>

                  <div className="space-y-1 text-[11px] text-muted-foreground pt-1 border-t border-border/50 dark:border-dark-border/50">
                    <p className="flex items-center gap-1.5">
                      <Hospital className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="truncate">{doc.hospital}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>{doc.experience} Experience</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                      <span className="font-semibold text-accent dark:text-white">{doc.rating} Rating</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border dark:border-dark-border flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-muted-foreground uppercase font-bold">Est. Fee</span>
                    <p className="font-heading font-extrabold text-sm text-primary">{doc.fee}</p>
                  </div>
                  <button
                    onClick={openNotifyModal}
                    className="btn-secondary px-3 py-1.5 text-xs font-semibold cursor-pointer"
                  >
                    Notify Me
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Will Work (5 Steps Timeline) */}
        <section className="card p-6 sm:p-8 space-y-6 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border dark:border-dark-border pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">5-Step Workflow</span>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-accent dark:text-white mt-0.5">
                How It Will Work
              </h2>
            </div>
            <span className="badge bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
              Planned Workflow
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 relative">
            {FIVE_STEP_WORKFLOW.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="space-y-3 relative p-4 rounded-xl bg-background/50 dark:bg-dark-bg/50 border border-border dark:border-dark-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase font-mono">{s.step}</span>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-accent dark:text-white text-xs sm:text-sm">
                      {s.title}
                    </h3>
                    <p className="text-muted-foreground text-[11px] mt-1 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why MedVault AI */}
        <section className="card p-6 sm:p-8 space-y-6 bg-gradient-to-br from-surface to-primary/5 dark:from-dark-surface dark:to-primary/10 border border-border dark:border-dark-border">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Intelligent Context Integration</span>
            <h2 className="font-heading font-bold text-2xl text-accent dark:text-white">
              Why MedVault AI?
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl">
              MedVault already manages your health information. Soon, it will help you connect that health context with professional healthcare support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHY_MEDVAULT.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-4 rounded-xl bg-background/60 dark:bg-dark-bg/60 border border-border dark:border-dark-border space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-accent dark:text-white text-xs sm:text-sm">{item.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Premium Benefits */}
        <section className="card p-6 sm:p-8 space-y-6 bg-gradient-to-r from-primary/10 via-primary/5 to-surface dark:to-dark-surface border border-primary/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Subscriber Advantages</span>
              <h2 className="font-heading font-bold text-2xl text-accent dark:text-white mt-1">
                Premium Benefits
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Exclusive enhancements planned for MedVault Pro subscribers
              </p>
            </div>
            <button
              onClick={openNotifyModal}
              className="btn-primary px-5 py-2.5 text-xs font-semibold shadow-glow cursor-pointer"
            >
              Get Notified
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PREMIUM_BENEFITS.map((benefit) => (
              <div key={benefit} className="p-3.5 rounded-xl bg-surface/80 dark:bg-dark-surface/80 border border-primary/20 flex items-center gap-3 text-xs font-semibold text-accent dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Coming Soon Section Banner */}
        <section className="card p-8 sm:p-10 text-center space-y-5 bg-gradient-to-br from-surface via-primary/5 to-surface dark:from-dark-surface dark:via-primary/10 dark:to-dark-surface border border-primary/30">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <span>🚧</span>
            <span>Doctor Consultation — Launching Soon</span>
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-accent dark:text-white">
            Transforming Connected Healthcare
          </h2>

          <p className="text-muted-foreground text-sm max-w-2xl mx-auto leading-relaxed">
            We are partnering with hospitals and certified healthcare professionals to provide secure online consultations directly through MedVault AI.
          </p>

          <button
            onClick={openNotifyModal}
            className="btn-primary px-8 py-3.5 text-sm font-semibold inline-flex items-center gap-2 shadow-glow cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            Notify Me
          </button>
        </section>

        {/* FAQ Section */}
        <section className="card p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="font-heading font-bold text-2xl text-accent dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-muted-foreground">
              Learn more about our upcoming Doctor Consultation module
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-border dark:border-dark-border overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 flex items-center justify-between gap-4 font-semibold text-sm text-accent dark:text-white hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 pt-1 text-xs text-muted-foreground border-t border-border/50 dark:border-dark-border/50 leading-relaxed"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
          <strong>Important Notice:</strong> Doctor Consultation is currently under development. Pricing shown is estimated and may change after launch. Medical advice will only be provided by licensed healthcare professionals. AI recommendations are informational and not a replacement for professional medical consultation. MedVault AI is not a replacement for emergency medical services.
        </div>

      </div>

      {/* Notify Me Modal */}
      <AnimatePresence>
        {isNotifyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card w-full max-w-md p-6 space-y-5 relative bg-surface dark:bg-dark-surface border border-border dark:border-dark-border shadow-2xl"
            >
              <button
                onClick={() => setIsNotifyModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:bg-border transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-accent dark:text-white">Get Notified</h3>
                  <p className="text-xs text-muted-foreground">Doctor Consultation Launch Updates</p>
                </div>
              </div>

              {!isSubscribed ? (
                <form onSubmit={handleNotifySubmit} className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Be among the first to know when Doctor Consultation launches on MedVault AI.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-accent dark:text-white">Email Address</label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="you@example.com"
                      className="input text-sm py-2.5 w-full"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving Request...
                      </span>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" />
                        Notify Me
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="py-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-accent dark:text-white text-base">You&apos;re on the notification list.</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      We will reach out to <strong className="text-accent dark:text-white">{emailInput}</strong> as soon as the consultation feature launches.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsNotifyModalOpen(false)}
                    className="btn-secondary px-6 py-2 text-xs font-semibold cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
