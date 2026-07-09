"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from "lucide-react";

type Favorite = {
  id: string;
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
        setFavorites(data as Favorite[]);
      }

      setLoading(false);
    }

    loadFavorites();
  }, [router]);

  async function removeFavorite(id: string) {
    const { error } = await supabase.from("favorites").delete().eq("id", id);

    if (!error) {
      setFavorites((prev) => prev.filter((item) => item.id !== id));
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
                key={item.id}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 transition hover:border-blue-300/40 hover:bg-white/[0.06]"
              >
                <div className="mb-5 flex h-56 items-center justify-center rounded-[1.5rem] bg-[#0f2035] p-6">
                  {item.product_image ? (
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Heart className="text-blue-300" size={40} />
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
                    href={`/products/${item.product_id}`}
                    className="flex-1 rounded-full bg-blue-500 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-blue-400"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => removeFavorite(item.id)}
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