import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Walking Through Memories by Diem Vo",
  description:
    "Every concert is a chapter. Every memory deserves a place. A personal concert archive by Diem Vo.",
  openGraph: {
    title: "Walking Through Memories by Diem Vo",
    description:
      "A personal archive of concerts, stories, and the moments that outlast the music.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Walking Through Memories by Diem Vo",
    description: "Every concert is a chapter. Every memory deserves a place.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}
