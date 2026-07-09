import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.apexxbiolabs.com"),

  title: {
    default: "Apexx Biolabs",
    template: "%s | Apexx Biolabs",
  },

  description:
    "Premium research peptides and laboratory research materials intended strictly for scientific, educational, and analytical research purposes.",

  keywords: [
    "Apexx Biolabs",
    "Research Peptides",
    "Laboratory Research",
    "Research Materials",
    "Scientific Research",
    "Peptides",
  ],

  alternates: {
    canonical: "/",
  },

  verification: {
    google: "32QpnbgyOIQ_12SS9SlNK3I_eKubhzvcFAaNOEXDZYU",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.apexxbiolabs.com",
    siteName: "Apexx Biolabs",
    title: "Apexx Biolabs",
    description:
      "Premium research peptides for laboratory research.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Apexx Biolabs Open Graph Image",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Apexx Biolabs",
    description:
      "Premium research peptides for laboratory research.",
    images: ["/images/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#081526] text-white flex flex-col">
        <Navbar />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}