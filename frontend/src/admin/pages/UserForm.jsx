import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  createAdminUser,
  getAdminUserById,
  updateAdminUser,
} from "../services/adminApi"

const initialForm = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  is_active: true,
  is_staff: false,
  is_vip: false,
}

export default function UserForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getAdminUserById(id).then((data) => {
      setForm({
        username: data.username || "",
        email: data.email || "",
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        password: "", // هیچ‌وقت prefill نمی‌شود
        is_active: data.is_active === true,
        is_staff: data.is_staff === true,
        is_vip: data.is_vip === true,
      })
    })
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    setGeneralError("")

    const payload = {
      username: form.username,
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      is_active: form.is_active,
      is_staff: form.is_staff,
      is_vip: form.is_vip,
    }
    if (form.password) payload.password = form.password

    try {
      if (isEdit) {
        await updateAdminUser(id, payload)
      } else {
        await createAdminUser(payload)
      }
      navigate("/admin/users")
    } catch (err) {
      const data = err?.response?.data
      if (data && typeof data === "object") {
        setErrors(data)
      } else {
        setGeneralError("خطا در ذخیره کاربر")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto my-8 p-8 rounded-2xl border border-white/10
                 bg-gradient-to-br from-indigo-500/10 to-white/[0.04]
                 backdrop-blur-xl shadow-2xl text-gray-100"
    >

      <h2 className="mb-6 text-xl font-bold bg-gradient-to-r from-indigo-500
                    to-violet-500 bg-clip-text text-transparent">
        {isEdit ? "ویرایش کاربر" : "افزودن کاربر"}
      </h2>

      <label className="block mb-4 text-sm text-gray-400 font-medium">
        نام کاربری
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full mt-2 px-3.5 py-3 rounded-lg bg-white/[0.06]
                    border border-white/10 text-gray-100 text-sm
                    focus:outline-none focus:border-indigo-500
                    focus:ring-2 focus:ring-indigo-500/20 transition"
        />
        {errors.username && <span className="block mt-1.5 text-xs text-red-500">{errors.username}</span>}
      </label>

      <label className="block mb-4 text-sm text-gray-400 font-medium">
        ایمیل
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full mt-2 px-3.5 py-3 rounded-lg bg-white/[0.06]
                    border border-white/10 text-gray-100 text-sm
                    focus:outline-none focus:border-indigo-500
                    focus:ring-2 focus:ring-indigo-500/20 transition"
        />
        {errors.email && <span className="block mt-1.5 text-xs text-red-500">{errors.email}</span>}
      </label>

      {/* فیلدهای جفتی در یک ردیف */}
      <div className="flex gap-3.5">
        <label className="flex-1 block mb-4 text-sm text-gray-400 font-medium">
          نام
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full mt-2 px-3.5 py-3 rounded-lg bg-white/[0.06]
                      border border-white/10 text-gray-100 text-sm
                      focus:outline-none focus:border-indigo-500
                      focus:ring-2 focus:ring-indigo-500/20 transition"
          />
        </label>
        <label className="flex-1 block mb-4 text-sm text-gray-400 font-medium">
          نام خانوادگی
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="w-full mt-2 px-3.5 py-3 rounded-lg bg-white/[0.06]
                      border border-white/10 text-gray-100 text-sm
                      focus:outline-none focus:border-indigo-500
                      focus:ring-2 focus:ring-indigo-500/20 transition"
          />
        </label>
      </div>

      <label className="block mb-4 text-sm text-gray-400 font-medium">
        رمز عبور {isEdit && "(خالی بذار اگه نمی‌خوای تغییر کنه)"}
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full mt-2 px-3.5 py-3 rounded-lg bg-white/[0.06]
                    border border-white/10 text-gray-100 text-sm
                    focus:outline-none focus:border-indigo-500
                    focus:ring-2 focus:ring-indigo-500/20 transition"
        />
        {errors.password && <span className="block mt-1.5 text-xs text-red-500">{errors.password}</span>}
      </label>



      <div className="flex gap-3 mb-5">
        <label className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-lg
                            bg-white/[0.06] border border-white/10 cursor-pointer
                            text-sm hover:border-indigo-500 transition">
            <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="w-[18px] h-[18px] accent-indigo-500 cursor-pointer"
            />
            فعال
        </label>

        <label className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-lg
                            bg-white/[0.06] border border-white/10 cursor-pointer
                            text-sm hover:border-indigo-500 transition">
            <input
            type="checkbox"
            name="is_staff"
            checked={form.is_staff}
            onChange={handleChange}
            className="w-[18px] h-[18px] accent-indigo-500 cursor-pointer"
            />
            کارمند (staff)
        </label>
        
        <label className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-lg
                            bg-white/[0.06] border border-white/10 cursor-pointer
                            text-sm hover:border-indigo-500 transition">
            <input
            type="checkbox"
            name="is_vip"
            checked={form.is_vip}
            onChange={handleChange}
            className="w-[18px] h-[18px] accent-indigo-500 cursor-pointer"
            />
            vip
        </label>
        
        </div>

        {generalError && <p className="mb-4 text-sm text-red-500">{generalError}</p>}

        <div className="flex gap-3">
        <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 rounded-lg font-semibold text-white
                    bg-gradient-to-br from-indigo-500 to-violet-500
                    hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all"
        >
            {saving ? "در حال ذخیره..." : "ذخیره"}
        </button>
        <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-3 rounded-lg font-semibold text-gray-400
                    bg-white/[0.06] border border-white/10
                    hover:text-gray-100 hover:border-gray-400 transition-all"
        >
            انصراف
        </button>
        </div>



    </form>
  )
}
