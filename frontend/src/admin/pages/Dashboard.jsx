import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Loader2,
  Film,
  Clapperboard,
  Users,
  Tag,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Star,
} from "lucide-react"
import {
  getAdminSeries,
  getAdminMovies,
  getAdminUsers,
  getAdminGenres,
} from "../services/adminApi"

// نرمال‌سازی پاسخ (آرایه یا paginated)
const normalizeResponse = (response) => {
  // اگر ورودی آرایه باشد
  if (Array.isArray(response)) {
    return { items: response, total: response.length }
  }
  
  // اگر پاسخ دارای ساختار paginated باشد (مانند {count, next, previous, results})
  if (response && typeof response === 'object') {
    if (response.results) {
      return { 
        items: response.results, 
        total: response.count !== undefined ? response.count : response.results.length 
      }
    }
    // اگر خود آبجکت شامل آیتم‌ها باشد
    if (response.items) {
      return { items: response.items, total: response.total || response.items.length }
    }
  }
  
  // حالت پیش‌فرض
  return { items: [], total: 0 }
}

// کارت آمار
function StatCard({ icon: Icon, label, value, sub, accent, to }) {
  const body = (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20 hover:bg-white/[0.04]">
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl ${accent}`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-100">{value}</p>
          {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-opacity-15 ${accent}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {to && (
        <span className="relative mt-4 inline-flex items-center gap-1 text-xs text-zinc-500 transition group-hover:text-zinc-300">
          مشاهده
          <ArrowUpRight className="h-3 w-3" />
        </span>
      )}
    </div>
  )
  return to ? <Link to={to}>{body}</Link> : body
}

// نمودار میله‌ای مقایسه‌ای
function CompareBars({ items }) {
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div key={i.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-zinc-400">{i.label}</span>
            <span className="font-semibold text-zinc-200">{i.value}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full rounded-full ${i.color}`}
              style={{ width: `${(i.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [series, setSeries] = useState({ items: [], total: 0 })
  const [movies, setMovies] = useState({ items: [], total: 0 })
  const [users, setUsers] = useState({ items: [], total: 0 })
  const [genres, setGenres] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    (async () => {
      setLoading(true)
      setError("")
      try {
        const [s, m, u, g] = await Promise.all([
          getAdminSeries(),
          getAdminMovies(),
          getAdminUsers(),
          getAdminGenres(),
        ])
        
        setSeries(normalizeResponse(s))
        setMovies(normalizeResponse(m))
        setUsers(normalizeResponse(u))
        setGenres(normalizeResponse(g))
      } catch (err) {
        console.error("Dashboard error:", err)
        setError("بارگذاری اطلاعات داشبورد با خطا مواجه شد.")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const stats = useMemo(() => {
    const all = [...series.items, ...movies.items]
    const ratings = all
      .map((x) => Number(x.imdb_rating))
      .filter((n) => !Number.isNaN(n) && n > 0)
    const avgRating = ratings.length
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : "—"
    const ongoing = series.items.filter((s) => !s.is_ended).length
    const activeUsers = users.items.filter((u) => u.is_active).length
    return { avgRating, ongoing, activeUsers }
  }, [series, movies, users])

  const chartItems = useMemo(
    () => [
      { label: "فیلم‌ها", value: movies.total, color: "bg-rose-400" },
      { label: "سریال‌ها", value: series.total, color: "bg-indigo-400" },
      { label: "کاربران", value: users.total, color: "bg-sky-400" },
      { label: "ژانرها", value: genres.total, color: "bg-emerald-400" },
    ],
    [movies, series, users, genres]
  )

  const recent = useMemo(() => {
    const tagged = [
      ...series.items.map((s) => ({ ...s, _type: "series" })),
      ...movies.items.map((m) => ({ ...m, _type: "movie" })),
    ]
    return tagged.sort((a, b) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 6)
  }, [series, movies])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">داشبورد</h1>
        <p className="mt-1 text-sm text-zinc-500">نمای کلی محتوای پنل مدیریت</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* چهار کارت اصلی */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Film}
          label="فیلم‌ها"
          value={movies.total}
          accent="bg-rose-500 text-rose-300"
          to="/admin/movies"
        />
        <StatCard
          icon={Clapperboard}
          label="سریال‌ها"
          value={series.total}
          sub={`${stats.ongoing} در حال پخش`}
          accent="bg-indigo-500 text-indigo-300"
          to="/admin/series"
        />
        <StatCard
          icon={Users}
          label="کاربران"
          value={users.total}
          sub={`${stats.activeUsers} فعال`}
          accent="bg-sky-500 text-sky-300"
          to="/admin/users"
        />
        <StatCard
          icon={Tag}
          label="ژانرها"
          value={genres.total}
          accent="bg-emerald-500 text-emerald-300"
          to="/admin/genres"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* نمودار مقایسه‌ای */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 lg:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-zinc-200">
              توزیع محتوا
            </h2>
          </div>
          <CompareBars items={chartItems} />

          <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
            <span className="flex items-center gap-2 text-sm text-zinc-400">
              <Star className="h-4 w-4 text-amber-300" />
              میانگین امتیاز کل
            </span>
            <span className="text-lg font-bold text-amber-300">
              {stats.avgRating}
            </span>
          </div>
        </div>

        {/* دسترسی سریع */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-200">
            دسترسی سریع
          </h2>
          <div className="space-y-3">
            {[
              { to: "/admin/movies/new", label: "افزودن فیلم", c: "rose" },
              { to: "/admin/series/new", label: "افزودن سریال", c: "indigo" },
              { to: "/admin/genres/new", label: "افزودن ژانر", c: "emerald" },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className={`flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-${a.c}-500/40 hover:bg-${a.c}-500/10`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg bg-${a.c}-500/15 text-${a.c}-300`}
                >
                  <Plus className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-zinc-200">
                  {a.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* آخرین محتوا */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-200">
            آخرین محتوای افزوده‌شده
          </h2>
        </div>

        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            محتوایی ثبت نشده است.
          </p>
        ) : (
          <div className="divide-y divide-white/5">
            {recent.map((item) => (
              <Link
                key={`${item._type}-${item.id}`}
                to={`/admin/${item._type === "movie" ? "movies" : "series"}/${item.id}/edit`}
                className="flex items-center gap-3 py-3 transition hover:bg-white/[0.02]"
              >
                <div className="h-12 w-9 flex-shrink-0 overflow-hidden rounded-md bg-white/5">
                  {item.poster || item.poster_url ? (
                    <img
                      src={item.poster || item.poster_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-600">
                      {item._type === "movie" ? (
                        <Film className="h-4 w-4" />
                      ) : (
                        <Clapperboard className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-200">
                    {item.title}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {item._type === "movie" ? "فیلم" : "سریال"}
                  </p>
                </div>
                {item.imdb_rating > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-300">
                    <Star className="h-3 w-3 fill-amber-300" />
                    {item.imdb_rating}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}