export default function Loading() {
  return (
    <main
      role="status"
      aria-label="পণ্য লোড হচ্ছে"
      className="mx-auto max-w-6xl px-4 py-10"
    >
      <div className="animate-pulse">
        <div className="mb-8 h-48 rounded-2xl bg-gray-200" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 p-5"
            >
              <div className="mb-4 h-12 w-12 rounded-lg bg-gray-200" />
              <div className="mb-3 h-4 w-2/3 rounded bg-gray-200" />
              <div className="h-4 w-1/3 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">লোড হচ্ছে...</span>
    </main>
  );
}