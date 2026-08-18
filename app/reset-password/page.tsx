"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [validSession, setValidSession] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      try {
        /*
         * Supabase recovery links establish
         * an authenticated recovery session.
         *
         * Check whether that session exists
         * before allowing a password change.
         */
        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        if (session) {
          setValidSession(true);
          setCheckingSession(false);
          return;
        }

        /*
         * Sometimes Supabase finishes processing
         * the recovery URL immediately after the
         * page loads. Listen briefly for the
         * password recovery auth event.
         */
        const {
          data: authListener,
        } =
          supabase.auth.onAuthStateChange(
            (event, session) => {
              if (
                event ===
                  "PASSWORD_RECOVERY" ||
                session
              ) {
                setValidSession(true);
                setCheckingSession(false);
              }
            }
          );

        /*
         * Give the recovery redirect a moment
         * to establish the session.
         */
        window.setTimeout(() => {
          if (
            mounted &&
            !validSession
          ) {
            setCheckingSession(false);
          }
        }, 1500);

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error(
          "Recovery session error:",
          error
        );

        if (mounted) {
          setCheckingSession(false);
        }
      }
    }

    checkRecoverySession();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleResetPassword(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setSuccess(false);

    if (password.length < 8) {
      setMessage(
        "Your new password must be at least 8 characters long."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setMessage(
        "The passwords do not match."
      );

      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {
        setMessage(
          "Your password reset link is invalid or has expired. Please request a new reset link."
        );

        return;
      }

      const {
        error,
      } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) {
        console.error(
          "Password update error:",
          error
        );

        setMessage(
          error.message ||
            "Unable to update your password."
        );

        return;
      }

      setSuccess(true);

      setMessage(
        "Your Apexx password has been updated successfully."
      );

      setPassword("");
      setConfirmPassword("");

      /*
       * Keep them signed into the same
       * Apexx Auth account.
       *
       * After a short confirmation,
       * send them to their account page.
       */
      window.setTimeout(() => {
        router.push("/account");
      }, 1800);
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      setMessage(
        "Unable to update your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-[#081526] text-white flex items-center justify-center px-6">
        <p className="text-blue-200 uppercase tracking-[0.25em] text-sm">
          Verifying Reset Link...
        </p>
      </main>
    );
  }

  if (!validSession) {
    return (
      <main className="min-h-screen bg-[#081526] text-white px-6 py-12 flex items-center justify-center">
        <div className="w-full max-w-xl text-center">

          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
            Apexx Account
          </p>

          <h1 className="text-4xl md:text-5xl font-black">
            Reset Link Expired
          </h1>

          <p className="text-white/60 mt-4">
            This password reset link is invalid or has expired.
            Request a new password reset email to continue.
          </p>

          <a
            href="/forgot-password"
            className="inline-block mt-8 rounded-full bg-blue-500 px-7 py-4 font-bold uppercase tracking-widest text-sm hover:bg-blue-400 transition-all"
          >
            Request New Reset Link
          </a>

          <div className="mt-6">
            <a
              href="/account/login"
              className="text-sm font-bold text-blue-300 hover:text-blue-200 transition"
            >
              ← Back to Login
            </a>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-xl">

        <div className="text-center mb-10">

          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
            Apexx Account
          </p>

          <h1 className="text-4xl md:text-5xl font-black">
            Create New Password
          </h1>

          <p className="text-white/60 mt-4">
            Enter a new password for your Apexx account.
          </p>

        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8">

          <form
            onSubmit={
              handleResetPassword
            }
            className="space-y-5"
          >

            <div>
              <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">
                New Password
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
                minLength={8}
                autoComplete="new-password"
                placeholder="Enter new password"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none focus:border-blue-400/50"
              />

              <p className="mt-2 text-xs text-white/35">
                Minimum 8 characters.
              </p>
            </div>

            <div>
              <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                value={
                  confirmPassword
                }
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Confirm new password"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none focus:border-blue-400/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-blue-500 px-7 py-4 font-bold uppercase tracking-widest text-sm hover:bg-blue-400 transition-all disabled:opacity-50"
            >
              {loading
                ? "Updating Password..."
                : "Update Password"}
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
          Your new password will be used for both your regular Apexx account
          and Affiliate Dashboard access.
        </p>

      </div>
    </main>
  );
}