import CollectionCard from "./CollectionCard";
import CollectionSkeleton from "./CollectionSkeleton";
import Pagination from "../ui/Pagination";

export default function CollectionGrid({
  collections = [],
  loading = false,
  error = null,
  page = 1,
  setPage = () => {},
  pagination = null,
}) {
  if (loading) {
    return (
      <section className="mt-10">

        <div className="grid justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3">

          {Array.from({ length: 6 }).map((_, index) => (
            <CollectionSkeleton key={index} />
          ))}

        </div>

      </section>
    );
  }

  if (error) {
    return (
      <div
        className="
          mt-12
          rounded-3xl
          border
          border-red-500/20
          bg-red-500/10
          p-10
          text-center
        "
      >
        <h3 className="text-xl font-bold text-red-300">
          دریافت اطلاعات با خطا مواجه شد.
        </h3>

        <p className="mt-3 text-zinc-400">
          لطفاً چند دقیقه دیگر دوباره تلاش کنید.
        </p>
      </div>
    );
  }

  if (!collections.length) {
    return (
      <div
        className="
          mt-12
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-12
          text-center
        "
      >
        <h2 className="text-2xl font-bold text-white">
          کالکشنی پیدا نشد
        </h2>

        <p className="mt-4 text-zinc-400">
          جستجوی خود را تغییر دهید یا بعداً دوباره امتحان کنید.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-10">

      {/* تعداد نتایج */}

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-bold text-white">

          کالکشن‌ها

        </h2>

        <span className="text-sm text-zinc-500">

          {collections.length} نتیجه

        </span>

      </div>

      {/* Grid */}

      <div
        className="
          grid
          gap-6

          sm:grid-cols-2

          xl:grid-cols-3
        "
      >
        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
          />
        ))}
      </div>

      {/* Pagination */}

      {pagination?.totalPages > 1 && (
        <div className="mt-12">

          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            onChange={setPage}
          />

        </div>
      )}

    </section>
  );
}