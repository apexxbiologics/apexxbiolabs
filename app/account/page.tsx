"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Heart,
  Home,
  LogOut,
  Package,
  Repeat,
  Settings,
  ShoppingBag,
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

export default function AccountPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccount() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        router.push("/account/login");
        return;
      }

      const normalizedEmail = user.email.toLowerCase();
      setEmail(normalizedEmail);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("username, first_name, last_name, created_at")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData as Profile);
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", normalizedEmail)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data as Order[]);
      }

      setLoading(false);
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
        (order) => String(order.status).toLowerCase() === "shipped"
      ).length,
    [orders]
  );

  const customerName =
    profile?.first_name ||
    profile?.username ||
    orders[0]?.first_name ||
    "Customer";

  const customerSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : orders.length > 0
    ? new Date(orders[orders.length - 1].created_at).toLocaleDateString()
    : "New account";

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/account/login");
  }

  function handleReorder(order: Order) {
    const cartItems =
      typeof order.cart === "string" ? JSON.parse(order.cart) : order.cart || [];

    localStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cartUpdated"));
    router.push("/cart");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">
        <p className="text-center text-white/60">Loading account...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur">
          <div className="relative p-8 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.20),transparent_45%)]" />

            <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-blue-300">
                  Customer Portal
                </p>

                <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                  Welcome back, {customerName}
                </h1>

                <p className="mt-5 max-w-2xl text-white/60">
                  Manage your Apexx Biolabs orders, tracking updates, account
                  information, saved preferences, and reorder history.
                </p>

                <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-white/50">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                    {email}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
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

        <section className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            icon={<Package />}
            label="Total Orders"
            value={orders.length}
            description="All current and previous orders"
          />

          <DashboardCard
            icon={<Box />}
            label="Active Orders"
            value={activeOrders}
            description="Awaiting payment or processing"
          />

          <DashboardCard
            icon={<Truck />}
            label="In Transit"
            value={inTransitOrders}
            description="Orders currently marked shipped"
          />

          <DashboardCard
            icon={<Heart />}
            label="Favorites"
            value="Coming Soon"
            description="Saved products and reorder shortcuts"
          />
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
            <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-blue-300">
                  Recent Orders
                </p>
                <h2 className="text-3xl font-black">Order History</h2>
              </div>

              <Link
                href="/products"
                className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white hover:border-blue-300/50"
              >
                Shop Products
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#0f2035] p-8 text-center">
                <ShoppingBag className="mx-auto mb-4 text-blue-300" size={34} />

                <h3 className="text-2xl font-black">No orders yet</h3>

                <p className="mx-auto mt-3 max-w-md text-white/60">
                  Once you place an order using this email, it will appear here
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
                  const cartItems =
                    typeof order.cart === "string"
                      ? JSON.parse(order.cart)
                      : order.cart || [];

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
                            ${Number(order.total).toFixed(2)}
                          </h3>

                          <p className="mt-2 text-sm text-white/50">
                            Placed{" "}
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="w-fit rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                          {order.status}
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        {firstItems.map((item: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                          >
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-12 w-12 rounded-xl object-contain"
                              />
                            )}

                            <div>
                              <p className="text-sm font-bold">{item.name}</p>
                              <p className="text-xs text-white/50">
                                Qty {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}

                        {cartItems.length > 3 && (
                          <div className="flex items-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/60">
                            +{cartItems.length - 3} more
                          </div>
                        )}
                      </div>

                      <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 md:grid-cols-3">
                        <InfoBlock label="Payment" value={order.status} />
                        <InfoBlock
                          label="Carrier"
                          value={order.carrier || "Not available yet"}
                        />
                        <InfoBlock
                          label="Tracking"
                          value={order.tracking_number || "Not available yet"}
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

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-blue-300">
                Quick Actions
              </p>

              <h2 className="mb-6 text-2xl font-black">Account Tools</h2>

              <div className="space-y-3">
                <QuickAction
                  href="/account"
                  icon={<Home />}
                  title="Dashboard"
                  description="View your account overview"
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
                  description="Coming soon"
                />

                <QuickAction
                  href="/account/favorites"
                  icon={<Heart />}
                  title="Favorites"
                  description="Coming soon"
                />

                <QuickAction
                  href="/account/settings"
                  icon={<Settings />}
                  title="Security"
                  description="Coming soon"
                />
              </div>
            </section>

            <section className="rounded-[2rem] border border-blue-400/20 bg-blue-500/10 p-6 md:p-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-blue-300">
                Recent Activity
              </p>

              <h2 className="mb-5 text-2xl font-black">Updates</h2>

              {orders.length === 0 ? (
                <p className="text-sm leading-relaxed text-white/60">
                  No account activity yet. Your order updates will appear here
                  after checkout.
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"
                    >
                      <p className="text-sm font-bold text-white">
                        Order {order.order_number}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-blue-200">
                        {order.status}
                      </p>
                    </div>
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
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
        {icon}
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-white">{value}</p>

      <p className="mt-2 text-sm leading-relaxed text-white/50">
        {description}
      </p>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">
        {label}
      </p>
      <p className="mt-1 capitalize text-white">{value}</p>
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
      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0f2035] p-4 transition hover:border-blue-300/40"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
        {icon}
      </div>

      <div>
        <p className="font-black text-white">{title}</p>
        <p className="mt-1 text-xs text-white/45">{description}</p>
      </div>
    </Link>
  );
}