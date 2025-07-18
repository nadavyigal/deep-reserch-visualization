'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Debug Tools</h1>
      
      <div className="flex flex-wrap gap-2 mb-8">
        <Link 
          href="/debug"
          className={`px-4 py-2 rounded-md ${isActive('/debug') 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
        >
          Main
        </Link>
        <Link 
          href="/debug/auth"
          className={`px-4 py-2 rounded-md ${isActive('/debug/auth') 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
        >
          Auth Debug
        </Link>
        <Link 
          href="/debug/firebase"
          className={`px-4 py-2 rounded-md ${isActive('/debug/firebase') 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
        >
          Firebase Debug
        </Link>
        <Link 
          href="/"
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          Back to Home
        </Link>
      </div>
      
      {children}
    </div>
  );
} 