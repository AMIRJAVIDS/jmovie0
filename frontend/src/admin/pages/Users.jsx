import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAdminUsers, deleteAdminUser } from "../services/adminApi"

export default function UserList() {
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [search, setSearch] = useState("")
  const [ordering, setOrdering] = useState("-date_joined")
  const [loading, setLoading] = useState(false)

  // debounce سرچ
  const [debouncedSearch, setDebouncedSearch] = useState("")
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    setLoading(true)
    getAdminUsers({ search: debouncedSearch, ordering })
      .then((data) => {
        // هم paginated هم آرایه خام
        setItems(data?.results ?? data ?? [])
      })
      .finally(() => setLoading(false))
  }, [debouncedSearch, ordering])

  const handleDelete = async (id) => {
    if (!window.confirm("این کاربر حذف شود؟")) return
    await deleteAdminUser(id)
    setItems((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto my-8 px-6 text-gray-100">
      {/* تولبار */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو..."
          className="flex-1 min-w-[200px] px-3.5 py-2.5 rounded-lg
                     bg-white/[0.06] border border-white/10 text-gray-100 text-sm
                     focus:outline-none focus:border-indigo-500
                     focus:ring-2 focus:ring-indigo-500/20 transition"
        />
        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="px-3.5 py-2.5 rounded-lg bg-white/[0.06]
                     border border-white/10 text-gray-100 text-sm
                     focus:outline-none focus:border-indigo-500 transition"
        >
          <option value="-date_joined">جدیدترین</option>
          <option value="date_joined">قدیمی‌ترین</option>
          <option value="username">نام کاربری</option>
          <option value="email">ایمیل</option>
        </select>
        <button
          onClick={() => navigate("/admin/users/new")}
          className="px-5 py-2.5 rounded-lg font-semibold text-white whitespace-nowrap
                     bg-gradient-to-br from-indigo-500 to-violet-500
                     hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40
                     transition-all"
        >
          + افزودن کاربر
        </button>
      </div>

      {/* جدول */}
      <table className="w-full border-collapse rounded-2xl overflow-hidden
                        bg-white/[0.04] border border-white/10 shadow-2xl">
        <thead className="bg-indigo-500/10">
          <tr>
            {["ID", "نام کاربری", "ایمیل", "نام کامل", "فعال", "Staff", "تاریخ عضویت", ""].map((h) => (
              <th key={h} className="px-4 py-3.5 text-right text-xs font-semibold text-gray-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u.id} className="border-t border-white/10 hover:bg-white/[0.06] transition">
              <td className="px-4 py-3.5 text-sm">{u.id}</td>
              <td className="px-4 py-3.5 text-sm">{u.username}</td>
              <td className="px-4 py-3.5 text-sm">{u.email}</td>
              <td className="px-4 py-3.5 text-sm">{`${u.first_name} ${u.last_name}`.trim() || "-"}</td>
              <td className="px-4 py-3.5 text-sm">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  u.is_active ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500"
                }`}>
                  {u.is_active ? "فعال" : "غیرفعال"}
                </span>
              </td>
              <td className="px-4 py-3.5 text-sm">{u.is_staff ? "✓" : "—"}</td>
              <td className="px-4 py-3.5 text-sm">{new Date(u.date_joined).toLocaleDateString("fa-IR")}</td>
              <td className="px-4 py-3.5 text-sm">
                <button
                  onClick={() => navigate(`/admin/users/${u.id}/edit`)}
                  className="ms-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/[0.06]
                             border border-white/10 hover:border-indigo-500
                             hover:text-indigo-500 transition"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="ms-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/[0.06]
                             border border-white/10 hover:border-red-500
                             hover:text-red-500 transition"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* حالت خالی / لودینگ */}
      {loading && (
        <p className="text-center text-gray-400 mt-6 text-sm">در حال بارگذاری...</p>
      )}
      {!loading && items.length === 0 && (
        <p className="text-center text-gray-400 mt-6 text-sm">کاربری یافت نشد.</p>
      )}
    </div>
  )
}
