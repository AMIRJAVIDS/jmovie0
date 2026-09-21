const SeasonTabs = ({
  seasons = [],
  activeSeason,
  onChange,
}) => {
  return (
    <div className="mb-8 overflow-x-auto scrollbar-hide">
      <div className="flex min-w-max gap-3 pb-2">

        {seasons.map((season, index) => {
          const isActive = activeSeason === index;
          const episodesCount = season.episodes?.length || 0;

          return (
            <button
              key={season.id || index}
              onClick={() => onChange(index)}
              className={`
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                px-5
                py-3
                transition-all
                duration-300
                ${
                  isActive
                    ? "border-rose-500 bg-gradient-to-br from-rose-700/80 to-rose-500/80 shadow-lg shadow-rose-700/30"
                    : "border-white/10 bg-white/5 hover:border-rose-500/40 hover:bg-rose-950/20"
                }
              `}
            >
              {/* Glow */}

              <div
                className={`
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-rose-600/10
                  to-transparent
                  transition-opacity
                  duration-300
                  ${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }
                `}
              />

              {/* Content */}

              <div className="relative flex flex-col items-center">

                <span
                  className={`
                    text-sm
                    font-bold
                    ${
                      isActive
                        ? "text-white"
                        : "text-zinc-300"
                    }
                  `}
                >
                  {season.title ||
                    `فصل ${season.season_number || index + 1}`}
                </span>

                <span
                  className={`
                    mt-1
                    text-xs
                    ${
                      isActive
                        ? "text-rose-200"
                        : "text-zinc-500"
                    }
                  `}
                >
                  {episodesCount} قسمت
                </span>

              </div>
            </button>
          );
        })}

      </div>
    </div>
  );
};

export default SeasonTabs;