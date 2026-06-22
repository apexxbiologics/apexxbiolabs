import { supabase } from "@/lib/supabase";

export default async function AdminPage() {
  const { data: orders } = await supabase
    .from("orders")
    .select("total, status");

  const { data: subscribers } = await supabase
    .from("promo_subscribers")
    .select("email");

  const totalOrders = orders?.length || 0;
  const totalSubscribers = subscribers?.length || 0;

  const totalRevenue =
    orders?.reduce((sum, order) => {
      if (order.status === "paid" || order.status === "shipped") {
        return sum + Number(order.total || 0);
      }
      return sum;
    }, 0) || 0;

  const adminCards = [
    {
      title: "Orders",
      description: "View and manage customer orders.",
      href: "/admin/orders",
    },
    {
      title: "Subscribers",
      description: "Manage promo email subscribers.",
      href: "/admin/subscribers",
    },
    {
      title: "Email Campaigns",
      description: "Send promo codes and announcements.",
      href: "/admin/campaigns",
    },
    {
      title: "Products",
      description: "Manage inventory and product listings.",
      href: "/admin/products",
    },
  ];

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
              Apexx Admin
            </p>

            <h1 className="text-5xl md:text-6xl font-black">
              Dashboard
            </h1>
          </div>

          <a
            href="/"
            className="rounded-full border border-blue-400/20 bg-blue-500/10 px-6 py-3 text-blue-200 text-sm uppercase tracking-widest hover:bg-blue-500/20 transition-all w-fit"
          >
            View Website
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="rounded-[30px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-white/50 text-sm uppercase tracking-widest">
              Total Orders
            </p>
            <p className="text-4xl font-black text-white mt-3">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-[30px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-white/50 text-sm uppercase tracking-widest">
              Subscribers
            </p>
            <p className="text-4xl font-black text-white mt-3">
              {totalSubscribers}
            </p>
          </div>

          <div className="rounded-[30px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-white/50 text-sm uppercase tracking-widest">
              Revenue
            </p>
            <p className="text-4xl font-black text-blue-300 mt-3">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminCards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="group rounded-[32px] border border-white/10 bg-white/[0.04] p-8 hover:border-blue-400/40 hover:bg-white/[0.07] transition-all"
            >
              <div className="flex items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-black mb-3">
                    {card.title}
                  </h2>

                  <p className="text-white/60">
                    {card.description}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-full border border-blue-400/20 bg-blue-500/10 flex items-center justify-center text-blue-300 group-hover:translate-x-1 transition-all">
                  →
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </main>
  );
}