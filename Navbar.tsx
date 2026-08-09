"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  Bell,
  Sun,
  Moon,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  Globe,
  Cloud,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useLanguage, Language } from "@/components/providers/LanguageContext";
import { SyncContext } from "@/components/providers/FirebaseSyncProvider";
import {
  getUserData,
  markAllNotificationsRead,
  clearNotifications,
  NotificationItem,
} from "@/lib/dataStore";

interface NavbarProps {
  onMenuToggle: () => void;
  userName?: string;
  userAvatar?: string;
}

export function Navbar({ onMenuToggle, userName: propUserName, userAvatar }: NavbarProps) {
  const { isSynced, isAnonymous } = useContext(SyncContext);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [displayUserName, setDisplayUserName] = useState(propUserName || "User");

  const loadData = useCallback(() => {
    const userData = getUserData();
    setItems(userData.notifications || []);
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("medvault_user_name");
      if (storedName) {
        setDisplayUserName(storedName);
      } else if (userData.email) {
        setDisplayUserName(userData.email.split("@")[0]);
      }
    }
  }, []);

  const [, setTick] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("medvault_data_updated", handleUpdate);
    const interval = setInterval(() => setTick((t) => t + 1), 10000);
    return () => {
      window.removeEventListener("medvault_data_updated", handleUpdate);
      clearInterval(interval);
    };
  }, [loadData]);

  const unreadCount = items.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    loadData();
  };

  const handleClearAll = () => {
    clearNotifications();
    loadData();
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-border dark:border-dark-border flex items-center px-4 gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden min-w-[44px] min-h-[44px] p-2.5 rounded-xl hover:bg-border dark:hover:bg-dark-border transition-colors flex items-center justify-center cursor-pointer"
        aria-label="Toggle navigation menu"
      >
        <Menu className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Desktop Search */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reports, medicines, prescriptions..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-background dark:bg-dark-bg border border-border dark:border-dark-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Sync Status Badge */}
        <div className={cn(
          "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-tight",
          isSynced 
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
            : "bg-warning/10 text-warning border-warning/20"
        )}>
          {isSynced ? (
            <>
              <Cloud className="w-3.5 h-3.5" />
              <span>{isAnonymous ? "Guest Mode (Local)" : "Cloud Synced"}</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Syncing...</span>
            </>
          )}
        </div>

        {isAnonymous && isSynced && (
          <Link href="/signup" className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-tight hover:bg-primary/20 transition-all">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Secure Account</span>
          </Link>
        )}
        {/* Mobile search toggle */}
        <button
          className="md:hidden min-w-[44px] min-h-[44px] p-2.5 rounded-xl hover:bg-border dark:hover:bg-dark-border transition-colors flex items-center justify-center cursor-pointer"
          onClick={() => setShowSearch(!showSearch)}
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Language selector */}
        <div className="flex items-center gap-1 px-2 py-1.5 min-h-[44px] rounded-xl bg-background dark:bg-dark-bg border border-border dark:border-dark-border">
          <Globe className="w-4 h-4 text-primary shrink-0" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent text-xs font-semibold text-accent dark:text-white focus:outline-none cursor-pointer py-1"
          >
            <option value="en">EN</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
            <option value="es">ES</option>
          </select>
        </div>

        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl hover:bg-border dark:hover:bg-dark-border transition-colors flex items-center justify-center cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-warning" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground" />
          )}
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative min-w-[44px] min-h-[44px] p-2.5 rounded-xl hover:bg-border dark:hover:bg-dark-border transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-error border-2 border-surface dark:border-dark-surface" />
            )}
          </motion.button>

          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-14 w-[calc(100vw-32px)] sm:w-80 card shadow-card-lg z-50 overflow-hidden max-w-sm"
            >
              <div className="p-4 border-b border-border dark:border-dark-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-accent dark:text-white text-sm">{t("notifications") || "Notifications"}</h3>
                  {unreadCount > 0 && (
                    <span className="badge-primary text-[10px] px-1.5 py-0.5">{unreadCount} new</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-primary hover:underline font-medium min-h-[32px] px-2"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border/50 dark:divide-dark-border/50">
                {items.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  items.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "px-4 py-3 hover:bg-background dark:hover:bg-dark-bg cursor-pointer transition-colors",
                        n.unread && "bg-primary/5 font-medium"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm text-accent dark:text-white">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                        </div>
                        {n.unread && (
                          <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">{formatRelativeTime(n.time)}</p>
                    </div>
                  ))
                )}
              </div>
              {items.length > 0 && (
                <div className="p-3 border-t border-border dark:border-dark-border flex justify-between text-xs">
                  <button onClick={handleMarkAllRead} className="text-primary hover:underline p-1">
                    Mark all read
                  </button>
                  <button onClick={handleClearAll} className="text-muted-foreground hover:text-error p-1">
                    Clear all
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 min-h-[44px] rounded-xl hover:bg-border dark:hover:bg-dark-border transition-colors cursor-pointer"
            aria-label="User Profile"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden shrink-0">
              {userAvatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={userAvatar} alt={displayUserName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-white">
                  {displayUserName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="hidden sm:block text-sm font-medium text-accent dark:text-white max-w-28 truncate">
              {displayUserName}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
          </motion.button>

          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-14 w-56 card shadow-card-lg z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-border dark:border-dark-border">
                <p className="text-sm font-semibold text-accent dark:text-white truncate">{displayUserName}</p>
                <p className="text-xs text-muted-foreground">MedVault Account</p>
              </div>
              <div className="py-2">
                {[
                  { href: "/settings", label: t("settings") || "Settings", icon: Settings },
                ].map((item) => (
                  <Link key={item.label} href={item.href} onClick={() => setShowProfile(false)}>
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-background dark:hover:bg-dark-bg transition-colors cursor-pointer min-h-[44px]">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-accent dark:text-white">{item.label}</span>
                    </div>
                  </Link>
                ))}
                <div className="border-t border-border dark:border-dark-border mt-2 pt-2">
                  <div
                    onClick={async () => {
                      try {
                        const { auth } = await import("@/lib/firebase");
                        await auth.signOut();
                      } catch (e) {
                        console.error(e);
                      }
                      localStorage.removeItem("medvault_user_uid");
                      localStorage.removeItem("medvault_user_email");
                      localStorage.removeItem("medvault_user_plan");
                      localStorage.removeItem("medvault_user_name");
                      window.location.href = "/login";
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-error/10 transition-colors cursor-pointer group min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4 text-error" />
                    <span className="text-sm text-error">{t("signOut") || "Sign Out"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute left-0 right-0 top-16 bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border p-3 shadow-md md:hidden z-40"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              autoFocus
              placeholder="Search reports, medicines, doctors..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-background dark:bg-dark-bg border border-border dark:border-dark-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={() => setShowSearch(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-xs text-muted-foreground hover:text-accent font-bold"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Click outside overlay */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </header>
  );
}
