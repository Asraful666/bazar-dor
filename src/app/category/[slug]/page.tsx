import { notFound } from "next/navigation";
import CategoryProducts from "@/components/CategoryProducts";
import { getProducts } from "@/lib/api";

const categories: Record<
  string,
  { name: string; icon: string }
> = {
  chal: { name: "চাল", icon: "🍚" },
  dal: { name: "ডাল", icon: "🫘" },
  tel: { name: "তেল", icon: "🛢️" },
  sobji: { name: "সবজি", icon: "🥬" },
  mach: { name: "মাছ", icon: "🐟" },
  mangsho: { name: "মাংস", icon: "🍗" },
  "dim-dui": { name: "ডিম-দুধ", icon: "🥛" },
  mosla: { name: "মসলা", icon: "🌶️" },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  if (!Object.prototype.hasOwnProperty.call(categories, slug)) {
    notFound();
  }

  const category = categories[slug];
  const allProducts = await getProducts();

  const products = allProducts.filter(
    (product) => product.category === slug
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="flex items-center gap-4 rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-6">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#edf5ef] text-3xl"
        >
          {category.icon}
        </span>

        <div>
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <p className="mt-1 text-sm text-[#64756b]">
            এই বিভাগের পণ্যের আজকের বাজারদর।
          </p>
        </div>
      </section>

      <CategoryProducts products={products} />
    </main>
  );
}