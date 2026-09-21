import { useEffect, useMemo, useState } from "react";

import {
  HardDrive,
  Globe,
  Languages,
  Crown,
  Video,
} from "lucide-react";

import DownloadButton from "./DownloadButton";
// import { useState } from "react";

const DownloadCard = ({ download, episode_title=null }) => {
  
  const language =
      download.language?.trim() ||
      "original";

  return (
    <div
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-gradient-to-br
        from-[#181111]
        to-[#111111]
        transition-all
        duration-300
        hover:border-rose-500/40
        hover:shadow-xl
        hover:shadow-rose-700/20
      "
    >
      {/* Header */}

      <div className="border-b border-white/5 p-4">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-rose-700/20
                text-rose-400
              "
            >
              <Video size={20} />
            </div>

            <div>

              <h4 className="font-semibold text-white">
                {episode_title || "نسخه دانلود"}
              </h4>

              <p className="mt-1 text-xs text-zinc-500">
                کیفیت {download.quality}
              </p>

            </div>

          </div>

          {download.is_vip && (
            <div
              className="
                flex
                items-center
                gap-1
                rounded-full
                bg-amber-500/15
                px-3
                py-1
                text-xs
                text-amber-400
              "
            >
              <Crown size={13} />
              VIP
            </div>
          )}

        </div>

      </div>

      {/* Meta */}

      <div className="space-y-3 p-4">

        <div className="grid grid-cols-2 gap-3">

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Video size={15} />
            <span>{download.quality}</span>
          </div>

          {download.size && (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <HardDrive size={15} />
              <span>{download.size}</span>
            </div>
          )}

          {download.language=="original" ? (
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Globe size={15} />
            <span>زبان اصلی</span>
          </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Globe size={15} />
              <span>دوبله فارسی</span>
            </div>
          )}


          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Languages size={15} />

            <span>
              {download.subtitle
                ? "دارای زیرنویس"
                : "بدون زیرنویس"}
            </span>

          </div>

        </div>

        {/* Download */}

        <DownloadButton download={download} />

      </div>

    </div>
  );
};

export default DownloadCard;