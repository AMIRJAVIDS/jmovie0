import DownloadCard from "../downloads/DownloadCard";

const DownloadSection = ({ downloads = [] }) => {
  if (!downloads.length) {
    return (
      <section className="mt-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 py-8 text-center">
          <p className="text-sm text-zinc-400">
            لینک دانلودی برای این فیلم ثبت نشده است.
          </p>
        </div>
      </section>
    );
  }

  // گروه‌بندی بر اساس کیفیت
  const groupedDownloads = downloads.reduce((acc, item) => {
    const quality = item.quality || "سایر";

    if (!acc[quality]) {
      acc[quality] = [];
    }

    acc[quality].push(item);

    return acc;
  }, {});

  return (
    <section className="mt-10">
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">
            دانلود فیلم
          </h2>

          <div className="h-px w-20 bg-gradient-to-l from-rose-500/40 to-transparent" />
        </div>

        <span className="rounded-full bg-rose-700/20 px-3 py-1 text-xs font-medium text-rose-300">
          {downloads.length} لینک
        </span>
      </div>

      {/* Download */}

      <div className="space-y-8">

        <div className="mt-8 border-t border-white/10 pt-6">

          {downloads.length ? (
            <div className="grid w-full gap-4 px-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {downloads.map((download) => (
                <DownloadCard
                  key={download.id}
                  download={download}
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
  </section>
  );
};

export default DownloadSection;