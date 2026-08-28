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

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] =
    useState(true);

  const [validSession, setValidSession] =
    useState(false);

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        if (session) {
          setValidSession(true);
          setCheckingSession(false);
          return;
        }

        const { data: authListener } =
          supabase.auth.onAuthStateChange(
            (event, session) => {
              if (
                event === "PASSWORD_RECOVERY" ||
                session
              ) {
                setValidSession(true);
                setCheckingSession(false);
              }
            }
          );

        window.setTimeout(() => {
          if (mounted) {
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

    /*
     * Keep validation aligned with the
     * Supabase password requirements.
     */
    if (password.length < 8) {
      setMessage(
        "Password must be at least 8 characters and include at least one letter and one number."
      );

      return;
    }

    const hasLetter = /[A-Za-z]/.test(
      password
    );

    const hasNumber = /[0-9]/.test(
      password
    );

    if (!hasLetter || !hasNumber) {
      setMessage(
        "Password must be at least 8 characters and include at least one letter and one number."
      );

      return;
    }

    if (password !== confirmPassword) {
      setMessage(
        "The passwords do not match. Please try again."
      );

      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setMessage(
          "Your password reset link is invalid or has expired. Please request a new reset link."
        );

        return;
      }

      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) {
        console.error(
          "Password update error:",
          error
        );

        /*
         * Hide Supabase's technical
         * password-policy error.
         */
        const errorText =
          error.message.toLowerCase();

        if (
          errorText.includes("password") &&
          (
            errorText.includes("character") ||
            errorText.includes("contain") ||
            errorText.includes("weak")
          )
        ) {
          setMessage(
            "Password must be at least 8 characters and include at least one letter and one number."
          );
        } else {
          setMessage(
            "Unable to update your password. Please try again."
          );
        }

        return;
      }

      setSuccess(true);

      setMessage(
        "Your Apexx password has been updated successfully."
      );

      setPassword("");
      setConfirmPassword("");

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
            onSubmit={handleResetPassword}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">
                New Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
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
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 pr-14 text-white outline-none focus:border-blue-400/50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white"
                >
                  {showPassword ? (
                    <EyeOffIcon />
                  ) : (
                    <EyeIcon />
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-white/35">
                Minimum 8 characters with at least one
                letter and one number.
              </p>
            </div>

            <div>
              <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">
                Confirm New Password
              </label>

              <div className="relative">
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 pr-14 text-white outline-none focus:border-blue-400/50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon />
                  ) : (
                    <EyeIcon />
                  )}
                </button>
              </div>
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
          Your new password will be used for both your regular
          Apexx account and Affiliate Dashboard access.
        </p>
      </div>
    </main>
  );
}

function EyeIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696C3.423 7.51 7.36 5 12 5c4.638 0 8.573 2.506 9.938 6.652a1 1 0 0 1 0 .696C20.577 16.49 16.64 19 12 19c-4.638 0-8.573-2.506-9.938-6.652Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m2 2 20 20" />
      <path d="M6.71 6.71C4.92 7.9 3.52 9.6 2.94 11.65a1 1 0 0 0 0 .7C4.3 16.49 7.98 19 12 19c1.15 0 2.24-.2 3.23-.56" />
      <path d="M10.73 5.08C11.14 5.03 11.57 5 12 5c4.02 0 7.7 2.51 9.06 6.65a1 1 0 0 1 0 .7c-.37 1.13-.92 2.14-1.62 3.02" />
      <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
    </svg>
  );
}