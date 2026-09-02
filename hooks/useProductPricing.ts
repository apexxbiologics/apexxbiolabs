"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type FlashSale = {
  id: string;
  product_id: string;
  sale_price: number;
  starts_at: string;
  ends_at: string;
  active: boolean;
};

export type StoreProduct = {
  id: string;
  name?: string | null;
  slug?: string | null;
  size?: string | null;
  price?: number | string | null;
  inventory?: number | string | null;
  active?: boolean | null;
};

export type ProductPricingVariant<T extends string> = {
  key: T;
  fallbackPrice: number;
  matches: (product: StoreProduct) => boolean;
};

export type ProductPricingState = {
  databaseProductId: string | null;
  inventory: number | null;
  regularPrice: number;
  effectiveUnitPrice: number;
  isFlashSaleActive: boolean;
  flashSale: FlashSale | null;
  flashSalePrice: number | null;
};

type UseProductPricingOptions<T extends string> = {
  variants: ProductPricingVariant<T>[];
  refreshMs?: number;
};

type PricingRecord<T extends string> = Record<T, ProductPricingState>;

function buildDefaultState<T extends string>(
  variants: ProductPricingVariant<T>[]
): PricingRecord<T> {
  return variants.reduce((acc, variant) => {
    acc[variant.key] = {
      databaseProductId: null,
      inventory: null,
      regularPrice: variant.fallbackPrice,
      effectiveUnitPrice: variant.fallbackPrice,
      isFlashSaleActive: false,
      flashSale: null,
      flashSalePrice: null,
    };

    return acc;
  }, {} as PricingRecord<T>);
}

function getActiveFlashSaleForProduct(
  sales: FlashSale[],
  databaseProductId: string,
  regularPrice: number
) {
  const now = Date.now();

  const matchingSales = sales
    .filter((sale) => {
      const startsAt = new Date(sale.starts_at).getTime();
      const endsAt = new Date(sale.ends_at).getTime();
      const salePrice = Number(sale.sale_price);

      return (
        sale.active === true &&
        String(sale.product_id) === String(databaseProductId) &&
        Number.isFinite(startsAt) &&
        Number.isFinite(endsAt) &&
        startsAt <= now &&
        endsAt > now &&
        Number.isFinite(salePrice) &&
        salePrice > 0 &&
        salePrice < regularPrice
      );
    })
    .sort((a, b) => {
      return (
        new Date(b.starts_at).getTime() -
        new Date(a.starts_at).getTime()
      );
    });

  return matchingSales[0] || null;
}

export function useProductPricing<T extends string>({
  variants,
  refreshMs = 30_000,
}: UseProductPricingOptions<T>) {
  const initialState = useMemo(
    () => buildDefaultState(variants),
    [variants]
  );

  const [pricing, setPricing] =
    useState<PricingRecord<T>>(initialState);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [productsResponse, salesResponse] =
        await Promise.all([
          fetch("/api/products", {
            cache: "no-store",
          }),
          fetch("/api/flash-sales", {
            cache: "no-store",
          }),
        ]);

      const productsData =
        await productsResponse.json();

      const salesData =
        await salesResponse
          .json()
          .catch(() => ({
            success: false,
            sales: [],
          }));

      if (
        !productsResponse.ok ||
        !productsData.success
      ) {
        throw new Error(
          productsData?.error ||
            "Unable to load product pricing."
        );
      }

      const products: StoreProduct[] =
        Array.isArray(productsData.products)
          ? productsData.products
          : [];

      const sales: FlashSale[] =
        salesResponse.ok &&
        salesData.success &&
        Array.isArray(salesData.sales)
          ? salesData.sales
          : [];

      const nextPricing =
        buildDefaultState(variants);

      for (const variant of variants) {
        const foundProduct =
          products.find((product) =>
            variant.matches(product)
          );

        if (!foundProduct) {
          continue;
        }

        const databaseProductId =
          String(foundProduct.id);

        const regularPriceCandidate =
          Number(foundProduct.price);

        const regularPrice =
          Number.isFinite(
            regularPriceCandidate
          ) &&
          regularPriceCandidate > 0
            ? regularPriceCandidate
            : variant.fallbackPrice;

        const inventoryCandidate =
          Number(foundProduct.inventory);

        const inventory =
          Number.isFinite(
            inventoryCandidate
          )
            ? inventoryCandidate
            : null;

        const flashSale =
          getActiveFlashSaleForProduct(
            sales,
            databaseProductId,
            regularPrice
          );

        const flashSalePrice =
          flashSale
            ? Number(
                flashSale.sale_price
              )
            : null;

        const isFlashSaleActive =
          flashSalePrice !== null &&
          Number.isFinite(
            flashSalePrice
          ) &&
          flashSalePrice > 0 &&
          flashSalePrice <
            regularPrice;

        nextPricing[variant.key] = {
          databaseProductId,
          inventory,
          regularPrice,
          effectiveUnitPrice:
            isFlashSaleActive
              ? flashSalePrice
              : regularPrice,
          isFlashSaleActive,
          flashSale:
            isFlashSaleActive
              ? flashSale
              : null,
          flashSalePrice:
            isFlashSaleActive
              ? flashSalePrice
              : null,
        };
      }

      setPricing(nextPricing);
      setError(null);
    } catch (err) {
      console.error(
        "Product pricing fetch failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load product pricing."
      );
    } finally {
      setLoading(false);
    }
  }, [variants]);

  useEffect(() => {
    refresh();

    const intervalId =
      window.setInterval(
        refresh,
        refreshMs
      );

    return () => {
      window.clearInterval(
        intervalId
      );
    };
  }, [refresh, refreshMs]);

  return {
    pricing,
    loading,
    error,
    refresh,
  };
}