"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Nesprávné heslo.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 border border-[#262626] flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-5 h-5 text-[#f06820]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#f0f0f0]">
            Správa webu
          </h1>
          <p className="text-[#555555] text-sm mt-2">
            Zadejte heslo pro přístup.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="block text-xs text-[#888888] mb-2 tracking-wide uppercase">
              Heslo
            </label>
            <input
              id="password"
              type="password"
              required
              autoFocus
              className="input-field w-full"
              placeholder="Zadejte heslo..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary justify-center disabled:opacity-50"
          >
            {loading ? "Ověřuji..." : "Přihlásit se"}
          </button>
        </form>

        <p className="text-center text-[#333333] text-xs mt-8">
          Tato stránka není veřejně přístupná.
        </p>
      </div>
    </div>
  );
}

