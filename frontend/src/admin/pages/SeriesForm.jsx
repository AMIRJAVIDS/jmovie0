import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  Tv, Image as ImageIcon, Star, Calendar, Hash, Type, FileText,
  Tag, Upload, X, Save, Loader2, Link2, Eye, CheckCircle2, ArrowRight,
} from "lucide-react"
import {
  createAdminSeries,
  getAdminSeriesById,
  updateAdminSeries,
  getAdminGenres,
} from "../services/adminApi"

// اگر ژانرها ذخیره نشد، این را به "genre_ids" تغییر بده
const GENRE_FIELD = "genre_ids"

const initialForm = {
  imdb_id: "",
  title: "",
  original_title: "",
  slug: "",
  description: "",
  views: "",
  start_date: "",
  end_date: "",
  imdb_rating: "",
  poster: null,
  backdrop: null,
  poster_url: "",
  backdrop_url: "",
  trailer_url: "",
  is_ended: false,
  genres: [],
}

/* ---------- UI helpers ---------- */
const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm " +
  "text-zinc-100 placeholder-zinc-500 outline-none transition " +
  "focus:border-indigo-400/50 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/20"

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-zinc-200">
      <Icon className="h-4 w-4 text-indigo-400" />
      <h3 className="text-sm font-semibold uppercase tracking-wide">{children}</h3>
    </div>
  )
}

function Field({ label, icon: Icon, required, children, hint, error }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
        {required && <span className="text-rose-400">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-zinc-500">{hint}</span>}
      <FieldError error={error} />
    </label>
  )
}

function FieldError({ error }) {
  if (!error) return null
  const items = Array.isArray(error) ? error : [error]
  return (
    <span className="mt-1 block space-y-0.5">
      {items.map((it, i) => (
        <span key={i} className="block text-[11px] text-rose-400">
          {String(it)}
        </span>
      ))}
    </span>
  )
}

