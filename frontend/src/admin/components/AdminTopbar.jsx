import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Bell, ChevronDown, User, Settings, LogOut, Menu, Home } from "lucide-react"
import { useAuth } from "../../context/AuthContext"


export default function Topbar({ title = "داشبورد", onMenuClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState("")
  const { user, logout } = useAuth()
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const handleLogout = () => {
    logout()
    setOpen(false)
    // navigate("/login")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/admin/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-zinc-950/70 px-4 backdrop-blur-xl sm:px-6">
      {/* دکمه منوی موبایل - داخل Topbar */}
      <button
        onClick={onMenuClick}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 lg:hidden"
        aria-label="منو"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="hidden text-lg font-bold text-zinc-100 sm:block">{title}</h1>

      <form onSubmit={handleSearch} className="relative ms-auto w-full max-w-xs">
        <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو..."
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pr-9 pl-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-indigo-500/40 focus:bg-white/10"
        />
      </form>

      <button
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-zinc-100"
        aria-label="اعلان‌ها"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-zinc-950" />
      </button>

      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 py-1.5 pr-1.5 pl-2 text-sm transition hover:bg-white/10"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
            <User className="h-4 w-4" />
          </span>
          <span className="hidden font-medium text-zinc-200 sm:block">{user.username || "Admin"}</span>
          <ChevronDown className={`h-4 w-4 text-zinc-500 transition ${menuOpen ? "rotate-180" : ""}`} />
        </button>

        {menuOpen && (
          <div className="absolute left-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 py-1 shadow-xl backdrop-blur-xl">
            <div className="border-b border-white/10 px-4 py-3">
              <p className="text-sm font-medium text-zinc-100">{user?.username || "Admin"}</p>
              <p className="truncate text-xs text-zinc-500">{user?.email || "you dont set your email"}</p>
            </div>
            <button onClick={() => { setMenuOpen(false); navigate("/admin/profile") }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5">
              <User className="h-4 w-4 text-zinc-500" /> پروفایل
            </button>
            <button onClick={() => { setMenuOpen(false); navigate("/admin/settings") }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5">
              <Settings className="h-4 w-4 text-zinc-500" /> تنظیمات
            </button>
            <button onClick={() => { setMenuOpen(false); navigate("/") }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5">
              <Home className="h-4 w-4 text-zinc-500" /> صفحه اصلی
            </button>
            <button onClick={handleLogout} className="flex w-full items-center gap-2 border-t border-white/10 px-4 py-2 text-sm text-rose-300 transition hover:bg-rose-500/10">
              <LogOut className="h-4 w-4" /> خروج
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
