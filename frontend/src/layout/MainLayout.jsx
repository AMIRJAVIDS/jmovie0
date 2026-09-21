import { Outlet } from "react-router-dom"

import Header from "./Header"
import Footer from "./Footer"
import BottomNavigation from "../components/navigation/BottomNavigation"


export default function MainLayout() {
  return (
      <div className="bg-[#1A0B0C]">
        <div className="min-h-screen flex flex-col pb-24">
          <Header />
            <main className="flex-1">
              <Outlet />
            </main>
          <Footer />
          <BottomNavigation />
        </div>
      </div>
  )
}
