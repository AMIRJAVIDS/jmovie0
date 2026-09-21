import { useRef } from "react";

export default function GenreChips({ genres, active, onToggle }) {
  const scrollRef = useRef(null);
  const scroll = (dir) =>
    scrollRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => scroll(1)}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10
                   bg-white/[0.03] text-white/60 backdrop-blur transition hover:border-white/25 hover:text-white"
        aria-label="بعدی"
      >
        ›
      </button>

      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto scroll-smooth py-1
                   [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {genres.map((g) => {
          const isActive = active.includes(g);
          return (
            <button
              key={g}
              onClick={() => onToggle(g)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all duration-300
                ${isActive
                  ? "bg-gradient-to-l from-fuchsia-500 to-pink-500 text-white shadow-lg shadow-fuchsia-500/30"
                  : "border border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white"}`}
            >
              {g}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scroll(-1)}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10
                   bg-white/[0.03] text-white/60 backdrop-blur transition hover:border-white/25 hover:text-white"
        aria-label="قبلی"
      >
        ‹
      </button>
    </div>
  );
}
