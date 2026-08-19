import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Langgeng Net — Internet Cepat, Stabil, dan Dekat",
  description: "Langgeng Net menyediakan layanan internet untuk rumah dan bisnis.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}