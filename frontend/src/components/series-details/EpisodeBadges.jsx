import {
  Calendar,
  Clock,
  Star,
  Users,
} from "lucide-react";

const EpisodeBadges = ({ episode }) => {
  return (
    <div className="flex flex-wrap gap-2">

      {episode.vote_average && (
        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            bg-yellow-500/10
            px-3
            py-1.5
            text-xs
            text-yellow-400
          "
        >
          <Star
            size={14}
            fill="currentColor"
          />

          <span>{episode.vote_average}</span>

          {episode.vote_count && (
            <>
              <span className="text-yellow-600">•</span>

              <span className="text-yellow-300">
                {episode.vote_count}
              </span>
            </>
          )}

        </div>
      )}

      {episode.runtime && (
        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            bg-rose-700/20
            px-3
            py-1.5
            text-xs
            text-rose-300
          "
        >
          <Clock size={14} />

          {episode.runtime} دقیقه
        </div>
      )}

      {episode.air_date && (
        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            bg-white/5
            px-3
            py-1.5
            text-xs
            text-zinc-400
          "
        >
          <Calendar size={14} />

          {episode.air_date}
        </div>
      )}

      {episode.vote_count && (
        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            bg-white/5
            px-3
            py-1.5
            text-xs
            text-zinc-400
          "
        >
          <Users size={14} />

          {episode.vote_count} رأی
        </div>
      )}

    </div>
  );
};

export default EpisodeBadges;