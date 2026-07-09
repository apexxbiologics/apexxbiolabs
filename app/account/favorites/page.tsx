"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from "lucide-react";

type Favorite = {
  id: string;
  user_id?: string;
  product_id: string;
  product_name: string;
  product_price: number | null;
  product_image: string | null;
  created_at: string;
};

export default function FavoritesPage() {
  const router = useRouter();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  function getProductPath(productId: string) {
    const productPaths: Record<string, string> = {
      "aceticacid-10ml": "/products/aceticacid",
      "ACETIC-ACID-10ML": "/products/aceticacid",

      "5amino1mq-50mg": "/products/5amino1mq",
      "5-AMINO-1MQ-50mg": "/products/5amino1mq",

      adamax: "/products/adamax",
      "adamax-10mg": "/products/adamax",

      apx3: "/products/apx3",
      "apx3-10mg": "/products/apx3",
      "apx3-20mg": "/products/apx3",

      aod9604: "/products/aod9604",
      "aod9604-5mg": "/products/aod9604",

      ara290: "/products/ara290",
      "ara290-16mg": "/products/ara290",

      bacwater: "/products/bacwater",
      "bacwater-10ml": "/products/bacwater",

      bpc157: "/products/bpc157",
      "bpc157-10mg": "/products/bpc157",

      cjcipa: "/products/cjcipa",
      "cjcipa-10mg": "/products/cjcipa",

      ghkcu: "/products/ghkcu",
      "ghkcu-50mg": "/products/ghkcu",

      kpv: "/products/kpv",
      "kpv-10mg": "/products/kpv",

      motsc: "/products/motsc",
      "motsc-10mg": "/products/motsc",

      nad: "/products/nad",
      "nad-500mg": "/products/nad",

      pe2228: "/products/pe2228",
      "pe2228-10mg": "/products/pe2228",

      pinealon: "/products/pinealon",
      "pinealon-10mg": "/products/pinealon",

      pt141: "/products/pt141",
      "pt141-10mg": "/products/pt141",

      selank: "/products/selank",
      "selank-10mg": "/products/selank",

      semax: "/products/semax",
      "semax-10mg": "/products/semax",

      tb500: "/products/tb500",
      "tb500-10mg": "/products/tb500",

      tesamorelin: "/products/tesamorelin",
      "tesamorelin-5mg": "/products/tesamorelin",
      "tesamorelin-10mg": "/products/tesamorelin",
    };

    return productPaths[productId] || "/products";
  }

  useEffect(() => {
    async function loadFavorites() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/account/login");
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const uniqueFavorites = Array.from(
          new Map(data.map((item) => [item.product_id, item])).values()
        );

        setFavorites(uniqueFavorites as Favorite[]);
      }

      setLoading(false);
    }

    loadFavorites();
  }, [router]);

  async function removeFavorite(productId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (!error) {
      setFavorites((prev) =>
        prev.filter((item) => item.product_id !== productId)
      );
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">
        <p className="text-center text-white/60">Loading favorites...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/account"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-300 hover:text-blue-200"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <section className="mb-8 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur">
          <div className="relative p-8 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.20),transparent_45%)]" />

            <div className="relative z-10">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-blue-300">
                Saved Products
              </p>

              <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                Favorites
              </h1>

              <p className="mt-5 max-w-2xl text-white/60">
                Keep track of products you want to reorder or purchase later.
              </p>
            </div>
          </div>
        </section>

        {favorites.length === 0 ? (
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center">
            <Heart className="mx-auto mb-5 text-blue-300" size={42} />

            <h2 className="text-3xl font-black">No favorites yet</h2>

            <p className="mx-auto mt-4 max-w-md text-white/60">
              Save products while browsing so they appear here in your account.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-blue-500 px-7 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition hover:bg-blue-400"
            >
              <ShoppingBag size={16} />
              Shop Products
            </Link>
          </section>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((item) => (
              <div
                key={item.product_id}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 transition hover:border-blue-300/40 hover:bg-white/[0.06]"
              >
<div className="relative mb-5 h-64 overflow-hidden rounded-[2rem] border border-blue-400/10 bg-[#93C5FD] shadow-[0_0_25px_rgba(96,165,250,0.18)]">
  {item.product_image ? (
    <img
      src={item.product_image}
      alt={item.product_name}
      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
    />
  ) : (
    <div className="flex h-full items-center justify-center">
      <Heart className="text-white" size={46} />
    </div>
  )}
</div>

                <h2 className="text-xl font-black">{item.product_name}</h2>

                <p className="mt-2 text-white/55">
                  {item.product_price
                    ? `$${Number(item.product_price).toFixed(2)}`
                    : "Price unavailable"}
                </p>

                <div className="mt-6 flex gap-3">
                  <Link
                    href={getProductPath(item.product_id)}
                    className="flex-1 rounded-full bg-blue-500 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-blue-400"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => removeFavorite(item.product_id)}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-4 text-white transition hover:border-red-400/40 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}