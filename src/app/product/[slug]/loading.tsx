export default function ProductLoading() {
  return (
    <main
      role="status"
      className="mx-auto max-w-6xl animate-pulse px-4 py-10 sm:px-6"
    >
      <div className="h-40 rounded-2xl bg-[#e4eee7]" />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-28 rounded-xl bg-[#e4eee7]" />
        ))}
      </div>

      <div className="mt-8 h-80 rounded-xl bg-[#e4eee7]" />
      <span className="sr-only">পণ্যের বিস্তারিত লোড হচ্ছে...</span>
    </main>
  );
}