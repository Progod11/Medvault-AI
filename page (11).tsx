"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";
import { MarketingNav, MarketingFooter } from "@/components/layout/MarketingLayout";
import { toast } from "sonner";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <MarketingNav />
      <section className="section">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 mb-16"
          >
            <span className="badge-primary">Get in Touch</span>
            <h1 className="font-heading font-bold text-5xl text-accent dark:text-white">
              We&apos;d Love to <span className="gradient-text">Hear From You</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-xl mx-auto">
              Have a question, feature request, or partnership inquiry? Our team responds within 24 hours.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {[
                { icon: Mail, label: "Email", value: "progod.coder@gmail.com", color: "text-primary", bg: "bg-primary/10" },
                { icon: Phone, label: "Phone", value: "+91 9028190291", color: "text-secondary", bg: "bg-secondary/10" },
                { icon: MapPin, label: "Location", value: "Maharashtra, India", color: "text-success", bg: "bg-success/10" },
              ].map((item) => (
                <div key={item.label} className="card p-6 flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-semibold text-accent dark:text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 card p-8"
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-success" />
                  </motion.div>
                  <h3 className="font-heading font-bold text-2xl text-accent dark:text-white">Message Sent!</h3>
                  <p className="text-muted-foreground text-center">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline mt-4">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-accent dark:text-white">Full Name</label>
                      <input required className="input" placeholder="Arjun Sharma" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-accent dark:text-white">Email Address</label>
                      <input required type="email" className="input" placeholder="arjun@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-accent dark:text-white">Subject</label>
                    <input required className="input" placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-accent dark:text-white">Message</label>
                    <textarea
                      required
                      rows={5}
                      className="input resize-none"
                      placeholder="Tell us more about your question or feedback..."
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
