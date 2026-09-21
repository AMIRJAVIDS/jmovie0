import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  Film, Type, Link as LinkIcon, Calendar, Clock, Star,
  Image as ImageIcon, Tags, FileText, ArrowRight, Save, X, Check, Upload
} from "lucide-react"
import {
  createAdminMovie,
  getAdminMovieById,
  updateAdminMovie,
  getAdminGenres,
} from "../services/adminApi"

const initialForm = {
  title: "",
  original_title: "",
  slug: "",
  description: "",
  release_date: "",
  runtime: "",
  imdb_rating: "",
  imdb_id: "",
  poster: null,
  backdrop: null,
  poster_url: "",
  backdrop_url: "",
  trailer_url: "",
  is_active: true,
  is_published: true,
  genres: [],
}

export default function MovieForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)

  const [form, setForm] = useState(initialForm)
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})

  const pageTitle = useMemo(
    () => (isEditMode ? "ویرایش فیلم" : "افزودن فیلم جدید"),
    [isEditMode]
  )

  useEffect(() => {
    loadGenres()
  }, [])

  useEffect(() => {
    if (!isEditMode) return
    const loadMovie = async () => {
      try {
        setLoading(true)
        setError("")
        const data = await getAdminMovieById(id)
        setForm({
          title: data.title || "",
          original_title: data.original_title || "",
          slug: data.slug || "",
          description: data.description || "",
          release_date: data.release_date || "",
          runtime: data.runtime || "",
          imdb_rating: data.imdb_rating || "",
          imdb_id: data.imdb_id || "",
          poster: null,
          backdrop: null,
          poster_url: data.poster_url || data.poster || "",
          backdrop_url: data.backdrop_url || data.backdrop || "",
          trailer_url: data.trailer_url || "",
          is_active: data.is_active !== false,
          is_published: data.is_published !== false,
          genres: Array.isArray(data.genres)
            ? data.genres.map((g) => Number(g?.id ?? g))
            : [],
        })
      } catch (err) {
        console.error("Load movie error:", err)
        setError("خطا در دریافت اطلاعات فیلم")
      } finally {
        setLoading(false)
      }
    }
    loadMovie()
  }, [id, isEditMode])

  const loadGenres = async () => {
    try {
      const data = await getAdminGenres()
      setGenres(Array.isArray(data) ? data : data.results || [])
    } catch (err) {
      console.error("Load genres error:", err)
    }
  }

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target
    let newValue
    if (type === "checkbox") newValue = checked
    else if (type === "file") newValue = files?.[0] || null
    else newValue = value

    setForm((prev) => ({ ...prev, [name]: newValue }))
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const setBool = (name, val) =>
    setForm((prev) => ({ ...prev, [name]: val }))

  const toggleGenre = (genreId) => {
    const gid = Number(genreId)
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.includes(gid)
        ? prev.genres.filter((g) => g !== gid)
        : [...prev.genres, gid],
    }))
    setFieldErrors((prev) => ({ ...prev, genres: undefined }))
  }

  const buildPayload = () => {
    const fd = new FormData()
    fd.append("title", form.title || "")
    fd.append("original_title", form.original_title || "")
    fd.append("slug", form.slug || "")
    fd.append("description", form.description || "")
    fd.append("release_date", form.release_date || "")
    fd.append("runtime", form.runtime ? String(Number(form.runtime)) : "")
    fd.append("imdb_rating", form.imdb_rating ? String(Number(form.imdb_rating)) : "")
    fd.append("imdb_id", form.imdb_id || "")
    fd.append("trailer_url", form.trailer_url || "")
    fd.append("is_active", String(form.is_active))
    fd.append("is_published", String(form.is_published))
    form.genres
      .filter((g) => Number.isFinite(Number(g)))
      .forEach((g) => fd.append("genre_ids", String(Number(g))))

    if (form.poster instanceof File) fd.append("poster", form.poster)
      if (form.backdrop instanceof File) fd.append("backdrop", form.backdrop)
    if (form.poster_url) fd.append("poster_url", form.poster_url)
      if (form.backdrop_url) fd.append("backdrop_url", form.backdrop_url)
    return fd
}


  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setSaving(true)
      setError("")
      setFieldErrors({})
      const payload = buildPayload()
      if (isEditMode) await updateAdminMovie(id, payload)
      else await createAdminMovie(payload)
      navigate("/admin/movies")
    } catch (err) {
      console.error("Save movie error:", err)
      const data = err?.response?.data
      if (data && typeof data === "object") {
        setFieldErrors(data)
        setError("لطفاً خطاهای فرم را بررسی کن.")
      } else {
        setError("خطا در ذخیره فیلم")
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-zinc-400">
          <div className="h-5 w-5 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
          در حال دریافت اطلاعات فیلم...
        </div>
      </div>
    )
  }

  const posterPreview =
    form.poster instanceof File ? URL.createObjectURL(form.poster) : form.poster_url
  const backdropPreview =
    form.backdrop instanceof File ? URL.createObjectURL(form.backdrop) : form.backdrop_url

  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0a0f] text-white p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="grid place-items-center h-12 w-12 rounded-2xl bg-gradient-to-br from-red-500 to-purple-600 shadow-lg shadow-red-500/20">
              <Film size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-l from-white to-zinc-400 bg-clip-text text-transparent">
                {pageTitle}
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">اطلاعات فیلم را وارد و ذخیره کن</p>
            </div>
          </div>
          <Link
            to="/admin/movies"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.07] transition-all"
          >
            <ArrowRight size={16} />
            بازگشت به لیست
          </Link>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 backdrop-blur-sm">
            <X size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} dir="rtl" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ===== Sidebar: previews ===== */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl">
              <SectionTitle icon={ImageIcon} title="تصاویر" />
              <PosterUpload preview={posterPreview} form={form} onChange={handleChange} />
              <BackdropUpload preview={backdropPreview} form={form} onChange={handleChange} />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl space-y-4">
              <SectionTitle icon={Check} title="وضعیت انتشار" />
              <Toggle label="فعال باشد" desc="نمایش در سایت" checked={form.is_active} onChange={(v) => setBool("is_active", v)} />
              <Toggle label="منتشر شده" desc="در دسترس کاربران" checked={form.is_published} onChange={(v) => setBool("is_published", v)} />
            </div>
          </div>

          {/* ===== Main fields ===== */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 md:p-6 backdrop-blur-xl">
              <SectionTitle icon={Type} title="اطلاعات اصلی" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field icon={Type} label="عنوان فارسی" name="title" value={form.title} onChange={handleChange} error={fieldErrors.title} required />
                <Field icon={Type} label="عنوان انگلیسی" name="original_title" value={form.original_title} onChange={handleChange} error={fieldErrors.original_title} />
                <Field icon={LinkIcon} label="Slug" name="slug" value={form.slug} onChange={handleChange} error={fieldErrors.slug} placeholder="example-movie-2025" />
                <Field icon={Star} label="IMDb ID" name="imdb_id" value={form.imdb_id} onChange={handleChange} error={fieldErrors.imdb_id} placeholder="tt1234567" />
                <Field icon={Calendar} label="تاریخ انتشار" name="release_date" type="date" value={form.release_date} onChange={handleChange} error={fieldErrors.release_date} />
                <Field icon={Clock} label="مدت (دقیقه)" name="runtime" type="number" value={form.runtime} onChange={handleChange} error={fieldErrors.runtime} placeholder="120" />
                <Field icon={Star} label="امتیاز" name="imdb_rating" type="number" step="0.1" value={form.imdb_rating} onChange={handleChange} error={fieldErrors.imdb_rating} placeholder="8.5" />
                <Field icon={LinkIcon} label="لینک تریلر" name="trailer_url" value={form.trailer_url} onChange={handleChange} error={fieldErrors.trailer_url} />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 md:p-6 backdrop-blur-xl">
              <SectionTitle icon={Tags} title="ژانرها" />
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => {
                  const gid = Number(g.id)
                  const active = form.genres.includes(gid)
                  return (
                    <button
                      key={gid} type="button" onClick={() => toggleGenre(gid)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-gradient-to-l from-red-500 to-purple-600 text-white shadow-lg shadow-red-500/25 scale-105"
                          : "bg-white/[0.04] text-zinc-400 border border-white/10 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      {g.name}
                    </button>
                  )
                })}

              </div>
              <FieldError error={fieldErrors.genres} />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 md:p-6 backdrop-blur-xl">
              <SectionTitle icon={FileText} title="خلاصه داستان" />
              <textarea
                name="description" value={form.description} onChange={handleChange} rows={6}
                className="w-full resize-y rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="خلاصه‌ای از داستان فیلم بنویس..."
              />
              <FieldError error={fieldErrors.description} />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
              <Link
                to="/admin/movies"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-zinc-300 hover:bg-white/[0.07] transition-all"
              >
                <X size={16} /> انصراف
              </Link>
              <button
                type="submit" disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-red-500 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    در حال ذخیره...
                  </>
                ) : (
                  <><Save size={16} /> ذخیره فیلم</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}



