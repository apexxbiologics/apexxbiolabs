"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
options: {
  emailRedirectTo: "https://apexxbiolabs.com/account",
},
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Account created. Check your email to confirm your account.");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">
      <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-blue-300">
          Customer Portal
        </p>

        <h1 className="mb-3 text-4xl font-black tracking-tight">
          Create account
        </h1>

        <p className="mb-8 text-sm leading-6 text-white/60">
          Create an ApexxBiolabs account to view your orders, payment status,
          shipping status, and tracking information.
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            minLength={6}
            className="w-full rounded-xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {message && (
            <p className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-500 px-5 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-white/60">
          <Link href="/account/login" className="hover:text-white">
            Already have an account?
          </Link>

          <Link href="/" className="hover:text-white">
            Back to shop
          </Link>
        </div>
      </div>
    </main>
  );
}