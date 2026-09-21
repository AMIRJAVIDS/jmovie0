import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiStar, FiPlus, FiCheck } from "react-icons/fi";

/* ── شکل برش پوستر ── */
const R = 18;
const NR = 26;

const NOTCH_PATH = [
  `M ${R} 0`,
  `L ${200 - NR} 0`,
  `A ${NR} ${NR} 0 0 1 200 ${NR}`,
  `L 200 ${300 - R}`,
  `A ${R} ${R} 0 0 1 ${200 - R} 300`,
  `L ${R} 300`,
  `A ${R} ${R} 0 0 1 0 ${300 - R}`,
  `L 0 ${R}`,
  `A ${R} ${R} 0 0 1 ${R} 0`,
  "Z",
].join(" ");

const MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 300' preserveAspectRatio='none'><path d='${NOTCH_PATH}' fill='black'/></svg>`
)}")`;

const maskStyle = {
  WebkitMaskImage: MASK,
  maskImage: MASK,
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
};

export default function DesktopMediaCard({ media, type = "media" }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const go = () => navigate(`/${type}/${media.slug}`);

  const Badge = ({ children }) => (
    <span
      className="rounded-full border border-white/20 bg-white/[0.08]
      px-3.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md tracking-wide"
    >
      {children}
    </span>
  );

  const description =
    media.description?.trim() ||
    "خلاصه‌ای برای این فیلم ثبت نشده. برای دیدن جزئیات بیشتر کلیک کن.";

  return (
    <article
      dir="rtl"
      onClick={go}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && go()}
      tabIndex={0}
      role="button"
      className="group relative w-full max-w-[210px] cursor-pointer text-right outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setSaved((s) => !s);
        }}
        className={`absolute right-2 top-2 z-20 grid h-9 w-9 place-items-center rounded-full border text-white shadow-[0_4px_14px_rgba(0,0,0,0.55)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:rotate-[360deg] active:scale-90 ${
          saved
            ? "border-emerald-400/40 bg-emerald-600/30 text-emerald-300"
            : "border-white/30 bg-white/5 hover:bg-white/10"
        }`}
      >
        {saved ? (
          <FiCheck className="text-lg" />
        ) : (
          <FiPlus className="text-lg" />
        )}
      </button>

      <div
        style={maskStyle}
        className="relative aspect-[2/3] overflow-hidden bg-zinc-900 transition-[filter] duration-300 group-hover:drop-shadow-[0_10px_30px_rgba(225,29,72,0.4)]"
      >
        <img
          src={media.poster || media.poster_url}
          alt={media.original_title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {media.imdb_rating && (
          <span className="absolute bottom-2 left-2 z-10 flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-xs font-bold text-amber-400 ring-1 ring-white/10 backdrop-blur-md">
            <FiStar className="fill-current" />
            {media.imdb_rating}
          </span>
        )}

        <div className="absolute inset-x-0 top-2 z-10 -translate-y-2 p-3 pt-12 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <h2 className="mb-3 text-center text-xl font-semibold text-white">
            {media.title}
          </h2>

          <p className="line-clamp-5 text-[15px] leading-relaxed text-white/85">
            {description}
          </p>

          {media.genres?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {media.genres.slice(0, 3).map((g) => {
                const id = typeof g === "object" ? g.id ?? g.slug : g;
                const name = typeof g === "object" ? g.name : g;

                return <Badge key={id}>{name}</Badge>;
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2.5 px-1">
        <h3 className="truncate text-sm font-semibold text-white/90 transition-colors group-hover:text-white">
          {media.original_title}
        </h3>

        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-white/45">
          {media.year && <span>{media.year}</span>}
          {media.year && media.duration && (
            <span className="opacity-50">•</span>
          )}
          {media.duration && <span>{media.duration}</span>}
        </div>
      </div>
    </article>
  );
}