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
      <div className="border-b border-[#1a1a1a] bg-[#080808] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-semibold text-[#f0f0f0] text-sm tracking-wide">
            Správa webu
          </span>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="text-xs text-[#555555] hover:text-[#888888] transition-colors"
            >
              Zobrazit web ↗
            </a>
            <button
              onClick={handleLogout}
              className="text-xs text-[#555555] hover:text-red-400 transition-colors"
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
