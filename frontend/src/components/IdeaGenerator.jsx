import { useState, useEffect } from "react";
import { addNotification } from "../utils/notificationService.js";
import {
  Brain, Rocket, Target, DollarSign, MapPin, Sparkles, AlertCircle,
  CheckCircle, Clock, Zap, Users, Globe, Lightbulb, Star, ThumbsUp,
  Bookmark, ArrowRight, Briefcase
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const INDUSTRIES = [
  { value: "FinTech", label: "FinTech", icon: "💰", color: "#6c63ff" },
  { value: "HealthTech", label: "HealthTech", icon: "🏥", color: "#38bdf8" },
  { value: "EdTech", label: "EdTech", icon: "📚", color: "#43e97b" },
  { value: "AgriTech", label: "AgriTech", icon: "🌾", color: "#fbbf24" },
  { value: "CleanTech", label: "CleanTech", icon: "🌱", color: "#34d399" },
  { value: "AI/ML", label: "AI/ML", icon: "🤖", color: "#a855f7" }
];

const BUSINESS_MODELS = [
  { value: "SaaS", label: "SaaS", icon: "☁️", color: "#6c63ff" },
  { value: "Marketplace", label: "Marketplace", icon: "🏪", color: "#38bdf8" },
  { value: "E-commerce", label: "E-commerce", icon: "🛒", color: "#43e97b" },
  { value: "Freemium", label: "Freemium", icon: "🎁", color: "#fbbf24" }
];

const INVESTMENT_OPTIONS = [
  { value: "5000", label: "Bootstrapping", range: "$5K - $10K" },
  { value: "25000", label: "Angel", range: "$25K - $50K" },
  { value: "100000", label: "Seed", range: "$100K - $500K" },
  { value: "500000", label: "Series A", range: "$500K - $2M" }
];

const REGIONS = ["Global", "North America", "Europe", "Asia Pacific", "South Asia"];

export default function IdeaGenerator() {
  const [form, setForm] = useState({
    industry: "FinTech",
    business_model: "SaaS",
    investment: "25000",
    interests: "",
    region: "Global",
    targetAudience: "",
    problem: ""
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeModule, setActiveModule] = useState("ideas");

  // Get data for sidebar stats
  const ideas = JSON.parse(localStorage.getItem("saved_ideas") || "[]");
  const markets = JSON.parse(localStorage.getItem("market_reports") || "[]");
  const competitors = JSON.parse(localStorage.getItem("competitor_reports") || "[]");
  const skills = JSON.parse(localStorage.getItem("skills_reports") || "[]");

  const globalData = {
    generatedIdeas: ideas,
    marketAnalyses: markets,
    competitors: competitors,
    skillsAnalyses: skills
  };

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const selectedInvestment = INVESTMENT_OPTIONS.find(i => i.value === form.investment);

  const validateForm = () => {
    if (!form.interests.trim()) {
      setError("Please describe your interests");
      return false;
    }
    if (form.interests.length < 20) {
      setError("Please describe your interests in more detail (minimum 20 characters)");
      return false;
    }
    return true;
  };

  const generate = async () => {
    if (!validateForm()) return;

    setError("");
    setLoading(true);
    setResult(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const descriptionText = `
Industry: ${form.industry}
Business Model: ${form.business_model}
Investment: ${selectedInvestment?.range || ""}
Interests: ${form.interests}
Region: ${form.region}
Target Audience: ${form.targetAudience || "General"}
Problem: ${form.problem || "Not specified"}
      `.trim();

      const response = await fetch("http://127.0.0.1:8000/api/ideas/generate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `${form.industry} Innovation: ${form.interests.slice(0, 50)}`,
          description: descriptionText,
          industry: form.industry,
          target_market: form.region,
          business_model: form.business_model,
          investment_range: selectedInvestment?.range || ""
        })
      });

      const data = await response.json();

      if (response.ok) {
        const ideaResult = {
          id: data.id,
          title: data.title || `${form.industry} Startup Idea`,
          description: data.description || "Your personalized startup idea based on your inputs.",
          viability_score: data.viability_score || 75,
          market_size: data.market_size || "$25B",
          competition_level: data.competition_level || "Medium",
          problem_solved: data.problem_solved || form.problem || "Not specified",
          target_audience: data.target_audience || form.targetAudience || "General audience",
          revenue_streams: data.revenue_streams || [],
          key_features: data.key_features || [],
          challenges: data.challenges || []
        };
        
        setResult(ideaResult);
        setSuccess(true);
        
        if (typeof addNotification === 'function') {
          addNotification(
            "success",
            "✨ Idea Generated Successfully!",
            `Your startup idea "${ideaResult.title}" is ready. Viability score: ${ideaResult.viability_score}%`,
            "/ideas",
            { 
              ideaId: ideaResult.id, 
              title: ideaResult.title,
              score: ideaResult.viability_score 
            }
          );
        }
        
      } else {
        setError(data.error || data.message || "Failed to generate idea");
      }
    } catch (err) {
      console.error("Idea generation error:", err);
      setError("Connection error. Make sure backend is running on port 8000");
    } finally {
      setLoading(false);
    }
  };

  const getViabilityColor = (score) => {
    if (score >= 80) return "#43e97b";
    if (score >= 60) return "#fbbf24";
    return "#ff6584";
  };

  const getViabilityText = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  const handleGenerateAnother = () => {
    setResult(null);
    setSuccess(false);
    setError("");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        globalData={globalData}
      />
      
      {/* Main Content */}
      <div style={{ 
        marginLeft: "260px", 
        padding: "2rem",
        flex: 1,
        background: "var(--bg)",
        minHeight: "100vh"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", 
            gap: "2rem",
            alignItems: "start"
          }}>
            
            {/* Left Panel - Form */}
            <div style={{ 
              background: "var(--surface)", 
              borderRadius: "24px", 
              border: "1px solid var(--border)", 
              padding: "2rem",
              transition: "all 0.3s ease"
            }}>
              <h3 style={{ 
                fontSize: "1.5rem", 
                fontWeight: "bold", 
                color: "var(--text)", 
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontFamily: "Syne, sans-serif"
              }}>
                <Rocket className="w-6 h-6" style={{ color: "#6c63ff" }} /> 
                Input Parameters
              </h3>

              {/* Industry */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  color: "var(--text-muted)", 
                  fontSize: "0.75rem", 
                  marginBottom: "0.5rem", 
                  display: "block", 
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Industry *
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.5rem" }}>
                  {INDUSTRIES.map(ind => (
                    <button
                      key={ind.value}
                      onClick={() => setField("industry", ind.value)}
                      style={{
                        padding: "0.6rem 1.2rem",
                        background: form.industry === ind.value ? ind.color : "var(--surface2)",
                        border: "none",
                        borderRadius: "12px",
                        color: form.industry === ind.value ? "white" : "var(--text)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}
                    >
                      <span>{ind.icon}</span>
                      <span>{ind.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Model */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  color: "var(--text-muted)", 
                  fontSize: "0.75rem", 
                  marginBottom: "0.5rem", 
                  display: "block", 
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Business Model *
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.5rem" }}>
                  {BUSINESS_MODELS.map(model => (
                    <button
                      key={model.value}
                      onClick={() => setField("business_model", model.value)}
                      style={{
                        padding: "0.6rem 1.2rem",
                        background: form.business_model === model.value ? model.color : "var(--surface2)",
                        border: "none",
                        borderRadius: "12px",
                        color: form.business_model === model.value ? "white" : "var(--text)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}
                    >
                      <span>{model.icon}</span>
                      <span>{model.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Investment */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  color: "var(--text-muted)", 
                  fontSize: "0.75rem", 
                  marginBottom: "0.5rem", 
                  display: "block", 
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Investment Range
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "0.75rem", marginTop: "0.5rem" }}>
                  {INVESTMENT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setField("investment", opt.value)}
                      style={{
                        padding: "0.6rem",
                        background: form.investment === opt.value ? "#43e97b" : "var(--surface2)",
                        border: "none",
                        borderRadius: "12px",
                        color: form.investment === opt.value ? "white" : "var(--text)",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        transition: "all 0.2s ease",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontWeight: "bold", marginBottom: "2px" }}>{opt.label}</div>
                      <div style={{ fontSize: "0.65rem", opacity: 0.9 }}>{opt.range}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Region */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  color: "var(--text-muted)", 
                  fontSize: "0.75rem", 
                  marginBottom: "0.5rem", 
                  display: "block", 
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Target Region *
                </label>
                <select
                  value={form.region}
                  onChange={e => setField("region", e.target.value)}
                  style={{ 
                    width: "100%", 
                    padding: "0.8rem", 
                    background: "var(--surface2)", 
                    border: "1px solid var(--border)", 
                    borderRadius: "12px", 
                    color: "var(--text)", 
                    marginTop: "0.5rem",
                    outline: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    transition: "all 0.2s ease"
                  }}
                >
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Interests */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  color: "var(--text-muted)", 
                  fontSize: "0.75rem", 
                  marginBottom: "0.5rem", 
                  display: "block", 
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Interests & Skills *
                </label>
                <textarea
                  value={form.interests}
                  onChange={e => setField("interests", e.target.value)}
                  placeholder="Describe your interests and skills in detail (min 20 characters)..."
                  rows={4}
                  style={{ 
                    width: "100%", 
                    padding: "0.8rem", 
                    background: "var(--surface2)", 
                    border: "1px solid var(--border)", 
                    borderRadius: "12px", 
                    color: "var(--text)", 
                    marginTop: "0.5rem",
                    resize: "vertical",
                    fontFamily: "inherit",
                    fontSize: "0.85rem",
                    transition: "all 0.2s ease"
                  }}
                />
                <div style={{ 
                  color: form.interests.length >= 20 ? "#43e97b" : "var(--text-muted)", 
                  fontSize: "0.7rem", 
                  marginTop: "0.5rem" 
                }}>
                  {form.interests.length} / 20 characters minimum
                  {form.interests.length >= 20 && " ✓ Good!"}
                </div>
              </div>

              {/* Target Audience (Optional) */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  color: "var(--text-muted)", 
                  fontSize: "0.75rem", 
                  marginBottom: "0.5rem", 
                  display: "block", 
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Target Audience <span style={{ opacity: 0.6 }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  value={form.targetAudience}
                  onChange={e => setField("targetAudience", e.target.value)}
                  placeholder="e.g., Small business owners, Gen Z consumers"
                  style={{ 
                    width: "100%", 
                    padding: "0.8rem", 
                    background: "var(--surface2)", 
                    border: "1px solid var(--border)", 
                    borderRadius: "12px", 
                    color: "var(--text)", 
                    marginTop: "0.5rem",
                    fontSize: "0.85rem",
                    transition: "all 0.2s ease"
                  }}
                />
              </div>

              {/* Problem to Solve (Optional) */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  color: "var(--text-muted)", 
                  fontSize: "0.75rem", 
                  marginBottom: "0.5rem", 
                  display: "block", 
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Problem to Solve <span style={{ opacity: 0.6 }}>(Optional)</span>
                </label>
                <textarea
                  value={form.problem}
                  onChange={e => setField("problem", e.target.value)}
                  placeholder="What problem are you trying to solve?"
                  rows={2}
                  style={{ 
                    width: "100%", 
                    padding: "0.8rem", 
                    background: "var(--surface2)", 
                    border: "1px solid var(--border)", 
                    borderRadius: "12px", 
                    color: "var(--text)", 
                    marginTop: "0.5rem",
                    resize: "vertical",
                    fontFamily: "inherit",
                    fontSize: "0.85rem"
                  }}
                />
              </div>

              {error && (
                <div style={{ 
                  padding: "1rem", 
                  background: "rgba(255,101,132,0.1)", 
                  border: "1px solid #ff6584", 
                  borderRadius: "12px", 
                  color: "#ff6584", 
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem"
                }}>
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <button
                onClick={generate}
                disabled={loading}
                style={{ 
                  width: "100%", 
                  padding: "1rem", 
                  background: "linear-gradient(135deg, #6c63ff, #ff6584)", 
                  border: "none", 
                  borderRadius: "12px", 
                  color: "white", 
                  fontSize: "1rem", 
                  fontWeight: "bold", 
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(108,99,255,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <span style={{ 
                      display: "inline-block", 
                      width: "16px", 
                      height: "16px", 
                      border: "2px solid white", 
                      borderTopColor: "transparent", 
                      borderRadius: "50%", 
                      animation: "spin 0.8s linear infinite" 
                    }} />
                    Generating...
                  </span>
                ) : (
                  "Generate Startup Idea"
                )}
              </button>
            </div>

            {/* Right Panel - Result */}
            <div>
              {loading && (
                <div style={{ 
                  background: "var(--surface)", 
                  borderRadius: "24px", 
                  border: "1px solid var(--border)", 
                  padding: "3rem", 
                  textAlign: "center" 
                }}>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    border: "3px solid var(--border)", 
                    borderTopColor: "#6c63ff", 
                    borderRadius: "50%", 
                    animation: "spin 1s linear infinite", 
                    margin: "0 auto" 
                  }} />
                  <p style={{ color: "var(--text-muted)", marginTop: "1.5rem", fontSize: "0.9rem" }}>
                    AI is analyzing your inputs and generating a tailored startup idea...
                  </p>
                </div>
              )}

              {result && (
                <div style={{ 
                  background: "var(--surface)", 
                  borderRadius: "24px", 
                  border: "1px solid var(--border)", 
                  padding: "2rem",
                  animation: "fadeIn 0.5s ease-out"
                }}>
                  {success && (
                    <div style={{ 
                      padding: "1rem", 
                      background: "rgba(67,233,123,0.1)", 
                      border: "1px solid #43e97b", 
                      borderRadius: "12px", 
                      marginBottom: "1.5rem", 
                      color: "#43e97b",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem"
                    }}>
                      <CheckCircle className="w-5 h-5" /> 
                      <span>Idea Generated Successfully!</span>
                    </div>
                  )}

                  <h3 style={{ 
                    fontSize: "1.5rem", 
                    fontWeight: "bold", 
                    color: "var(--text)", 
                    marginBottom: "0.75rem",
                    fontFamily: "Syne, sans-serif",
                    lineHeight: "1.3"
                  }}>
                    {result.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                    {result.description}
                  </p>

                  {/* Viability Score */}
                  {result.viability_score && (
                    <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "var(--surface2)", borderRadius: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>Viability Score</span>
                        <div>
                          <span style={{ color: getViabilityColor(result.viability_score), fontWeight: "bold" }}>
                            {result.viability_score}%
                          </span>
                          <span style={{ color: "var(--text-muted)", marginLeft: "0.5rem", fontSize: "0.8rem" }}>
                            ({getViabilityText(result.viability_score)})
                          </span>
                        </div>
                      </div>
                      <div style={{ width: "100%", height: "8px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ 
                          width: `${result.viability_score}%`, 
                          height: "100%", 
                          background: getViabilityColor(result.viability_score), 
                          borderRadius: "4px",
                          transition: "width 0.8s ease-out"
                        }} />
                      </div>
                    </div>
                  )}

                  {/* Market Size & Competition */}
                  {result.market_size && result.competition_level && (
                    <div style={{ marginBottom: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div style={{ padding: "0.75rem", background: "var(--surface2)", borderRadius: "12px", textAlign: "center" }}>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Market Size
                        </div>
                        <div style={{ color: "var(--text)", fontWeight: "bold", fontSize: "1rem" }}>
                          {result.market_size}
                        </div>
                      </div>
                      <div style={{ padding: "0.75rem", background: "var(--surface2)", borderRadius: "12px", textAlign: "center" }}>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Competition Level
                        </div>
                        <div style={{ 
                          color: result.competition_level === "Low" ? "#43e97b" : result.competition_level === "Medium" ? "#fbbf24" : "#ff6584", 
                          fontWeight: "bold", 
                          fontSize: "1rem" 
                        }}>
                          {result.competition_level}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Problem Solved */}
                  {result.problem_solved && (
                    <div style={{ marginBottom: "1rem", padding: "0.75rem", background: "var(--surface2)", borderRadius: "12px" }}>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Problem Solved
                      </div>
                      <div style={{ color: "var(--text)", fontSize: "0.85rem", lineHeight: "1.5" }}>
                        {result.problem_solved}
                      </div>
                    </div>
                  )}

                  {/* Target Audience */}
                  {result.target_audience && (
                    <div style={{ marginBottom: "1rem", padding: "0.75rem", background: "var(--surface2)", borderRadius: "12px" }}>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Target Audience
                      </div>
                      <div style={{ color: "var(--text)", fontSize: "0.85rem", lineHeight: "1.5" }}>
                        {result.target_audience}
                      </div>
                    </div>
                  )}

                  {/* Revenue Streams */}
                  {result.revenue_streams && result.revenue_streams.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <h4 style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--text)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Revenue Streams
                      </h4>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {result.revenue_streams.map((stream, i) => (
                          <span key={i} style={{
                            padding: "0.35rem 1rem",
                            background: "rgba(67,233,123,0.1)",
                            borderRadius: "100px",
                            fontSize: "0.75rem",
                            color: "#43e97b",
                            fontWeight: "500"
                          }}>
                            {stream}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Features */}
                  {result.key_features && result.key_features.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <h4 style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--text)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Key Features
                      </h4>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {result.key_features.map((feature, i) => (
                          <span key={i} style={{
                            padding: "0.35rem 1rem",
                            background: "rgba(108,99,255,0.1)",
                            borderRadius: "100px",
                            fontSize: "0.75rem",
                            color: "#6c63ff",
                            fontWeight: "500"
                          }}>
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Challenges */}
                  {result.challenges && result.challenges.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <h4 style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--text)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Potential Challenges
                      </h4>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {result.challenges.map((challenge, i) => (
                          <span key={i} style={{
                            padding: "0.35rem 1rem",
                            background: "rgba(255,101,132,0.1)",
                            borderRadius: "100px",
                            fontSize: "0.75rem",
                            color: "#ff6584",
                            fontWeight: "500"
                          }}>
                            {challenge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleGenerateAnother}
                    style={{ 
                      width: "100%", 
                      marginTop: "1.5rem", 
                      padding: "0.85rem", 
                      background: "transparent", 
                      border: "1px solid var(--border)", 
                      borderRadius: "12px", 
                      color: "var(--text-muted)", 
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: "0.9rem",
                      fontWeight: "500"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#6c63ff";
                      e.currentTarget.style.color = "#6c63ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                  >
                    Generate Another Idea
                  </button>
                </div>
              )}

              {!loading && !result && (
                <div style={{ 
                  background: "var(--surface)", 
                  borderRadius: "24px", 
                  border: "1px solid var(--border)", 
                  padding: "3rem", 
                  textAlign: "center" 
                }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    background: "var(--surface2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem"
                  }}>
                    <Lightbulb className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
                  </div>
                  <h4 style={{ color: "var(--text)", fontWeight: "bold", marginTop: "1rem", fontSize: "1.1rem" }}>
                    Ready to Generate
                  </h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    Fill out the form with your interests and click "Generate Startup Idea"
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                    Our AI will create a personalized startup idea tailored to your inputs
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}