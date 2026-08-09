import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { LanguageProvider } from "@/components/providers/LanguageContext";
import { FirebaseSyncProvider } from "@/components/providers/FirebaseSyncProvider";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { FirebaseDebug } from "@/components/debug/FirebaseDebug";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MedVault AI — Your Family Health Vault",
    template: "%s | MedVault AI",
  },
  description:
    "Securely store, organize, and manage your family's medical records with AI-powered insights. Never lose a prescription or lab report again.",
  keywords: [
    "health records",
    "medical vault",
    "family health",
    "medical records management",
    "AI health",
    "prescription management",
    "lab reports",
  ],
  authors: [{ name: "MedVault AI" }],
  creator: "MedVault AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://medvault-ai.com",
    title: "MedVault AI — Your Family Health Vault",
    description:
      "Securely store, organize, and manage your family's medical records with AI-powered insights.",
    siteName: "MedVault AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "MedVault AI — Your Family Health Vault",
    description:
      "Securely store, organize, and manage your family's medical records with AI-powered insights.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-body antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            <LanguageProvider>
              <FirebaseSyncProvider>
                <SplashScreen>
                  {children}
                </SplashScreen>
                <FirebaseDebug />
              </FirebaseSyncProvider>
            </LanguageProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "rgb(var(--card))",
                  border: "1px solid rgb(var(--border))",
                  color: "rgb(var(--foreground))",
                },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
