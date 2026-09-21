import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import { AuthProvider } from "./context/AuthContext"
import "./styles/global.css"
import { ThemeProvider } from "./context/ThemeContext"
// cursor
import { CursorProvider } from "./context/CursorContext";
import PremiumCursor from "./components/cursor/PremiumCursor";
import CursorTrail from "./components/cursor/CursorTrail";
import CursorParticles from "./components/cursor/CursorParticles";

// ai chat bot
import AIChat from './components/ai/AIChat'

ReactDOM.createRoot(document.getElementById("root")).render(
  <CursorProvider>
    <AIChat />
    {/* Premium Cursor */}
    <PremiumCursor />
    <CursorTrail />
    <CursorParticles />
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <AppRoutes />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  </CursorProvider>
)

