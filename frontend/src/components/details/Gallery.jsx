import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function Gallery({ images = [], title = "" }) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setActive(null);
    if (active !== null) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  if (!images.length) return null;

  // پشتیبانی از هر دو حالت: رشته یا آبجکت
  const getSrc = (it) => (typeof it === "string" ? it : it?.url);
  const getCaption = (it) => (typeof it === "string" ? "" : it?.caption || "");

  return (
    <section
      dir="rtl"
      className="relative z-20 -mt-12 px-4 sm:-mt-16 sm:px-8 md:-mt-20 md:px-14 lg:px-20"
    >
      <div
        className="mx-auto flex max-w-6xl gap-3 overflow-x-auto pb-3
        sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible [scrollbar-width:thin]"
      >
        {images.slice(0, 5).map((it, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`تصویر ${i + 1}`}
            className="group relative aspect-video w-[150px] flex-shrink-0
              overflow-hidden rounded-xl border border-white/10
              shadow-[0_12px_40px_rgba(0,0,0,0.55)] transition-all duration-300
              hover:-translate-y-2 hover:border-white/30
              hover:shadow-[0_20px_50px_rgba(14,165,233,0.45)]
              sm:w-auto sm:rounded-2xl"
          >
            <img
              src={getSrc(it)}
              alt={getCaption(it) || `${title} - ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform
                duration-500 group-hover:scale-110"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/50
              to-transparent opacity-0 transition-opacity duration-300
              group-hover:opacity-100"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {active !== null && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 grid place-items-center
            bg-black/85 p-4 backdrop-blur-sm animate-[fadeIn_.2s_ease] sm:p-6"
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="بستن"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center
              rounded-full border border-white/20 bg-white/10 text-white
              backdrop-blur-md transition hover:bg-white/20
              sm:right-6 sm:top-6 sm:h-11 sm:w-11"
          >
            <FiX className="text-xl" />
          </button>

          <figure onClick={(e) => e.stopPropagation()} className="text-center">
            <img
              src={getSrc(images[active])}
              alt={getCaption(images[active]) || `${title} - ${active + 1}`}
              className="max-h-[80vh] max-w-[92vw] rounded-xl
                shadow-[0_0_60px_rgba(0,0,0,0.8)] sm:max-w-[90vw] sm:rounded-2xl"
            />
            {getCaption(images[active]) && (
              <figcaption className="mt-3 text-xs text-white/80 sm:mt-4 sm:text-sm">
                {getCaption(images[active])}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </section>
  );
}
