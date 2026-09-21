import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page = 1, totalPages = 1, onChange }) => {
  const currentPage = Number(page);
  const lastPage = Number(totalPages);

  if (lastPage <= 1) return null;

  const goToPage = (newPage) => {
    const target = Number(newPage);

    if (
      target < 1 ||
      target > lastPage ||
      target === currentPage
    ) {
      return;
    }

    onChange(target);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const pages = [];

  if (lastPage <= 7) {
    for (let i = 1; i <= lastPage; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(lastPage - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < lastPage - 2) {
      pages.push("...");
    }

    pages.push(lastPage);
  }

  return (
    <div
      dir="rtl"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="
          flex h-11 w-11 items-center justify-center
          rounded-xl border border-rose-700/30 bg-white/5
          text-white transition
          hover:border-rose-500 hover:bg-rose-700/20
          disabled:cursor-not-allowed disabled:opacity-40
        "
      >
        <ChevronRight size={18} />
      </button>

      {/* Pages */}
      {pages.map((item, index) =>
        item === "..." ? (
          <span
            key={`dots-${index}`}
            className="px-2 text-zinc-500"
          >
            ...
          </span>
        ) : (
          <button
            key={`page-${item}`}
            onClick={() => goToPage(item)}
            className={`
              h-11 min-w-[44px] rounded-xl px-4 text-sm font-semibold
              transition-all duration-300
              ${
                currentPage === item
                  ? "bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-lg shadow-red-900/30"
                  : "border border-white/10 bg-white/5 text-zinc-300 hover:border-rose-500 hover:bg-rose-700/20 hover:text-white"
              }
            `}
          >
            {item}
          </button>
        )
      )}

      {/* Previous */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          flex h-11 w-11 items-center justify-center
          rounded-xl border border-rose-700/30 bg-white/5
          text-white transition
          hover:border-rose-500 hover:bg-rose-700/20
          disabled:cursor-not-allowed disabled:opacity-40
        "
      >
        <ChevronLeft size={18} />
      </button>
    </div>
  );
};

export default Pagination;