"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquareText } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [shippingRating, setShippingRating] = useState<number | null>(null);
  const [packagingRating, setPackagingRating] = useState<number | null>(null);
  const [productRating, setProductRating] = useState<number | null>(null);
  const [orderingRating, setOrderingRating] = useState<number | null>(null);
  const [supportRating, setSupportRating] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false });

      setReviews(data || []);
    };

    fetchReviews();
  }, []);

  const average =
    reviews.length > 0
      ? (
          reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "5.0";

  const RatingStars = ({
    value,
    onChange,
    size = 26,
  }: {
    value: number | null;
    onChange?: (value: number) => void;
    size?: number;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className="text-blue-300"
        >
          <Star
            size={size}
            className={
              value && star <= value
                ? "fill-blue-300 text-blue-300"
                : "text-white/20"
            }
          />
        </button>
      ))}
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        rating,
        review,
        shipping_rating: shippingRating,
        packaging_rating: packagingRating,
        product_rating: productRating,
        ordering_rating: orderingRating,
        support_rating: supportRating,
      }),
    });

    const data = await response.json();
    setStatus(data.message);

    if (data.success) {
      setName("");
      setRating(5);
      setShippingRating(null);
      setPackagingRating(null);
      setProductRating(null);
      setOrderingRating(null);
      setSupportRating(null);
      setReview("");
    }
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">
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

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.05] text-blue-300 flex items-center justify-center mx-auto mb-8">
              <MessageSquareText size={32} />
            </div>

            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
              Customer Experiences
            </p>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-8">
              Verified Customer Reviews
            </h1>

            <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
              Feedback from Apexx customers about ordering, shipping, packaging,
              product quality, and support.
            </p>
          </div>

          <div className="rounded-[2.5rem] border border-blue-400/20 bg-white/[0.04] backdrop-blur-sm p-8 md:p-12 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 items-center">
              <div className="text-center lg:text-left">
                <p className="uppercase tracking-[0.3em] text-blue-300 text-xs mb-4">
                  Overall Rating
                </p>

                <div className="flex items-center justify-center lg:justify-start gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={30}
                      className="fill-blue-300 text-blue-300"
                    />
                  ))}
                </div>

                <div className="flex items-end justify-center lg:justify-start gap-3">
                  <span className="text-6xl md:text-7xl font-black text-white">
                    {average}
                  </span>

                  <span className="text-white/50 text-xl pb-3">/ 5</span>
                </div>

                <p className="text-white/50 mt-4">
                  Based on {reviews.length} approved review
                  {reviews.length === 1 ? "" : "s"}.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Product Quality",
                  "Packaging",
                  "Shipping",
                  "Ordering Experience",
                  "Customer Support",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.5rem] border border-white/10 bg-[#081526]/60 p-5"
                  >
                    <p className="text-white/70 text-sm uppercase tracking-widest mb-3">
                      {item}
                    </p>

                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          className="fill-blue-300 text-blue-300"
                        />
                      ))}
                    </div>
                  </div>
                ))}

                <a
                  href="#leave-review"
                  className="rounded-[1.5rem] border border-blue-400/30 bg-blue-500/10 p-5 flex items-center justify-between text-blue-100 hover:bg-blue-500/20 transition-all"
                >
                  <span className="font-bold uppercase tracking-widest text-sm">
                    Leave a Review
                  </span>

                  <span className="text-2xl">→</span>
                </a>
              </div>
            </div>
          </div>

          <div
            id="leave-review"
            className="max-w-3xl mx-auto rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10 mb-20 scroll-mt-24"
          >
            <div className="text-center mb-10">
              <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-5">
                Share Your Experience
              </p>

              <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
                Leave a Review
              </h2>

              <p className="text-white/60 leading-relaxed">
                Reviews are reviewed before appearing on the website.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <label className="block text-sm uppercase tracking-widest text-blue-300 mb-3">
                  Overall Experience
                </label>

                <RatingStars value={rating} onChange={setRating} />
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-[#020817]/60 p-6 mb-8">
                <p className="text-sm uppercase tracking-widest text-blue-300 mb-5">
                  Optional Ratings
                </p>

                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-white/70">Shipping Speed</p>
                    <RatingStars
                      value={shippingRating}
                      onChange={setShippingRating}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <p className="text-white/70">Packaging</p>
                    <RatingStars
                      value={packagingRating}
                      onChange={setPackagingRating}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <p className="text-white/70">Product Quality</p>
                    <RatingStars
                      value={productRating}
                      onChange={setProductRating}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <p className="text-white/70">Ordering Experience</p>
                    <RatingStars
                      value={orderingRating}
                      onChange={setOrderingRating}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <p className="text-white/70">Customer Support</p>
                    <RatingStars
                      value={supportRating}
                      onChange={setSupportRating}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm uppercase tracking-widest text-blue-300 mb-3">
                  Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="First name & last initial, e.g. John D."
                  className="w-full rounded-2xl bg-[#020817] border border-white/10 px-5 py-4 text-white outline-none focus:border-blue-400"
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm uppercase tracking-widest text-blue-300 mb-3">
                  Tell Us About Your Experience
                </label>

                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  required
                  rows={4}
                  placeholder="Share your experience with ordering, shipping, packaging, product quality, or customer support."
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
              Reviews containing medical, therapeutic, or human-use claims may
              not be approved.
            </p>
          </div>

          <div className="mb-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
                  Latest Reviews
                </p>

                <h2 className="text-4xl md:text-5xl font-black text-white">
                  What Customers Are Saying
                </h2>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {reviews.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 hover:bg-white/[0.07] hover:border-blue-400/40 transition-all"
                  >
                    <RatingStars value={item.rating} size={20} />

                    <p className="text-white/70 leading-relaxed my-8">
                      “{item.review}”
                    </p>

                    <div className="grid grid-cols-1 gap-2 text-sm text-white/50 mb-6">
                      {item.product_rating && (
                        <p>Product Quality: {item.product_rating}/5</p>
                      )}

                      {item.packaging_rating && (
                        <p>Packaging: {item.packaging_rating}/5</p>
                      )}

                      {item.shipping_rating && (
                        <p>Shipping: {item.shipping_rating}/5</p>
                      )}

                      {item.ordering_rating && (
                        <p>Ordering: {item.ordering_rating}/5</p>
                      )}

                      {item.support_rating && (
                        <p>Support: {item.support_rating}/5</p>
                      )}
                    </div>

                    <div className="border-t border-white/10 pt-5">
                      <p className="text-white font-bold">{item.name}</p>

                      <p className="text-blue-300 text-xs uppercase tracking-widest mt-1">
                        Verified Customer
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-10 text-center">
                <p className="text-white/60">
                  Customer reviews will appear here once approved.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}