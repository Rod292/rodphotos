export default function AboutLoading() {
  return (
    <section className="min-h-[100dvh] w-full pt-24 pb-16 px-4 md:px-10 bg-zinc-950">
      <div className="max-w-[1400px] mx-auto">
        <div className="skeleton h-12 w-48 mb-8 md:mb-12 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div className="skeleton h-[500px] w-full rounded-xl" />
          <div className="space-y-4">
            <div className="skeleton h-6 w-64 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-3/4 rounded" />
          </div>
        </div>
      </div>
    </section>
  );
}
