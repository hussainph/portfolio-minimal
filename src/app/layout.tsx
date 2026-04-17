import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { InterfaceKit } from "interface-kit/react";
import { Agentation } from "agentation";
import { SITE_URL } from "@/lib/siteUrl";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
  weight: ["400"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});

const SITE_NAME = "Hussain Phalasiya";
const SITE_DESCRIPTION =
  "Personal feed — notes, posts, and projects. A Twitter + Substack hybrid.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Per-route titles flow through the template; routes return bare titles
  // (no " · Hussain Phalasiya" suffix) and the template appends the site
  // name once. The `default` covers routes that don't set a title at all.
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
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
      className={`${instrumentSerif.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === "development" && <InterfaceKit />}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
