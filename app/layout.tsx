import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

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

  title: "Apexx Biolabs",
  description:
    "Laboratory research materials intended strictly for scientific, educational, and analytical research purposes.",

  alternates: {
    canonical: "/",
  },

  verification: {
    google: "32QpnbgyOIQ_12SS9SlNK3I_eKubhzvcFAaNOEXDZYU",
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
        <body className="min-h-screen bg-[#081526] text-white flex flex-col">
  <Navbar />

  <main className="flex-1">
    {children}
  </main>

  <Footer />
</body>

        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}