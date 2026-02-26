export default function GalleryLoading() {
  return (
    <section className="min-h-[100dvh] w-full pt-24 pb-16 px-4 md:px-10 bg-zinc-950">
      <div className="max-w-[1400px] mx-auto">
        <div className="skeleton h-12 w-48 mb-8 md:mb-12 rounded-lg" />
        <div className="flex gap-2 md:gap-3 mb-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-10 w-24 rounded-full" />
          ))}
        </div>
        <div className="flex gap-2 md:gap-3">
          {Array.from({ length: 4 }).map((_, col) => (
            <div key={col} className="flex-1 flex flex-col gap-2 md:gap-3">
              {Array.from({ length: 3 }).map((_, row) => (
                <div
                  key={row}
                  className="skeleton rounded-lg"
                  style={{ height: `${250 + (col + row) * 30}px` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
