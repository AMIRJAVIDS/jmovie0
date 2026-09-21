import {
  Play,
  Download,
} from "lucide-react";

const EpisodeActions = ({ episode }) => {
  return (
    <div className="flex flex-wrap gap-3">

      {episode.watch_url && (
        <a
          href={episode.watch_url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-rose-700
            to-rose-500
            px-5
            py-2.5
            text-sm
            font-medium
            text-white
            transition
            hover:scale-105
          "
        >
          <Play size={16} />

          پخش آنلاین
        </a>
      )}

      {episode.download_url && (
        <a
          href={episode.download_url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-rose-700/30
            bg-white/5
            px-5
            py-2.5
            text-sm
            text-zinc-300
            transition
            hover:border-rose-500
            hover:bg-rose-950/20
            hover:text-white
          "
        >
          <Download size={16} />

          دانلود
        </a>
      )}

    </div>
  );
};

export default EpisodeActions;