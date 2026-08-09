"use client";

import React, { useContext, useState } from "react";
import { SyncContext } from "@/components/providers/FirebaseSyncProvider";
import { auth } from "@/lib/firebase";
import { ChevronDown, ChevronUp, Database, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function FirebaseDebug() {
  const { isSynced } = useContext(SyncContext);
  const [isOpen, setIsOpen] = useState(false);
  const user = auth.currentUser;

  if (typeof window !== "undefined" && process.env.NODE_ENV !== "development" && !window.location.hostname.includes("localhost")) {
    // Only show on dev/localhost or if explicitly enabled via localStorage
    if (!localStorage.getItem("medvault_debug_enabled")) return null;
  }
  
  if (typeof window === "undefined") return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-xs w-full">
      <div className={cn(
        "bg-dark-surface border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300",
        isOpen ? "max-h-[500px]" : "max-h-[48px]",
        isSynced ? "border-emerald-500/30" : "border-warning/30"
      )}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-[48px] px-4 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Database className={cn("w-4 h-4", isSynced ? "text-emerald-500" : "text-warning")} />
            <span className="text-xs font-bold text-white uppercase tracking-tight">Firebase Sync Status</span>
          </div>
          {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
        </button>

        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <DebugItem 
              label="Sync Status" 
              value={isSynced ? "Synced" : "Syncing..."} 
              status={isSynced ? "success" : "warning"} 
            />
            <DebugItem 
              label="Project ID" 
              value={auth.app.options.projectId || "Unknown"} 
              isCode
            />
            <DebugItem 
              label="Auth State" 
              value={user ? "Authenticated" : "Not Authenticated"} 
              status={user ? "success" : "error"} 
            />
            <DebugItem 
              label="UID" 
              value={user?.uid || "None"} 
              isCode
            />
            <DebugItem 
              label="Anonymous" 
              value={user?.isAnonymous ? "Yes" : "No"} 
              status={user?.isAnonymous ? "warning" : "success"}
            />
            <DebugItem 
              label="Email" 
              value={user?.email || (typeof window !== "undefined" ? localStorage.getItem("medvault_user_email") : "") || "None"} 
            />
            <DebugItem 
              label="Firestore Path" 
              value={user ? `user_profiles_v2/${user.uid}` : "None"} 
              isCode
            />
          </div>

          {!user?.email && user?.isAnonymous && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex gap-3">
              <AlertCircle className="w-4 h-4 text-primary shrink-0" />
              <p className="text-[10px] text-primary leading-relaxed">
                <strong>Guest Mode:</strong> Your data is saved to the cloud but tied to this browser. 
                Sign up to access it from anywhere.
              </p>
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex gap-3">
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
            <p className="text-[10px] text-blue-300 leading-relaxed">
              <strong>Important:</strong> If sign-in fails with <code className="text-red-400">auth/operation-not-allowed</code>, 
              enable <strong>Email/Password</strong> and <strong>Google</strong> in the Firebase Console.
            </p>
          </div>

          <div className="pt-2 border-t border-white/5">
            <p className="text-[9px] text-slate-500 text-center uppercase tracking-widest font-bold">
              Development Debug Panel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DebugItem({ label, value, status, isCode }: { 
  label: string; 
  value: string; 
  status?: "success" | "warning" | "error";
  isCode?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
      <div className={cn(
        "px-2 py-1.5 rounded-lg text-[11px] font-medium break-all",
        isCode ? "font-mono bg-black/50 border border-white/5" : "bg-white/5",
        status === "success" && "text-emerald-400",
        status === "warning" && "text-warning",
        status === "error" && "text-destructive"
      )}>
        {value}
      </div>
    </div>
  );
}
