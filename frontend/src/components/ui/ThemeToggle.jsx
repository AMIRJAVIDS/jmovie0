import { Sun, Moon } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button className="w-7 h-7 text-[#030A1F] hover:text-[#27679f] dark:text-white dark:hover:text-[#98b2ff]" onClick={toggleTheme}>
    {theme === "dark" ? (
        <Sun className="w-7 h-7 opacity-80 hover:opacity-100" />
    ) : (
        <Moon className="w-7 h-7 opacity-80 hover:opacity-100" />
    )}
    </button>
  )
}
