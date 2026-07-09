"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpdatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setUpdating(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      setUpdating(false);
      return;
    }

    setMessage("Password updated successfully.");
    setUpdating(false);

    setTimeout(() => {
      router.push("/account/login");
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">
      <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
          <Lock />
        </div>

        <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-blue-300">
          Account Security
        </p>

        <h1 className="mb-4 text-4xl font-black tracking-tight">
          Update Password
        </h1>

        <p className="mb-8 text-sm leading-6 text-white/60">
          Enter your new password below.
        </p>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            minLength={6}
            className="security-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm new password"
            minLength={6}
            className="security-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {message && (
            <p className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={updating}
            className="w-full rounded-xl bg-blue-500 px-5 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:bg-blue-400 disabled:opacity-60"
          >
            {updating ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .security-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.08);
          padding: 1rem 1.25rem;
          color: white;
          outline: none;
        }

        .security-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .security-input:focus {
          border-color: rgba(96, 165, 250, 0.55);
        }
      `}</style>
    </main>
  );
}