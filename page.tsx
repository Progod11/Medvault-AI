"use client";

import { motion } from "framer-motion";
import { Shield, Heart, Brain, Users, Target, Award } from "lucide-react";
import { MarketingNav, MarketingFooter } from "@/components/layout/MarketingLayout";

const values = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "We built MedVault AI with privacy at the core. Your health data is yours — we never sell, share, or mine it.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Heart,
    title: "Family-Centered",
    description: "We designed every feature thinking about real families — managing aging parents, young children, and everyone in between.",
    color: "text-error",
    bg: "bg-error/10",
  },
  {
    icon: Brain,
    title: "AI for Good",
    description: "We use AI to make healthcare accessible and understandable, not to replace doctors but to empower patients.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
];

const team = [
  { name: "Dev Pandey", role: "Founder & Lead Developer", initials: "DP", bg: "from-primary to-secondary" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <MarketingNav />

      {/* Hero */}
      <section className="section bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-app relative text-center space-y-6">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="badge bg-primary/20 border border-primary/30 text-primary"
          >
            Our Story
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading font-bold text-5xl md:text-6xl text-white"
          >
            Built by a Family,{" "}
            <span className="gradient-text">For Families</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed"
          >
            MedVault AI was born from a personal crisis — when our co-founder&apos;s
            father had a cardiac emergency and critical medical history was
            scattered across WhatsApp chats, paper files, and multiple hospital
            apps. We built the tool we wish we had.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                <span className="font-heading font-semibold text-primary uppercase tracking-wide text-sm">Our Mission</span>
              </div>
              <h2 className="font-heading font-bold text-4xl text-accent dark:text-white">
                Making Healthcare{" "}
                <span className="gradient-text">Organized & Accessible</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We believe every family deserves a secure, organized place for
                their medical history. Not just the wealthy or tech-savvy — every
                family in India and around the world.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our goal is to reduce medical errors, improve treatment outcomes,
                and save lives by ensuring critical health information is always
                available when it matters most.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, value: "10K+", label: "Families Protected" },
                { icon: Shield, value: "500K+", label: "Reports Secured" },
                { icon: Award, value: "99.9%", label: "Uptime" },
                { icon: Heart, value: "0", label: "Data Breaches" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-6 text-center space-y-2"
                >
                  <stat.icon className="w-8 h-8 text-primary mx-auto" />
                  <p className="font-heading font-bold text-3xl gradient-text">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-background dark:bg-dark-bg">
        <div className="container-app">
          <motion.div className="text-center mb-16 space-y-4">
            <h2 className="font-heading font-bold text-4xl text-accent dark:text-white">
              What We <span className="gradient-text">Stand For</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card-hover p-8 text-center space-y-4"
              >
                <div className={`w-16 h-16 rounded-2xl ${v.bg} flex items-center justify-center mx-auto`}>
                  <v.icon className={`w-8 h-8 ${v.color}`} />
                </div>
                <h3 className="font-heading font-bold text-xl text-accent dark:text-white">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container-app">
          <motion.div className="text-center mb-12 space-y-4">
            <h2 className="font-heading font-bold text-4xl text-accent dark:text-white">
              Meet the <span className="gradient-text">Team</span>
            </h2>
          </motion.div>
          <div className="flex justify-center">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="card p-8 text-center space-y-4 max-w-sm w-full"
              >
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${member.bg} flex items-center justify-center mx-auto shadow-glow`}>
                  <span className="text-xl font-bold text-white">{member.initials}</span>
                </div>
                <div>
                  <p className="font-heading font-semibold text-accent dark:text-white">{member.name}</p>
                  <p className="text-sm text-primary">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
