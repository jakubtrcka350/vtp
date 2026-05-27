"use client";

import { useState, useEffect } from "react";
import type { Inquiry } from "@/lib/types";

export default function InquiriesManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/inquiries");
    if (res.ok) setInquiries(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const markRead = async (id: string) => {
    await fetch(`/api/admin/inquiries/${id}`, { method: "PATCH" });
    setInquiries((is) =>
      is.map((i) => (i.id === id ? { ...i, read: true } : i))
    );
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Smazat tuto poptávku?")) return;
    await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    setInquiries((is) => is.filter((i) => i.id !== id));
  };

  const unread = inquiries.filter((i) => !i.read).length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-lg font-semibold text-[#f0f0f0]">Poptávky</h2>
        {unread > 0 && (
          <span className="bg-[#c8a96e] text-[#0a0a0a] text-xs font-bold px-2 py-0.5 rounded-full">
            {unread} nové
          </span>
        )}
      </div>

      {loading ? (
        <div className="text-[#555555] text-sm py-8">Načítám...</div>
      ) : inquiries.length === 0 ? (
        <div className="text-[#333333] text-sm py-16 text-center border border-dashed border-[#1a1a1a]">
          <svg
            className="w-8 h-8 mx-auto mb-3 text-[#222222]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          Zatím žádné poptávky.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {inquiries.map((i) => (
            <div
              key={i.id}
              className={`bg-[#111111] border p-5 transition-colors ${
                i.read ? "border-[#1a1a1a]" : "border-[#c8a96e]/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-medium text-[#f0f0f0] text-sm">
                      {i.name}
                    </span>
                    {!i.read && (
                      <span className="text-[10px] bg-[#c8a96e]/20 text-[#c8a96e] px-2 py-0.5 font-medium tracking-wide uppercase">
                        Nová
                      </span>
                    )}
                    <span className="text-xs text-[#333333]">
                      {new Date(i.createdAt).toLocaleString("cs-CZ", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                    <a
                      href={`mailto:${i.email}`}
                      className="text-xs text-[#c8a96e] hover:underline"
                    >
                      {i.email}
                    </a>
                    {i.phone && (
                      <a
                        href={`tel:${i.phone}`}
                        className="text-xs text-[#888888] hover:text-[#f0f0f0] transition-colors"
                      >
                        {i.phone}
                      </a>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-[#888888] leading-relaxed whitespace-pre-wrap">
                    {i.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 flex-shrink-0">
                  {!i.read && (
                    <button
                      onClick={() => markRead(i.id)}
                      className="text-xs text-[#555555] hover:text-[#f0f0f0] transition-colors"
                      title="Označit jako přečteno"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => deleteInquiry(i.id)}
                    className="text-[#333333] hover:text-red-400 transition-colors"
                    title="Smazat"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
