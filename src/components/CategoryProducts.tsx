"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import { formatNumber } from "@/lib/format";

type Props = {
  products: Product[];
};

type SortOrder = "default" | "asc" | "desc";

export default function CategoryProducts({ products }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");

  const sortedProducts = [...products];

  if (sortOrder === "asc") {
    sortedProducts.sort((a, b) => a.today - b.today);
  } else if (sortOrder === "desc") {
    sortedProducts.sort((a, b) => b.today - a.today);
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#dfe9e2] bg-[#fafcfb] px-4 py-3">
        <p className="text-sm text-[#64756b]">
          মোট {formatNumber(products.length)}টি পণ্য
        </p>

        <div className="flex items-center gap-3">
          <label
            htmlFor="price-sort"
            className="text-sm font-medium"
          >
            সাজান:
          </label>

          <div className="relative">
            <select
              id="price-sort"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as SortOrder)
              }
              className="appearance-none rounded-lg border border-[#dfe9e2] bg-white py-2 pr-9 pl-3 text-sm focus:border-green-600"
            >
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-[#64756b]"
            >
              ▼
            </span>
          </div>
        </div>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] px-4 py-16 text-center">
          <h2 className="text-xl font-bold">
            এই বিভাগে কোনো পণ্য পাওয়া যায়নি।
          </h2>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-[#008c40] px-5 py-3 text-white hover:bg-[#007535]"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      )}
    </>
  );
}