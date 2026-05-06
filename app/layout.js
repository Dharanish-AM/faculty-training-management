import { Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToasterProvider from "@/components/ToasterProvider";
import Navbar from "@/components/Navbar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Faculty Training Management System",
  description: "A simple and scalable system for managing faculty training details.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${poppins.className} antialiased text-gray-900 min-h-screen`}
      >
        <Navbar />
        <main className="w-full px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <ToasterProvider />
      </body>
    </html>
  );
}
