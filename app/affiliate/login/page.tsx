"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AffiliateLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

    if (error || !data.user) {
      setLoading(false);
      setMessage(
        error?.message ||
          "Unable to sign in to your affiliate account."
      );
      return;
    }

    const { data: affiliate, error: affiliateError } =
      await supabase
        .from("affiliates")
        .select("id, status")
        .eq("user_id", data.user.id)
        .maybeSingle();

    if (
      affiliateError ||
      !affiliate ||
      affiliate.status !== "active"
    ) {
      await supabase.auth.signOut();

      setLoading(false);

      setMessage(
        affiliate?.status === "suspended"
          ? "Your affiliate account is currently suspended."
          : "This account is not an active Apexx Affiliate account."
      );

      return;
    }

    setLoading(false);

    router.push("/affiliate/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
            Apexx Biolabs
          </p>

          <h1 className="text-4xl md:text-5xl font-black">
            Affiliate Portal
          </h1>

          <p className="text-white/60 mt-4">
            Sign in to view your affiliate code,
            performance, and commissions.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 space-y-6"
        >
          <div>
            <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              autoComplete="email"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none focus:border-blue-400/50"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              autoComplete="current-password"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none focus:border-blue-400/50"
              placeholder="Your password"
            />
          </div>

          {message && (
            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 text-blue-100 text-sm">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-blue-500 px-7 py-4 font-bold uppercase tracking-widest text-sm hover:bg-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}