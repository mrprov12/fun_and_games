import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "./components/Sidebar"; // Import Sidebar

// Fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata
export const metadata: Metadata = {
  title: "Fun and Games",
  description: "Play Sudoku or Tic-Tac-Toe",
};

// RootLayout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-800 text-white`}
      >
        {/* Flex container for sidebar and main content */}
        <div className="flex min-h-screen">
          {/* Sidebar with vertical tabs */}
          <Sidebar />
          {/* Main content area */}
          <main className="flex-1 bg-gray-300 p-8 rounded-l-lg">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
