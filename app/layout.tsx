import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Langgeng Net — Internet Cepat, Stabil, dan Dekat",
  description: "Langgeng Net menyediakan layanan internet untuk rumah dan bisnis.",
};

// Explicit mobile viewport: prevents phones from using a wide virtual layout
// viewport and scaling the entire site down to a fraction of the screen.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
