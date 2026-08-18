"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AffiliateClaimClient() {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const token =
    searchParams.get("token") || "";

  const [loading, setLoading] =
    useState(true);

  const [claiming, setClaiming] =
    useState(false);

  const [loggingIn, setLoggingIn] =
    useState(false);

  const [loggedIn, setLoggedIn] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    async function checkSession() {
      try {
        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        setLoggedIn(
          Boolean(user)
        );
      } catch (error) {
        console.error(
          "Affiliate claim session error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setLoggingIn(true);

    try {
      const normalizedEmail =
        email
          .trim()
          .toLowerCase();

      if (!normalizedEmail) {
        setMessage(
          "Please enter your Apexx account email."
        );

        return;
      }

      const {
        error,
      } =
        await supabase.auth.signInWithPassword({
          email:
            normalizedEmail,
          password,
        });

      if (error) {
        setMessage(
          "Unable to sign in. Please check your email and password."
        );

        return;
      }

      setLoggedIn(true);

      setMessage(
        "Account verified. You can now activate your affiliate access."
      );
    } catch (error) {
      console.error(
        "Affiliate claim login error:",
        error
      );

      setMessage(
        "Unable to sign in. Please try again."
      );
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleClaim() {
    setMessage("");
    setClaiming(true);

    try {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (
        !session?.access_token
      ) {
        setMessage(
          "Please sign in to your Apexx account first."
        );

        return;
      }

      const response =
        await fetch(
          "/api/affiliate/claim",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${session.access_token}`,
            },

            body:
              JSON.stringify({
                token,
              }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setMessage(
          result.error ||
            "Unable to activate affiliate account."
        );

        return;
      }

      router.push(
        "/affiliate/dashboard?claimed=success"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Affiliate claim error:",
        error
      );

      setMessage(
        "Unable to activate affiliate account."
      );
    } finally {
      setClaiming(false);
    }
  }

  /*
   * Preserve the affiliate invitation token
   * while sending a brand-new customer through
   * the regular Apexx account signup process.
   */
  const createAccountUrl =
    `/account/signup?affiliate_token=${encodeURIComponent(
      token
    )}`;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#081526] text-white flex items-center justify-center px-6">
        <p className="text-blue-200 uppercase tracking-[0.25em] text-sm">
          Loading Invitation...
        </p>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-[#081526] text-white flex items-center justify-center px-6">
        <div className="max-w-xl text-center">

          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
            Apexx Affiliate Program
          </p>

          <h1 className="text-4xl font-black">
            Invalid Invitation
          </h1>

          <p className="text-white/60 mt-4">
            This affiliate invitation link is missing or invalid.
          </p>

          <a
            href="/"
            className="inline-block mt-8 rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 text-sm font-bold uppercase tracking-widest text-white/70 hover:bg-white/[0.08]"
          >
            Back to Apexx
          </a>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12 flex items-center justify-center">

      <div className="w-full max-w-2xl">

        <div className="text-center mb-10">

          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
            Apexx Affiliate Program
          </p>

          <h1 className="text-4xl md:text-5xl font-black">
            Accept Invitation
          </h1>

          <p className="text-white/60 mt-4 max-w-xl mx-auto leading-relaxed">
            Activate your Apexx Affiliate access.
            Choose the option below that matches your account.
          </p>

        </div>

        {!loggedIn ? (
          <div className="space-y-6">

            {/* EXISTING ACCOUNT */}

            <section className="rounded-[32px] border border-blue-400/20 bg-white/[0.04] p-8">

              <div className="mb-7">

                <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-300 mb-3">
                  Already Have an Account?
                </p>

                <h2 className="text-2xl md:text-3xl font-black">
                  Sign In to Apexx
                </h2>

                <p className="text-white/50 mt-3 leading-relaxed">
                  If you already have an Apexx Points account,
                  sign in using the
                  <strong className="text-white">
                    {" "}same email and password{" "}
                  </strong>
                  you normally use for that account.
                  Your affiliate access will be connected to it.
                </p>

              </div>

              <form
                onSubmit={
                  handleLogin
                }
                className="space-y-5"
              >

                <div>
                  <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(
                      event
                    ) =>
                      setEmail(
                        event.target
                          .value
                      )
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
                    onChange={(
                      event
                    ) =>
                      setPassword(
                        event.target
                          .value
                      )
                    }
                    required
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none focus:border-blue-400/50"
                    placeholder="Your Apexx password"
                  />

                  <div className="mt-3 text-right">
                    <Link
                      href="/forgot-password"
                      className="text-sm font-semibold text-blue-300 hover:text-blue-200 transition"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    loggingIn
                  }
                  className="w-full rounded-full bg-blue-500 px-7 py-4 font-bold uppercase tracking-widest text-sm hover:bg-blue-400 transition-all disabled:opacity-50"
                >
                  {loggingIn
                    ? "Signing In..."
                    : "Sign In"}
                </button>

              </form>

            </section>

            {/* NEW ACCOUNT */}

            <section className="rounded-[32px] border border-white/10 bg-white/[0.025] p-8">

              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-3">
                New to Apexx?
              </p>

              <h2 className="text-2xl md:text-3xl font-black">
                Create an Apexx Account
              </h2>

              <p className="text-white/50 mt-3 leading-relaxed">
                If you do not already have an Apexx account,
                create one using the
                <strong className="text-white">
                  {" "}same email address that received this affiliate invitation.
                </strong>
                {" "}Your new customer account and Affiliate Dashboard
                will then be connected under the same login.
              </p>

              <a
                href={
                  createAccountUrl
                }
                className="mt-7 flex w-full items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 px-7 py-4 text-sm font-bold uppercase tracking-widest text-blue-200 transition hover:bg-blue-500/20"
              >
                Create Account
              </a>

              <p className="mt-4 text-center text-xs leading-relaxed text-white/35">
                Be sure to use the same email address
                where you received your affiliate invitation.
              </p>

            </section>

          </div>
        ) : (
          <section className="rounded-[32px] border border-green-400/20 bg-white/[0.04] p-8">

            <div className="text-center">

              <div className="w-16 h-16 rounded-full border border-green-400/20 bg-green-500/10 flex items-center justify-center mx-auto mb-5 text-green-300 text-2xl">
                ✓
              </div>

              <p className="text-xs font-black uppercase tracking-[0.3em] text-green-300 mb-3">
                Account Verified
              </p>

              <h2 className="text-2xl md:text-3xl font-black">
                Activate Affiliate Access
              </h2>

              <p className="text-white/50 mt-3 max-w-lg mx-auto leading-relaxed">
                You&apos;re signed into your Apexx account.
                Activate this invitation to connect your
                Affiliate Dashboard to the same account.
              </p>

            </div>

            <button
              onClick={
                handleClaim
              }
              disabled={
                claiming
              }
              className="w-full mt-8 rounded-full bg-blue-500 px-7 py-4 font-bold uppercase tracking-widest text-sm hover:bg-blue-400 transition-all disabled:opacity-50"
            >
              {claiming
                ? "Activating..."
                : "Activate Affiliate Access"}
            </button>

          </section>
        )}

        {message && (
          <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 text-blue-100 text-sm mt-6">
            {message}
          </div>
        )}

      </div>

    </main>
  );
}