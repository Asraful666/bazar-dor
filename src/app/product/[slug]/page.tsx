import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProducts } from "@/lib/api";
import {
  formatNumber,
  formatPercent,
  formatUnit,
} from "@/lib/format";

type Props = {
  params: Promise<{ slug: string }>;
};

async function ProductDetails({ params }: Props) {
  const { slug } = await params;

  const products = await getProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?reason=login_required");
  }

  const markets = Array.isArray(product.markets)
    ? product.markets.filter(
        (market) =>
          typeof market.market === "string" &&
          typeof market.division === "string" &&
          Number.isFinite(market.min) &&
          Number.isFinite(market.max) &&
          market.min <= market.max
      )
    : [];

  const minimum = markets.length
    ? Math.min(...markets.map((market) => market.min))
    : null;

  const maximum = markets.length
    ? Math.max(...markets.map((market) => market.max))
    : null;

  // প্রতিটি বাজারের min/max-এর মধ্যমানের গড়।
  const average = markets.length
    ? markets.reduce(
        (total, market) => total + (market.min + market.max) / 2,
        0
      ) / markets.length
    : null;

  const direction = product.change.dir;

  const symbol =
    direction === "up" ? "▲" : direction === "down" ? "▼" : "—";

  const changeColor =
    direction === "up"
      ? "text-red-600"
      : direction === "down"
        ? "text-[#169c52]"
        : "text-gray-500";

  const summary = [
    { label: "সর্বনিম্ন দাম", value: minimum, color: "text-[#169c52]" },
    { label: "সর্বোচ্চ দাম", value: maximum, color: "text-red-600" },
    { label: "গড় দাম", value: average, color: "text-[#182b24]" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#64756b]">
        <Link href="/" className="hover:text-[#008c40]">
          হোম
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/category/${encodeURIComponent(product.category)}`}
          className="hover:text-[#008c40]"
        >
          {product.categoryNameBn || product.category}
        </Link>
        <span aria-hidden="true">/</span>
        <span>{product.nameBn}</span>
      </div>

      <section className="flex flex-col justify-between gap-6 rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-6 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#edf5ef] text-4xl"
          >
            {product.image}
          </span>

          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {product.nameBn}
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#64756b]">
              বিভিন্ন বাজারে আজকের দাম ও দামের পরিবর্তন দেখুন।
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Link
                href={`/category/${encodeURIComponent(product.category)}`}
                className="rounded-full bg-[#e2f2e7] px-3 py-1 text-xs text-[#008c40]"
              >
                {product.categoryIcon}{" "}
                {product.categoryNameBn || product.category}
              </Link>

              <span className="text-sm text-[#64756b]">
                {formatUnit(product.unit)}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 rounded-xl bg-[#f0f6f2] p-4 sm:text-right">
          <p className="text-xs text-[#64756b]">আজকের দাম</p>
          <p className="mt-1 text-2xl font-bold">
            {formatNumber(product.today)} টাকা
          </p>
          <p className={`mt-2 text-sm font-semibold ${changeColor}`}>
            {symbol} {formatPercent(product.change.pct)}%
          </p>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="price-summary">
        <h2 id="price-summary" className="text-xl font-bold">
          দামের সারসংক্ষেপ
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {summary.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[#dfe9e2] bg-[#fafcfb] p-5"
            >
              <p className="text-sm text-[#64756b]">{item.label}</p>
              <p className={`mt-2 text-2xl font-bold ${item.color}`}>
                {item.value === null
                  ? "তথ্য নেই"
                  : `${formatNumber(item.value)} টাকা`}
              </p>
              <p className="mt-1 text-xs text-[#64756b]">
                {formatUnit(product.unit)}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-[#64756b]">
          গড় দাম প্রতিটি বাজারের সর্বনিম্ন ও সর্বোচ্চ দামের মধ্যমান থেকে
          হিসাব করা হয়েছে।
        </p>
      </section>

      <section className="mt-8" aria-labelledby="market-prices">
        <h2 id="market-prices" className="text-xl font-bold">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length === 0 ? (
          <p className="mt-4 rounded-xl bg-[#fafcfb] p-6 text-[#64756b]">
            বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
          </p>
        ) : (
          <div
            tabIndex={0}
            role="region"
            aria-label="বাজারভিত্তিক দামের টেবিল"
            className="mt-4 overflow-x-auto rounded-xl border border-[#dfe9e2] bg-[#fafcfb]"
          >
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">
                {product.nameBn}-এর বাজারভিত্তিক দাম
              </caption>

              <thead className="bg-[#eaf3ed]">
                <tr>
                  <th scope="col" className="px-4 py-3">বাজার</th>
                  <th scope="col" className="px-4 py-3">বিভাগ</th>
                  <th scope="col" className="px-4 py-3">সর্বনিম্ন</th>
                  <th scope="col" className="px-4 py-3">সর্বোচ্চ</th>
                  <th scope="col" className="px-4 py-3">মধ্যমান</th>
                </tr>
              </thead>

              <tbody>
                {markets.map((market, index) => (
                  <tr
                    key={`${market.division}-${market.market}-${index}`}
                    className="border-t border-[#dfe9e2] even:bg-[#f0f6f2]"
                  >
                    <th scope="row" className="px-4 py-3 font-medium">
                      {market.market}
                    </th>
                    <td className="px-4 py-3">{market.division}</td>
                    <td className="px-4 py-3">
                      {formatNumber(market.min)} টাকা
                    </td>
                    <td className="px-4 py-3">
                      {formatNumber(market.max)} টাকা
                    </td>
                    <td className="px-4 py-3">
                      {formatNumber((market.min + market.max) / 2)} টাকা
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default function ProductPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          className="mx-auto my-10 h-80 max-w-6xl animate-pulse rounded-2xl bg-[#e4eee7]"
        >
          <span className="sr-only">পণ্যের বিস্তারিত লোড হচ্ছে...</span>
        </div>
      }
    >
      <ProductDetails params={params} />
    </Suspense>
  );
}