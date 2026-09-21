import {
  Clapperboard,
  ExternalLink,
  Film,
  Play,
  Star,
  Tv,
} from 'lucide-react'

const AIMovieCard = ({ item }) => {
  const isSeries = item.media_type === 'series'

  const mediaType = isSeries ? 'سریال' : 'فیلم'

  return (
    <div
      dir="rtl"
      className="
        mt-3
        overflow-hidden
        rounded-2xl
        border border-white/[0.08]
        bg-[#0d0708]
        transition
        hover:border-[#8b1e2d]/40
      "
    >
      <div className="flex gap-3 p-3">

        {/* Poster */}

        <div
          className="
            relative
            h-[125px]
            w-[84px]
            shrink-0
            overflow-hidden
            rounded-xl
            bg-white/[0.05]
          "
        >
          {item.poster ? (
            <img
              src={item.poster}
              alt={item.title}
              className="
                h-full
                w-full
                object-cover
              "
              loading="lazy"
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                text-gray-600
              "
            >
              {isSeries ? (
                <Tv size={25} />
              ) : (
                <Film size={25} />
              )}
            </div>
          )}

          {/* Type badge */}

          <span
            className="
              absolute
              bottom-1.5
              right-1.5
              rounded-md
              bg-black/75
              px-1.5
              py-1
              text-[9px]
              text-gray-200
              backdrop-blur
            "
          >
            {mediaType}
          </span>
        </div>

        {/* Information */}

        <div className="min-w-0 flex-1">

          <h4
            className="
              truncate
              text-sm
              font-semibold
              text-white
            "
          >
            {item.title}
          </h4>

          {item.original_title && (
            <p
              className="
                mt-1
                truncate
                text-[10px]
                text-gray-500
                ltr:text-left
              "
            >
              {item.original_title}
            </p>
          )}

          <div
            className="
              mt-3
              flex
              flex-wrap
              items-center
              gap-2
              text-[10px]
              text-gray-400
            "
          >

            {item.year && (
              <span>
                {item.year}
              </span>
            )}

            {item.year && item.rating !== null && (
              <span className="text-gray-700">
                •
              </span>
            )}

            {item.rating !== null &&
              item.rating !== undefined && (
                <span
                  className="
                    flex
                    items-center
                    gap-1
                    text-yellow-500
                  "
                >
                  <Star
                    size={11}
                    fill="currentColor"
                  />

                  <span>
                    {item.rating}
                  </span>
                </span>
              )}
          </div>

          {/* Link */}

          {item.url && (
            <a
              href={item.url}
              className="
                mt-3
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                bg-[#8b1e2d]/15
                px-2.5
                py-1.5
                text-[10px]
                font-medium
                text-[#dc7180]
                transition
                hover:bg-[#8b1e2d]
                hover:text-white
              "
            >
              <Play size={11} />

              مشاهده {mediaType}

              <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default AIMovieCard