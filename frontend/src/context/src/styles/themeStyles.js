// Theme-based style helpers
export const getThemeStyles = (isDark) => ({
  // Background colors
  bg: isDark ? "#0a0a0f" : "#f8fafc",
  surface: isDark ? "#12121a" : "#ffffff",
  surface2: isDark ? "#1a1a26" : "#f1f5f9",
  surface3: isDark ? "#2a2a3d" : "#e2e8f0",
  
  // Text colors
  text: isDark ? "#e8e8f0" : "#0f172a",
  textMuted: isDark ? "#7878a0" : "#64748b",
  textLight: isDark ? "#a0a0c0" : "#94a3b8",
  
  // Border colors
  border: isDark ? "#2a2a3d" : "#e2e8f0",
  borderLight: isDark ? "#3a3a4d" : "#cbd5e1",
  
  // Accent colors (same for both modes)
  accent: "#6c63ff",
  accent2: "#ff6584",
  accent3: "#43e97b",
  accentHover: "#7c75ff",
  
  // Glow effects
  glow: isDark ? "rgba(108, 99, 255, 0.15)" : "rgba(108, 99, 255, 0.1)",
  glowStrong: isDark ? "rgba(108, 99, 255, 0.25)" : "rgba(108, 99, 255, 0.2)",
  
  // Gradients
  gradientPrimary: "linear-gradient(135deg, #6c63ff, #ff6584)",
  gradientSecondary: "linear-gradient(135deg, #38bdf8, #6c63ff)",
  gradientSuccess: "linear-gradient(135deg, #43e97b, #6feca0)",
});

// CSS variable injection
export const injectThemeVariables = (isDark) => {
  const styles = getThemeStyles(isDark);
  const root = document.documentElement;
  
  root.style.setProperty('--bg', styles.bg);
  root.style.setProperty('--surface', styles.surface);
  root.style.setProperty('--surface2', styles.surface2);
  root.style.setProperty('--border', styles.border);
  root.style.setProperty('--text', styles.text);
  root.style.setProperty('--text-muted', styles.textMuted);
  root.style.setProperty('--accent', styles.accent);
  root.style.setProperty('--accent2', styles.accent2);
  root.style.setProperty('--accent3', styles.accent3);
  root.style.setProperty('--glow', styles.glow);
};