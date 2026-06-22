export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">

        <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
          Apexx Admin
        </p>

        <h1 className="text-5xl font-black mb-10">
          Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <a
            href="/admin/orders"
            className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 hover:border-blue-400/40 transition-all"
          >
            <h2 className="text-2xl font-black mb-3">
              Orders
            </h2>

            <p className="text-white/60">
              View and manage customer orders.
            </p>
          </a>

          <a
            href="/admin/subscribers"
            className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 hover:border-blue-400/40 transition-all"
          >
            <h2 className="text-2xl font-black mb-3">
              Subscribers
            </h2>

            <p className="text-white/60">
              Manage promo email subscribers.
            </p>
          </a>

          <a
            href="/admin/campaigns"
            className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 hover:border-blue-400/40 transition-all"
          >
            <h2 className="text-2xl font-black mb-3">
              Email Campaigns
            </h2>

            <p className="text-white/60">
              Send promo codes and announcements.
            </p>
          </a>

          <a
            href="/admin/products"
            className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 hover:border-blue-400/40 transition-all"
          >
            <h2 className="text-2xl font-black mb-3">
              Products
            </h2>

            <p className="text-white/60">
              Manage inventory and product listings.
            </p>
          </a>

        </div>

      </div>
    </main>
  );
}