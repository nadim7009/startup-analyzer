import { useState, useEffect } from "react";
import {
  Target,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Shield,
  AlertCircle,
  CheckCircle,
  Star,
  Award,
  Zap,
  Eye,
  MapPin,
  Building2,
  Calendar,
  Activity,
  GitCompare,
  Crown,
  Sparkles,
  ChevronRight,
  Download,
  Share2,
  Bookmark,
  PieChart,
  LineChart,
  ThumbsUp,
  ThumbsDown,
  Info,
  ExternalLink,
  Globe,
  Briefcase,
  Search,
  Loader2
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const FOCUS_AREAS = [
  { value: "comprehensive", label: "Full Analysis", icon: <Target className="w-4 h-4" />, color: "#6c63ff" },
  { value: "funding", label: "Funding Focus", icon: <DollarSign className="w-4 h-4" />, color: "#43e97b" },
  { value: "features", label: "Feature Analysis", icon: <BarChart3 className="w-4 h-4" />, color: "#38bdf8" },
  { value: "reviews", label: "Sentiment Analysis", icon: <Star className="w-4 h-4" />, color: "#fbbf24" }
];

const REGIONS = [
  "Global", "North America", "Europe", "Asia Pacific", 
  "South Asia", "Bangladesh", "Middle East", "Africa", "Latin America"
];

export default function CompetitorIntelligence({ updateGlobalData }) {
  const [form, setForm] = useState({ 
    industry: "",
    idea_description: "",
    region: "Global",
    focusArea: "comprehensive"
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("analysis");
  const [savedReports, setSavedReports] = useState([]);
  const [searching, setSearching] = useState(false);
  const [activeModule, setActiveModule] = useState("competitors");

  // Get data for sidebar stats
  const ideas = JSON.parse(localStorage.getItem("saved_ideas") || "[]");
  const markets = JSON.parse(localStorage.getItem("market_reports") || "[]");
  const competitorsStats = JSON.parse(localStorage.getItem("competitor_reports") || "[]");
  const skills = JSON.parse(localStorage.getItem("skills_reports") || "[]");

  const globalData = {
    generatedIdeas: ideas,
    marketAnalyses: markets,
    competitors: competitorsStats,
    skillsAnalyses: skills
  };

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    try {
      const saved = localStorage.getItem("competitor_reports");
      if (saved) {
        setSavedReports(JSON.parse(saved).slice(0, 10));
      }
    } catch (err) {
      console.error("Error loading saved reports:", err);
      setSavedReports([]);
    }
  }, []);

  const validateForm = () => {
    if (!form.industry.trim()) {
      setError("Please enter your industry");
      return false;
    }
    if (!form.idea_description.trim()) {
      setError("Please describe your startup idea");
      return false;
    }
    if (form.idea_description.length < 20) {
      setError("Please provide more details about your idea (at least 20 characters)");
      return false;
    }
    return true;
  };

  // AI-powered competitor discovery
  const findCompetitors = async () => {
    if (!validateForm()) return;
    
    setError("");
    setSearching(true);
    setCompetitors([]);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Please login first");
        setSearching(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/competitors/discover/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          industry: form.industry,
          idea_description: form.idea_description,
          region: form.region
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCompetitors(data.competitors || []);
        if (data.competitors?.length === 0) {
          setError("No competitors found. Try a different industry or region.");
        }
      } else {
        setError(data.error || data.message || "Failed to find competitors. Please try again.");
      }
    } catch (err) {
      console.error("Competitor discovery error:", err);
      setError("Connection error. Please check if the backend server is running.");
    } finally {
      setSearching(false);
    }
  };

  // Analyze selected competitor
  const analyzeCompetitor = async (competitor) => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/competitors/analyze/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: competitor.name,
          website: competitor.website || "",
          industry: form.industry,
          idea_description: form.idea_description,
          region: form.region,
          focus_area: form.focusArea
        })
      });

      const data = await response.json();

      if (response.ok) {
        const mappedResult = {
          id: data.id,
          name: data.name,
          website: data.website,
          description: data.description,
          founded_year: data.founded_year,
          headquarters: data.headquarters,
          market_presence: data.market_presence,
          funding_stage: data.funding_stage,
          total_funding: data.total_funding,
          strengths: data.strengths || [],
          weaknesses: data.weaknesses || [],
          opportunities: data.opportunities || [],
          threats: data.threats || [],
          market_share: data.market_share,
          key_features: data.key_features || [],
          target_customers: data.target_customers || [],
          pricing_model: data.pricing_model,
          review_sentiment: data.review_sentiment,
          threat_score: data.threat_score,
          market_leader_status: data.market_leader_status
        };
        
        setSelectedCompetitor(mappedResult);
        setResult(mappedResult);

        if (updateGlobalData && typeof updateGlobalData === 'function') {
          updateGlobalData("competitors", { 
            name: competitor.name,
            industry: form.industry,
            timestamp: new Date().toLocaleTimeString(),
            threatScore: mappedResult.threat_score
          });
        }

        try {
          const saved = JSON.parse(localStorage.getItem("competitor_reports") || "[]");
          const newReport = { 
            name: competitor.name,
            industry: form.industry,
            region: form.region,
            focusArea: form.focusArea,
            data: mappedResult,
            createdAt: new Date().toISOString()
          };
          saved.unshift(newReport);
          const updatedReports = saved.slice(0, 10);
          localStorage.setItem("competitor_reports", JSON.stringify(updatedReports));
          setSavedReports(updatedReports);
        } catch (err) {
          console.error("Error saving report:", err);
        }

      } else {
        setError(data.error || data.message || "Failed to analyze competitor. Please try again.");
      }
    } catch (err) {
      console.error("Competitor analysis error:", err);
      setError("Connection error. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (result) {
      try {
        const jsonStr = JSON.stringify(result, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `competitor_analysis_${result.name}_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Export error:", err);
        setError("Failed to export report");
      }
    }
  };

  const getThreatColor = (score) => {
    if (!score) return "#7878a0";
    if (score < 4) return "#43e97b";
    if (score < 7) return "#fbbf24";
    return "#ff6584";
  };

  const CompetitorCard = ({ competitor }) => (
    <div style={{
      padding: "1.25rem",
      background: "var(--surface2)",
      borderRadius: "12px",
      border: "1px solid var(--border)",
      marginBottom: "1rem",
      transition: "all 0.3s ease"
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = "#6c63ff"}
    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <h4 style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--text)", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
            <Building2 className="w-4 h-4" style={{ color: "#6c63ff" }} />
            {competitor.name}
          </h4>
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem", flexWrap: "wrap" }}>
            {competitor.founded_year && (
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Calendar className="w-3 h-3" />
                Founded {competitor.founded_year}
              </span>
            )}
            {competitor.headquarters && (
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <MapPin className="w-3 h-3" />
                {competitor.headquarters}
              </span>
            )}
            {competitor.total_funding && (
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <DollarSign className="w-3 h-3" />
                {competitor.total_funding}
              </span>
            )}
            {competitor.funding_stage && (
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <TrendingUp className="w-3 h-3" />
                {competitor.funding_stage}
              </span>
            )}
          </div>
        </div>
        {competitor.market_share && (
          <div style={{
            padding: "0.25rem 0.75rem",
            background: "rgba(108,99,255,0.1)",
            borderRadius: "100px",
            fontSize: "0.7rem",
            color: "#6c63ff"
          }}>
            Market Share: {competitor.market_share}
          </div>
        )}
      </div>

      {competitor.description && (
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem", lineHeight: "1.5" }}>
          {competitor.description}
        </p>
      )}

      {competitor.key_features?.length > 0 && (
        <div style={{ marginBottom: "0.75rem" }}>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Key Features</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {competitor.key_features.slice(0, 3).map((feature, i) => (
              <span key={i} style={{
                padding: "0.125rem 0.5rem",
                background: "var(--surface)",
                borderRadius: "4px",
                fontSize: "0.7rem",
                color: "var(--text)"
              }}>
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {(competitor.strengths?.length > 0 || competitor.weaknesses?.length > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
          {competitor.strengths?.length > 0 && (
            <div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <ThumbsUp className="w-3 h-3" style={{ color: "#43e97b" }} />
                Strengths
              </div>
              <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.7rem", color: "var(--text)" }}>
                {competitor.strengths.slice(0, 2).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {competitor.weaknesses?.length > 0 && (
            <div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <ThumbsDown className="w-3 h-3" style={{ color: "#ff6584" }} />
                Weaknesses
              </div>
              <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.7rem", color: "var(--text)" }}>
                {competitor.weaknesses.slice(0, 2).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {competitor.pricing_model && (
        <div style={{
          padding: "0.5rem",
          background: "var(--surface)",
          borderRadius: "8px",
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          marginTop: "0.5rem"
        }}>
          <strong style={{ color: "#6c63ff" }}>Pricing:</strong> {competitor.pricing_model}
        </div>
      )}

      {competitor.review_sentiment && (
        <div style={{
          padding: "0.5rem",
          background: "var(--surface)",
          borderRadius: "8px",
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          marginTop: "0.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <Star className="w-3 h-3" style={{ color: "#fbbf24" }} />
          {competitor.review_sentiment}
        </div>
      )}

      {competitor.website && (
        <div style={{ marginTop: "0.75rem" }}>
          <a 
            href={competitor.website.startsWith('http') ? competitor.website : `https://${competitor.website}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "0.65rem",
              color: "#6c63ff",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem"
            }}
          >
            <ExternalLink className="w-3 h-3" />
            {competitor.website}
          </a>
        </div>
      )}
    </div>
  );

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
          
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #ff6584, #6c63ff)",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Target className="w-7 h-7" style={{ color: "white" }} />
              </div>
              <div>
                <h2 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "Syne, sans-serif", color: "var(--text)", margin: 0 }}>
                  Competitor Intelligence
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0.25rem 0 0" }}>
                  AI discovers competitors based on your idea and provides in-depth analysis
                </p>
              </div>
            </div>
          </div>

          <div style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "2rem",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "1rem"
          }}>
            {[
              { id: "analysis", label: "Competitor Analysis", icon: <Target className="w-4 h-4" /> },
              { id: "saved", label: "Saved Reports", icon: <Bookmark className="w-4 h-4" />, count: savedReports.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: activeTab === tab.id ? "linear-gradient(135deg, #ff6584, #6c63ff)" : "transparent",
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
                  <Eye className="w-5 h-5" style={{ color: "#ff6584" }} />
                  Find Competitors
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "1.5rem" }}>
                  Tell us about your startup, and AI will discover relevant competitors
                </p>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Industry *
                  </label>
                  <input 
                    type="text"
                    value={form.industry}
                    onChange={e => setField("industry", e.target.value)}
                    placeholder="e.g., FinTech, SaaS, E-commerce, AI/ML"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      color: "var(--text)",
                      fontSize: "0.85rem"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Your Startup Idea / Product Description *
                  </label>
                  <textarea 
                    value={form.idea_description}
                    onChange={e => setField("idea_description", e.target.value)}
                    placeholder="Describe your startup idea in detail. Include: problem solved, target audience, key features, unique value proposition..."
                    rows={4}
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
                    {form.idea_description.length} characters (minimum 20)
                  </div>
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Target Region
                  </label>
                  <select
                    value={form.region}
                    onChange={e => setField("region", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      color: "var(--text)",
                      cursor: "pointer",
                      fontSize: "0.85rem"
                    }}
                  >
                    {REGIONS.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Focus Area
                  </label>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                    gap: "0.5rem",
                    marginTop: "0.5rem"
                  }}>
                    {FOCUS_AREAS.map(area => (
                      <button
                        key={area.value}
                        onClick={() => setField("focusArea", area.value)}
                        style={{
                          padding: "0.5rem",
                          background: form.focusArea === area.value 
                            ? `linear-gradient(135deg, ${area.color}, ${area.color}dd)`
                            : "var(--surface2)",
                          border: form.focusArea === area.value ? "none" : "1px solid var(--border)",
                          borderRadius: "8px",
                          color: form.focusArea === area.value ? "white" : "var(--text)",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.25rem",
                          transition: "all 0.3s ease"
                        }}
                      >
                        {area.icon}
                        {area.label}
                      </button>
                    ))}
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
                  onClick={findCompetitors}
                  disabled={searching}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    background: "linear-gradient(135deg, #ff6584, #6c63ff)",
                    border: "none",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    cursor: searching ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "all 0.3s ease",
                    opacity: searching ? 0.7 : 1
                  }}
                >
                  {searching ? (
                    <>
                      <Loader2 className="w-4 h-4" style={{ animation: "spin 1s linear infinite" }} />
                      <span>Discovering Competitors...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Find Competitors</span>
                    </>
                  )}
                </button>

                {competitors.length > 0 && (
                  <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                    <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--text)", marginBottom: "1rem" }}>
                      Found {competitors.length} Competitors:
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {competitors.map((comp, idx) => (
                        <button
                          key={idx}
                          onClick={() => analyzeCompetitor(comp)}
                          style={{
                            padding: "0.75rem",
                            background: "var(--surface2)",
                            border: "1px solid var(--border)",
                            borderRadius: "10px",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.2s ease",
                            width: "100%"
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = "#6c63ff"}
                          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <Building2 className="w-4 h-4" style={{ color: "#6c63ff" }} />
                            <div>
                              <div style={{ fontWeight: "bold", color: "var(--text)" }}>{comp.name}</div>
                              {comp.description && (
                                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{comp.description.slice(0, 60)}...</div>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4" style={{ marginLeft: "auto", color: "var(--text-muted)" }} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                    Analysis includes:
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {[
                      "AI-powered competitor discovery",
                      "Strengths & weaknesses analysis",
                      "Funding & investment details",
                      "Feature comparison",
                      "Market positioning & share",
                      "Threat assessment score",
                      "Target customer analysis"
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
                    <div style={{ width: 40, height: 40, margin: "0 auto 1rem", border: "3px solid var(--border)", borderTopColor: "#6c63ff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    <h4 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem", color: "var(--text)" }}>Analyzing Competitor</h4>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      Our AI is analyzing competitor data, funding, and market position...
                    </p>
                  </div>
                )}

                {result && (
                  <div style={{ animation: "fadeIn 0.5s ease-out" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                      <div>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--text)", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
                          <Target className="w-5 h-5" style={{ color: "#ff6584" }} />
                          Competitor Analysis Report
                        </h3>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                          {result.name} · {form.industry} · {form.region}
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
                      </div>
                    </div>

                    {result.threat_score && (
                      <div style={{
                        padding: "1rem",
                        background: `linear-gradient(135deg, ${getThreatColor(result.threat_score)}20, transparent)`,
                        borderLeft: `4px solid ${getThreatColor(result.threat_score)}`,
                        borderRadius: "12px",
                        marginBottom: "1.5rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem"
                      }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Shield className="w-4 h-4" style={{ color: getThreatColor(result.threat_score) }} />
                            <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--text)" }}>Threat Assessment</span>
                          </div>
                          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: getThreatColor(result.threat_score) }}>
                            {result.threat_score}/10
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                            {result.threat_score >= 7 ? "High Threat Level" : result.threat_score >= 4 ? "Medium Threat Level" : "Low Threat Level"}
                          </div>
                        </div>
                        {result.market_leader_status !== undefined && (
                          <div style={{
                            padding: "0.5rem 1rem",
                            background: result.market_leader_status ? "rgba(255,101,132,0.1)" : "rgba(67,233,123,0.1)",
                            borderRadius: "8px"
                          }}>
                            <span style={{ fontSize: "0.7rem", color: result.market_leader_status ? "#ff6584" : "#43e97b" }}>
                              {result.market_leader_status ? "Market Leader" : "Challenger"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <CompetitorCard competitor={result} />

                    {(result.opportunities?.length > 0 || result.threats?.length > 0) && (
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem",
                        marginTop: "1rem"
                      }}>
                        {result.opportunities?.length > 0 && (
                          <div style={{ padding: "1rem", background: "var(--surface2)", borderRadius: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                              <Zap className="w-4 h-4" style={{ color: "#43e97b" }} />
                              <h4 style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--text)", margin: 0 }}>Opportunities</h4>
                            </div>
                            <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                              {result.opportunities.map((opp, i) => (
                                <li key={i} style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{opp}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {result.threats?.length > 0 && (
                          <div style={{ padding: "1rem", background: "var(--surface2)", borderRadius: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                              <AlertCircle className="w-4 h-4" style={{ color: "#ff6584" }} />
                              <h4 style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--text)", margin: 0 }}>Threats</h4>
                            </div>
                            <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                              {result.threats.map((threat, i) => (
                                <li key={i} style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{threat}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {result.target_customers?.length > 0 && (
                      <div style={{
                        padding: "1rem",
                        background: "var(--surface2)",
                        borderRadius: "12px",
                        marginTop: "1rem"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                          <Users className="w-4 h-4" style={{ color: "#38bdf8" }} />
                          <h4 style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--text)", margin: 0 }}>Target Customers</h4>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                          {result.target_customers.map((customer, i) => (
                            <span key={i} style={{
                              padding: "0.25rem 0.75rem",
                              background: "rgba(56,189,248,0.1)",
                              borderRadius: "100px",
                              fontSize: "0.7rem",
                              color: "#38bdf8"
                            }}>
                              {customer}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!loading && !searching && !result && competitors.length === 0 && (
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
                      <Search className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
                    </div>
                    <h4 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem", color: "var(--text)" }}>Discover Competitors</h4>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      Enter your industry and idea, then click "Find Competitors"
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginTop: "0.5rem" }}>
                      AI will discover relevant competitors and provide detailed analysis
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{
              background: "var(--surface)",
              borderRadius: "20px",
              border: "1px solid var(--border)",
              padding: "2rem"
            }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)" }}>
                <Bookmark className="w-5 h-5" style={{ color: "#6c63ff" }} />
                Saved Competitor Reports
              </h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                Your previously analyzed competitor reports
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
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Run competitor analysis and save reports to see them here</p>
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
                        setSelectedCompetitor(report.data);
                        setActiveTab("analysis");
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--text)", marginBottom: "0.25rem" }}>
                            {report.name}
                          </h4>
                          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                              <Briefcase className="w-3 h-3" />
                              {report.industry}
                            </span>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                              <MapPin className="w-3 h-3" />
                              {report.region}
                            </span>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                              <Calendar className="w-3 h-3" />
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {report.data.threat_score && (
                          <div style={{
                            padding: "0.25rem 0.5rem",
                            background: `rgba(${parseInt(getThreatColor(report.data.threat_score).slice(1,3), 16)}, ${parseInt(getThreatColor(report.data.threat_score).slice(3,5), 16)}, ${parseInt(getThreatColor(report.data.threat_score).slice(5,7), 16)}, 0.1)`,
                            borderRadius: "4px",
                            fontSize: "0.65rem",
                            color: getThreatColor(report.data.threat_score)
                          }}>
                            Threat: {report.data.threat_score}/10
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}