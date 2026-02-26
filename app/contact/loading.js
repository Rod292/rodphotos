export default function ContactLoading() {
  return (
    <section className="min-h-[100dvh] w-full pt-24 pb-16 px-4 md:px-10 bg-zinc-950">
      <div className="max-w-[1400px] mx-auto max-w-3xl">
        <div className="skeleton h-12 w-56 mb-8 md:mb-12 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div className="space-y-4">
            <div className="skeleton h-6 w-40 rounded" />
            <div className="skeleton h-16 w-full rounded" />
            <div className="skeleton h-5 w-48 rounded" />
            <div className="skeleton h-5 w-36 rounded" />
          </div>
          <div className="skeleton h-96 w-full rounded-xl" />
        </div>
      </div>
    </section>
  );
}
