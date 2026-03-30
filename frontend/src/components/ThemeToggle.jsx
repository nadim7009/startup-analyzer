import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeProvider";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full transition-all duration-300 hover:scale-110"
      style={{
        background: "var(--surface2)",
        border: "1px solid var(--border)",
        color: "var(--text)"
      }}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5" style={{ color: "var(--text)" }} />
      )}
    </button>
  );
}