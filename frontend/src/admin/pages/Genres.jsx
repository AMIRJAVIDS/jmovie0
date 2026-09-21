import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Loader2,
  Plus,
  Search,
  Pencil,
  Trash2,
  Tag,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  getAdminGenres,
  deleteAdminGenre,
} from "../services/adminApi"

const PAGE_SIZE = 12

// مودال تأیید حذف
function DeleteModal({ genre, loading, onCancel, onConfirm }) {
  if (!genre) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/15 text-rose-400">
            <Trash2 className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-100">حذف ژانر</h3>
        </div>
        <p className="mb-6 text-sm text-zinc-400">
          آیا از حذف ژانر «
          <span className="font-medium text-zinc-200">{genre.name}</span>»
          مطمئن هستید؟ این عمل قابل بازگشت نیست.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10 disabled:opacity-50"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-500 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            حذف
          </button>
        </div>
      </div>
    </div>
  )
}

export default function GenreList() {
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [debounced, setDebounced] = useState("")
  const [page, setPage] = useState(1)

  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // debounce جستجو
  const timer = useRef(null)
  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setDebounced(search.trim())
      setPage(1)
    }, 350)
    return () => clearTimeout(timer.current)
  }, [search])

  // واکشی لیست
  async function load() {
    setLoading(true)
    setError("")
    try {
      const data = await getAdminGenres()
      // پشتیبانی از پاسخ آرایه‌ای یا paginated
      setItems(Array.isArray(data) ? data : data?.results ?? [])
    } catch {
      setError("بارگذاری ژانرها با خطا مواجه شد.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // فیلتر + صفحه‌بندی سمت کلاینت
  const filtered = useMemo(() => {
    if (!debounced) return items
    const q = debounced.toLowerCase()
    return items.filter(
      (g) =>
        g.name?.toLowerCase().includes(q) ||
        g.slug?.toLowerCase().includes(q)
    )
  }, [items, debounced])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  async function confirmDelete() {
    if (!toDelete) return
    setDeleting(true)
    try {
      await deleteAdminGenre(toDelete.id)
      setItems((prev) => prev.filter((g) => g.id !== toDelete.id))
      setToDelete(null)
    } catch {
      setError("حذف ژانر با خطا مواجه شد.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">ژانرها</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            مدیریت ژانرهای سریال‌ها
          </p>
        </div>
        <Link
          to="/admin/genres/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4" />
          افزودن ژانر
        </Link>
      </div>

      {/* search */}
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی نام یا اسلاگ..."
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pr-10 pl-9 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-indigo-500/50"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
          </div>
        ) : pageItems.length === 0 ? (
          <div className="flex min-h-[30vh] flex-col items-center justify-center gap-2 text-zinc-500">
            <Tag className="h-8 w-8 opacity-50" />
            <p className="text-sm">
              {debounced ? "ژانری یافت نشد." : "هنوز ژانری ثبت نشده است."}
            </p>
          </div>
        ) : (
          <table className="w-full text-center text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-zinc-500">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">نام</th>
                <th className="px-4 py-3 font-medium">slug</th>
                <th className="px-4 py-3 font-medium text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((g, i) => (
                <tr
                  key={g.id}
                  className="border-b border-white/5 transition last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 text-zinc-500">
                    {(page - 1) * PAGE_SIZE + i + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-200">
                    {g.name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-xs text-zinc-400"
                    >
                      {g.slug}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/genres/${g.id}/edit`)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-indigo-300"
                        title="ویرایش"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setToDelete(g)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-rose-500/15 hover:text-rose-400"
                        title="حذف"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="text-sm text-zinc-400">
            صفحه {page} از {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      )}

      <DeleteModal
        genre={toDelete}
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
