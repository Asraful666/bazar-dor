import { Suspense } from "react";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import ProductSkeleton from "@/components/ProductSkeleton";
import { getProducts } from "@/lib/api";

async function HomeProducts() {
  const products = await getProducts();

  const risers = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const fallers = products
    .filter((product) => product.change.dir === "down")
    .sort(
      (a, b) =>
        Math.abs(b.change.pct) - Math.abs(a.change.pct)
    )
    .slice(0, 6);

  return (
    <>
      <ProductSection
        id="দাম-বেড়েছে"
        title="আজ দাম বেড়েছে"
        symbol="▲"
        products={risers}
      />

      <ProductSection
        id="দাম-কমেছে"
        title="আজ দাম কমেছে"
        symbol="▼"
        products={fallers}
      />

      <ProductSection
        id="সব-পণ্য"
        title="সব পণ্য"
        subtitle="প্রয়োজনীয় সব পণ্যের আজকের দাম ও পরিবর্তন এক নজরে।"
        products={products}
      />
    </>
  );
}

function ProductsLoading() {
  return (
    <section id="সব-পণ্য" className="mt-10">
      <h2 className="mb-5 text-2xl font-bold">
        বাজারদর লোড হচ্ছে...
      </h2>

      <ProductSkeleton />
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Hero />

      <Suspense fallback={<ProductsLoading />}>
        <HomeProducts />
      </Suspense>
    </main>
  );
}