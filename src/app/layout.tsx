import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientProviders from './ClientProviders';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Next.js Auth Demo',
  description: 'A demo of authentication with Next.js and NextAuth.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
