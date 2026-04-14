import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PixelForge Commerce",
  description: "Generate product visuals and remove backgrounds for e-commerce teams."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