function Toggle({ label, desc, checked, onChange, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-right transition hover:bg-white/10"
    >
      <span className="flex items-center gap-3">
        {Icon && <Icon className="h-4 w-4 text-indigo-400" />}
        <span>
          <span className="block text-sm font-medium text-zinc-100">{label}</span>
          {desc && <span className="block text-[11px] text-zinc-500">{desc}</span>}
        </span>
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-indigo-500" : "bg-zinc-700"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  )
}

function ImageUpload({ label, fileName, urlName, fileValue, urlValue, onPickFile, onChangeUrl, onClear, aspect = "aspect-[2/3]" }) {
  const ref = useRef(null)
  const preview = fileValue instanceof File ? URL.createObjectURL(fileValue) : urlValue || ""
  return (
    <div className="space-y-3">
      <span className="block text-xs font-medium text-zinc-400">{label}</span>
      <div className={`group relative ${aspect} w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5`}>
        {preview ? (
          <>
            <img src={preview} alt={label} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={onClear}
              className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-rose-500"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-500 transition hover:text-indigo-400"
          >
            <Upload className="h-6 w-6" />
            <span className="text-xs">انتخاب تصویر</span>
          </button>
        )}
      </div>
      <input ref={ref} type="file" name={fileName} accept="image/*" className="hidden"
        onChange={(e) => e.target.files?.[0] && onPickFile(e.target.files[0])} />
      <div className="relative">
        <Link2 className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
        <input type="url" name={urlName} value={urlValue} onChange={onChangeUrl}
          placeholder="یا لینک تصویر..." className={inputCls + " pr-9"} />
      </div>
    </div>
  )
}

/* ---------- Main ---------- */
export default function SeriesForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)

  const [genres, setGenres] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})

  const pageTitle = useMemo(() => (isEditMode ? "ویرایش سریال" : "افزودن سریال جدید"), [isEditMode])

  useEffect(() => { loadGenres() }, [])

  useEffect(() => {
    if (!isEditMode) return
    const loadSeries = async () => {
      try {
        setLoading(true); setError("")
        const data = await getAdminSeriesById(id)
        setForm({
          imdb_id: data.imdb_id || "",
          title: data.title || "",
          original_title: data.original_title || "",
          slug: data.slug || "",
          description: data.description || "",
          views: data.views ?? "",
          start_date: data.start_date || "",
          end_date: data.end_date || "",
          imdb_rating: data.imdb_rating ?? "",
          poster: null,
          backdrop: null,
          poster_url: data.poster_url || data.poster || "",
          backdrop_url: data.backdrop_url || data.backdrop || "",
          trailer_url: data.trailer_url || "",
          is_ended: data.is_ended === true,
          genres: Array.isArray(data.genres) ? data.genres.map((g) => Number(g?.id ?? g)) : [],
        })
      } catch (err) {
        console.error("Load series error:", err)
        setError("خطا در دریافت اطلاعات سریال")
      } finally { setLoading(false) }
    }
    loadSeries()
  }, [id, isEditMode])

  const loadGenres = async () => {
    try {
      const data = await getAdminGenres()
      setGenres(Array.isArray(data) ? data : data.results || [])
    } catch (err) { console.error("Load genres error:", err) }
  }

  const set = (name) => (e) => {
    const v = e?.target ? e.target.value : e
    setForm((f) => ({ ...f, [name]: v }))
    setFieldErrors((p) => ({ ...p, [name]: undefined }))
  }

  const toggleGenre = (gid) => {
    const n = Number(gid)
    setForm((f) => ({
      ...f,
      genres: f.genres.includes(n) ? f.genres.filter((x) => x !== n) : [...f.genres, n],
    }))
    setFieldErrors((p) => ({ ...p, [GENRE_FIELD]: undefined, genres: undefined }))
  }

  const buildPayload = () => {
    const fd = new FormData()
    const appendIf = (k, v) => {
      if (v !== "" && v !== null && v !== undefined) fd.append(k, v)
    }
    fd.append("imdb_id", form.imdb_id || "")
    fd.append("title", form.title || "")
    appendIf("original_title", form.original_title)
    appendIf("slug", form.slug)
    appendIf("description", form.description)
    appendIf("views", form.views ? String(Number(form.views)) : "")
    appendIf("start_date", form.start_date)
    appendIf("end_date", form.end_date)
    appendIf("imdb_rating", form.imdb_rating ? String(Number(form.imdb_rating)) : "")
    appendIf("trailer_url", form.trailer_url)
    fd.append("is_ended", String(form.is_ended))

    form.genres
      .filter((g) => Number.isFinite(Number(g)))
      .forEach((g) => fd.append(GENRE_FIELD, String(Number(g))))

    if (form.poster instanceof File) fd.append("poster", form.poster)
    if (form.backdrop instanceof File) fd.append("backdrop", form.backdrop)
    if (form.poster_url) fd.append("poster_url", form.poster_url)
    if (form.backdrop_url) fd.append("backdrop_url", form.backdrop_url)
    return fd
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true); setError(""); setFieldErrors({})
      const payload = buildPayload()
      if (isEditMode) await updateAdminSeries(id, payload)
      else await createAdminSeries(payload)
      navigate("/admin/series")
    } catch (err) {
      console.error("Save series error:", err)
      const data = err?.response?.data
      if (data && typeof data === "object") {
        setFieldErrors(data)
        setError("لطفاً خطاهای فرم را بررسی کن.")
      } else setError("خطا در ذخیره سریال")
    } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-300">
        <Loader2 className="ml-2 h-5 w-5 animate-spin text-indigo-400" />
        در حال دریافت اطلاعات سریال...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} dir="rtl" className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-500/15 p-3 ring-1 ring-indigo-500/30">
              <Tv className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{pageTitle}</h1>
              <p className="text-sm text-zinc-500">اطلاعات سریال را وارد و ذخیره کن.</p>
            </div>
          </div>
          <Link to="/admin/series"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5">
            <ArrowRight className="h-4 w-4" /> بازگشت به لیست
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
              <SectionTitle icon={Type}>اطلاعات پایه</SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="عنوان" icon={Type} required error={fieldErrors.title}>
                  <input className={inputCls} value={form.title} onChange={set("title")} placeholder="نام سریال" />
                </Field>
                <Field label="عنوان اصلی" icon={Type} error={fieldErrors.original_title}>
                  <input className={inputCls} value={form.original_title} onChange={set("original_title")} placeholder="Original title" />
                </Field>
                <Field label="IMDb ID" icon={Hash} required error={fieldErrors.imdb_id}>
                  <input className={inputCls} value={form.imdb_id} onChange={set("imdb_id")} placeholder="tt1234567" />
                </Field>
                <Field label="Slug" icon={Link2} error={fieldErrors.slug}>
                  <input className={inputCls} value={form.slug} onChange={set("slug")} placeholder="series-slug" />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="خلاصه داستان" icon={FileText} error={fieldErrors.description}>
                  <textarea rows={4} className={inputCls + " resize-y"} value={form.description}
                    onChange={set("description")} placeholder="خلاصه‌ی داستان..." />
                </Field>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
              <SectionTitle icon={Star}>تاریخ، امتیاز و رسانه</SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="تاریخ شروع" icon={Calendar} error={fieldErrors.start_date}>
                  <input type="date" className={inputCls} value={form.start_date} onChange={set("start_date")} />
                </Field>
                <Field label="تاریخ پایان" icon={Calendar} hint="در صورت ادامه‌دار بودن خالی بگذار" error={fieldErrors.end_date}>
                  <input type="date" className={inputCls} value={form.end_date} onChange={set("end_date")} />
                </Field>
                <Field label="امتیاز IMDb" icon={Star} error={fieldErrors.imdb_rating}>
                  <input type="number" step="0.1" min="0" max="10" className={inputCls}
                    value={form.imdb_rating} onChange={set("imdb_rating")} placeholder="8.5" />
                </Field>
                <Field label="بازدید" icon={Eye} error={fieldErrors.views}>
                  <input type="number" min="0" className={inputCls} value={form.views}
                    onChange={set("views")} placeholder="0" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="لینک تریلر" icon={Link2} error={fieldErrors.trailer_url}>
                    <input type="url" className={inputCls} value={form.trailer_url}
                      onChange={set("trailer_url")} placeholder="https://youtube.com/..." />
                  </Field>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
              <SectionTitle icon={Tag}>ژانرها</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => {
                  const active = form.genres.includes(Number(g.id))
                  return (
                    <button key={g.id} type="button" onClick={() => toggleGenre(g.id)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                        active
                          ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                          : "border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10"
                      }`}>
                      {g.name || g.title}
                    </button>
                  )
                })}
                {genres.length === 0 && <span className="text-xs text-zinc-500">ژانری موجود نیست</span>}
              </div>
              <FieldError error={fieldErrors[GENRE_FIELD] || fieldErrors.genres} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
              <SectionTitle icon={ImageIcon}>تصاویر</SectionTitle>
              <div className="space-y-6">
                <ImageUpload label="پوستر (2:3)" fileName="poster" urlName="poster_url"
                  fileValue={form.poster} urlValue={form.poster_url}
                  onPickFile={(file) => setForm((f) => ({ ...f, poster: file }))}
                  onChangeUrl={set("poster_url")}
                  onClear={() => setForm((f) => ({ ...f, poster: null, poster_url: "" }))} />
                <ImageUpload label="بک‌گراند (16:9)" aspect="aspect-video" fileName="backdrop" urlName="backdrop_url"
                  fileValue={form.backdrop} urlValue={form.backdrop_url}
                  onPickFile={(file) => setForm((f) => ({ ...f, backdrop: file }))}
                  onChangeUrl={set("backdrop_url")}
                  onClear={() => setForm((f) => ({ ...f, backdrop: null, backdrop_url: "" }))} />
              </div>
              <FieldError error={fieldErrors.poster || fieldErrors.backdrop} />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
              <SectionTitle icon={CheckCircle2}>وضعیت</SectionTitle>
              <Toggle label="سریال به اتمام رسیده" desc="پخش این سریال تمام شده است" icon={CheckCircle2}
                checked={form.is_ended} onChange={(v) => setForm((f) => ({ ...f, is_ended: v }))} />
            </div>

            <button type="submit" disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "در حال ذخیره..." : isEditMode ? "بروزرسانی سریال" : "ذخیره سریال"}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
