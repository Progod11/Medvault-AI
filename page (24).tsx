/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  QrCode, Camera, Upload, Download, Check, ArrowRight, Eye, User, Plus
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { toast } from "sonner";
import Link from "next/link";
import { getUserData, UserData, FamilyMember } from "@/lib/dataStore";

export default function QRScanAndGeneratePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<"scan" | "generate">("generate");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [generatedQrUrl, setGeneratedQrUrl] = useState("");
  const [downloading, setDownloading] = useState(false);

  // Scanner state
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
    if (data.familyMembers && data.familyMembers.length > 0) {
      setSelectedMemberId(data.familyMembers[0].id);
    }
    const handleUpdate = () => {
      const updated = getUserData();
      setUserData(updated);
    };
    window.addEventListener("medvault_data_updated", handleUpdate);
    return () => window.removeEventListener("medvault_data_updated", handleUpdate);
  }, []);

  const familyMembers = userData?.familyMembers || [];
  const selectedMember = familyMembers.find((m) => m.id === selectedMemberId) || familyMembers[0];

  // Generate QR Code
  useEffect(() => {
    if (typeof window !== "undefined" && selectedMember) {
      const shareUrl = `${window.location.origin}/share/member/${selectedMember.id}`;
      QRCode.toDataURL(shareUrl, {
        width: 300,
        margin: 2,
        color: { dark: "#0F172A", light: "#FFFFFF" }
      })
        .then((url) => setGeneratedQrUrl(url))
        .catch((err) => console.error("QR build error:", err));
    }
  }, [selectedMember]);

  // Start Camera Scan
  const startCamera = async () => {
    try {
      setScanning(true);
      setScanResult(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.play();
        scanFrame();
      }
    } catch (err) {
      console.error(err);
      toast.error("Camera access denied or unavailable. You can upload a QR image instead.");
      setScanning(false);
    }
  };

  const stopCamera = () => {
    setScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  };

  const scanFrame = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current || document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert"
        });

        if (code && code.data) {
          setScanResult(code.data);
          toast.success("QR Code detected successfully!");
          stopCamera();
          return;
        }
      }
    }
    animationFrameId.current = requestAnimationFrame(scanFrame);
  };

  // Image File Upload Scan
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            setScanResult(code.data);
            toast.success("QR Code decoded successfully!");
          } else {
            toast.error("Could not find a valid QR code in this image.");
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleDownloadQr = () => {
    if (!generatedQrUrl) return;
    setDownloading(true);
    const a = document.createElement("a");
    a.href = generatedQrUrl;
    a.download = `MedVault_QR_${selectedMember.name.replace(/\s+/g, "_")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("QR Code image downloaded!");
    setTimeout(() => setDownloading(false), 1000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-accent dark:text-white flex items-center gap-3">
              <QrCode className="w-8 h-8 text-primary" />
              Emergency QR Vault
            </h1>
            <p className="text-muted-foreground mt-1">
              Generate & scan instant first-responder health verification QR codes
            </p>
          </div>

          <div className="flex bg-border/40 dark:bg-dark-border/40 p-1 rounded-xl">
            <button
              onClick={() => { setActiveTab("generate"); stopCamera(); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === "generate"
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-accent dark:hover:text-white"
              }`}
            >
              Generate QR
            </button>
            <button
              onClick={() => setActiveTab("scan")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === "scan"
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-accent dark:hover:text-white"
              }`}
            >
              Scan QR Code
            </button>
          </div>
        </div>

        {/* Tab 1: Generate QR Code */}
        {activeTab === "generate" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            {/* Member Selection Controls */}
            <div className="card p-6 space-y-6">
              <div className="space-y-2">
                <span className="badge-primary">Select Vault Profile</span>
                <h3 className="font-heading font-bold text-xl text-accent dark:text-white">
                  Family Member Emergency Card
                </h3>
                <p className="text-xs text-muted-foreground">
                  Scanning this QR code gives emergency medical staff instant access to blood group, allergies, medications, and emergency contacts.
                </p>
              </div>

              {familyMembers.length > 0 ? (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-accent dark:text-white uppercase tracking-wider">
                      Select Family Member
                    </label>
                    <select
                      value={selectedMemberId}
                      onChange={(e) => setSelectedMemberId(e.target.value)}
                      className="input font-semibold text-accent dark:text-white"
                    >
                      {familyMembers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.relationship})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedMember && (
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary">{selectedMember.name}</span>
                        <span className="badge-error text-xs">{selectedMember.bloodGroup || "A+"}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        📞 Emergency: {selectedMember.emergencyPhone || "+91 98765 43210"}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleDownloadQr}
                      disabled={!generatedQrUrl || downloading}
                      className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 shadow-glow"
                    >
                      <Download className="w-4 h-4" /> Download Printable QR
                    </button>
                    <Link href="/emergency" className="w-full">
                      <button className="btn-outline w-full py-3 text-xs flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" /> View Card
                      </button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <User className="w-10 h-10 text-primary mx-auto" />
                  <p className="text-sm font-semibold text-accent dark:text-white">No Family Members Added</p>
                  <p className="text-xs text-muted-foreground">
                    Add family members to generate QR codes for emergency medical access.
                  </p>
                  <Link href="/family" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add Family Member
                  </Link>
                </div>
              )}
            </div>

            {/* Generated QR Display Card */}
            <div className="card p-8 flex flex-col items-center justify-center text-center space-y-6 bg-surface dark:bg-dark-surface border-2 border-primary/30 shadow-card-lg">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Official MedVault AI QR</span>
                <h4 className="font-heading font-bold text-lg text-accent dark:text-white">{selectedMember?.name || "Family Member"}</h4>
              </div>

              {generatedQrUrl ? (
                <div className="p-4 bg-white rounded-3xl shadow-lg border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={generatedQrUrl} alt="Generated QR" className="w-52 h-52" />
                </div>
              ) : (
                <div className="w-52 h-52 bg-border/20 rounded-3xl animate-pulse flex items-center justify-center text-muted-foreground">
                  Generating QR...
                </div>
              )}

              <p className="text-xs text-muted-foreground max-w-xs">
                🔒 Scan using any standard smartphone camera or MedVault scanner to view critical emergency data.
              </p>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Scan QR Code */}
        {activeTab === "scan" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 sm:p-8 space-y-6 max-w-2xl mx-auto"
          >
            <div className="text-center space-y-2">
              <h3 className="font-heading font-bold text-2xl text-accent dark:text-white flex items-center justify-center gap-2">
                <Camera className="w-6 h-6 text-primary" /> MedVault QR Code Scanner
              </h3>
              <p className="text-xs text-muted-foreground">
                Scan any MedVault emergency card QR code via Live Camera or image upload
              </p>
            </div>

            {/* Camera Frame */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-primary/40 flex items-center justify-center">
              <video ref={videoRef} className={`w-full h-full object-cover ${scanning ? "block" : "hidden"}`} />
              <canvas ref={canvasRef} className="hidden" />

              {!scanning && (
                <div className="text-center space-y-3 p-6">
                  <QrCode className="w-16 h-16 text-primary/40 mx-auto animate-bounce" />
                  <p className="text-xs text-slate-400">Click below to start live camera scanning</p>
                  <button
                    onClick={startCamera}
                    className="btn-primary text-xs py-2.5 px-6 inline-flex items-center gap-2 shadow-glow"
                  >
                    <Camera className="w-4 h-4" /> Start Camera Scan
                  </button>
                </div>
              )}

              {scanning && (
                <div className="absolute inset-0 border-2 border-primary animate-pulse pointer-events-none flex items-center justify-center">
                  <span className="bg-primary/80 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Scanning for MedVault QR...
                  </span>
                </div>
              )}
            </div>

            {scanning && (
              <button onClick={stopCamera} className="btn-ghost w-full py-2 text-xs text-error">
                Stop Camera
              </button>
            )}

            {/* File Upload Alternative */}
            <div className="border-t border-border dark:border-dark-border pt-4 text-center space-y-3">
              <p className="text-xs font-semibold text-muted-foreground">Or upload an emergency card QR image</p>
              <label className="btn-outline text-xs py-2.5 px-6 inline-flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" /> Select QR Image File
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Scan Result Box */}
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-success/10 border border-success/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-success uppercase tracking-wider flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Decoded Result
                  </span>
                </div>

                <div className="p-3 bg-background dark:bg-dark-bg rounded-xl font-mono text-xs text-accent dark:text-white break-all">
                  {scanResult}
                </div>

                {scanResult.startsWith("http") ? (
                  <a href={scanResult} target="_blank" rel="noopener noreferrer" className="block">
                    <button className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2">
                      Open Verified Emergency Vault <ArrowRight className="w-4 h-4" />
                    </button>
                  </a>
                ) : (
                  <Link href="/share/member/1" className="block">
                    <button className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2">
                      View Matching Patient Vault Profile <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
