import { Search, X } from "lucide-react";
import { useState } from "react";

import { useTheme } from "../../context/ThemeContext";
import UserMenu from "./UserMenu";
import SearchBar from "./SearchBar";

export default function MobileHeader() {
  const { theme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  

  return (
    <header
      className="
      fixed
      top-3
      left-1/2
      -translate-x-1/2
      z-50
      w-[96%]
      lg:hidden
      "
    >
      <div
        className="
        h-14
        rounded-2xl
        border border-white/20
        bg-white/10
        dark:bg-black/20
        backdrop-blur-xl
        shadow-lg
        shadow-black/20
        px-4
        flex
        items-center
        justify-between
        "
      >
        <a href="/" className="flex items-center gap-2">
          <img
            src={theme === "dark" ? "/Logo-red.svg" : "/Logo-dark.svg"}
            className="h-10"
            alt=""
          />

          <span className="font-black text-white text-xl">
            مووی
            <span className="text-rose-500">ورس</span>
          </span>
        </a>

        <div className="flex items-center gap-3">

          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="text-[#030A1F] dark:text-white"
          >
            {searchOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Search className="w-7 h-7" />
            )}
          </button>

          <UserMenu />
        </div>
      </div>
      {/* Search Bar */}
      <SearchBar
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </header>
  );
}