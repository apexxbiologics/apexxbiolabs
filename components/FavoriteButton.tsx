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

export default function FavoriteButton({ product }: { product: Product }) {
  const router = useRouter();
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkFavorite() {
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

    checkFavorite();
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

      if (!error) setFavoriteId(null);
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
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-xs font-black uppercase tracking-[0.22em] transition ${
        favoriteId
          ? "border-blue-400/50 bg-blue-500/15 text-blue-200"
          : "border-white/10 bg-white/[0.05] text-white hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-200"
      }`}
    >
      <Heart
        size={17}
        className={favoriteId ? "fill-blue-300 text-blue-300" : ""}
      />

      {favoriteId ? "Saved" : "Save"}
    </button>
  );
}