import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminReviewsPage() {
  const { data: reviews, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-[#081526] text-white p-10">
        <p className="text-red-300">Error loading reviews: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <a href="/admin" className="text-blue-300 uppercase tracking-widest text-sm">
          ← Back to Dashboard
        </a>

        <h1 className="text-5xl font-black my-10">Review Moderation</h1>

        <div className="space-y-6">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8"
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-2xl font-black">{review.name}</h2>

                      <span
                        className={`rounded-full px-4 py-1 text-xs uppercase tracking-widest ${
                          review.approved
                            ? "bg-green-500/20 text-green-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {review.approved ? "Approved" : "Pending"}
                      </span>
                    </div>

                    <p className="text-blue-300 font-bold mb-4">
                      Overall: {review.rating}/5
                    </p>

                    <p className="text-white/70 leading-relaxed mb-6">
                      {review.review}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm text-white/50">
                      <p>Shipping: {review.shipping_rating || "—"}</p>
                      <p>Packaging: {review.packaging_rating || "—"}</p>
                      <p>Product: {review.product_rating || "—"}</p>
                      <p>Ordering: {review.ordering_rating || "—"}</p>
                      <p>Support: {review.support_rating || "—"}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[160px]">
                    {!review.approved && (
                      <form action="/api/admin/reviews/approve" method="POST">
                        <input type="hidden" name="id" value={review.id} />
                        <button className="w-full rounded-full bg-green-500 px-6 py-3 font-bold uppercase tracking-widest">
                          Approve
                        </button>
                      </form>
                    )}

                    {review.approved && (
                      <form action="/api/admin/reviews/unapprove" method="POST">
                        <input type="hidden" name="id" value={review.id} />
                        <button className="w-full rounded-full bg-yellow-500 text-[#081526] px-6 py-3 font-bold uppercase tracking-widest">
                          Hide
                        </button>
                      </form>
                    )}

                    <form action="/api/admin/reviews/delete" method="POST">
                      <input type="hidden" name="id" value={review.id} />
                      <button className="w-full rounded-full bg-red-500 px-6 py-3 font-bold uppercase tracking-widest">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center">
              <p className="text-white/60">No reviews submitted yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}