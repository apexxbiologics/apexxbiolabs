"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

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
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      setLoggedIn(Boolean(user));
      setLoading(false);
    }

    checkSession();
  }, []);

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    const { error } =
      await supabase.auth.signInWithPassword({
        email:
          email
            .trim()
            .toLowerCase(),

        password,
      });

    if (error) {
      setMessage(
        "Unable to sign in. Please check your email and password."
      );

      return;
    }

    setLoggedIn(true);
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

        setClaiming(false);
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

        setClaiming(false);
        return;
      }

      router.push(
        "/affiliate/dashboard?claimed=success"
      );
    } catch (error) {
      console.error(
        "Affiliate claim error:",
        error
      );

      setMessage(
        "Unable to activate affiliate account."
      );

      setClaiming(false);
    }
  }

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
          <h1 className="text-3xl font-black">
            Invalid Invitation
          </h1>

          <p className="text-white/60 mt-4">
            This affiliate invitation link is missing or invalid.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-xl">

        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
            Apexx Affiliate Program
          </p>

          <h1 className="text-4xl md:text-5xl font-black">
            Accept Invitation
          </h1>

          <p className="text-white/60 mt-4">
            Activate affiliate access for your existing Apexx account.
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8">

          {!loggedIn ? (
            <>
              <div className="mb-7">
                <h2 className="text-2xl font-black">
                  Sign In to Apexx
                </h2>

                <p className="text-white/50 mt-2">
                  Use the same Apexx account that received this affiliate invitation.
                </p>
              </div>

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">
                    Email
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
                      setPassword(
                        event.target.value
                      )
                    }
                    required
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none focus:border-blue-400/50"
                    placeholder="Your Apexx password"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-blue-500 px-7 py-4 font-bold uppercase tracking-widest text-sm hover:bg-blue-400 transition-all"
                >
                  Sign In
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">

                <div className="w-16 h-16 rounded-full border border-green-400/20 bg-green-500/10 flex items-center justify-center mx-auto mb-5 text-green-300 text-2xl">
                  ✓
                </div>

                <h2 className="text-2xl font-black">
                  Apexx Account Verified
                </h2>

                <p className="text-white/50 mt-3">
                  You're signed in. Activate your affiliate access to continue.
                </p>

              </div>

              <button
                onClick={handleClaim}
                disabled={claiming}
                className="w-full mt-8 rounded-full bg-blue-500 px-7 py-4 font-bold uppercase tracking-widest text-sm hover:bg-blue-400 transition-all disabled:opacity-50"
              >
                {claiming
                  ? "Activating..."
                  : "Activate Affiliate Access"}
              </button>
            </>
          )}

          {message && (
            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 text-blue-100 text-sm mt-6">
              {message}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}