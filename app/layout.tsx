import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./components/public-ai-cs.css";
import PublicAiCs from "./components/public-ai-cs";

export const metadata: Metadata = {
  title: "Langgeng Net — Internet Cepat, Stabil, dan Dekat",
  description: "Langgeng Net menyediakan layanan internet untuk rumah dan bisnis.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}<PublicAiCs /></body></html>;
}
