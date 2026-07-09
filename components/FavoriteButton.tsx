"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function FavoriteButton({
  product,
}: {
  product: Product;
}) {
  const router = useRouter();

  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFavorite() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .maybeSingle();

      if (data?.id) {
        setFavoriteId(data.id);
      }
    }

    loadFavorite();
  }, [product.id]);

  async function toggleFavorite() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/account/login");
      return;
    }

    if (favoriteId) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", favoriteId);

      if (!error) {
        setFavoriteId(null);
      }
    } else {
      const { data, error } = await supabase
        .from("favorites")
        .insert({
          user_id: user.id,
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_image: product.image,
        })
        .select("id")
        .single();

      if (!error && data?.id) {
        setFavoriteId(data.id);
      }
    }

    setLoading(false);
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      aria-label={
        favoriteId ? "Remove from favorites" : "Add to favorites"
      }
      className="absolute top-5 right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/35 backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-110 hover:border-blue-400/40 hover:bg-black/50 active:scale-95 disabled:opacity-50"
    >
      <Heart
        size={22}
        strokeWidth={2.2}
        className={`transition-all duration-300 ${
          favoriteId
            ? "fill-red-500 text-red-500 scale-110"
            : "text-white hover:text-red-400"
        }`}
      />
    </button>
  );
}