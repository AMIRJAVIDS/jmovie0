import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Tv, Plus, Search, Pencil, Trash2, Star, Calendar, Eye,
  Loader2, AlertTriangle, X, ChevronRight, ChevronLeft, Film,
  LayoutGrid, List,
} from "lucide-react"
import { getAdminMovies, deleteAdminMovie } from "../services/adminApi"

const PAGE_SIZE = 12

export default function MoviesList() {
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)

  const [search, setSearch] = useState("")
  const [debounced, setDebounced] = useState("")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [deleting, setDeleting] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const [view, setView] = useState(
    () => localStorage.getItem("moviesView") || "grid"
  )

  const debounceRef = useRef(null)

  // debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebounced(search.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [search])

  // fetch list
  useEffect(() => {
    let active = true
    setLoading(true)
    setError("")

    getAdminMovies({ search: debounced, page, page_size: PAGE_SIZE })
      .then((data) => {
        if (!active) return
        const results = data?.results ?? data ?? []
        setItems(Array.isArray(results) ? results : [])
        setCount(data?.count ?? results.length ?? 0)
      })
      .catch((err) => {
        if (!active) return
        setError(err?.message || "خطا در دریافت لیست فیلم‌ها")
        setItems([])
        setCount(0)
      })
      .finally(() => active && setLoading(false))

    return () => { active = false }
  }, [debounced, page])

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(count / PAGE_SIZE)),
    [count]
  )

  const toggleView = () => {
    setView((v) => {
      const next = v === "grid" ? "table" : "grid"
      localStorage.setItem("moviesView", next)
      return next
    })
  }

  const handleDelete = async () => {
    if (!deleting) return
    setBusyId(deleting.id)
    try {
      await deleteAdminMovie(deleting.id)
      setItems((prev) => prev.filter((x) => x.id !== deleting.id))
      setCount((c) => Math.max(0, c - 1))
      setDeleting(null)
    } catch (err) {
      setError(err?.message || "حذف فیلم ناموفق بود")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
              <Tv className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">مدیریت فیلم‌ها</h1>
              <p className="text-sm text-zinc-500">{count} فیلم ثبت شده</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleView}
              title={view === "grid" ? "نمایش جدولی" : "نمایش کارتی"}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10"
            >
              {view === "grid"
                ? <><List className="h-4 w-4" /> جدولی</>
                : <><LayoutGrid className="h-4 w-4" /> کارتی</>}
            </button>
            <Link to="/admin/movies/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600">
              <Plus className="h-4 w-4" /> افزودن فیلم
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی فیلم..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pr-10 pl-10 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-indigo-500/50 focus:bg-white/[0.05]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-zinc-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-zinc-600">
              <Tv className="h-8 w-8" />
            </div>
            <p className="mb-1 font-medium text-zinc-300">فیلمی یافت نشد</p>
            <p className="mb-5 text-sm text-zinc-500">
              {debounced ? "نتیجه‌ای برای جستجوی شما نبود" : "هنوز فیلمی اضافه نکرده‌اید"}
            </p>
            <Link to="/admin/movies/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600">
              <Plus className="h-4 w-4" /> افزودن فیلم
            </Link>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((s) => (
              <MoviesCard
                key={s.id}
                movies={s}
                busy={busyId === s.id}
                onEdit={() => navigate(`/admin/movies/${s.id}/edit`)}
                onDelete={() => setDeleting(s)}
              />
            ))}
          </div>
        ) : (
          <MoviesTable
            items={items}
            busyId={busyId}
            onEdit={(s) => navigate(`/admin/movies/${s.id}/edit`)}
            onDelete={(s) => setDeleting(s)}
          />
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" /> قبلی
            </button>
            <span className="px-3 text-sm text-zinc-500">
              صفحه {page} از {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 disabled:opacity-40"
            >
              بعدی <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleting && (
        <DeleteModal
          movies={deleting}
          busy={busyId === deleting.id}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

/* ---------- helpers ---------- */
function statusBadge(s) {
  return s.is_active
    ? { label: "فعال", cls: "bg-zinc-500/15 text-zinc-400" }
    : { label: "غیرفعال", cls: "bg-emerald-500/15 text-emerald-400" }
}

function yearOf(date) {
  if (!date) return "—"
  const y = new Date(date).getFullYear()
  return Number.isNaN(y) ? "—" : y
}

/* ---------- card view ---------- */
function MoviesCard({ movies, busy, onEdit, onDelete }) {
  const badge = statusBadge(movies)

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-white/20">
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
        {movies.poster || movies.poster_url ? (
          <img
            src={movies.poster || movies.poster_url}
            alt={movies.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-700">
            <Film className="h-10 w-10" />
          </div>
        )}

        <span className={`absolute right-2 top-2 rounded-md px-2 py-0.5 text-[11px] font-medium ${badge.cls}`}>
          {badge.label}
        </span>

        {/* hover actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-indigo-500"
            title="ویرایش"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={busy}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-rose-500 disabled:opacity-50"
            title="حذف"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-zinc-100" title={movies.title}>
          {movies.title}
        </h3>
        <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-amber-400" />
            {movies.imdb_rating ?? "—"}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {yearOf(movies.start_date)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {movies.views ?? 0}
          </span>
        </div>
      </div>
    </div>
  )
}


/* ---------- table view ---------- */
function MoviesTable({ items, busyId, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs text-zinc-500">
              <th className="px-4 py-3 font-medium">فیلم</th>
              <th className="px-4 py-3 font-medium">امتیاز</th>
              <th className="px-4 py-3 font-medium">سال</th>
              <th className="px-4 py-3 font-medium">بازدید</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
              <th className="px-4 py-3 font-medium">اقدامات</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => {
              const badge = statusBadge(s)
              const busy = busyId === s.id
              return (
                <tr key={s.id} className="border-b border-white/5 transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-9 shrink-0 overflow-hidden rounded-md bg-zinc-900">
                        {s.poster_url ? (
                          <img src={s.poster_url} alt={s.title} loading="lazy" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-700">
                            <Film className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-zinc-100">{s.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-400" />
                      {s.imdb_rating ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{yearOf(s.start_date)}</td>
                  <td className="px-4 py-3 text-zinc-400">{s.views ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(s)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-300 transition hover:bg-indigo-500 hover:text-white"
                        title="ویرایش"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(s)}
                        disabled={busy}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-300 transition hover:bg-rose-500 hover:text-white disabled:opacity-50"
                        title="حذف"
                      >
                        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}


/* ---------- delete modal ---------- */
function DeleteModal({ movies, busy, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-zinc-100">حذف فیلم</h3>
        <p className="mb-6 text-sm text-zinc-400">
          آیا از حذف <span className="font-semibold text-zinc-200">«{movies.title}»</span> مطمئن هستید؟ این عمل قابل بازگشت نیست.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={busy}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10 disabled:opacity-50"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            حذف
          </button>
        </div>
      </div>
    </div>
  )
}
