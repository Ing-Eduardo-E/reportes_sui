import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BrowserCompatibility from "@/components/BrowserCompatibility";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portal de Tutoriales - 3E Asesorías y Consultorías",
  description: "Sistema privado de gestión de tutoriales en video - Ing. Eduardo E. Enríquez R.",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <BrowserCompatibility />
        {children}
      </body>
    </html>
  );
}
