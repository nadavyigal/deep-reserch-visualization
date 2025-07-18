import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Test Page - Deep Research Visualization",
  description: "A simple test page to verify basic functionality",
};

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen transition-colors duration-300">
        {children}
      </body>
    </html>
  );
} 