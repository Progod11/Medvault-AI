"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Clock,
  Upload,
  Pill,
  Bell,
  AlertCircle,
  Settings,
  Shield,
  X,
  ChevronRight,
  QrCode,
  Sparkles,
  Activity,
  Calendar,
  Gift,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageContext";
import { getUserData } from "@/lib/dataStore";
import { useState, useEffect } from "react";

const navKeys = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/ai-assistant", key: "aiAssistant", icon: Sparkles },
  { href: "/family", key: "familyMembers", icon: Users },
  { href: "/timeline", key: "medicalTimeline", icon: Clock },
  { href: "/upload", key: "uploadReport", icon: Upload },
  { href: "/medicines", key: "medicineVault", icon: Pill },
  { href: "/reminders", key: "reminders", icon: Bell },
  { href: "/wearables", key: "wearables", icon: Activity },
  { href: "/appointments", key: "autoAppointments", icon: Calendar },
  { href: "/consultation", key: "doctorConsultation", icon: Stethoscope },
  { href: "/referral", key: "referral", icon: Gift },
  { href: "/emergency", key: "emergencyCard", icon: AlertCircle },
  { href: "/qr", key: "emergencyQr", icon: QrCode },
  { href: "/settings", key: "settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarContent({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const { t } = useLanguage();
  const [storageText, setStorageText] = useState("0 KB / 5 GB");
  const [storagePercent, setStoragePercent] = useState(1);

  useEffect(() => {
    const calculateStorage = () => {
      const data = getUserData();
      const jsonStr = JSON.stringify(data);
      const bytes = new Blob([jsonStr]).size;
      const totalReports = data.reports?.length || 0;
      const estimatedBytes = bytes + totalReports * 35000;

      if (estimatedBytes < 1024 * 1024) {
        const kb = (estimatedBytes / 1024).toFixed(1);
        setStorageText(`${kb} KB / 5 GB`);
        setStoragePercent(Math.max(1, Math.round((estimatedBytes / (5 * 1024 * 1024 * 1024)) * 100)));
      } else {
        const mb = (estimatedBytes / (1024 * 1024)).toFixed(1);
        setStorageText(`${mb} MB / 5 GB`);
        setStoragePercent(Math.max(1, Math.round((estimatedBytes / (5 * 1024 * 1024 * 1024)) * 100)));
      }
    };

    calculateStorage();
    window.addEventListener("medvault_data_updated", calculateStorage);
    return () => window.removeEventListener("medvault_data_updated", calculateStorage);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border dark:border-dark-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-heading font-bold text-lg text-accent dark:text-white">
            MedVault <span className="gradient-text">AI</span>
          </span>
          <p className="text-xs text-muted-foreground">{t("healthVault") || "Health Vault"}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {navKeys.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          const translatedLabel = t(item.key);

          return (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "sidebar-link group",
                  isActive && "sidebar-link-active"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                  )}
                />
                <span className="flex-1 text-sm font-medium">{translatedLabel}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-primary" />
                )}
                {(item.href === "/wearables" || item.href === "/appointments" || item.href === "/consultation") && (
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20 shadow-xs">
                    SOON
                  </span>
                )}
                {item.href === "/emergency" && (
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-border dark:border-dark-border">
        <div className="rounded-xl bg-gradient-card border border-primary/20 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-accent dark:text-white">Storage</span>
            <span className="text-xs text-muted-foreground">{storageText}</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-primary transition-all duration-500"
              style={{ width: `${storagePercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{storagePercent}% used</p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-surface dark:bg-dark-surface border-r border-border dark:border-dark-border">
        <SidebarContent pathname={pathname} onClose={onClose} />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-surface dark:bg-dark-surface border-r border-border dark:border-dark-border lg:hidden"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-border transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent pathname={pathname} onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
