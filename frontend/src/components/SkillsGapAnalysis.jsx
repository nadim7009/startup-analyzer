import { useState } from "react";
import { callClaude } from "../utils/ai";

const STARTUP_TYPES = ["SaaS Platform", "Mobile App", "E-commerce", "FinTech", "HealthTech", "AI/ML Product", "Marketplace", "EdTech", "IoT Solution", "B2B Service"];

export default function SkillsGapAnalysis({ updateGlobalData }) {
  const [form, setForm] = useState({ skills: "", startupType: "SaaS Platform", experience: "1-2 years" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [skillsData, setSkillsData] = useState(null);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const analyze = async () => {
    if (!form.skills.trim()) { setError("Please list your skills."); return; }
    setError(""); setLoading(true); setResult(""); setSkillsData(null);
    try {
      // First get structured skills data for heatmap
      const structuredPrompt = `Analyze the skills gap for building a ${form.startupType}.

Founder's current skills: ${form.skills}
Experience: ${form.experience}

Return ONLY a JSON object (no markdown, no backticks) with this exact structure:
{
  "skillAreas": [
    {"area": "Frontend Development", "required": 80, "current": 70},
    {"area": "Backend Development", "required": 85, "current": 60},
    {"area": "Product Management", "required": 75, "current": 40},
    {"area": "Marketing/Growth", "required": 70, "current": 30},
    {"area": "Business Development", "required": 65, "current": 50},
    {"area": "UI/UX Design", "required": 60, "current": 45},
    {"area": "Data Analytics", "required": 55, "current": 35},
    {"area": "DevOps/Cloud", "required": 70, "current": 25}
  ],
  "readinessScore": 62,
  "topGaps": ["Marketing/Growth", "DevOps/Cloud"],
  "strengths": ["Frontend Development"]
}

Adjust the numbers based on the actual skills provided. Keep it realistic.`;

      const structuredText = await callClaude(structuredPrompt);
      try {
        const parsed = JSON.parse(structuredText.trim());
        setSkillsData(parsed);
        updateGlobalData("skillsData", parsed);
      } catch (_) { /* ignore parse errors, still show text result */ }

      const textPrompt = `You are a startup readiness coach. Analyze the skills gap for:
Startup Type: ${form.startupType}
Founder Skills: ${form.skills}
Experience Level: ${form.experience}

Provide:
1. OVERALL READINESS SCORE (0-100) with breakdown
2. SKILL STRENGTHS (what they have that helps)
3. CRITICAL SKILL GAPS (must-have skills they're missing)
4. NICE-TO-HAVE GAPS (helpful but not blocking)
5. RECOMMENDED LEARNING PATH
   - For each gap: specific courses, resources, timeline
   - Priority order for learning
6. TEAM BUILDING SUGGESTIONS
   - What roles to hire first
   - Whether to use co-founders vs contractors
7. 6-MONTH IMPROVEMENT PROJECTION
   - What their readiness score could be with focused effort

Be specific with course/resource recommendations (Coursera, Udemy, YouTube channels, books, etc.)`;
      const textResult = await callClaude(textPrompt);
      setResult(textResult);
    } catch (e) {
      setError("AI error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>Skills Gap Analysis</h2>
        <p>Compare your current skills with startup requirements and get a personalized improvement roadmap.</p>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="card">
          <h3 style={{ fontFamily: "Syne, sans-serif", marginBottom: "1.5rem", fontSize: "1rem" }}>Your Profile</h3>

          <div className="form-group">
            <label className="label">Startup Type</label>
            <select className="select" value={form.startupType} onChange={e => set("startupType", e.target.value)}>
              {STARTUP_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="label">Years of Experience</label>
            <select className="select" value={form.experience} onChange={e => set("experience", e.target.value)}>
              {["< 1 year", "1-2 years", "2-4 years", "4-7 years", "7+ years"].map(e => <option key={e}>{e}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="label">Your Current Skills *</label>
            <textarea className="textarea" value={form.skills} onChange={e => set("skills", e.target.value)}
              placeholder="e.g. React, Node.js, Python basics, SQL, some project management experience, basic Excel, English communication..."
              style={{ minHeight: 130 }} />
          </div>

          {error && <div style={{ color: "var(--accent2)", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</div>}

          <button className="btn btn-primary" onClick={analyze} disabled={loading} style={{ width: "100%" }}>
            {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Analyzing...</> : "◐ Analyze Skills Gap"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {/* Skills Heatmap */}
          {skillsData && (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem" }}>Skills Heatmap</h3>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.8rem", fontFamily: "Syne, sans-serif", fontWeight: 800, color: skillsData.readinessScore >= 70 ? "var(--accent3)" : skillsData.readinessScore >= 50 ? "var(--accent)" : "var(--accent2)" }}>
                    {skillsData.readinessScore}
                    <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/100</span>
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Readiness Score</div>
                </div>
              </div>

              {skillsData.skillAreas.map((s) => {
                const gap = s.required - s.current;
                const color = gap <= 0 ? "var(--accent3)" : gap <= 20 ? "var(--accent)" : gap <= 40 ? "#f59e0b" : "var(--accent2)";
                return (
                  <div key={s.area} style={{ marginBottom: "0.9rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "0.35rem" }}>
                      <span>{s.area}</span>
                      <span style={{ color: "var(--text-muted)" }}>
                        <span style={{ color }}>{s.current}</span>
                        <span style={{ color: "var(--text-muted)" }}> / {s.required} req</span>
                      </span>
                    </div>
                    {/* Required bar */}
                    <div className="score-bar-wrap" style={{ position: "relative", marginBottom: 3 }}>
                      <div style={{ position: "absolute", width: `${s.required}%`, height: "100%", background: "var(--border)", borderRadius: 100 }} />
                      <div className="score-bar" style={{ width: `${s.current}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }} />
                    </div>
                    {gap > 0 && <div style={{ fontSize: "0.68rem", color: color, textAlign: "right" }}>−{gap} gap</div>}
                  </div>
                );
              })}

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Key gaps:</span>
                {(skillsData.topGaps || []).map(g => <span key={g} className="badge badge-red" style={{ fontSize: "0.68rem" }}>{g}</span>)}
              </div>
            </div>
          )}

          {loading && (
            <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "3rem" }}>
              <div className="spinner" />
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Building your skills profile...</p>
            </div>
          )}

          {result && (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem" }}>Improvement Roadmap</h3>
                <span className="badge badge-purple">◐ Analysis</span>
              </div>
              <div className="ai-response">{result}</div>
            </div>
          )}

          {!loading && !result && !skillsData && (
            <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>◐</div>
              <p style={{ fontSize: "0.85rem" }}>List your skills to get a visual heatmap and personalized learning roadmap.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
