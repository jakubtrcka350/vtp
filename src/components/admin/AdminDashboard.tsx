"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WorksManager from "./WorksManager";
import InquiriesManager from "./InquiriesManager";

type Tab = "works" | "inquiries";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("inquiries");
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
          <div className="flex items-center gap-6">
            <span className="font-semibold text-[#f0f0f0] text-sm tracking-wide">
              Správa webu
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setTab("inquiries")}
                className={`px-4 py-1.5 text-xs font-medium transition-colors ${
                  tab === "inquiries"
                    ? "bg-[#1c1c1c] text-[#f0f0f0]"
                    : "text-[#555555] hover:text-[#888888]"
                }`}
              >
                Poptávky
              </button>
              <button
                onClick={() => setTab("works")}
                className={`px-4 py-1.5 text-xs font-medium transition-colors ${
                  tab === "works"
                    ? "bg-[#1c1c1c] text-[#f0f0f0]"
                    : "text-[#555555] hover:text-[#888888]"
                }`}
              >
                Naše práce
              </button>
            </div>
          </div>

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

      {/* Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        {tab === "works" ? <WorksManager /> : <InquiriesManager />}
      </div>
    </div>
  );
}
