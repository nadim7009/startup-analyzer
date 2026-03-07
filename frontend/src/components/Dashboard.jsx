export default function Dashboard({ globalData, setActiveModule }) {
  const quickActions = [
    { id: "ideas", label: "Generate Startup Idea", icon: "◈", color: "var(--accent)", desc: "AI-powered idea creation with viability scoring" },
    { id: "market", label: "Market Research", icon: "◉", color: "#38bdf8", desc: "Analyze markets for any industry or region" },
    { id: "competitors", label: "Competitor Intel", icon: "◎", color: "var(--accent2)", desc: "Identify and analyze key competitors" },
    { id: "skills", label: "Skills Gap", icon: "◐", color: "var(--accent3)", desc: "Compare your skills with startup needs" },
  ];

  const tips = [
    "Combine two unrelated industries for breakthrough startup ideas",
    "Focus on markets with 15-25% annual growth for best opportunities",
    "Skills gaps in AI/ML are the biggest bottleneck for tech startups in 2026",
    "B2B SaaS has 3x higher survival rate than B2C consumer apps",
  ];
  const tip = tips[Math.floor(Date.now() / 1000) % tips.length];

  return (
    <div>
      <div className="section-header">
        <h2>Mission Control</h2>
        <p>AI-powered startup intelligence platform — analyze, compare, and launch smarter.</p>
      </div>

      {/* Stats Row */}
      <div className="grid-3" style={{ marginBottom: "2rem" }}>
        {[
          { label: "Ideas Generated", val: globalData.generatedIdeas.length, icon: "◈", color: "var(--accent)" },
          { label: "Markets Analyzed", val: globalData.marketAnalyses.length, icon: "◉", color: "#38bdf8" },
          { label: "Competitors Tracked", val: globalData.competitors.length, icon: "◎", color: "var(--accent2)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: `${s.color}20`, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "1.4rem", color: s.color,
            }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: "2rem", fontFamily: "Syne, sans-serif", fontWeight: 800, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.1rem", marginBottom: "1rem", color: "var(--text-muted)" }}>Quick Actions</h3>
        <div className="grid-2">
          {quickActions.map((a) => (
            <button
              key={a.id}
              onClick={() => setActiveModule(a.id)}
              style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 16, padding: "1.3rem", cursor: "pointer",
                display: "flex", alignItems: "flex-start", gap: "1rem",
                transition: "all 0.2s", textAlign: "left",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.boxShadow = `0 0 24px ${a.color}25`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                background: `${a.color}20`, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "1.2rem", color: a.color,
              }}>{a.icon}</div>
              <div>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: 4 }}>{a.label}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{a.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tip Box */}
      <div style={{
        background: "linear-gradient(135deg, rgba(108,99,255,0.1), rgba(255,101,132,0.07))",
        border: "1px solid rgba(108,99,255,0.3)", borderRadius: 16, padding: "1.2rem 1.5rem",
        display: "flex", gap: "1rem", alignItems: "flex-start",
      }}>
        <span style={{ fontSize: "1.4rem" }}>💡</span>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.85rem", marginBottom: 4 }}>AI Insight</div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{tip}</div>
        </div>
      </div>

      {/* Recent Activity */}
      {globalData.generatedIdeas.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.1rem", marginBottom: "1rem" }}>Recent Ideas</h3>
          {globalData.generatedIdeas.slice(-3).reverse().map((idea, i) => (
            <div key={i} className="card" style={{ marginBottom: "0.8rem", cursor: "pointer" }} onClick={() => setActiveModule("ideas")}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: "0.9rem" }}>
                  {idea.industry} — {idea.timestamp}
                </div>
                <span className="badge badge-purple">Generated</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
