'use client'

import { useState, useEffect, memo } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

// Create a client-only Button component
const Button = memo(({ 
  onClick, 
  className, 
  children
}: { 
  onClick: () => void; 
  className?: string; 
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    type="button"
    className={className}
  >
    {children}
  </button>
));
Button.displayName = 'Button';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full transition-all duration-300 z-10 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <main 
        className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarOpen ? 'md:ml-64' : ''
        }`}
      >
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-dark-800 shadow-sm">
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
          >
            <MenuIcon />
          </Button>
          <h1 className="text-lg font-semibold text-primary-600 dark:text-primary-400">
            MD Animation
          </h1>
          <ThemeToggle />
        </div>
        
        {/* Content */}
        <div className="p-4 md:p-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
} 