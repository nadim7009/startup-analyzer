import { useState } from "react";
import { callClaude } from "../utils/ai";

const INDUSTRIES = ["FinTech", "HealthTech", "EdTech", "AgriTech", "CleanTech", "Logistics", "Retail", "AI/ML", "Cybersecurity", "Gaming"];

export default function IdeaGenerator({ updateGlobalData }) {
  const [form, setForm] = useState({ industry: "FinTech", investment: "10000", interests: "", region: "Bangladesh" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const generate = async () => {
    if (!form.interests.trim()) { setError("Please describe your interests/skills."); return; }
    setError(""); setLoading(true); setResult("");
    try {
      const prompt = `You are a startup strategist. Generate a complete startup idea for the following parameters:
- Industry: ${form.industry}
- Initial Investment Budget: $${Number(form.investment).toLocaleString()}
- Founder Interests/Background: ${form.interests}
- Target Region: ${form.region}

Provide the following in a well-structured format:
1. STARTUP NAME & TAGLINE
2. PROBLEM STATEMENT (specific pain point)
3. SOLUTION (your product/service)
4. BUSINESS MODEL (how it makes money)
5. VIABILITY SCORE (out of 100) with breakdown: Market Demand, Competition Level, Technical Feasibility, Revenue Potential
6. TARGET CUSTOMER SEGMENT
7. KEY MILESTONES (first 12 months)
8. ESTIMATED BREAK-EVEN TIMELINE

Be specific, realistic, and tailored to the region (${form.region}).`;
      const text = await callClaude(prompt);
      setResult(text);
      updateGlobalData("generatedIdeas", {
        industry: form.industry,
        timestamp: new Date().toLocaleTimeString(),
        summary: text.slice(0, 100),
      });
    } catch (e) {
      setError("AI error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>Startup Idea Generator</h2>
        <p>AI generates complete startup concepts with viability scoring and business model analysis.</p>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Form */}
        <div className="card">
          <h3 style={{ fontFamily: "Syne, sans-serif", marginBottom: "1.5rem", fontSize: "1rem" }}>Input Parameters</h3>

          <div className="form-group">
            <label className="label">Industry</label>
            <select className="select" value={form.industry} onChange={e => set("industry", e.target.value)}>
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="label">Initial Investment (USD)</label>
            <input className="input" type="number" value={form.investment} onChange={e => set("investment", e.target.value)} placeholder="e.g. 10000" />
          </div>

          <div className="form-group">
            <label className="label">Target Region</label>
            <input className="input" value={form.region} onChange={e => set("region", e.target.value)} placeholder="e.g. Bangladesh, Southeast Asia" />
          </div>

          <div className="form-group">
            <label className="label">Your Interests & Background *</label>
            <textarea className="textarea" value={form.interests} onChange={e => set("interests", e.target.value)} placeholder="e.g. I have a background in software development, interested in solving payment problems for small businesses..." />
          </div>

          {error && <div style={{ color: "var(--accent2)", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</div>}

          <button className="btn btn-primary" onClick={generate} disabled={loading} style={{ width: "100%" }}>
            {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Generating...</> : "◈ Generate Idea"}
          </button>
        </div>

        {/* Result */}
        <div>
          {loading && (
            <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "3rem" }}>
              <div className="spinner" />
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>AI is crafting your startup idea...</p>
            </div>
          )}
          {result && (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem" }}>Generated Idea</h3>
                <span className="badge badge-green">✓ Complete</span>
              </div>
              <div className="ai-response">{result}</div>
            </div>
          )}
          {!loading && !result && (
            <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>◈</div>
              <p style={{ fontSize: "0.85rem" }}>Fill in the parameters and click Generate to create your AI-powered startup idea.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
