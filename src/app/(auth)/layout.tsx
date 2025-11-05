// Auth page layout - Beautiful gradient design
// Updated with modern gradients and animations

import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 dark:from-purple-900 dark:via-indigo-900 dark:to-blue-900" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md animate-slideUp">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20">
          {/* Logo or Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Free Diet
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Трекер калорий по фотографии
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
