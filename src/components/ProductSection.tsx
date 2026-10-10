import type { Product } from "@/types";
import ProductCard from "./ProductCard";

type ProductSectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  symbol?: "▲" | "▼";
  products: Product[];
};

export default function ProductSection({
  id,
  title,
  subtitle,
  symbol,
  products,
}: ProductSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="mt-10 sm:mt-12"
    >
      <h2
        id={`${id}-title`}
        className="flex items-center gap-2 text-xl font-bold sm:text-2xl"
      >
        {symbol && (
          <span
            aria-hidden="true"
            className={
              symbol === "▲" ? "text-green-700" : "text-red-600"
            }
          >
            {symbol}
          </span>
        )}

        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 text-sm text-[#64756b] sm:text-base">
          {subtitle}
        </p>
      )}

      {products.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-6 text-[#64756b]">
          এই বিভাগে কোনো পণ্য পাওয়া যায়নি।
        </p>
      )}
    </section>
  );
}