'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  
  // Use a function declaration for the handler
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-2">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
          >
            Go Home
          </Link>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base"
          >
            Go Back
          </button>
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you believe this is an error, please contact support
          </p>
        </div>
      </div>
    </div>
  );
} 