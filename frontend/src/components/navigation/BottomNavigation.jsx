import { NavLink } from "react-router-dom";
import {
  House,
  Clapperboard,
  Tv,
  LibraryBig,
  User,
} from "lucide-react";

const items = [
  {
    label: "خانه",
    icon: House,
    path: "/home",
  },
  {
    label: "فیلم",
    icon: Clapperboard,
    path: "/movies",
  },
  {
    label: "سریال",
    icon: Tv,
    path: "/series",
  },
  {
    label: "مجموعه",
    icon: LibraryBig,
    path: "/collection",
  },
  {
    label: "پروفایل",
    icon: User,
    path: "/profile",
  },
];

export default function BottomNavigation() {
  return (
    <nav
      className="
      lg:hidden
      fixed
      bottom-3
      left-1/2
      -translate-x-1/2
      z-[100]
      w-[96%]
      "
    >
      <div
        className="
        h-16
        rounded-2xl
        border
        border-white/20
        bg-white/10
        dark:bg-black/20
        backdrop-blur-xl
        shadow-xl
        shadow-black/20
        px-2
        flex
        items-center
        justify-around
        "
      >
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                flex
                flex-col
                items-center
                justify-center
                gap-1
                transition
                ${
                  isActive
                    ? "text-[#27679f]"
                    : "text-[#030A1F] dark:text-white"
                }
                `
              }
            >
              <Icon className="w-5 h-5" />

              <span className="text-[11px]">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}