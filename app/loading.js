export default function Loading() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin" />
      </div>
    </div>
  );
}
