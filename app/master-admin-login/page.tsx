"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

export default function MasterAdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/master-admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!data.success) {
      setError(data.error || "Incorrect username or password.");
      return;
    }

    window.location.href = "/admin";
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.12),transparent_55%)]" />

      <form
        onSubmit={login}
        className="relative z-10 w-full max-w-md rounded-[40px] border border-blue-400/20 bg-white/[0.04] backdrop-blur-sm p-8 shadow-[0_0_60px_rgba(96,165,250,0.12)]"
      >
        <div className="w-16 h-16 rounded-full border border-blue-400/20 bg-blue-500/10 flex items-center justify-center mb-6">
          <Lock className="text-blue-300" size={28} />
        </div>

        <p className="uppercase tracking-[0.35em] text-blue-300 text-xs mb-4">
          Master Admin
        </p>

        <h1 className="text-4xl font-black mb-6">Apexx Control</h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-full bg-[#081526]/70 border border-white/10 px-6 py-4 text-white placeholder:text-white/40 outline-none focus:border-blue-400/50"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full bg-[#081526]/70 border border-white/10 px-6 py-4 text-white placeholder:text-white/40 outline-none focus:border-blue-400/50"
          />
        </div>

        {error && <p className="text-red-300 text-sm mt-4">{error}</p>}

        <button
          type="submit"
          className="w-full mt-6 rounded-full bg-white text-[#081526] py-4 font-bold uppercase tracking-widest hover:bg-blue-100 transition-all"
        >
          Enter Admin
        </button>
      </form>
    </main>
  );
}