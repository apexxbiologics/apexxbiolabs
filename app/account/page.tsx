"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Award,
  Box,
  Gift,
  Heart,
  Home,
  LogOut,
  Package,
  Repeat,
  Settings,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Truck,
  UserCircle,
} from "lucide-react";

type Order = {
  id: string;
  order_number: string;
  customer_email: string;
  first_name: string;
  last_name: string;
  cart: any;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  tracking_number: string | null;
  carrier: string | null;
  created_at: string;
};

type Profile = {
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string | null;
};

type PointTransaction = {
  id: string;
  user_id: string;
  order_id: string | null;
  points: number;
  type: string;
  description: string | null;
  created_at: string;
};

function safeParseCart(cart: any) {
  if (!cart) return [];

  if (Array.isArray(cart)) return cart;

  if (typeof cart === "string") {
    try {
      const parsed = JSON.parse(cart);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

function formatStatus(status: string) {
  return String(status || "pending")
    .replaceAll("_", " ")
    .toLowerCase();
}

function formatTransactionType(type: string) {
  return String(type || "adjustment")
    .replaceAll("_", " ")
    .toLowerCase();
}

export default function AccountPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pointTransactions, setPointTransactions] = useState<
    PointTransaction[]
  >([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccount() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.email) {
          router.push("/account/login");
          return;
        }

        const normalizedEmail = user.email.toLowerCase();
        setEmail(normalizedEmail);

        const [
          profileResult,
          ordersResult,
          favoritesResult,
          pointsResult,
        ] = await Promise.all([
          supabase
            .from("profiles")
            .select("username, first_name, last_name, created_at")
            .eq("id", user.id)
            .maybeSingle(),

          supabase
            .from("orders")
            .select("*")
            .eq("customer_email", normalizedEmail)
            .order("created_at", { ascending: false }),

          supabase
            .from("favorites")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id),

          supabase
            .from("point_transactions")
            .select(
              "id, user_id, order_id, points, type, description, created_at"
            )
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        ]);

        if (profileResult.error) {
          console.error("Profile loading error:", profileResult.error);
        }

        if (ordersResult.error) {
          console.error("Orders loading error:", ordersResult.error);
        }

        if (favoritesResult.error) {
          console.error(
            "Favorites loading error:",
            favoritesResult.error
          );
        }

        if (pointsResult.error) {
          console.error("Rewards loading error:", pointsResult.error);
        }

        if (profileResult.data) {
          setProfile(profileResult.data as Profile);
        }

        if (ordersResult.data) {
          setOrders(ordersResult.data as Order[]);
        }

        setFavoritesCount(favoritesResult.count || 0);

        if (pointsResult.data) {
          setPointTransactions(
            pointsResult.data as PointTransaction[]
          );
        }
      } catch (error) {
        console.error("Account loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, [router]);

  const activeOrders = useMemo(
    () =>
      orders.filter((order) =>
        ["awaiting_payment", "paid", "processing"].includes(
          String(order.status).toLowerCase()
        )
      ).length,
    [orders]
  );

  const inTransitOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          String(order.status).toLowerCase() === "shipped"
      ).length,
    [orders]
  );

  const pointsBalance = useMemo(
    () =>
      pointTransactions.reduce(
        (sum, transaction) =>
          sum + Number(transaction.points || 0),
        0
      ),
    [pointTransactions]
  );

  const safePointsBalance = Math.max(0, pointsBalance);

  const lifetimePointsEarned = useMemo(
    () =>
      pointTransactions.reduce((sum, transaction) => {
        const points = Number(transaction.points || 0);

        return points > 0 ? sum + points : sum;
      }, 0),
    [pointTransactions]
  );

  const availableRewardDollars =
    Math.floor(safePointsBalance / 100) * 10;

  const completedRewardLevels = Math.floor(
    safePointsBalance / 100
  );

  const rewardRemainder = safePointsBalance % 100;

  const pointsUntilNextReward =
    rewardRemainder === 0 ? 100 : 100 - rewardRemainder;

  const rewardProgress = rewardRemainder;

  const customerName =
    profile?.first_name ||
    profile?.username ||
    orders[0]?.first_name ||
    "Customer";

  const customerSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : orders.length > 0
    ? new Date(
        orders[orders.length - 1].created_at
      ).toLocaleDateString()
    : "New account";

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/account/login");
  }

  function handleReorder(order: Order) {
    const cartItems = safeParseCart(order.cart);

    localStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cartUpdated"));
    router.push("/cart");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#081526] px-6 py-32 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center">
            <p className="text-white/60">
              Loading your account...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">
      <div className="mx-auto max-w-7xl">
        {/* HERO */}
        <section className="mb-8 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur">
          <div className="relative p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.24),transparent_45%)]" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-blue-300">
                  Customer Portal
                </p>

                <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
                  Welcome back, {customerName}
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60">
                  View orders, track shipments, manage favorites,
                  monitor rewards, reorder products, and update your
                  account security.
                </p>

                <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-white/55">
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
                    {email}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
                    Customer since {customerSince}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-6 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition hover:border-blue-400/50 hover:bg-white/[0.10]"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </div>
        </section>

        {/* REWARDS DASHBOARD */}
        <section className="relative mb-8 overflow-hidden rounded-[2.5rem] border border-blue-300/20 bg-gradient-to-br from-blue-500/15 via-white/[0.05] to-white/[0.03] p-7 shadow-[0_25px_90px_rgba(37,99,235,0.14)] md:p-10">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-cyan-300/5 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-400/10 text-blue-200">
                    <Award size={25} />
                  </div>

                  <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-300">
                    Apexx Rewards
                  </p>
                </div>

                <h2 className="text-4xl font-black md:text-5xl">
                  Your loyalty rewards
                </h2>

                <p className="mt-4 max-w-2xl leading-relaxed text-white/60">
                  Earn one point for every dollar spent. Every 100
                  points can be redeemed for $10 off a future
                  purchase.
                </p>
              </div>

              {availableRewardDollars > 0 ? (
                <div className="w-fit rounded-full border border-green-300/20 bg-green-400/10 px-5 py-3 text-sm font-bold text-green-200">
                  ${availableRewardDollars.toFixed(2)} available to
                  redeem
                </div>
              ) : (
                <div className="w-fit rounded-full border border-blue-300/20 bg-blue-400/10 px-5 py-3 text-sm font-bold text-blue-200">
                  Keep earning toward your first reward
                </div>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <RewardStat
                icon={<Sparkles />}
                label="Current Balance"
                value={`${safePointsBalance} pts`}
                description="Available rewards points"
              />

              <RewardStat
                icon={<Gift />}
                label="Reward Value"
                value={`$${availableRewardDollars.toFixed(2)}`}
                description="Available for a future order"
              />

              <RewardStat
                icon={<TrendingUp />}
                label="Lifetime Earned"
                value={`${lifetimePointsEarned} pts`}
                description="All positive points earned"
              />

              <RewardStat
                icon={<Award />}
                label="Rewards Unlocked"
                value={completedRewardLevels}
                description="$10 reward levels reached"
              />
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-[#0f2035]/90 p-6 md:p-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-300">
                    Next Reward
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    {pointsUntilNextReward} points until another $10
                    reward
                  </h3>
                </div>

                <p className="text-sm font-bold text-white/60">
                  {rewardRemainder} / 100 points
                </p>
              </div>

              <div className="mt-5 h-4 overflow-hidden rounded-full border border-white/10 bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-300 transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, rewardProgress)
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-4 flex flex-col justify-between gap-2 text-sm text-white/50 sm:flex-row">
                <p>1 point earned for every $1 spent</p>
                <p>100 points = $10 off</p>
              </div>
            </div>
          </div>
        </section>

        {/* DASHBOARD CARDS */}
        <section className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            href="/account"
            icon={<Package />}
            label="Total Orders"
            value={orders.length}
            description="All current and previous orders"
          />

          <DashboardCard
            href="/account"
            icon={<Box />}
            label="Active Orders"
            value={activeOrders}
            description="Awaiting payment or processing"
          />

          <DashboardCard
            href="/account"
            icon={<Truck />}
            label="In Transit"
            value={inTransitOrders}
            description="Orders currently marked shipped"
          />

          <DashboardCard
            href="/account/favorites"
            icon={<Heart />}
            label="Favorites"
            value={favoritesCount}
            description="Saved products and quick access"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* ORDERS */}
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-blue-300">
                  Recent Orders
                </p>

                <h2 className="text-3xl font-black">
                  Order History
                </h2>
              </div>

              <Link
                href="/products"
                className="w-fit rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:border-blue-300/50"
              >
                Shop Products
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-[1.75rem] border border-white/10 bg-[#0f2035] p-8 text-center">
                <ShoppingBag
                  className="mx-auto mb-4 text-blue-300"
                  size={34}
                />

                <h3 className="text-2xl font-black">
                  No orders yet
                </h3>

                <p className="mx-auto mt-3 max-w-md text-white/60">
                  Once you place an order using this email, your
                  order history and tracking details will appear here
                  automatically.
                </p>

                <Link
                  href="/products"
                  className="mt-6 inline-block rounded-full bg-blue-500 px-7 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition hover:bg-blue-400"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => {
                  const cartItems = safeParseCart(order.cart);
                  const firstItems = cartItems.slice(0, 3);

                  return (
                    <div
                      key={order.id}
                      className="rounded-[1.75rem] border border-white/10 bg-[#0f2035] p-5 md:p-6"
                    >
                      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-blue-300">
                            {order.order_number}
                          </p>

                          <h3 className="mt-2 text-2xl font-black">
                            $
                            {Number(
                              order.total || 0
                            ).toFixed(2)}
                          </h3>

                          <p className="mt-2 text-sm text-white/50">
                            Placed{" "}
                            {new Date(
                              order.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="w-fit rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                          {formatStatus(order.status)}
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        {firstItems.map(
                          (item: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                            >
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={
                                    item.name ||
                                    "Product image"
                                  }
                                  className="h-14 w-14 rounded-full border border-blue-300/20 bg-blue-500/10 object-contain p-1"
                                />
                              )}

                              <div>
                                <p className="text-sm font-bold">
                                  {item.name || "Product"}
                                </p>

                                <p className="text-xs text-white/50">
                                  Qty {item.quantity || 1}
                                </p>
                              </div>
                            </div>
                          )
                        )}

                        {cartItems.length > 3 && (
                          <div className="flex items-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/60">
                            +{cartItems.length - 3} more
                          </div>
                        )}
                      </div>

                      <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 md:grid-cols-3">
                        <InfoBlock
                          label="Payment"
                          value={formatStatus(order.status)}
                        />

                        <InfoBlock
                          label="Carrier"
                          value={
                            order.carrier ||
                            "Not available yet"
                          }
                        />

                        <InfoBlock
                          label="Tracking"
                          value={
                            order.tracking_number ||
                            "Not available yet"
                          }
                        />
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                          onClick={() => handleReorder(order)}
                          className="inline-flex justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:border-blue-300/50"
                        >
                          <Repeat size={15} />
                          Reorder
                        </button>

                        <Link
                          href={`/account/orders/${order.order_number}`}
                          className="rounded-full bg-blue-500 px-6 py-3 text-center text-xs font-black uppercase tracking-[0.25em] text-white transition hover:bg-blue-400"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            {/* REWARDS HISTORY */}
            <section className="rounded-[2rem] border border-blue-300/20 bg-white/[0.04] p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-blue-300">
                    Rewards Activity
                  </p>

                  <h2 className="text-2xl font-black">
                    Points History
                  </h2>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-400/10 text-blue-300">
                  <Gift size={21} />
                </div>
              </div>

              {pointTransactions.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#0f2035] p-5">
                  <p className="text-sm font-bold text-white">
                    No points activity yet
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    Points will appear here after an eligible order
                    has shipped.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pointTransactions
                    .slice(0, 6)
                    .map((transaction) => {
                      const transactionPoints = Number(
                        transaction.points || 0
                      );

                      const isPositive =
                        transactionPoints >= 0;

                      return (
                        <div
                          key={transaction.id}
                          className="rounded-2xl border border-white/10 bg-[#0f2035] p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-white">
                                {transaction.description ||
                                  formatTransactionType(
                                    transaction.type
                                  )}
                              </p>

                              <p className="mt-1 text-xs capitalize text-white/40">
                                {formatTransactionType(
                                  transaction.type
                                )}{" "}
                                •{" "}
                                {new Date(
                                  transaction.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>

                            <p
                              className={`shrink-0 text-sm font-black ${
                                isPositive
                                  ? "text-green-300"
                                  : "text-red-300"
                              }`}
                            >
                              {isPositive ? "+" : ""}
                              {transactionPoints}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </section>

            {/* QUICK ACTIONS */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-blue-300">
                Quick Actions
              </p>

              <h2 className="mb-6 text-2xl font-black">
                Account Tools
              </h2>

              <div className="space-y-3">
                <QuickAction
                  href="/account"
                  icon={<Home />}
                  title="Dashboard"
                  description="Account overview"
                />

                <QuickAction
                  href="/products"
                  icon={<ShoppingBag />}
                  title="Shop Products"
                  description="Browse current catalog"
                />

                <QuickAction
                  href="/account/profile"
                  icon={<UserCircle />}
                  title="Profile"
                  description="Manage account details"
                />

                <QuickAction
                  href="/account/favorites"
                  icon={<Heart />}
                  title="Favorites"
                  description="View saved products"
                />

                <QuickAction
                  href="/account/settings"
                  icon={<Settings />}
                  title="Security"
                  description="Password and login settings"
                />
              </div>
            </section>

            {/* RECENT ACTIVITY */}
            <section className="rounded-[2rem] border border-blue-400/20 bg-blue-500/10 p-6 md:p-8">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-blue-300">
                Recent Activity
              </p>

              <h2 className="mb-5 text-2xl font-black">
                Updates
              </h2>

              {orders.length === 0 ? (
                <p className="text-sm leading-relaxed text-white/60">
                  No account activity yet. Your order updates will
                  appear here after checkout.
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <Link
                      key={order.id}
                      href={`/account/orders/${order.order_number}`}
                      className="block rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition hover:border-blue-300/40"
                    >
                      <p className="text-sm font-bold text-white">
                        Order {order.order_number}
                      </p>

                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-blue-200">
                        {formatStatus(order.status)}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}

function DashboardCard({
  href,
  icon,
  label,
  value,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur transition hover:-translate-y-1 hover:border-blue-300/40 hover:bg-white/[0.06]"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300 transition group-hover:scale-105">
        {icon}
      </div>

      <p className="text-xs font-black uppercase tracking-[0.25em] text-white/40">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-white">
        {value}
      </p>

      <p className="mt-2 text-sm leading-relaxed text-white/50">
        {description}
      </p>
    </Link>
  );
}

function RewardStat({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-[#0f2035]/90 p-6">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-400/10 text-blue-300">
        {icon}
      </div>

      <p className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-white">
        {value}
      </p>

      <p className="mt-2 text-sm leading-relaxed text-white/50">
        {description}
      </p>
    </div>
  );
}

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">
        {label}
      </p>

      <p className="mt-1 break-words capitalize text-white">
        {value}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0f2035] p-4 transition hover:border-blue-300/40 hover:bg-white/[0.04]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
        {icon}
      </div>

      <div>
        <p className="font-black text-white">{title}</p>

        <p className="mt-1 text-xs text-white/45">
          {description}
        </p>
      </div>
    </Link>
  );
}