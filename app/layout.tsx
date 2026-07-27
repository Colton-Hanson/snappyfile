import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnappyFile – Fast Free File & Link Tools",
  description: "Convert files, shorten links, generate QR codes and more. Free, fast, no signup required.",
  keywords: "file converter, pdf to word, image converter, url shortener, qr code generator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="noise" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
