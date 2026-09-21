import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiStar, FiPlus, FiCheck } from "react-icons/fi";

export default function MobileMediaCard({
  media,
  type = "media",
  onToggleWatchlist,
}) {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(media.inWatchlist ?? false);

  const go = () => {
    navigate(`/${type}/${media.slug}`);
  };

  const description =
    media.description?.trim() ||
    "خلاصه‌ای برای این فیلم ثبت نشده است.";

  const Badge = ({ children }) => (
    <span
      className="
        rounded-full
        border
        border-white/10
        bg-white/10
        px-2
        py-0.5
        text-[10px]
        text-white/80
      "
    >
      {children}
    </span>
  );

  const handleWatchlist = (e) => {
    e.stopPropagation();

    const next = !saved;

    setSaved(next);

    onToggleWatchlist?.(media.id, next);
  };

  return (
    <article
      dir="rtl"
      tabIndex={0}
      role="button"
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          go();
        }
      }}
      className="
        group
        flex
        h-[395px]
        w-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-zinc-900
        shadow-lg
        transition-all
        duration-300
        active:scale-[0.98]
      "
    >
      {/* ---------------- پوستر ---------------- */}

      <div
        className="
          relative
          h-[250px]
          w-full
          shrink-0
          overflow-hidden
        "
      >
        <img
          src={media.poster || media.poster_url}
          alt={media.original_title}
          loading="lazy"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black
            via-black/20
            to-transparent
          "
        />

        {/* IMDb */}

        {media.imdb_rating && (
          <span
            className="
              absolute
              bottom-2
              left-2
              flex
              items-center
              gap-1
              rounded-full
              bg-black/60
              px-2
              py-1
              text-[11px]
              font-bold
              text-amber-400
              backdrop-blur
            "
          >
            <FiStar className="fill-current" />
            {media.imdb_rating}
          </span>
        )}

        {/* Watchlist */}

        <button
          type="button"
          onClick={handleWatchlist}
          className={`
            absolute
            right-2
            top-2
            grid
            h-8
            w-8
            place-items-center
            rounded-full
            backdrop-blur
            transition

            ${
              saved
                ? "bg-emerald-600/80 text-white"
                : "bg-black/50 text-white"
            }
          `}
        >
          {saved ? (
            <FiCheck size={16} />
          ) : (
            <FiPlus size={16} />
          )}
        </button>
      </div>

      {/* ---------------- اطلاعات ---------------- */}

      <div
        className="
          flex
          flex-1
          flex-col
          p-3
        "
      >
        <h2
          className="
            line-clamp-1
            text-sm
            font-semibold
            text-white
          "
        >
          {media.title}
        </h2>

        <p
          className="
            mt-2
            h-[40px]
            overflow-hidden
            text-xs
            leading-5
            text-zinc-300
          "
        >
          {description}
        </p>
        {media.genres?.length > 0 && (
          <div
            className="
              mt-3
              h-[26px]
              overflow-hidden
            "
          >
            <div className="flex flex-wrap gap-1">
              {media.genres.slice(0, 3).map((genre) => {
                const id =
                  typeof genre === "object"
                    ? genre.id ?? genre.slug
                    : genre;

                const name =
                  typeof genre === "object"
                    ? genre.name
                    : genre;

                return (
                  <Badge key={id}>
                    {name}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-auto" />

        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-white/10
            pt-3
            text-[11px]
            text-zinc-400
          "
        >
          <span
            className="
              max-w-[55%]
              truncate
            "
          >
            {media.original_title}
          </span>

          <div className="flex items-center gap-1">
            {media.year && (
              <span>{media.year}</span>
            )}

            {media.year && media.duration && (
              <span className="opacity-50">•</span>
            )}

            {media.duration && (
              <span>{media.duration}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}