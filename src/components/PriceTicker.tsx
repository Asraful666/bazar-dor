"use client";

import { useEffect, useState } from "react";

type TickerProduct = {
  id: number;
  nameBn: string;
  image: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

const units: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  l: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
};

const numberFormat = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 2,
});

const percentFormat = new Intl.NumberFormat("bn-BD", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function isTickerProduct(value: unknown): value is TickerProduct {
  if (typeof value !== "object" || value === null) return false;

  const product = value as Partial<TickerProduct>;

  return (
    typeof product.id === "number" &&
    typeof product.nameBn === "string" &&
    typeof product.image === "string" &&
    typeof product.unit === "string" &&
    typeof product.today === "number" &&
    Number.isFinite(product.today) &&
    !!product.change &&
    ["up", "down", "flat"].includes(product.change.dir) &&
    typeof product.change.pct === "number" &&
    Number.isFinite(product.change.pct)
  );
}

export default function PriceTicker() {
  const [products, setProducts] = useState<TickerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("পণ্যের দাম লোড করা যায়নি।");
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("পণ্যের তথ্য সঠিক নয়।");
        }

        const validProducts = data.filter(isTickerProduct);

        if (validProducts.length === 0) {
          throw new Error("পণ্যের দাম পাওয়া যায়নি।");
        }

        if (!controller.signal.aborted) {
          setProducts(validProducts);
          setError("");
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("পণ্যের দাম লোড করা যায়নি।");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div
        role="status"
        className="overflow-hidden border-b border-[#dfe9e2] bg-[#fafcfb] px-4 py-3"
      >
        <div className="mx-auto flex max-w-6xl animate-pulse gap-6">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-4 w-56 shrink-0 rounded bg-[#e4eee7]"
            />
          ))}
        </div>

        <span className="sr-only">বাজারের দাম লোড হচ্ছে...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="status"
        className="border-b border-[#dfe9e2] bg-[#fafcfb] px-4 py-3 text-center text-xs text-[#64756b]"
      >
        {error}
      </div>
    );
  }

  return (
    <section
      aria-label="আজকের বাজারদর"
      className="price-ticker border-b border-[#dfe9e2] bg-[#fafcfb]"
    >
      <div className="ticker-track flex w-max">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="flex shrink-0 items-center"
          >
            {products.map((product) => {
              const direction = product.change.dir;

              const changeColor =
                direction === "up"
                  ? "text-[#dc3545]"
                  : direction === "down"
                    ? "text-[#169c52]"
                    : "text-[#64756b]";

              const symbol =
                direction === "up"
                  ? "▲"
                  : direction === "down"
                    ? "▼"
                    : "—";

              return (
                <div
                  key={`${copy}-${product.id}`}
                  className="flex shrink-0 items-center gap-2 whitespace-nowrap border-r border-[#e5eee8] px-5 py-3 text-xs sm:text-sm"
                >
                  <span aria-hidden="true">{product.image}</span>

                  <span className="font-medium text-[#182b24]">
                    {product.nameBn}
                  </span>

                  <span className="text-[#182b24]">
                    {numberFormat.format(product.today)} টাকা/
                    {units[product.unit] || product.unit}
                  </span>

                  <span className={`font-semibold ${changeColor}`}>
                    {symbol}{" "}
                    {percentFormat.format(Math.abs(product.change.pct))}%
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}