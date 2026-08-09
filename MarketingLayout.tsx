"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg border-b border-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-accent dark:text-white">
              MedVault <span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl hover:bg-border dark:hover:bg-dark-border transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-warning" />
              ) : (
                <Moon className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <Link href="/login" className="btn-ghost text-sm py-2">
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary text-sm py-2.5 px-5">
              Get Started Free
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl hover:bg-border transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-warning" />
              ) : (
                <Moon className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl hover:bg-border transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border dark:border-dark-border py-4 space-y-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-primary/5 text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="font-medium">{link.label}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" className="btn-outline text-sm py-2.5 text-center">
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary text-sm py-2.5 text-center">
                Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

export function MarketingFooter() {
  return (
    <footer className="bg-accent dark:bg-dark-surface border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-white">
                MedVault <span className="gradient-text">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your Family. Your Health. Securely Together. Store, organize, and
              access your family&apos;s complete medical history in one secure place.
            </p>
            <div className="space-y-1 text-xs text-slate-400">
              <p>📧 progod.coder@gmail.com</p>
              <p>📞 +91 9028190291</p>
              <p>📍 Maharashtra, India</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400 pt-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>256-bit encrypted · HIPAA compliant</span>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-white">Product</h4>
            <ul className="space-y-2">
              {["Features", "Pricing", "Security", "Changelog"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-slate-400 hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-white">Company</h4>
            <ul className="space-y-2">
              {["About", "Contact", "Privacy Policy", "Terms of Service"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                      className="text-sm text-slate-400 hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} MedVault AI. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Made with ❤️ for healthier families
          </p>
        </div>
      </div>
    </footer>
  );
}
