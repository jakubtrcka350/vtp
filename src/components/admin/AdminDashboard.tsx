"use client";

import { useRouter } from "next/navigation";
import WorksManager from "./WorksManager";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="border-b border-[#2a2a2a] bg-[#141414] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-semibold text-[#f0f0f0] text-sm tracking-wide">
            Správa webu
          </span>
          <div className="flex items-center gap-1">
            <a
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-[#888888] hover:text-[#f0f0f0] transition-colors px-3 py-2"
            >
              Zobrazit web
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <div className="w-px h-4 bg-[#2a2a2a]" />
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs text-[#888888] hover:text-red-400 transition-colors px-3 py-2"
            >
              Odhlásit se
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <WorksManager />
      </div>
    </div>
  );
}
