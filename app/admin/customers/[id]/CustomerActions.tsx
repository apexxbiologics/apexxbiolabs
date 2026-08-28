"use client";

import { useState } from "react";

type CustomerActionsProps = {
  customerId: string;
  email: string;
  verified: boolean;
};

export default function CustomerActions({
  customerId,
  email,
  verified,
}: CustomerActionsProps) {
  const [
    sendingVerification,
    setSendingVerification,
  ] = useState(false);

  const [
    sendingPasswordReset,
    setSendingPasswordReset,
  ] = useState(false);

  const [
    sendingEmail,
    setSendingEmail,
  ] = useState(false);

  const [
    showEmailForm,
    setShowEmailForm,
  ] = useState(false);

  const [subject, setSubject] =
    useState("");

  const [emailMessage, setEmailMessage] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  function clearAlerts() {
    setMessage("");
    setError("");
  }

  async function resendVerification() {
    if (sendingVerification) return;

    const confirmed = window.confirm(
      `Resend the account verification email to ${email}?`
    );

    if (!confirmed) return;

    setSendingVerification(true);
    clearAlerts();

    try {
      const response = await fetch(
        `/api/admin/customers/${customerId}/resend-verification`,
        {
          method: "POST",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to send verification email."
        );
      }

      setMessage(
        data.message ||
          "Verification email sent successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send verification email."
      );
    } finally {
      setSendingVerification(false);
    }
  }

  async function sendPasswordReset() {
    if (sendingPasswordReset) return;

    const confirmed = window.confirm(
      `Send a password reset email to ${email}?`
    );

    if (!confirmed) return;

    setSendingPasswordReset(true);
    clearAlerts();

    try {
      const response = await fetch(
        `/api/admin/customers/${customerId}/password-reset`,
        {
          method: "POST",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to send password reset email."
        );
      }

      setMessage(
        data.message ||
          "Password reset email sent successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send password reset email."
      );
    } finally {
      setSendingPasswordReset(false);
    }
  }

  async function sendCustomerEmail() {
    if (sendingEmail) return;

    if (!subject.trim()) {
      setError(
        "Enter an email subject."
      );
      return;
    }

    if (!emailMessage.trim()) {
      setError(
        "Enter an email message."
      );
      return;
    }

    setSendingEmail(true);
    clearAlerts();

    try {
      const response = await fetch(
        `/api/admin/customers/${customerId}/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            subject,
            message:
              emailMessage,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to send email."
        );
      }

      setMessage(
        data.message ||
          "Email sent successfully."
      );

      setSubject("");
      setEmailMessage("");
      setShowEmailForm(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send email."
      );
    } finally {
      setSendingEmail(false);
    }
  }

  return (
    <div>

      <div className="flex flex-wrap gap-3">

        {!verified && (
          <button
            type="button"
            onClick={
              resendVerification
            }
            disabled={
              sendingVerification
            }
            className="rounded-xl border border-yellow-400/20 bg-yellow-500/10 px-5 py-3 text-sm font-bold text-yellow-200 transition hover:bg-yellow-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sendingVerification
              ? "Sending..."
              : "Resend Verification"}
          </button>
        )}

        <button
          type="button"
          onClick={
            sendPasswordReset
          }
          disabled={
            sendingPasswordReset
          }
          className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-5 py-3 text-sm font-bold text-blue-200 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sendingPasswordReset
            ? "Sending..."
            : "Send Password Reset"}
        </button>

        <button
          type="button"
          onClick={() => {
            clearAlerts();

            setShowEmailForm(
              (current) => !current
            );
          }}
          className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.1]"
        >
          {showEmailForm
            ? "Cancel Email"
            : "Send Email"}
        </button>

      </div>

      {showEmailForm && (
        <div className="mt-6 max-w-3xl rounded-[24px] border border-white/10 bg-[#0c1d31] p-6">

          <p className="mb-5 text-sm text-white/50">
            Send an email to{" "}
            <span className="font-semibold text-white">
              {email}
            </span>
          </p>

          <div className="mb-4">

            <label className="mb-2 block text-xs uppercase tracking-widest text-white/40">
              Subject
            </label>

            <input
              value={subject}
              onChange={(event) =>
                setSubject(
                  event.target.value
                )
              }
              placeholder="Email subject"
              className="w-full rounded-2xl border border-white/10 bg-[#081526] px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-blue-400/50"
            />

          </div>

          <div className="mb-5">

            <label className="mb-2 block text-xs uppercase tracking-widest text-white/40">
              Message
            </label>

            <textarea
              value={
                emailMessage
              }
              onChange={(event) =>
                setEmailMessage(
                  event.target.value
                )
              }
              rows={7}
              placeholder="Write your message..."
              className="w-full resize-y rounded-2xl border border-white/10 bg-[#081526] px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-blue-400/50"
            />

          </div>

          <button
            type="button"
            onClick={
              sendCustomerEmail
            }
            disabled={sendingEmail}
            className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sendingEmail
              ? "Sending Email..."
              : "Send Email"}
          </button>

        </div>
      )}

      {message && (
        <div className="mt-5 rounded-2xl border border-green-400/20 bg-green-500/10 px-5 py-4 text-sm font-semibold text-green-200">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-200">
          {error}
        </div>
      )}

    </div>
  );
}