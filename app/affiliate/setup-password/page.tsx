"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AffiliateSetupPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    /*
     * Verify that the affiliate has a valid
     * Supabase session from the invitation link.
     */
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      setMessage(
        "Your invitation session could not be verified. Please open the invitation link from your email again."
      );
      return;
    }

    /*
     * Set the affiliate's password.
     */
    const { error: passwordError } =
      await supabase.auth.updateUser({
        password,
      });

    if (passwordError) {
      setLoading(false);
      setMessage(passwordError.message);
      return;
    }

    /*
     * Get the authenticated session so we can
     * securely activate the affiliate through
     * our server API.
     */
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setLoading(false);
      setMessage(
        "Your affiliate session could not be verified."
      );
      return;
    }

    /*
     * Tell our server to change the affiliate
     * status from "invited" to "active".
     */
    const activationResponse = await fetch(
      "/api/affiliate/activate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    const activationResult =
      await activationResponse.json();

    if (!activationResponse.ok) {
      setLoading(false);
      setMessage(
        activationResult.error ||
          "Your affiliate account could not be activated."
      );
      return;
    }

    /*
     * Account is now active.
     */
    setLoading(false);

    router.push(
      "/affiliate/dashboard?setup=success"
    );
  }

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
            Apexx Biolabs
          </p>

          <h1 className="text-4xl md:text-5xl font-black">
            Affiliate Account
          </h1>

          <p className="text-white/60 mt-4">
            Create your password to activate your Apexx Affiliate account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 space-y-6"
        >
          <div>
            <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">
              Create Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none focus:border-blue-400/50"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none focus:border-blue-400/50"
              placeholder="Enter password again"
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
              ? "Activating..."
              : "Activate Affiliate Account"}
          </button>
        </form>
      </div>
    </main>
  );
}