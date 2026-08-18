import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminPage() {
  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("total, status");

  const { data: subscribers } = await supabaseAdmin
    .from("promo_subscribers")
    .select("email");

  const { data: referralApplications } = await supabaseAdmin
    .from("affiliate_applications")
    .select("id, status");

  const safeOrders = orders || [];
  const safeSubscribers = subscribers || [];
  const safeReferralApplications =
    referralApplications || [];

  const totalOrders = safeOrders.length;
  const totalSubscribers = safeSubscribers.length;

  const pendingReferralApplications =
    safeReferralApplications.filter(
      (application) =>
        application.status === "pending"
    ).length;

  const totalRevenue = safeOrders.reduce(
    (sum, order) => {
      const status = String(
        order.status || ""
      ).toLowerCase();

      if (
        status === "paid" ||
        status === "shipped" ||
        status === "payment received"
      ) {
        return (
          sum +
          Number(
            order.total || 0
          )
        );
      }

      return sum;
    },
    0
  );

  const adminCards = [
    {
      title: "Orders",
      description:
        "View and manage customer orders.",
      href: "/admin/orders",
    },
    {
      title: "Subscribers",
      description:
        "Manage promo email subscribers.",
      href: "/admin/subscribers",
    },
    {
      title: "Email Campaigns",
      description:
        "Send promo codes and announcements.",
      href: "/admin/campaigns",
    },
    {
      title: "Products",
      description:
        "Manage inventory and product listings.",
      href: "/admin/products",
    },
    {
      title: "Reviews",
      description:
        "Approve, unapprove, or delete customer reviews.",
      href: "/admin/reviews",
    },
    {
      title: "Affiliates",
      description:
        "Manage affiliates, promo codes, commissions, and payouts.",
      href: "/admin/affiliates",
    },
    {
      title: "Referral Applications",
      description:
        pendingReferralApplications > 0
          ? `${pendingReferralApplications} application${
              pendingReferralApplications === 1
                ? ""
                : "s"
            } waiting for review.`
          : "Review Research Referral Program applications.",
      href: "/admin/affiliate-applications",
    },
  ];

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-blue-300">
              Apexx Admin
            </p>

            <h1 className="text-5xl font-black md:text-6xl">
              Dashboard
            </h1>
          </div>

          <a
            href="/"
            className="w-fit rounded-full border border-blue-400/20 bg-blue-500/10 px-6 py-3 text-sm uppercase tracking-widest text-blue-200 transition-all hover:bg-blue-500/20"
          >
            View Website
          </a>

        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-4">

          <div className="rounded-[30px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-sm uppercase tracking-widest text-white/50">
              Total Orders
            </p>

            <p className="mt-3 text-4xl font-black text-white">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-[30px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-sm uppercase tracking-widest text-white/50">
              Subscribers
            </p>

            <p className="mt-3 text-4xl font-black text-white">
              {totalSubscribers}
            </p>
          </div>

          <div className="rounded-[30px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-sm uppercase tracking-widest text-white/50">
              Revenue
            </p>

            <p className="mt-3 text-4xl font-black text-blue-300">
              $
              {totalRevenue.toFixed(
                2
              )}
            </p>
          </div>

          <div className="rounded-[30px] border border-yellow-400/20 bg-yellow-500/[0.07] p-6">
            <p className="text-sm uppercase tracking-widest text-yellow-200/70">
              Pending Referrals
            </p>

            <p className="mt-3 text-4xl font-black text-yellow-200">
              {
                pendingReferralApplications
              }
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {adminCards.map(
            (card) => (
              <a
                key={card.title}
                href={card.href}
                className="group rounded-[32px] border border-white/10 bg-white/[0.04] p-8 transition-all hover:border-blue-400/40 hover:bg-white/[0.07]"
              >

                <div className="flex items-center justify-between gap-6">

                  <div>
                    <h2 className="mb-3 text-2xl font-black">
                      {card.title}
                    </h2>

                    <p className="text-white/60">
                      {
                        card.description
                      }
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10 text-blue-300 transition-all group-hover:translate-x-1">
                    →
                  </div>

                </div>

              </a>
            )
          )}

        </div>

      </div>
    </main>
  );
}