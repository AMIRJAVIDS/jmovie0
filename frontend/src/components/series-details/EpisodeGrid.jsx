import EpisodeCard from "./EpisodeCard";
import EpisodeDetails from "./EpisodeDetails";

const EpisodeGrid = ({
  episodes = [],
  selectedEpisodeId,
  onSelectEpisode,
}) => {
  if (!episodes.length) {
    return (
      <div className="rounded-2xl bg-white/5 py-12 text-center text-zinc-500">
        قسمتی برای این فصل ثبت نشده است.
      </div>
    );
  }

  // تعداد ستون‌های دسکتاپ
  const columns = 4;

  const rows = [];

  for (let i = 0; i < episodes.length; i += columns) {
    rows.push(episodes.slice(i, i + columns));
  }

  return (
    <div className="space-y-6">
      {rows.map((row, rowIndex) => {
        const selectedEpisode = row.find(
          (ep) => ep.id === selectedEpisodeId
        );

        return (
          <div key={rowIndex} className="space-y-4">
            {/* Grid */}

            <div
              className="
                grid
                grid-cols-2
                gap-4
                lg:grid-cols-4
              "
            >
              {row.map((episode) => (
                <EpisodeCard
                  key={episode.id}
                  episode={episode}
                  selected={episode.id === selectedEpisodeId}
                  onClick={() => onSelectEpisode(episode.id)}
                />
              ))}
            </div>

            {/* Detail */}

            {selectedEpisode && (
              <EpisodeDetails
                episode={selectedEpisode}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EpisodeGrid;