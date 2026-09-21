import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import api from "../services/api"
import { clearTokens, getAccessToken } from "../utils/token"

// 1. کاننکست را اکسپورت نکنید (فقط داخل همین فایل بماند)
const AuthContext = createContext(null)

// 2. تعریف کامپوننت پرووایدر
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // استفاده از useCallback برای جلوگیری از رندرهای بی مورد
  const fetchUser = useCallback(async () => {
    try {
      const token = getAccessToken()
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      const { data } = await api.get("/accounts/profile/")
      setUser(data)
    } catch (error) {
      console.error("Auth Error:", error)
      // اگر توکن منقضی شده بود یا مشکلی داشت
      if (error.response?.status === 401) {
        clearTokens()
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const logout = () => {
    clearTokens()
    setUser(null)
    window.location.href = "/login"
  }

  const value = {
    user,
    isAuth: !!user,
    loading,
    logout,
    refreshUser: fetchUser,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 3. تعریف هوک (اسم هوک حتماً با use شروع شود)
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
