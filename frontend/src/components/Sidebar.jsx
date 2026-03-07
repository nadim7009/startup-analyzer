export default function Sidebar({ activeModule, setActiveModule, globalData }) {

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⬡" },
    { id: "ideas", label: "Idea Generator", icon: "◈" },
    { id: "market", label: "Market Analysis", icon: "◉" },
    { id: "competitors", label: "Competitors", icon: "◎" },
    { id: "skills", label: "Skills Gap", icon: "◐" },
  ];

  const ideas = globalData?.generatedIdeas?.length || 0;
  const markets = globalData?.marketAnalyses?.length || 0;
  const competitors = globalData?.competitors?.length || 0;

  const totalNotifs = ideas + markets + competitors;

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "260px",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        padding: "1.5rem 0",
      }}
    >

      {/* Logo */}

      <div style={{ padding: "0 1.5rem 2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>

          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background:
                "linear-gradient(135deg, var(--accent), var(--accent2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "white",
              fontFamily: "Syne, sans-serif",
            }}
          >
            S
          </div>

          <div>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "1rem",
                lineHeight: 1,
              }}
            >
              StartupAI
            </div>

            <div
              style={{
                fontSize: "0.68rem",
                color: "var(--text-muted)",
                marginTop: 2,
              }}
            >
              Analyzer v1.0
            </div>
          </div>

        </div>
      </div>

      {/* Navigation */}

      <nav style={{ flex: 1, padding: "0 0.8rem" }}>
        {navItems.map((item) => {

          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                padding: "0.75rem 1rem",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: isActive
                  ? "rgba(108,99,255,0.15)"
                  : "transparent",
                color: isActive
                  ? "var(--accent)"
                  : "var(--text-muted)",
                fontFamily: "Space Mono, monospace",
                fontSize: "0.82rem",
                marginBottom: "0.2rem",
                borderLeft: isActive
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
                transition: "all 0.2s",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>
                {item.icon}
              </span>

              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Stats */}

      <div
        style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid var(--border)",
          marginTop: "auto",
        }}
      >

        <div
          style={{
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            marginBottom: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Session Stats
        </div>

        {[
          { label: "Ideas Generated", val: ideas },
          { label: "Markets Analyzed", val: markets },
          { label: "Competitors Found", val: competitors },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.4rem",
            }}
          >
            <span
              style={{
                fontSize: "0.78rem",
                color: "var(--text-muted)",
              }}
            >
              {s.label}
            </span>

            <span
              style={{
                fontSize: "0.78rem",
                color: "var(--accent)",
                fontWeight: 700,
              }}
            >
              {s.val}
            </span>
          </div>
        ))}
      </div>

    </aside>
  );
}