import { useState } from "react";
import { callClaude } from "../utils/ai";

export default function CompetitorIntelligence({ updateGlobalData }) {
  const [form, setForm] = useState({ idea: "", region: "Bangladesh", focusArea: "funding" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const analyze = async () => {
    if (!form.idea.trim()) { setError("Please describe your startup idea."); return; }
    setError(""); setLoading(true); setResult("");
    try {
      const prompt = `You are a competitive intelligence analyst. Analyze competitors for this startup idea:

Startup Idea: "${form.idea}"
Target Region: ${form.region}

Provide:
1. TOP 5 DIRECT COMPETITORS
   For each competitor provide:
   - Company name & founding year
   - Headquarters & market presence
   - Estimated funding raised (if known)
   - Key features/products
   - Strengths
   - Weaknesses
   - Customer reviews sentiment (positive/negative highlights)
   - Market share estimate

2. TOP 3 INDIRECT COMPETITORS (alternative solutions customers use)

3. COMPETITIVE LANDSCAPE SUMMARY
   - Market leader and why
   - Most disruptive player
   - Biggest gap/opportunity in the market

4. COMPETITIVE POSITIONING STRATEGY
   - Blue Ocean opportunities (uncontested market space)
   - Recommended differentiators for a new entrant
   - Price positioning recommendation

5. THREAT ASSESSMENT SCORE (1-10) for entering this market

Be specific and include real company names where relevant.`;
      const text = await callClaude(prompt);
      setResult(text);
      updateGlobalData("competitors", { idea: form.idea.slice(0, 60), timestamp: new Date().toLocaleTimeString() });
    } catch (e) {
      setError("AI error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>Competitor Intelligence</h2>
        <p>Identify key competitors and get detailed comparative analysis with funding, features, and reviews.</p>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="card">
          <h3 style={{ fontFamily: "Syne, sans-serif", marginBottom: "1.5rem", fontSize: "1rem" }}>Analyze Competitors</h3>

          <div className="form-group">
            <label className="label">Your Startup Idea *</label>
            <textarea className="textarea" value={form.idea} onChange={e => set("idea", e.target.value)} placeholder="e.g. A mobile app that helps small retailers in Bangladesh manage inventory and accept digital payments..." style={{ minHeight: 120 }} />
          </div>

          <div className="form-group">
            <label className="label">Target Region</label>
            <input className="input" value={form.region} onChange={e => set("region", e.target.value)} placeholder="e.g. Bangladesh, Southeast Asia, Global" />
          </div>

          {error && <div style={{ color: "var(--accent2)", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</div>}

          <button className="btn btn-primary" onClick={analyze} disabled={loading} style={{ width: "100%" }}>
            {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Analyzing...</> : "◎ Find Competitors"}
          </button>

          {/* Info cards */}
          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {["Funding comparisons", "Feature analysis", "Review sentiment", "Market positioning"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <span style={{ color: "var(--accent3)" }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>

        <div>
          {loading && (
            <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "3rem" }}>
              <div className="spinner" />
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Scanning competitor landscape...</p>
            </div>
          )}
          {result && (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem" }}>Competitor Report</h3>
                <span className="badge badge-red">◎ Intel</span>
              </div>
              <div className="ai-response">{result}</div>
            </div>
          )}
          {!loading && !result && (
            <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>◎</div>
              <p style={{ fontSize: "0.85rem" }}>Describe your startup idea to get a full competitor intelligence report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
