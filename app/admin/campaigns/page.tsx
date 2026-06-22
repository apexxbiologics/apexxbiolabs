"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";

export default function CampaignsPage() {
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [buttonText, setButtonText] = useState("Shop Products");
  const [buttonUrl, setButtonUrl] = useState("https://apexxbiolabs.com/products");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !title || !message) {
      setStatus("Please fill out subject, title, and message.");
      return;
    }

    const confirmSend = window.confirm(
      "Are you sure you want to send this campaign to all subscribers?"
    );

    if (!confirmSend) return;

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/admin/send-campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          title,
          message,
          buttonText,
          buttonUrl,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setStatus(data.error || "Campaign failed.");
        return;
      }

      setStatus(`✓ Campaign sent to ${data.sent} subscribers. Failed: ${data.failed}`);
      setSubject("");
      setTitle("");
      setMessage("");
    } catch (error) {
      setStatus("Something went wrong sending the campaign.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <a
          href="/admin"
          className="inline-flex mb-8 text-blue-300 hover:text-white text-sm uppercase tracking-widest transition-all"
        >
          ← Back to Dashboard
        </a>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full border border-blue-400/20 bg-blue-500/10 flex items-center justify-center">
            <Mail className="text-blue-300" />
          </div>

          <div>
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-2">
              Admin
            </p>

            <h1 className="text-5xl font-black">
              Email Campaigns
            </h1>
          </div>
        </div>

        <form
          onSubmit={sendCampaign}
          className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10 space-y-6"
        >
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Email Subject
            </label>

            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Example: FREEDOM10 Extended"
              className="admin-input"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">
              Email Heading
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Independence Day Promo Extended"
              className="admin-input"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">
              Email Message
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={"Example:\nUse code FREEDOM10 for 10% off sitewide.\nBuy any 4 vials and receive complimentary Bac Water."}
              rows={8}
              className="admin-input rounded-[28px]"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-white/60 text-sm mb-2">
                Button Text
              </label>

              <input
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Shop Products"
                className="admin-input"
              />
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-2">
                Button URL
              </label>

              <input
                value={buttonUrl}
                onChange={(e) => setButtonUrl(e.target.value)}
                placeholder="https://apexxbiolabs.com/products"
                className="admin-input"
              />
            </div>
          </div>

          {status && (
            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
              <p className="text-blue-100 text-sm font-semibold">
                {status}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white text-[#081526] py-5 font-bold uppercase tracking-widest hover:bg-blue-100 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <Send size={20} />
            {loading ? "Sending..." : "Send Campaign"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .admin-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          padding: 1rem 1.25rem;
          color: white;
          outline: none;
        }

        .admin-input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .admin-input:focus {
          border-color: rgba(96, 165, 250, 0.6);
        }
      `}</style>
    </main>
  );
}