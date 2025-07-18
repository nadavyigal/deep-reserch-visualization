export default function TestIndexPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Markdown Animation Studio - Test Pages</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <a 
          href="/firebase-test" 
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">Firebase Connection Test</h2>
          <p className="text-gray-600 dark:text-gray-300">Test if Firebase is properly initialized and connected.</p>
        </a>
        
        <a 
          href="/debug" 
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">Authentication Debug</h2>
          <p className="text-gray-600 dark:text-gray-300">Debug Firebase authentication issues.</p>
        </a>
        
        <a 
          href="/auth-test" 
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">Auth Test Page</h2>
          <p className="text-gray-600 dark:text-gray-300">Test authentication with the AuthContext provider.</p>
        </a>
        
        <a 
          href="/" 
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">Main Application</h2>
          <p className="text-gray-600 dark:text-gray-300">Return to the main Markdown Animation Studio application.</p>
        </a>
      </div>
    </div>
  );
} 