/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import {
  Sparkles,
  Send,
  User,
  Bot,
  Pill,
  FileText,
  AlertTriangle,
  Copy,
  Check,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  HeartPulse,
  Trash2,
  Image as ImageIcon,
  Mic,
  Volume2,
  VolumeX,
  X,
  Paperclip,
} from "lucide-react";
import { getUserData, FamilyMember } from "@/lib/dataStore";
import type { Report, Medicine } from "@/types";
import { useLanguage } from "@/components/providers/LanguageContext";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  familyMemberName?: string;
  image?: string;
}

function generateMsgId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

const quickPrompts = [
  {
    icon: Stethoscope,
    label: "Symptom Triage & Check",
    prompt: "I want to check symptoms: mild persistent fever, fatigue, and dry cough. What could be the cause and recommended triage level?",
  },
  {
    icon: FileText,
    label: "Explain Lab Report Results",
    prompt: "Can you analyze and explain the key findings in my family member's recent blood test and lab reports?",
  },
  {
    icon: Pill,
    label: "Medicine Interactions & Usage",
    prompt: "Explain the usage, potential side effects, and drug interactions for our active prescribed medications.",
  },
  {
    icon: HeartPulse,
    label: "Diet & Lifestyle Recommendations",
    prompt: "What dietary guidelines, exercise habits, and precaution steps are recommended for managing diabetes and blood pressure?",
  },
];

