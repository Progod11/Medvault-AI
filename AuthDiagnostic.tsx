'use client';

import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Shield, CheckCircle2, XCircle, Info } from "lucide-react";

export function AuthDiagnostic() {
  const [status, setStatus] = useState<{
    initialized: boolean;
    projectId: string;
    authDomain: string;
    currentUser: string | null;
    isAnonymous: boolean;
  }>({
    initialized: false,
    projectId: "",
    authDomain: "",
    currentUser: null,
    isAnonymous: false,
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setStatus({
        initialized: !!auth.app,
        projectId: auth.app.options.projectId || "Unknown",
        authDomain: auth.app.options.authDomain || "Unknown",
        currentUser: user ? user.uid : null,
        isAnonymous: user ? user.isAnonymous : false,
      });
    });

    return () => unsubscribe();
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform z-50 flex items-center gap-2 text-sm font-medium border border-slate-700"
      >
        <Shield size={16} className="text-blue-400" />
        Auth Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden font-sans">
      <div className="bg-slate-900 text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          <Shield size={16} className="text-blue-400" />
          Firebase Diagnostic
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <XCircle size={18} />
        </button>
      </div>
      
      <div className="p-4 space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Project ID</span>
          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">{status.projectId}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">Auth Status</span>
          {status.initialized ? (
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <CheckCircle2 size={14} /> Initialized
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-600 font-medium">
              <XCircle size={14} /> Not Loaded
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">User Identity</span>
          {status.currentUser ? (
            <span className="font-mono text-xs text-blue-600 truncate max-w-[120px]">
              {status.currentUser}
            </span>
          ) : (
            <span className="text-slate-400 italic text-xs">Not Signed In</span>
          )}
        </div>

        {status.currentUser && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Mode</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${status.isAnonymous ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
              {status.isAnonymous ? 'Guest' : 'Account'}
            </span>
          </div>
        )}

        <div className="pt-2 mt-2 border-t border-slate-100">
          <div className="flex gap-2 text-[11px] text-slate-500 leading-tight">
            <Info size={14} className="shrink-0 text-blue-500" />
            <p>
              If sign-in fails with <code className="text-red-500">auth/operation-not-allowed</code>, 
              ensure <strong>Email/Password</strong> and <strong>Google</strong> are enabled in the 
              Firebase Console for project <strong>{status.projectId}</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
