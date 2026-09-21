import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/AdminSidebar"
import Topbar from "../components/AdminTopbar"

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100" dir="rtl">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* محتوا - در دسکتاپ به اندازه عرض سایدبار از راست فاصله می‌گیرد */}
      <div className="flex min-h-screen flex-col lg:pr-64">
        <Topbar title="پنل مدیریت" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