export default function AIAssistantPage() {
  const { language, t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("all");

  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // Multimodal & Voice state
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load real user data
  useEffect(() => {
    const loadData = () => {
      const userData = getUserData();
      setFamilyMembers(userData.familyMembers || []);
      setReports(userData.reports || []);
      setMedicines(userData.medicines || []);
    };

    loadData();

    // Initial greeting if chat is empty
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages([
      {
        id: "welcome-1",
        role: "assistant",
        content: language === "hi"
          ? `### 👋 मेड एआई स्वास्थ्य सहायक में आपका स्वागत है\n\nमैं आपका बुद्धिमत्तापूर्ण पारिवारिक स्वास्थ्य सलाहकार हूँ। मैं मेडिकल रिपोर्ट का विश्लेषण, लक्षणों की जाँच, दवाओं के दुष्प्रभाव और आपके स्वास्थ्य प्रश्नों का उत्तर देने में सहायता कर सकता हूँ।\n\n📷 **इमेज शेयर करें:** आप मेडिकल रिपोर्ट या त्वचा के लक्षण की फोटो भी अपलोड कर सकते हैं!`
          : `### 👋 Welcome to Med AI Symptoms & Health Assistant\n\nI am your intelligent family health consultant powered by **Gemini 3.5 AI**. I can help you analyze medical reports, check symptoms, review medication side effects, and answer health questions.\n\n📷 **Attach Images:** You can upload photos of lab reports, skin rashes, or prescriptions for precise image analysis!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    const handleUpdate = () => loadData();
    window.addEventListener("medvault_data_updated", handleUpdate);
    return () => window.removeEventListener("medvault_data_updated", handleUpdate);
  }, [language]);

  // Handle image upload selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedImage(event.target?.result as string);
      toast.success("Image attached! Type your query or ask AI to analyze it.");
    };
    reader.readAsDataURL(file);
  };

  // Voice Dictation (Speech to Text)
  const toggleVoiceRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === "hi" ? "hi-IN" : "en-US";

      recognition.onstart = () => {
        setIsRecording(true);
        toast.info(language === "hi" ? "बोलना शुरू करें..." : "Listening... Speak now.");
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setInputQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        toast.error("Voice input error: " + event.error);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  // Text to Speech Read Aloud
  const speakMessage = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      window.speechSynthesis?.cancel();
      setSpeakingMsgId(null);
      return;
    }

    if (!("speechSynthesis" in window)) {
      toast.error("Text to speech is not supported in your browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*#_`-]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === "hi" ? "hi-IN" : "en-US";

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const selectedMember = familyMembers.find((m) => m.id === selectedMemberId);

  // Build context payload for API call
  const getContextPayload = () => {
    if (selectedMemberId === "all" || !selectedMember) {
      return {
        name: "Entire Family Unit",
        relationship: "Family Vault",
        age: "N/A",
        bloodGroup: "Multiple",
        allergies: familyMembers.flatMap((m) => m.allergies || []),
        chronicDiseases: familyMembers.flatMap((m) => m.chronicDiseases || []),
        medications: medicines.map((m) => ({ name: m.name, dosage: m.dosage })),
        reports: reports.map((r) => ({ title: r.title, reportDate: r.reportDate, summary: r.summary || r.diagnosis })),
      };
    }

    const memberReports = reports.filter((r) => r.familyMemberId === selectedMember.id);
    const memberMedicines = medicines.filter((m) => m.familyMemberId === selectedMember.id);

    return {
      name: selectedMember.name,
      relationship: selectedMember.relationship,
      age: selectedMember.age,
      bloodGroup: selectedMember.bloodGroup,
      allergies: selectedMember.allergies || [],
      chronicDiseases: selectedMember.chronicDiseases || [],
      medications: memberMedicines.map((m) => ({ name: m.name, dosage: m.dosage })),
      reports: memberReports.map((r) => ({ title: r.title, reportDate: r.reportDate, summary: r.summary || r.diagnosis })),
    };
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if ((!textToSend && !attachedImage) || isLoading) return;

    const currentImage = attachedImage;
    setAttachedImage(null);

    const msgId = generateMsgId("user");
    const userMsg: Message = {
      id: msgId,
      role: "user",
      content: textToSend || (currentImage ? "Analyze this attached medical report / image." : ""),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      familyMemberName: selectedMember ? selectedMember.name : "All Family",
      image: currentImage || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const familyContext = getContextPayload();
      const conversationHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
          familyMemberContext: familyContext,
          language: language,
          image: currentImage,
        }),
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: generateMsgId("ai"),
        role: "assistant",
        content: data.text || "No response received.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("AI Assistant query error:", err);
      toast.error("Failed to connect to Med AI Assistant. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    toast.success("Response copied to clipboard!");
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: generateMsgId("clear"),
        role: "assistant",
        content: "Chat history cleared. How can Med AI Assistant help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    toast.info("Chat history reset.");
  };

  return (
    <div className="flex h-screen bg-background dark:bg-dark-bg text-foreground overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] p-4 sm:p-6 max-w-7xl w-full mx-auto overflow-hidden">
          {/* Top Bar Header */}
          <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-4 mb-4 shadow-sm shrink-0 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-glow">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-heading font-bold text-foreground flex items-center gap-2">
                  Med AI Symptoms & Health Assistant
                  <span className="badge bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Gemini 3.5 AI
                  </span>
                </h1>
                <p className="text-xs text-muted-foreground">
                  Ask about family medical reports, symptoms, dosages, or drug interactions
                </p>
              </div>
            </div>

            {/* Family Member Context Selector */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1.5 rounded-xl border border-border dark:border-dark-border">
                <User className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground hidden sm:inline">Context:</span>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="all">Entire Family Vault ({familyMembers.length} members)</option>
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.relationship})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleClearChat}
                title="Clear Conversation"
                className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Context Summary Chips */}
          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 text-xs shrink-0 no-scrollbar">
            <span className="text-muted-foreground font-semibold shrink-0">Attached Records:</span>
            <span className="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0">
              <Pill className="w-3 h-3" /> {medicines.length} Medicines Active
            </span>
            <span className="badge bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0">
              <FileText className="w-3 h-3" /> {reports.length} Lab Reports
            </span>
            <span className="badge bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0">
              <ShieldCheck className="w-3 h-3" /> 256-Bit Encrypted
            </span>
          </div>

          {/* Chat Bubble Area */}
          <div className="flex-1 bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4 mb-4 shadow-inner">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 max-w-3xl ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                    msg.role === "user"
                      ? "bg-accent"
                      : "bg-gradient-primary shadow-glow"
                  }`}
                >
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm space-y-2 relative group shadow-sm ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-secondary/10 dark:bg-dark-surface border border-border dark:border-dark-border text-foreground rounded-tl-none"
                  }`}
                >
                  {msg.familyMemberName && msg.role === "user" && (
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/80 border-b border-white/20 pb-1 mb-1">
                      Target: {msg.familyMemberName}
                    </div>
                  )}

                  {msg.role === "assistant" ? (
                    <div className="markdown-body text-foreground leading-relaxed">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <div>
                      {msg.image && (
                        <div className="mb-2 rounded-xl overflow-hidden border border-white/20 max-w-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={msg.image} alt="Uploaded report or symptom" className="w-full h-auto object-cover max-h-48" />
                        </div>
                      )}
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2">
                        {/* Voice Text-to-Speech Read Aloud */}
                        <button
                          type="button"
                          onClick={() => speakMessage(msg.id, msg.content)}
                          className="hover:opacity-100 flex items-center gap-1 p-1 rounded hover:bg-border/30 transition-all text-primary font-semibold cursor-pointer"
                          title="Listen to AI Response"
                        >
                          {speakingMsgId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 animate-pulse text-error" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                          <span>{speakingMsgId === msg.id ? "Stop" : "Listen"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="hover:opacity-100 flex items-center gap-1 p-1 rounded hover:bg-border/30 transition-all cursor-pointer"
                        >
                          {copiedMsgId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedMsgId === msg.id ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground animate-pulse py-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-primary text-white flex items-center justify-center font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 bg-secondary/10 p-3 rounded-2xl border border-border">
                  <Sparkles className="w-4 h-4 text-primary animate-spin" />
                  <span>
                    {language === "hi"
                      ? "मेड एआई स्वास्थ्य रिकॉर्ड और रिपोर्टों का विश्लेषण कर रहा है..."
                      : "Med AI is analyzing family medical records & symptoms..."}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Attached Image Bar */}
          {attachedImage && (
            <div className="mb-2 p-2 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={attachedImage} alt="Attached preview" className="w-10 h-10 object-cover rounded-lg border border-primary/30" />
                <span className="text-xs font-semibold text-primary">Image attached for AI analysis</span>
              </div>
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                className="p-1 hover:bg-primary/20 rounded-lg text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Suggested Quick Prompt Cards */}
          {messages.length <= 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-3 shrink-0">
              {quickPrompts.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSendMessage(item.prompt)}
                    className="p-3 bg-card dark:bg-dark-card border border-border dark:border-dark-border hover:border-primary rounded-xl text-left transition-all hover:shadow-md group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-primary" /> {item.label}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
                      &quot;{item.prompt}&quot;
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 shrink-0 bg-card dark:bg-dark-card border border-border dark:border-dark-border p-2 rounded-2xl shadow-lg"
          >
            {/* Image File Selector */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-secondary/20 rounded-xl text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              title="Attach Report Image or Symptom Photo"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Voice Mic Input */}
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isRecording ? "bg-error text-white animate-pulse" : "text-muted-foreground hover:text-primary hover:bg-secondary/20"
              }`}
              title="Voice Input (Mic)"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                language === "hi"
                  ? "लक्षण, रिपोर्ट या दवा के बारे में पूछें..."
                  : `Ask Med AI about ${selectedMember ? selectedMember.name : "family"}'s symptoms, reports, or medicines...`
              }
              className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
            />

            <button
              type="submit"
              disabled={(!inputQuery.trim() && !attachedImage) || isLoading}
              className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>

          {/* Clinical Disclaimer */}
          <div className="mt-2 text-[10px] text-center text-muted-foreground shrink-0 flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
            <span>Med AI Assistant provides educational health analysis and is not a substitute for professional medical advice.</span>
          </div>
        </main>
      </div>
    </div>
  );
}
