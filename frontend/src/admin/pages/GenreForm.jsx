import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Loader2, ArrowRight, Save, Tag } from "lucide-react"
import {
  createAdminGenre,
  getAdminGenreById,
  updateAdminGenre,
} from "../services/adminApi"

const initialForm = { name: "", slug: "" }

// تبدیل نام به اسلاگ ساده (lowercase, dash)
function slugify(str) {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .replace(/-+/g, "-")
}

export default function GenreForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(initialForm)
  const [slugTouched, setSlugTouched] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})

  // لود ژانر در حالت ویرایش
  useEffect(() => {
    if (!isEdit) return
    let alive = true
    ;(async () => {
      try {
        const data = await getAdminGenreById(id)
        if (!alive) return
        setForm({ name: data.name ?? "", slug: data.slug ?? "" })
        setSlugTouched(true)
      } catch {
        if (alive) setError("بارگذاری ژانر با خطا مواجه شد.")
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [id, isEdit])

  function onName(value) {
    setForm((f) => ({
      ...f,
      name: value,
      slug: slugTouched ? f.slug : slugify(value),
    }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError("")
    setFieldErrors({})

    if (!form.name.trim()) {
      setFieldErrors({ name: "نام ژانر الزامی است." })
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
      }
      if (isEdit) await updateAdminGenre(id, payload)
      else await createAdminGenre(payload)
      navigate("/admin/genres")
    } catch (err) {
      const resp = err?.response?.data
      if (resp && typeof resp === "object") setFieldErrors(resp)
      setError("ذخیره ژانر با خطا مواجه شد.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/genres")}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        <h1 className="text-xl font-bold text-zinc-100">
          {isEdit ? "ویرایش ژانر" : "افزودن ژانر"}
        </h1>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6"
      >
        {/* name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            نام ژانر
          </label>
          <div className="relative">
            <Tag className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={form.name}
              onChange={(e) => onName(e.target.value)}
              placeholder="مثلاً: اکشن"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pr-10 pl-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-indigo-500/50"
            />
          </div>
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-rose-400">{fieldErrors.name}</p>
          )}
        </div>

        {/* slug */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            اسلاگ (slug)
          </label>
          <input
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true)
              setForm((f) => ({ ...f, slug: e.target.value }))
            }}
            dir="ltr"
            placeholder="action"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-indigo-500/50"
          />
          <p className="mt-1 text-xs text-zinc-500">
            اگر خالی بماند از روی نام ساخته می‌شود.
          </p>
          {fieldErrors.slug && (
            <p className="mt-1 text-xs text-rose-400">{fieldErrors.slug}</p>
          )}
        </div>

        {/* actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/admin/genres")}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10"
          >
            انصراف
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEdit ? "ذخیره تغییرات" : "افزودن ژانر"}
          </button>
        </div>
      </form>
    </div>
  )
}
