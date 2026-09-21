import { NavLink, useNavigate } from "react-router-dom"
import { LayoutDashboard, Film, Clapperboard, Users, Tag, LogOut, X, Settings } from "lucide-react"

const NAV = [
  { to: "/admin", label: "داشبورد", icon: LayoutDashboard, end: true },
  { to: "/admin/movies", label: "فیلم‌ها", icon: Film },
  { to: "/admin/series", label: "سریال‌ها", icon: Clapperboard },
  { to: "/admin/users", label: "کاربران", icon: Users },
  { to: "/admin/genres", label: "ژانرها", icon: Tag },
]

function NavItem({ item, onClick }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          isActive
            ? "bg-indigo-500/15 text-indigo-300"
            : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="h-5 w-5 shrink-0" />
          <span>{item.label}</span>
          {isActive && <span className="ms-auto h-2 w-2 rounded-full bg-indigo-400" />}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <>
      {/* بک‌دراپ موبایل */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-screen w-64 flex-col border-l border-white/10 bg-zinc-950/80 backdrop-blur-xl transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* هدر - هم‌ارتفاع با Topbar */}
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
            <Clapperboard className="h-5 w-5" />
          </span>
          <span className="font-bold text-zinc-100">پنل مدیریت</span>
          <button
            onClick={onClose}
            className="ms-auto flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-200 lg:hidden"
            aria-label="بستن"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* لینک‌ها */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {NAV.map((item) => (
            <NavItem key={item.to} item={item} onClick={onClose} />
          ))}
        </nav>

        {/* فوتر */}
        <div className="border-t border-white/10 p-3">
          <NavLink
            to="/admin/settings"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-zinc-200"
          >
            <Settings className="h-5 w-5" /> تنظیمات
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
          >
            <LogOut className="h-5 w-5" /> خروج
          </button>
        </div>
      </aside>
    </>
  )
}
