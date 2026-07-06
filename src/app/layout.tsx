import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AURAGAZE — Dress With Intention",
  description: "Premium oversized tees and streetwear. Discover curated drops, new arrivals, and everyday essentials.",
  keywords: ["oversized tees", "streetwear", "apparel", "t-shirts", "AURAGAZE", "BLUORNG"],
  openGraph: {
    title: "AURAGAZE",
    description: "Premium oversized tees for the bold.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7ff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${geistMono.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" href="/hero-poster.jpg" as="image" type="image/jpeg" />
      </head>
      <body className="min-h-screen grid-bg">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
