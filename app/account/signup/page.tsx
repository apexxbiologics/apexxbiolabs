"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  async function handleSignup(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const cleanEmail =
        email.trim().toLowerCase();

      if (!cleanEmail) {
        setMessage(
          "Please enter your email address."
        );

        return;
      }

      if (password.length < 8) {
        setMessage(
          "Password must be at least 8 characters."
        );

        return;
      }

      /*
       * Check whether this signup came from
       * an affiliate invitation.
       */
      const params =
        new URLSearchParams(
          window.location.search
        );

      const affiliateToken =
        params.get(
          "affiliate_token"
        ) || "";

      /*
       * Normal customers:
       * confirm email → /account
       *
       * New affiliates:
       * confirm email → return to the original
       * affiliate claim page with the invite token.
       */
      const emailRedirectTo =
        affiliateToken
          ? `${
              window.location.origin
            }/affiliate/claim?token=${encodeURIComponent(
              affiliateToken
            )}`
          : `${
              window.location.origin
            }/account`;

      const {
        data,
        error,
      } =
        await supabase.auth.signUp({
          email:
            cleanEmail,

          password,

          options: {
            emailRedirectTo,
          },
        });

      if (
        error ||
        !data.user
      ) {
        setMessage(
          error?.message ||
            "Could not create account."
        );

        return;
      }

      /*
       * IMPORTANT:
       * Do not manually insert into profiles here.
       *
       * The previous version created the Auth user
       * successfully and then failed while trying
       * to create a profile row.
       *
       * Account creation should succeed based on
       * Supabase Auth itself.
       */
      setSuccess(true);

      if (affiliateToken) {
        setMessage(
          "Account created. Check your email to confirm your account. After confirming, you'll return to your affiliate invitation to activate your Affiliate Dashboard."
        );
      } else {
        setMessage(
          "Account created. Check your email to confirm your account."
        );
      }
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      setMessage(
        "Could not create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Read the affiliate token without
   * useSearchParams so we do not introduce
   * another Next.js Suspense requirement.
   */
  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(
          window.location.search
        )
      : null;

  const isAffiliateSignup =
    Boolean(
      params?.get(
        "affiliate_token"
      )
    );

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">

      <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur">

        <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-blue-300">
          {isAffiliateSignup
            ? "Apexx Affiliate Program"
            : "Customer Portal"}
        </p>

        <h1 className="mb-3 text-4xl font-black tracking-tight">
          Create account
        </h1>

        <p className="mb-8 text-sm leading-6 text-white/60">
          {isAffiliateSignup
            ? "Create your Apexx account using the same email address that received your affiliate invitation."
            : "Create your Apexx Biolabs account using your email address."}
        </p>

        {isAffiliateSignup && (
          <div className="mb-6 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">

            <p className="text-sm font-bold text-blue-200">
              Affiliate Invitation
            </p>

            <p className="mt-2 text-sm leading-6 text-white/55">
              After confirming your email,
              you&apos;ll return to your
              affiliate invitation and connect
              your new Apexx account to your
              Affiliate Dashboard.
            </p>

          </div>
        )}

        <form
          onSubmit={
            handleSignup
          }
          className="space-y-4"
        >

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@email.com"
              className="w-full rounded-xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-blue-400"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              minLength={8}
              className="w-full rounded-xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-blue-400"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
              autoComplete="new-password"
            />

            <p className="mt-2 text-xs text-white/35">
              Minimum 8 characters.
            </p>
          </div>

          {message && (
            <p
              className={`rounded-xl border px-4 py-3 text-sm ${
                success
                  ? "border-green-400/30 bg-green-500/10 text-green-100"
                  : "border-blue-400/30 bg-blue-500/10 text-blue-100"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={
              loading ||
              success
            }
            className="w-full rounded-xl bg-blue-500 px-5 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating..."
              : success
              ? "Check Your Email"
              : "Create Account"}
          </button>

        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-white/60">

          {isAffiliateSignup ? (
            <button
              type="button"
              onClick={() =>
                window.history.back()
              }
              className="hover:text-white"
            >
              ← Back to invitation
            </button>
          ) : (
            <Link
              href="/account/login"
              className="hover:text-white"
            >
              Already have an account?
            </Link>
          )}

          <Link
            href="/"
            className="hover:text-white"
          >
            Back to shop
          </Link>

        </div>

      </div>

    </main>
  );
}