import React from "react";
import { useNavigate } from "react-router";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex flex-col items-center justify-center p-4 text-white">
      {/* Locked Parcel Illustration (SVG) */}
      <div className="mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-500"
        >
          <rect
            x="3"
            y="11"
            width="18"
            height="11"
            rx="1"
            ry="1"
            fill="#1E40AF"
            stroke="#EF4444"
          />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#EF4444" />
          <circle cx="12" cy="16" r="1" fill="#EF4444" />
          <path d="M12 16v2" stroke="#EF4444" />
        </svg>
      </div>

      {/* Error Message */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
        Access Denied! 🚫
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8 text-center max-w-md">
        You don't have permission to view this parcel. Please check your
        tracking ID or contact support.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Back to Home
        </button>
        <button
          onClick={() => navigate("/contact")}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          Contact Support
        </button>
      </div>

      {/* Error Code (Subtle) */}
      <p className="mt-8 text-sm text-gray-500">Error 403 - Forbidden</p>
    </div>
  );
};

export default Forbidden;