function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
      <Icon size={18} className="text-red-400" />
      <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
    </div>
  )
}

function Field({ icon: Icon, label, name, value, onChange, error, type = "text", required, placeholder = "", step }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
        {Icon && <Icon size={13} />}
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        required={required} placeholder={placeholder} step={step}
        className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all [color-scheme:dark]"
      />
      <FieldError error={error} />
    </div>
  )
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-zinc-200">{label}</p>
        {desc && <p className="text-xs text-zinc-500">{desc}</p>}
      </div>
      <button
        type="button" onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
          checked ? "bg-gradient-to-l from-red-500 to-purple-600" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
            checked ? "right-0.5" : "right-[22px]"
          }`}
        />
      </button>
    </div>
  )
}

function PosterUpload({ preview, form, onChange }) {
  return (
    <div className="mb-5">
      <label className="block text-xs text-zinc-400 mb-2">پوستر (عمودی)</label>
      <div className="group relative aspect-[2/3] rounded-2xl overflow-hidden border-2 border-dashed border-white/10 hover:border-red-500/50 bg-black/30 transition-all">
        {preview ? (
          <img src={preview} alt="poster" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-zinc-500">
            <Upload size={28} className="mb-2" />
            <span className="text-xs">انتخاب پوستر</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors grid place-items-center opacity-0 group-hover:opacity-100">
          <Upload size={24} className="text-white" />
        </div>
        <input type="file" name="poster" accept="image/*" onChange={onChange} className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>
      <input
        type="url" name="poster_url" value={form.poster_url} onChange={onChange}
        placeholder="یا لینک تصویر..."
        className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-red-500/50 transition-all"
      />
    </div>
  )
}

function BackdropUpload({ preview, form, onChange }) {
  return (
    <div>
      <label className="block text-xs text-zinc-400 mb-2">بک‌دراپ (افقی)</label>
      <div className="group relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-white/10 hover:border-red-500/50 bg-black/30 transition-all">
        {preview ? (
          <img src={preview} alt="backdrop" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-zinc-500">
            <ImageIcon size={24} className="mb-1" />
            <span className="text-xs">انتخاب بک‌دراپ</span>
          </div>
        )}
        <input type="file" name="backdrop" accept="image/*" onChange={onChange} className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>
      <input
        type="url" name="backdrop_url" value={form.backdrop_url} onChange={onChange}
        placeholder="یا لینک تصویر..."
        className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-red-500/50 transition-all"
      />
    </div>
  )
}

function FieldError({ error }) {
  if (!error) return null
  const items = Array.isArray(error) ? error : [error]
  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <p key={i} className="text-xs text-red-400">{String(item)}</p>
      ))}
    </div>
  )
}
