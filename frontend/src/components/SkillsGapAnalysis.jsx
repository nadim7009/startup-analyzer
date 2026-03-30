import { useState, useEffect } from "react";
import {
  Brain,
  TrendingUp,
  Target,
  BookOpen,
  Users,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  LineChart,
  Star,
  Bookmark,
  Download,
  Share2,
  Lightbulb,
  Rocket,
  GraduationCap,
  Briefcase,
  Code,
  Database,
  Palette,
  Megaphone,
  Calculator,
  Shield,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Heart,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const STARTUP_TYPES = [
  { value: "SaaS Platform", label: "SaaS Platform", icon: <Code className="w-4 h-4" />, color: "#6c63ff" },
  { value: "Mobile App", label: "Mobile App", icon: <Database className="w-4 h-4" />, color: "#38bdf8" },
  { value: "E-commerce", label: "E-commerce", icon: <Calculator className="w-4 h-4" />, color: "#43e97b" },
  { value: "FinTech", label: "FinTech", icon: <Briefcase className="w-4 h-4" />, color: "#fbbf24" },
  { value: "HealthTech", label: "HealthTech", icon: <Heart className="w-4 h-4" />, color: "#ff6584" },
  { value: "AI/ML Product", label: "AI/ML Product", icon: <Brain className="w-4 h-4" />, color: "#a855f7" },
  { value: "Marketplace", label: "Marketplace", icon: <Users className="w-4 h-4" />, color: "#ec489a" },
  { value: "EdTech", label: "EdTech", icon: <GraduationCap className="w-4 h-4" />, color: "#34d399" },
  { value: "IoT Solution", label: "IoT Solution", icon: <Zap className="w-4 h-4" />, color: "#f97316" },
  { value: "B2B Service", label: "B2B Service", icon: <Briefcase className="w-4 h-4" />, color: "#7878a0" }
];

const EXPERIENCE_LEVELS = [
  { value: "< 1 year", label: "Less than 1 year", color: "#ff6584" },
  { value: "1-2 years", label: "1-2 years", color: "#fbbf24" },
  { value: "2-4 years", label: "2-4 years", color: "#43e97b" },
  { value: "4-7 years", label: "4-7 years", color: "#38bdf8" },
  { value: "7+ years", label: "7+ years", color: "#6c63ff" }
];

export default function SkillsGapAnalysis({ updateGlobalData }) {
  const [form, setForm] = useState({ 
    skills: "", 
    startupType: "SaaS Platform", 
    experience: "1-2 years" 
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("analysis");
  const [savedReports, setSavedReports] = useState([]);
  const [activeModule, setActiveModule] = useState("skills");

  // Get data for sidebar stats
  const ideas = JSON.parse(localStorage.getItem("saved_ideas") || "[]");
  const markets = JSON.parse(localStorage.getItem("market_reports") || "[]");
  const competitors = JSON.parse(localStorage.getItem("competitor_reports") || "[]");
  const skillsData = JSON.parse(localStorage.getItem("skills_reports") || "[]");

  const globalData = {
    generatedIdeas: ideas,
    marketAnalyses: markets,
    competitors: competitors,
    skillsAnalyses: skillsData
  };

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const selectedStartup = STARTUP_TYPES.find(s => s.value === form.startupType);
  const selectedExp = EXPERIENCE_LEVELS.find(e => e.value === form.experience);

  // Load saved reports from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("skills_reports") || "[]");
    setSavedReports(saved.slice(0, 10));
  }, []);

  const validateForm = () => {
    if (!form.skills.trim()) { 
      setError("Please list your current skills."); 
      return false; 
    }
    if (form.skills.length < 20) {
      setError("Please provide more details about your skills (at least 20 characters)");
      return false;
    }
    return true;
  };

  const analyze = async () => {
    if (!validateForm()) return;
    
    setError("");
    setLoading(true);
    setResult(null);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/skills-gap-analysis/analyze/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          skills: form.skills,
          startup_type: form.startupType,
          experience_level: form.experience
        })
      });

      const data = await response.json();

      if (response.ok) {
        const mappedResult = {
          id: data.id,
          skills: data.skills,
          startup_type: data.startup_type,
          experience_level: data.experience_level,
          required_skills: data.required_skills || [],
          current_skills: data.current_skills || [],
          gap_skills: data.gap_skills || [],
          recommendations: data.recommendations || [],
          skill_areas: data.skill_areas || [],
          readiness_score: data.readiness_score,
          top_gaps: data.top_gaps || [],
          strengths: data.strengths || [],
          learning_path: data.learning_path || [],
          timeline_projection: data.timeline_projection || [],
          recommended_roles: data.recommended_roles || []
        };
        
        setResult(mappedResult);

        if (updateGlobalData && typeof updateGlobalData === 'function') {
          updateGlobalData("skillsData", {
            startupType: form.startupType,
            experience: form.experience,
            readinessScore: mappedResult.readiness_score,
            timestamp: new Date().toLocaleTimeString()
          });
        }

        // Save to local storage
        const saved = JSON.parse(localStorage.getItem("skills_reports") || "[]");
        saved.unshift({ 
          startupType: form.startupType,
          experience: form.experience,
          skills: form.skills,
          readinessScore: mappedResult.readiness_score,
          data: mappedResult,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem("skills_reports", JSON.stringify(saved.slice(0, 10)));
        setSavedReports(saved.slice(0, 10));

      } else {
        setError(data.error || data.message || "Failed to analyze skills gap. Please try again.");
      }
    } catch (err) {
      console.error("Skills analysis error:", err);
      setError("Connection error. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const getReadinessColor = (score) => {
    if (!score) return "#7878a0";
    if (score >= 70) return "#43e97b";
    if (score >= 50) return "#fbbf24";
    return "#ff6584";
  };

  const getGapColor = (required, current) => {
    const gap = required - current;
    if (gap <= 0) return "#43e97b";
    if (gap <= 20) return "#fbbf24";
    return "#ff6584";
  };

  const handleExport = () => {
    if (result) {
      const jsonStr = JSON.stringify(result, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `skills_gap_analysis_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const formatSkillAreaName = (name) => {
    return name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        globalData={globalData}
      />
      
      <div style={{ 
        marginLeft: "260px", 
        padding: "2rem",
        flex: 1,
        background: "var(--bg)",
        minHeight: "100vh"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          
          {/* Header Section */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #43e97b, #6c63ff)",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "Syne, sans-serif", color: "var(--text)", margin: 0 }}>
                  Skills Gap Analysis
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0.25rem 0 0" }}>
                  AI-powered skills assessment and personalized learning roadmap for your startup journey
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "2rem",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "1rem"
          }}>
            {[
              { id: "analysis", label: "Skills Analysis", icon: <Brain className="w-4 h-4" /> },
              { id: "saved", label: "Saved Reports", icon: <Bookmark className="w-4 h-4" />, count: savedReports.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: activeTab === tab.id ? "linear-gradient(135deg, #43e97b, #6c63ff)" : "transparent",
                  border: activeTab === tab.id ? "none" : "1px solid var(--border)",
                  borderRadius: "12px",
                  color: activeTab === tab.id ? "white" : "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "all 0.3s ease"
                }}
              >
                {tab.icon}
                {tab.label}
                {tab.count > 0 && (
                  <span style={{
                    background: "rgba(108,99,255,0.2)",
                    padding: "0.125rem 0.5rem",
                    borderRadius: "100px",
                    fontSize: "0.7rem",
                    color: "#6c63ff"
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === "analysis" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
              
              {/* Left Panel - Form */}
              <div style={{
                background: "var(--surface)",
                borderRadius: "20px",
                border: "1px solid var(--border)",
                padding: "2rem"
              }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)" }}>
                  <Target className="w-5 h-5" style={{ color: "#43e97b" }} />
                  Your Profile
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "1.5rem" }}>
                  Tell us about your skills and startup goals
                </p>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Startup Type *
                  </label>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: "0.5rem",
                    marginTop: "0.5rem"
                  }}>
                    {STARTUP_TYPES.map(type => (
                      <button
                        key={type.value}
                        onClick={() => setField("startupType", type.value)}
                        style={{
                          padding: "0.5rem",
                          background: form.startupType === type.value 
                            ? `linear-gradient(135deg, ${type.color}, ${type.color}dd)`
                            : "var(--surface2)",
                          border: form.startupType === type.value ? "none" : "1px solid var(--border)",
                          borderRadius: "8px",
                          color: form.startupType === type.value ? "white" : "var(--text)",
                          cursor: "pointer",
                          fontSize: "0.7rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.25rem",
                          transition: "all 0.3s ease"
                        }}
                      >
                        {type.icon}
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Years of Experience *
                  </label>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                    gap: "0.5rem",
                    marginTop: "0.5rem"
                  }}>
                    {EXPERIENCE_LEVELS.map(exp => (
                      <button
                        key={exp.value}
                        onClick={() => setField("experience", exp.value)}
                        style={{
                          padding: "0.5rem",
                          background: form.experience === exp.value 
                            ? `linear-gradient(135deg, ${exp.color}, ${exp.color}dd)`
                            : "var(--surface2)",
                          border: form.experience === exp.value ? "none" : "1px solid var(--border)",
                          borderRadius: "8px",
                          color: form.experience === exp.value ? "white" : "var(--text)",
                          cursor: "pointer",
                          fontSize: "0.7rem",
                          textAlign: "center",
                          transition: "all 0.3s ease"
                        }}
                      >
                        {exp.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Your Current Skills *
                  </label>
                  <textarea 
                    value={form.skills} 
                    onChange={e => setField("skills", e.target.value)} 
                    placeholder="List your technical and non-technical skills. Examples:&#10;- Programming: Python, JavaScript, React&#10;- Design: Figma, UI/UX principles&#10;- Business: Project management, marketing&#10;- Soft skills: Communication, leadership..."
                    rows={5}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      color: "var(--text)",
                      fontSize: "0.85rem",
                      resize: "vertical",
                      fontFamily: "inherit"
                    }}
                  />
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    {form.skills.length} characters (minimum 20)
                  </div>
                </div>

                {error && (
                  <div style={{
                    padding: "0.75rem",
                    background: "rgba(255,101,132,0.1)",
                    border: "1px solid rgba(255,101,132,0.3)",
                    borderRadius: "10px",
                    color: "#ff6584",
                    fontSize: "0.8rem",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <button
                  onClick={analyze}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    background: "linear-gradient(135deg, #43e97b, #6c63ff)",
                    border: "none",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "all 0.3s ease",
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? (
                    <>
                      <div className="spinner" style={{ width: 18, height: 18, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                      <span>Analyzing Your Skills...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" />
                      <span>Analyze Skills Gap</span>
                    </>
                  )}
                </button>

                {/* Info Cards */}
                <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                    Analysis includes:
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {[
                      "Skills heatmap & readiness score",
                      "Critical skill gaps identification",
                      "Personalized learning roadmap",
                      "Team building recommendations",
                      "6-month improvement projection"
                    ].map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        <CheckCircle className="w-3 h-3" style={{ color: "#43e97b" }} />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel - Results */}
              <div>
                {loading && (
                  <div style={{
                    background: "var(--surface)",
                    borderRadius: "20px",
                    border: "1px solid var(--border)",
                    padding: "3rem",
                    textAlign: "center"
                  }}>
                    <div className="spinner" style={{ width: 40, height: 40, margin: "0 auto 1rem", border: "3px solid var(--border)", borderTopColor: "#6c63ff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    <h4 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem", color: "var(--text)" }}>Analyzing Your Skills</h4>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      Our AI is evaluating your skills against startup requirements...
                    </p>
                    <div style={{ marginTop: "1rem" }}>
                      <div style={{
                        width: "100%",
                        height: 4,
                        background: "var(--surface2)",
                        borderRadius: 2,
                        overflow: "hidden"
                      }}>
                        <div style={{
                          width: "80%",
                          height: "100%",
                          background: "linear-gradient(90deg, #43e97b, #6c63ff)",
                          borderRadius: 2,
                          animation: "pulse 1.5s ease-in-out infinite"
                        }} />
                      </div>
                    </div>
                  </div>
                )}

                {result && (
                  <div style={{ animation: "fadeIn 0.5s ease-out" }}>
                    {/* Header with Actions */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                      <div>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--text)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <GraduationCap className="w-5 h-5" style={{ color: "#43e97b" }} />
                          Skills Assessment Report
                        </h3>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                          {selectedStartup?.label} · {selectedExp?.label} experience
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={handleExport}
                          style={{
                            padding: "0.5rem 1rem",
                            background: "var(--surface2)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            transition: "all 0.3s ease"
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = "#6c63ff"}
                          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                        >
                          <Download className="w-3 h-3" />
                          Export
                        </button>
                        <button
                          style={{
                            padding: "0.5rem",
                            background: "var(--surface2)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            cursor: "pointer"
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = "#6c63ff"}
                          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                        >
                          <Share2 className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                        </button>
                      </div>
                    </div>

                    {/* Readiness Score Card */}
                    {result.readiness_score !== undefined && (
                      <div style={{
                        padding: "1.5rem",
                        background: `linear-gradient(135deg, ${getReadinessColor(result.readiness_score)}20, transparent)`,
                        borderRadius: "16px",
                        border: `1px solid ${getReadinessColor(result.readiness_score)}40`,
                        marginBottom: "1.5rem",
                        textAlign: "center"
                      }}>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Overall Readiness Score</div>
                        <div style={{ fontSize: "3rem", fontWeight: "bold", color: getReadinessColor(result.readiness_score) }}>
                          {result.readiness_score}/100
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                          {result.readiness_score >= 70 ? "Well-prepared for launch!" : 
                           result.readiness_score >= 50 ? "On track, but gaps to address" : 
                           "Critical gaps need immediate attention"}
                        </div>
                      </div>
                    )}

                    {/* Skills Heatmap */}
                    {result.skill_areas && result.skill_areas.length > 0 && (
                      <div style={{
                        background: "var(--surface)",
                        borderRadius: "16px",
                        border: "1px solid var(--border)",
                        padding: "1.5rem",
                        marginBottom: "1.5rem"
                      }}>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)" }}>
                          <BarChart3 className="w-4 h-4" style={{ color: "#6c63ff" }} />
                          Skills Heatmap
                        </h4>
                        
                        {result.skill_areas.map((skill, idx) => {
                          const required = skill.required || 0;
                          const current = skill.current || 0;
                          const gapColor = getGapColor(required, current);
                          const areaName = formatSkillAreaName(skill.area);
                          
                          return (
                            <div key={idx} style={{ marginBottom: "1rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.35rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                  <span style={{ color: "var(--text)" }}>{areaName}</span>
                                  {skill.importance && (
                                    <span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>
                                      ({skill.importance})
                                    </span>
                                  )}
                                </div>
                                <span>
                                  <span style={{ color: gapColor }}>{current}</span>
                                  <span style={{ color: "var(--text-muted)" }}> / {required}</span>
                                </span>
                              </div>
                              <div style={{ background: "var(--surface2)", borderRadius: "8px", height: "8px", overflow: "hidden" }}>
                                <div style={{
                                  width: required > 0 ? `${(current / required) * 100}%` : "0%",
                                  height: "100%",
                                  background: `linear-gradient(90deg, ${gapColor}, ${gapColor}aa)`,
                                  borderRadius: "8px",
                                  transition: "width 0.5s ease"
                                }} />
                              </div>
                              {required > current && (
                                <div style={{ fontSize: "0.65rem", color: gapColor, textAlign: "right", marginTop: "0.25rem" }}>
                                  Gap: {required - current} points
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {result.top_gaps && result.top_gaps.length > 0 && (
                          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Critical gaps:</span>
                            {result.top_gaps.map((gap, i) => (
                              <span key={i} style={{
                                padding: "0.25rem 0.5rem",
                                background: "rgba(255,101,132,0.1)",
                                borderRadius: "100px",
                                fontSize: "0.65rem",
                                color: "#ff6584"
                              }}>
                                {formatSkillAreaName(gap)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Strengths */}
                    {result.strengths && result.strengths.length > 0 && (
                      <div style={{
                        padding: "1rem",
                        background: "rgba(67,233,123,0.05)",
                        borderRadius: "12px",
                        border: "1px solid rgba(67,233,123,0.2)",
                        marginBottom: "1.5rem"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                          <ThumbsUp className="w-4 h-4" style={{ color: "#43e97b" }} />
                          <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--text)" }}>Your Strengths</span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                          {result.strengths.map((strength, i) => (
                            <span key={i} style={{
                              padding: "0.25rem 0.75rem",
                              background: "rgba(67,233,123,0.1)",
                              borderRadius: "100px",
                              fontSize: "0.75rem",
                              color: "#43e97b"
                            }}>
                              {formatSkillAreaName(strength)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Team Building Recommendations */}
                    {result.recommended_roles && result.recommended_roles.length > 0 && (
                      <div style={{
                        background: "var(--surface)",
                        borderRadius: "16px",
                        border: "1px solid var(--border)",
                        padding: "1.5rem",
                        marginBottom: "1.5rem"
                      }}>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)" }}>
                          <Users className="w-4 h-4" style={{ color: "#38bdf8" }} />
                          Team Building Recommendations
                        </h4>
                        
                        {result.recommended_roles.map((role, i) => (
                          <div key={i} style={{
                            padding: "0.75rem",
                            background: "var(--surface2)",
                            borderRadius: "8px",
                            marginBottom: "0.5rem"
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                              <span style={{ fontWeight: "bold", color: "var(--text)" }}>{role.role}</span>
                              <span style={{ fontSize: "0.7rem", color: role.priority === "High" ? "#ff6584" : "#fbbf24" }}>
                                {role.priority} Priority · {role.timeline}
                              </span>
                            </div>
                            {role.reason && (
                              <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{role.reason}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Learning Path / Recommendations */}
                    {result.recommendations && result.recommendations.length > 0 && (
                      <div style={{
                        background: "var(--surface)",
                        borderRadius: "16px",
                        border: "1px solid var(--border)",
                        padding: "1.5rem",
                        marginBottom: "1.5rem"
                      }}>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)" }}>
                          <BookOpen className="w-4 h-4" style={{ color: "#43e97b" }} />
                          Recommendations
                        </h4>
                        
                        <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                          {result.recommendations.map((rec, i) => (
                            <li key={i} style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Learning Path - Detailed Resources */}
                    {result.learning_path && result.learning_path.length > 0 && (
                      <div style={{
                        background: "var(--surface)",
                        borderRadius: "16px",
                        border: "1px solid var(--border)",
                        padding: "1.5rem",
                        marginBottom: "1.5rem"
                      }}>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)" }}>
                          <GraduationCap className="w-4 h-4" style={{ color: "#6c63ff" }} />
                          Learning Path
                        </h4>
                        
                        {result.learning_path.map((path, i) => (
                          <div key={i} style={{ marginBottom: "1rem" }}>
                            <div style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#6c63ff", marginBottom: "0.5rem" }}>
                              {formatSkillAreaName(path.area)}
                            </div>
                            {path.resources && path.resources.length > 0 ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {path.resources.map((resource, idx) => (
                                  <div key={idx} style={{
                                    padding: "0.5rem",
                                    background: "var(--surface2)",
                                    borderRadius: "8px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "0.5rem"
                                  }}>
                                    <div>
                                      <div style={{ fontSize: "0.75rem", color: "var(--text)", fontWeight: "500" }}>{resource.name}</div>
                                      <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{resource.platform} · {resource.duration}</div>
                                    </div>
                                    {resource.url && (
                                      <a href={resource.url} target="_blank" rel="noopener noreferrer" style={{
                                        fontSize: "0.65rem",
                                        color: "#6c63ff",
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.25rem"
                                      }}>
                                        Start Learning
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Resources available upon request</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Timeline Projection */}
                    {result.timeline_projection && result.timeline_projection.length > 0 && (
                      <div style={{
                        background: "var(--surface)",
                        borderRadius: "16px",
                        border: "1px solid var(--border)",
                        padding: "1.5rem"
                      }}>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)" }}>
                          <LineChart className="w-4 h-4" style={{ color: "#38bdf8" }} />
                          Improvement Projection
                        </h4>
                        
                        <div style={{ marginBottom: "1rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                            {result.timeline_projection.map((point, i) => (
                              <div key={i} style={{ textAlign: "center", flex: 1 }}>
                                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                  {point.month !== undefined ? `Month ${point.month}` : point.timeline || point.period || ""}
                                </div>
                                {point.score !== undefined && (
                                  <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: getReadinessColor(point.score) }}>
                                    {point.score}
                                  </div>
                                )}
                                {point.milestone && (
                                  <div style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>{point.milestone}</div>
                                )}
                              </div>
                            ))}
                          </div>
                          <div style={{ height: "4px", background: "var(--surface2)", borderRadius: "2px", overflow: "hidden", marginBottom: "0.5rem" }}>
                            <div style={{
                              width: "100%",
                              height: "100%",
                              background: "linear-gradient(90deg, #ff6584, #fbbf24, #43e97b)",
                              borderRadius: "2px"
                            }} />
                          </div>
                        </div>

                        {/* Gap Skills Summary */}
                        {result.gap_skills && result.gap_skills.length > 0 && (
                          <div style={{
                            padding: "1rem",
                            background: "rgba(108,99,255,0.05)",
                            borderRadius: "8px",
                            marginTop: "1rem"
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                              <Lightbulb className="w-4 h-4" style={{ color: "#fbbf24" }} />
                              <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--text)" }}>Skills to Develop</span>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                              {result.gap_skills.map((skill, i) => (
                                <span key={i} style={{
                                  padding: "0.25rem 0.75rem",
                                  background: "rgba(255,101,132,0.1)",
                                  borderRadius: "100px",
                                  fontSize: "0.7rem",
                                  color: "#ff6584"
                                }}>
                                  {formatSkillAreaName(skill)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {!loading && !result && (
                  <div style={{
                    background: "var(--surface)",
                    borderRadius: "20px",
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
                      <Brain className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
                    </div>
                    <h4 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem", color: "var(--text)" }}>Ready to Analyze</h4>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      List your skills to get a visual heatmap and personalized learning roadmap
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginTop: "0.5rem" }}>
                      We'll analyze your skills against startup requirements and provide actionable recommendations
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Saved Reports Tab
            <div style={{
              background: "var(--surface)",
              borderRadius: "20px",
              border: "1px solid var(--border)",
              padding: "2rem"
            }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)" }}>
                <Bookmark className="w-5 h-5" style={{ color: "#6c63ff" }} />
                Saved Skills Reports
              </h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                Your previously analyzed skills gap reports
              </p>

              {savedReports.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                  <div style={{
                    width: 64,
                    height: 64,
                    background: "var(--surface2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem"
                  }}>
                    <Bookmark className="w-8 h-8" style={{ color: "var(--text-muted)" }} />
                  </div>
                  <p style={{ color: "var(--text-muted)" }}>No saved reports yet</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Run skills gap analysis and save reports to see them here</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {savedReports.map((report, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "1rem",
                        background: "var(--surface2)",
                        borderRadius: "12px",
                        border: "1px solid var(--border)",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#6c63ff"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                      onClick={() => {
                        setResult(report.data);
                        setActiveTab("analysis");
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--text)", marginBottom: "0.25rem" }}>
                            {report.startupType} · {report.experience}
                          </h4>
                          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                              <Target className="w-3 h-3" />
                              Score: {report.readinessScore}
                            </span>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                              <Calendar className="w-3 h-3" />
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {report.readinessScore && (
                          <div style={{
                            padding: "0.25rem 0.5rem",
                            background: `rgba(${getReadinessColor(report.readinessScore).slice(1,3)}, 0.1)`,
                            borderRadius: "4px",
                            fontSize: "0.65rem",
                            color: getReadinessColor(report.readinessScore)
                          }}>
                            {report.readinessScore}/100
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}