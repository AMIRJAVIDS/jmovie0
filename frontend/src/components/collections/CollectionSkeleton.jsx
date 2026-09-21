export default function CollectionSkeleton() {
  return (
    <article
      className="
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-xl
      "
    >
      {/* ================= Posters ================= */}

      <div className="relative flex h-72 items-center justify-center overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 animate-pulse bg-white/5" />

        {/* Left Poster */}
        <div
          className="
            absolute
            h-48
            w-32
            -translate-x-20
            -rotate-12
            animate-pulse
            rounded-xl
            bg-white/10
          "
        />

        {/* Center Poster */}
        <div
          className="
            relative
            z-10
            h-56
            w-36
            animate-pulse
            rounded-2xl
            bg-white/15
          "
        />

        {/* Right Poster */}
        <div
          className="
            absolute
            h-48
            w-32
            translate-x-20
            rotate-12
            animate-pulse
            rounded-xl
            bg-white/10
          "
        />
      </div>

      {/* ================= Body ================= */}

      <div className="space-y-5 p-6">

        {/* Title */}
        <div
          className="
            h-6
            w-3/4
            animate-pulse
            rounded-lg
            bg-white/10
          "
        />

        {/* Description */}
        <div className="space-y-2">

          <div className="h-4 w-full animate-pulse rounded bg-white/10" />

          <div className="h-4 w-11/12 animate-pulse rounded bg-white/10" />

        </div>

        {/* Stats */}

        <div className="grid grid-cols-3 gap-3">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
                rounded-xl
                border
                border-white/10
                bg-black/20
                p-3
              "
            >
              <div className="mx-auto mb-2 h-5 w-5 animate-pulse rounded-full bg-white/10" />

              <div className="mx-auto h-4 w-8 animate-pulse rounded bg-white/10" />

              <div className="mx-auto mt-2 h-3 w-12 animate-pulse rounded bg-white/10" />
            </div>
          ))}

        </div>

        {/* Button */}

        <div
          className="
            h-12
            w-full
            animate-pulse
            rounded-2xl
            bg-white/10
          "
        />

      </div>
    </article>
  );
}