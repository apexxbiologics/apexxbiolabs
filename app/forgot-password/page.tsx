"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const normalizedEmail =
        email
          .trim()
          .toLowerCase();

      if (!normalizedEmail) {
        setMessage(
          "Please enter your email address."
        );

        return;
      }

      const {
        error,
      } =
        await supabase.auth.resetPasswordForEmail(
          normalizedEmail,
          {
            redirectTo:
              `${window.location.origin}/reset-password`,
          }
        );

      if (error) {
        console.error(
          "Password reset request error:",
          error
        );

        setMessage(
          "Unable to send the password reset email. Please try again."
        );

        return;
      }

      /*
       * Keep the response intentionally generic.
       * This avoids confirming whether a specific
       * email address exists in the system.
       */
      setSuccess(true);

      setMessage(
        "If an Apexx account exists for that email, a password reset link has been sent."
      );
    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      setMessage(
        "Unable to send the password reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-xl">

        <div className="text-center mb-10">

          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
            Apexx Account
          </p>

          <h1 className="text-4xl md:text-5xl font-black">
            Reset Password
          </h1>

          <p className="text-white/60 mt-4">
            Enter the email address connected to your Apexx account.
          </p>

        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                required
                autoComplete="email"
                placeholder="you@email.com"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none focus:border-blue-400/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-blue-500 px-7 py-4 font-bold uppercase tracking-widest text-sm hover:bg-blue-400 transition-all disabled:opacity-50"
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>

          </form>

          {message && (
            <div
              className={`mt-6 rounded-2xl border p-4 text-sm ${
                success
                  ? "border-green-400/20 bg-green-500/10 text-green-100"
                  : "border-blue-400/20 bg-blue-500/10 text-blue-100"
              }`}
            >
              {message}
            </div>
          )}

          <div className="mt-7 border-t border-white/10 pt-6 text-center">

            <a
              href="/account/login"
              className="text-sm font-bold text-blue-300 hover:text-blue-200 transition"
            >
              ← Back to Login
            </a>

          </div>

        </div>

        <p className="text-center text-white/35 text-xs mt-6 leading-relaxed">
          Your Apexx account password is shared across your regular account and affiliate access.
        </p>

      </div>
    </main>
  );
}