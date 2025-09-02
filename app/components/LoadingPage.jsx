"use client";

import { Wallet } from "lucide-react";

export default function LoadingPage({ type = "expense" }) {
  const spinnerColor = type === "income" ? "text-green-600" : "text-indigo-600";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      {/* App Logo */}
      <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-md mb-6">
        <Wallet size={40} className={spinnerColor} />
      </div>

      {/* Loading text */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h1>
      <p className="text-gray-500 text-center max-w-sm mb-6">
        Please wait while we fetch your data.
      </p>

      {/* Animated dots */}
      <div className="flex space-x-2">
        <span className={`w-3 h-3 bg-gray-400 rounded-full animate-bounce ${spinnerColor}`}></span>
        <span className={`w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-150 ${spinnerColor}`}></span>
        <span className={`w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-300 ${spinnerColor}`}></span>
      </div>
    </div>
  );
}
