import { useState } from "react";
import { callClaude } from "../utils/ai";

const INDUSTRIES = ["FinTech", "HealthTech", "EdTech", "AgriTech", "CleanTech", "Logistics", "Retail", "AI/ML", "Cybersecurity", "Gaming"];
const REGIONS = ["Bangladesh", "South Asia", "Southeast Asia", "Africa", "Middle East", "Europe", "North America", "Latin America", "Global"];

export default function MarketAnalysis({ updateGlobalData }) {
  const [form, setForm] = useState({ industry: "FinTech", region: "Bangladesh", compareWith: "South Asia" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [compareResult, setCompareResult] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("research"); // research | compare

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const doResearch = async () => {
    setError(""); setLoading(true); setResult(""); setCompareResult("");
    try {
      const prompt = `You are a senior market research analyst. Provide a comprehensive market research report for:
- Industry: ${form.industry}
- Region: ${form.region}

Include:
1. MARKET OVERVIEW (size, growth rate, maturity stage)
2. KEY MARKET DRIVERS (top 3-5 factors fueling growth)
3. MARKET CHALLENGES & BARRIERS
4. CUSTOMER SEGMENTS (primary buyers/users)
5. REGULATORY ENVIRONMENT (key laws, licenses needed)
6. INVESTMENT LANDSCAPE (funding trends, active VCs/investors in the region)
7. TECHNOLOGY TRENDS shaping this market
8. MARKET OPPORTUNITY SCORE (1-10) with reasoning
9. TOP 3 ENTRY STRATEGIES for a new startup

Be specific to ${form.region} context and include local examples where possible.`;
      const text = await callClaude(prompt);
      setResult(text);
      updateGlobalData("marketAnalyses", { industry: form.industry, region: form.region, timestamp: new Date().toLocaleTimeString() });
    } catch (e) {
      setError("AI error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const doCompare = async () => {
    setError(""); setLoading(true); setResult(""); setCompareResult("");
    try {
      const prompt = `You are a strategic market analyst. Compare ${form.industry} markets in two regions:
- Market A: ${form.region}
- Market B: ${form.compareWith}

Provide a side-by-side comparative analysis covering:
1. MARKET SIZE comparison (TAM in USD)
2. GROWTH RATE comparison (CAGR %)
3. COMPETITION INTENSITY (Low/Medium/High for each)
4. REGULATORY DIFFICULTY (score 1-10 each)
5. CUSTOMER SPENDING POWER
6. DIGITAL INFRASTRUCTURE
7. TALENT AVAILABILITY
8. FUNDING ECOSYSTEM
9. VERDICT: Which market is better for a new startup and WHY
10. HYBRID STRATEGY: How to operate in both markets simultaneously

Format as a clear comparison table where possible, then provide analysis.`;
      const text = await callClaude(prompt);
      setCompareResult(text);
    } catch (e) {
      setError("AI error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>Market Analysis</h2>
        <p>Automated market research and comparative analysis for any industry and region.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {[{ id: "research", label: "Market Research" }, { id: "compare", label: "Compare Markets" }].map(t => (
          <button key={t.id} className={`btn ${tab === t.id ? "btn-primary" : "btn-secondary"}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Form */}
        <div className="card">
          <h3 style={{ fontFamily: "Syne, sans-serif", marginBottom: "1.5rem", fontSize: "1rem" }}>
            {tab === "research" ? "Research Parameters" : "Comparison Parameters"}
          </h3>

          <div className="form-group">
            <label className="label">Industry</label>
            <select className="select" value={form.industry} onChange={e => set("industry", e.target.value)}>
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="label">{tab === "compare" ? "Market A — Region" : "Region"}</label>
            <select className="select" value={form.region} onChange={e => set("region", e.target.value)}>
              {REGIONS.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          {tab === "compare" && (
            <div className="form-group">
              <label className="label">Market B — Compare With</label>
              <select className="select" value={form.compareWith} onChange={e => set("compareWith", e.target.value)}>
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          )}

          {error && <div style={{ color: "var(--accent2)", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</div>}

          <button className="btn btn-primary" onClick={tab === "research" ? doResearch : doCompare} disabled={loading} style={{ width: "100%" }}>
            {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Analyzing...</> : tab === "research" ? "◉ Research Market" : "◉ Compare Markets"}
          </button>
        </div>

        {/* Result */}
        <div>
          {loading && (
            <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "3rem" }}>
              <div className="spinner" />
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Researching market data...</p>
            </div>
          )}
          {(result || compareResult) && (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem" }}>
                  {tab === "research" ? `${form.industry} — ${form.region}` : `${form.region} vs ${form.compareWith}`}
                </h3>
                <span className="badge badge-blue">◉ Research</span>
              </div>
              <div className="ai-response">{result || compareResult}</div>
            </div>
          )}
          {!loading && !result && !compareResult && (
            <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>◉</div>
              <p style={{ fontSize: "0.85rem" }}>Select parameters and run a market research or comparison analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
