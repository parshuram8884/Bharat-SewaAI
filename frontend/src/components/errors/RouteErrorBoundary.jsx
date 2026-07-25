import { useRouteError } from 'react-router-dom';

export default function RouteErrorBoundary() {
  const error = useRouteError();
  console.error("RouteErrorBoundary:", error);

  return (
    <div className="p-8 flex items-center justify-center h-full">
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg max-w-lg">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Page Error</h2>
        <p className="text-sm text-red-600 mb-4">There was a problem loading this section of the application.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
