import type { Product } from "@/types";

const BASE_URLS = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;

  const product = value as Partial<Product>;

  return (
    typeof product.id === "number" &&
    typeof product.slug === "string" &&
    typeof product.nameBn === "string" &&
    typeof product.category === "string" &&
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

export async function getProducts(): Promise<Product[]> {
  for (const baseUrl of BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}/products`, {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data) || !data.every(isProduct)) {
        throw new Error("Invalid product data");
      }

      return data;
    } catch {
      // Primary API fail হলে alternative API চেষ্টা হবে।
    }
  }

  throw new Error("বাজারদর পাওয়া যাচ্ছে না। আবার চেষ্টা করুন।");
}