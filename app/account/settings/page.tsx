"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail } from "lucide-react";

export default function AccountSettingsPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        router.push("/account/login");
        return;
      }

      setEmail(user.email);
      setLoading(false);
    }

    loadUser();
  }, [router]);

  async function handlePasswordReset() {
    setSending(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://apexxbiolabs.com/account/update-password",
    });

    if (error) {
      setMessage(error.message);
      setSending(false);
      return;
    }

    setMessage("Password reset email sent. Please check your inbox.");
    setSending(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">
        <p className="text-center text-white/60">Loading security settings...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/account"
          className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-blue-300 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Account
        </Link>

        <section className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur md:p-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-blue-300">
            Account Security
          </p>

          <h1 className="mb-4 text-5xl font-black tracking-tight">
            Security Settings
          </h1>

          <p className="mb-8 text-white/60">
            Manage your account security and password access.
          </p>

          <div className="rounded-[2rem] border border-white/10 bg-[#0f2035] p-6 md:p-8">
            <div className="mb-5 flex items-center gap-4">
              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-3 text-blue-300">
                <Lock />
              </div>

              <div>
                <h2 className="text-2xl font-black">Change Password</h2>
                <p className="mt-1 text-sm text-white/50">
                  We’ll send a secure password reset link to your email.
                </p>
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3 text-white/70">
                <Mail className="text-blue-300" size={18} />
                <span>{email}</span>
              </div>
            </div>

            {message && (
              <p className="mb-5 rounded-2xl border border-blue-400/30 bg-blue-500/10 px-5 py-4 text-sm text-blue-100">
                {message}
              </p>
            )}

            <button
              onClick={handlePasswordReset}
              disabled={sending}
              className="rounded-full bg-blue-500 px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-white hover:bg-blue-400 disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send Password Reset Email"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}