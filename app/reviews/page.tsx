"use client";

import { useState } from "react";
import { Star, MessageSquareText } from "lucide-react";

export default function ReviewsPage() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, rating, review }),
    });

    const data = await response.json();
    setStatus(data.message);

    if (data.success) {
      setName("");
      setRating(5);
      setReview("");
    }
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white">
      <header className="border-b border-white/10 bg-[#081526]/95 backdrop-blur-xl px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/">
            <img
              src="/images/logo.png"
              alt="Apexx Biolabs"
              className="h-12 w-auto"
            />
          </a>

          <a
            href="/"
            className="border border-white/10 bg-white/[0.04] text-white rounded-full px-6 py-3 text-xs uppercase tracking-widest hover:border-blue-400/50 hover:bg-white/[0.07] transition-all"
          >
            Home
          </a>
        </div>
      </header>

      <section className="relative px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.12),transparent_55%)]" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.05] text-blue-300 flex items-center justify-center mx-auto mb-8">
              <MessageSquareText size={32} />
            </div>

            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
              Customer Feedback
            </p>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-8">
              Leave a Review
            </h1>

            <p className="text-white/70 text-lg leading-relaxed">
              Share your experience with Apexx Biolabs. Reviews are reviewed
              before appearing on the website.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10"
          >
            <div className="mb-6">
              <label className="block text-sm uppercase tracking-widest text-blue-300 mb-3">
                Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name or initials"
                className="w-full rounded-2xl bg-[#020817] border border-white/10 px-5 py-4 text-white outline-none focus:border-blue-400"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm uppercase tracking-widest text-blue-300 mb-3">
                Rating
              </label>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-blue-300"
                  >
                    <Star
                      size={30}
                      className={
                        star <= rating
                          ? "fill-blue-300 text-blue-300"
                          : "text-white/20"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm uppercase tracking-widest text-blue-300 mb-3">
                Review
              </label>

              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
                rows={6}
                placeholder="Please keep reviews focused on ordering, shipping, support, packaging, or documentation."
                className="w-full rounded-2xl bg-[#020817] border border-white/10 px-5 py-4 text-white outline-none focus:border-blue-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-white text-[#081526] px-8 py-4 font-bold uppercase tracking-widest hover:bg-blue-100 transition-all"
            >
              Submit Review
            </button>

            {status && (
              <p className="text-center text-blue-300 mt-6 font-semibold">
                {status}
              </p>
            )}
          </form>

          <p className="text-white/40 text-xs text-center uppercase tracking-widest leading-relaxed mt-8">
            Reviews containing medical claims, human-use claims, or inappropriate
            content will not be approved.
          </p>
        </div>
      </section>
    </main>
  );
}