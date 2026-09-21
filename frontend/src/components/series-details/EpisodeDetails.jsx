import { ImageOff } from "lucide-react";

import EpisodeBadges from "./EpisodeBadges";
import EpisodeActions from "./EpisodeActions";
import DownloadCard from "../downloads/DownloadCard";

const EpisodeDetails = ({ episode }) => {
  const image =
    episode.still_image_url ||
    episode.still_image ||
    null;

  const downloads = episode.downloads || [];

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-rose-700/20
        bg-gradient-to-br
        from-[#181111]
        to-[#101010]
        shadow-xl
        shadow-rose-950/10
        animate-in
        fade-in
        duration-300
      "
    >
      <div className="relative gap-5 p-5 lg:grid-cols-[220px_1fr]">

        {/* Image */}

        {/* <div className="overflow-hidden rounded-2xl">

          {image ? (
            <img
              src={image}
              alt={episode.title}
              className="
                h-full
                w-full
                rounded-2xl
                object-cover
                transition-transform
                duration-500
                hover:scale-105
              "
            />
          ) : (
            <div
              className="
                flex
                aspect-video
                items-center
                justify-center
                rounded-2xl
                bg-zinc-900
                text-zinc-600
              "
            >
              <ImageOff size={42} />
            </div>
          )}

        </div> */}

        {/* Content */}

        <div className="flex flex-col">

          {/* Title */}

          <h3 className="text-2xl font-bold text-white">
            {episode.title}
          </h3>

          {/* Badges */}

          <div className="mt-4">
            <EpisodeBadges episode={episode} />
          </div>

          {/* Description */}

          <div className="mt-5">
            <p className="text-sm leading-7 text-zinc-400">
              {episode.description ||
                "توضیحی برای این قسمت ثبت نشده است."}
            </p>
          </div>

          {/* Actions */}

          <div className="mt-6">
            <EpisodeActions episode={episode} />
          </div>

          {/* Downloads */}

          <div className="mt-8 border-t border-white/10 pt-6">

            <div className="mb-5 flex items-center justify-between">

              <h4 className="text-lg font-bold text-white">
                دانلود
              </h4>

              {!!downloads.length && (
                <span className="rounded-full bg-rose-700/20 px-3 py-1 text-xs text-rose-300">
                  {downloads.length} لینک
                </span>
              )}

            </div>

            {downloads.length ? (
              <div className="grid w-full gap-4 px-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {downloads.map((download) => (
                  <DownloadCard
                    key={download.id}
                    download={download}
                    episode_title={episode.title}
                  />
                ))}
              </div>
            ) : (
              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  py-8
                  text-center
                  text-sm
                  text-zinc-400
                "
              >
                لینک دانلودی برای این قسمت ثبت نشده است.
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default EpisodeDetails;