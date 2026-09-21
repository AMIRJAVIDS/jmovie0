import { Download, Lock, Globe, Languages } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const DownloadButton = ({ download }) => {

  const isLocked = !download.url;

  
  return (
    <div className="space-y-4">

      {/* دکمه دانلود */}

      {download.url ? (
        <a
          href={download.url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-rose-700
            to-rose-500
            px-4
            py-3
            text-sm
            font-semibold
            text-white
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:from-rose-800
            hover:to-rose-600
          "
        >
          <Download size={18} />
          دانلود فایل
        </a>
      ) : (
        <Link
          to={`/login`}
          state={{ from: location.pathname + location.search }}
          className="flex items-center justify-center gap-2 rounded-xl bg-zinc-700/70 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-600"
        >
          {/* <span>🔒</span> */}
          <Lock size={18} />
          <span>برای دانلود وارد شوید</span>
        </Link>
      )}
    </div>
  );
};

export default DownloadButton;