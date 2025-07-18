export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 animate-pulse">
          Loading...
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Please wait while we prepare your content
        </p>
      </div>
    </div>
  );
} 