import ProductSkeleton from "@/components/ProductSkeleton";

export default function CategoryLoading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10"
    >
      <div className="mb-6 h-28 animate-pulse rounded-2xl bg-[#e4eee7]" />
      <div className="mb-6 h-14 animate-pulse rounded-xl bg-[#e4eee7]" />

      <ProductSkeleton />
    </main>
  );
}