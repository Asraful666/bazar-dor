"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  nameBn: string;
  image: string;
  today: number;
  unit: string;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

const endpoints = [
  "https://api.api-store.workers.dev/api/bazardor/products",
  "https://api.abcz.workers.dev/api/bazardor/products",
];

const units: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  l: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
};

const formatter = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 1,
});

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;

  const product = value as Partial<Product>;

  return (
    typeof product.id === "number" &&
    typeof product.nameBn === "string" &&
    typeof product.image === "string" &&
    typeof product.unit === "string" &&
    typeof product.today === "number" &&
    Number.isFinite(product.today) &&
    typeof product.change === "object" &&
    product.change !== null &&
    ["up", "down", "flat"].includes(product.change.dir) &&
    typeof product.change.pct === "number" &&
    Number.isFinite(product.change.pct)
  );
}

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function load() {
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            signal: controller.signal,
          });

          if (!response.ok) throw new Error("API request failed");

          const data: unknown = await response.json();

          if (!Array.isArray(data)) {
            throw new Error("Invalid API response");
          }

          const validProducts = data.filter(isProduct);

          if (validProducts.length === 0) {
            throw new Error("No valid products");
          }

          if (!cancelled) {
            setProducts(validProducts);
            setLoading(false);
          }

          return;
        } catch {
          if (cancelled) return;
        }
      }

      if (!cancelled) {
        setFailed(true);
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <div
        role="status"
        className="border-b border-[#dfe9e2] bg-[#fafcfb] px-4 py-3"
      >
        <div className="h-4 animate-pulse rounded bg-[#e4eee7]" />
        <span className="sr-only">বাজারদর লোড হচ্ছে...</span>
      </div>
    );
  }

  if (failed) {
    return (
      <p
        role="status"
        className="border-b border-[#dfe9e2] bg-[#fafcfb] px-4 py-3 text-center text-sm text-[#64756b]"
      >
        বাজারদর লোড করা যাচ্ছে না। পরে আবার চেষ্টা করুন।
      </p>
    );
  }

  return (
    <div
      role="region"
      aria-label="আজকের বাজারদর"
      tabIndex={0}
      className="price-ticker overflow-hidden border-b border-[#dfe9e2] bg-[#fafcfb]"
    >
      <div className="ticker-track flex w-max">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="flex shrink-0 items-center"
          >
            {products.map((product) => {
              const { dir, pct } = product.change;

              const symbol =
                dir === "up" ? "▲" : dir === "down" ? "▼" : "—";

              const color =
                dir === "up"
                  ? "text-red-600"
                  : dir === "down"
                    ? "text-[#169c52]"
                    : "text-gray-500";

              return (
                <span
                  key={product.id}
                  className="flex shrink-0 items-center gap-2 whitespace-nowrap border-r border-[#dfe9e2] px-5 py-3 text-sm"
                >
                  <span aria-hidden="true">{product.image}</span>
                  <span>{product.nameBn}</span>

                  <span>
                    {formatter.format(product.today)} টাকা/
                    {units[product.unit] || product.unit}
                  </span>

                  <span className={`font-semibold ${color}`}>
                    {symbol} {formatter.format(Math.abs(pct))}%
                  </span>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}