"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("GLOBAL_ERROR_RECOVERY:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-red-50 p-8 rounded-2xl border border-red-100 shadow-xl max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Upps! Something went wrong</h2>
        <p className="text-gray-600 mb-6 font-medium">
          We encountered a server-side exception. Please see the details below to help us fix it.
        </p>
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg text-left text-sm font-mono mb-8 overflow-auto max-h-[300px] shadow-inner">
          <p className="mb-2"># Error Details:</p>
          <p className="whitespace-pre-wrap">{error.message || "No error message provided by server."}</p>
          {error.digest && <p className="mt-4 text-gray-400">Digest: {error.digest}</p>}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl transition-all"
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = "/"}
            className="border-gray-200 hover:bg-gray-50 px-8 py-3 rounded-xl"
          >
            Back to Home
          </Button>
        </div>
        <p className="mt-8 text-sm text-gray-400">
          Our team is working hard to resolve this. Thank you for your patience!
        </p>
      </div>
    </div>
  );
}
