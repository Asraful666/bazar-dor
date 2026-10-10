import Hero from "@/components/Hero";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Hero />

      <section
        id="সব-পণ্য"
        aria-labelledby="products-title"
        className="mt-12"
      >
        <h2 id="products-title" className="text-2xl font-bold">
          সব পণ্য
        </h2>

        <p className="mt-2 text-[#64756b]">
          প্রয়োজনীয় পণ্যের আজকের বাজারদর দেখুন।
        </p>

        <div className="mt-6 rounded-2xl border border-[#dfe9e2] bg-[#fbfdfb] p-8 text-center text-[#64756b]">
          পরের ধাপে এখানে API থেকে পণ্যের তালিকা যুক্ত করব।
        </div>
      </section>
    </main>
  );
}