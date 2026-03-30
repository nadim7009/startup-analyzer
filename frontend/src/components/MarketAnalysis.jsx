import { useState, useEffect } from "react";
import {
  Globe,
  TrendingUp,
  BarChart3,
  Shield,
  Users,
  DollarSign,
  Zap,
  Target,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Download,
  Share2,
  Bookmark,
  Eye,
  MapPin,
  Building2,
  Clock,
  Award,
  Lightbulb,
  ChevronRight,
  Sparkles,
  PieChart,
  LineChart,
  Activity,
  Battery,
  Scale,
  Calculator,
  FileSpreadsheet
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const INDUSTRIES = [
  { value: "FinTech", label: "FinTech", icon: "💰", color: "#6c63ff", description: "Financial technology & digital banking" },
  { value: "HealthTech", label: "HealthTech", icon: "🏥", color: "#38bdf8", description: "Healthcare innovation & telemedicine" },
  { value: "EdTech", label: "EdTech", icon: "📚", color: "#43e97b", description: "Education technology & e-learning" },
  { value: "AgriTech", label: "AgriTech", icon: "🌾", color: "#fbbf24", description: "Agricultural technology & farming" },
  { value: "CleanTech", label: "CleanTech", icon: "🌱", color: "#34d399", description: "Sustainable energy & environment" },
  { value: "Logistics", label: "Logistics", icon: "🚚", color: "#f97316", description: "Supply chain & delivery" },
  { value: "Retail", label: "Retail", icon: "🛍️", color: "#ec489a", description: "E-commerce & retail innovation" },
  { value: "AI/ML", label: "AI/ML", icon: "🤖", color: "#a855f7", description: "Artificial intelligence & machine learning" },
  { value: "Cybersecurity", label: "Cybersecurity", icon: "🔒", color: "#ef4444", description: "Security solutions & protection" },
  { value: "Gaming", label: "Gaming", icon: "🎮", color: "#f43f5e", description: "Interactive entertainment & esports" }
];

const REGIONS = [
  { value: "Bangladesh", label: "Bangladesh", icon: "🇧🇩" },
  { value: "South Asia", label: "South Asia", icon: "🌏" },
  { value: "Southeast Asia", label: "Southeast Asia", icon: "🌴" },
  { value: "Africa", label: "Africa", icon: "🌍" },
  { value: "Middle East", label: "Middle East", icon: "🕌" },
  { value: "Europe", label: "Europe", icon: "🇪🇺" },
  { value: "North America", label: "North America", icon: "🇺🇸" },
  { value: "Latin America", label: "Latin America", icon: "🌎" },
  { value: "Global", label: "Global", icon: "🌐" }
];

export default function MarketAnalysis({ updateGlobalData }) {
  const [form, setForm] = useState({ 
    industry: "FinTech", 
    region: "Bangladesh", 
    compareWith: "South Asia" 
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [compareResult, setCompareResult] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("research");
  const [savedReports, setSavedReports] = useState([]);
  const [activeModule, setActiveModule] = useState("market");

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

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const selectedIndustry = INDUSTRIES.find(i => i.value === form.industry);
  const selectedRegion = REGIONS.find(r => r.value === form.region);
  const selectedCompareRegion = REGIONS.find(r => r.value === form.compareWith);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("market_reports");
      if (saved) {
        setSavedReports(JSON.parse(saved).slice(0, 10));
      }
    } catch (err) {
      console.error("Error loading saved reports:", err);
      setSavedReports([]);
    }
  }, []);

  const doResearch = async () => {
    setError("");
    setLoading(true);
    setResult(null);
    setCompareResult(null);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/market-analysis/analyze/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          industry: form.industry,
          region: form.region
        })
      });

      const data = await response.json();

      if (response.ok) {
        const mappedResult = {
          id: data.id,
          industry: data.industry,
          region: data.region,
          market_size_tam: data.market_size_tam,
          market_size_sam: data.market_size_sam,
          market_size_som: data.market_size_som,
          growth_rate: data.growth_rate,
          key_trends: data.key_trends || [],
          customer_segments: data.customer_segments || [],
          market_drivers: data.market_drivers || [],
          market_barriers: data.market_barriers || [],
          regulatory_factors: data.regulatory_factors || [],
          analysis_summary: data.analysis_summary,
          market_maturity: data.market_maturity,
          competition_intensity: data.competition_intensity,
          opportunity_score: data.opportunity_score,
          entry_strategies: data.entry_strategies || []
        };
        
        setResult(mappedResult);

        if (updateGlobalData && typeof updateGlobalData === 'function') {
          updateGlobalData("marketAnalyses", { 
            industry: form.industry, 
            region: form.region, 
            timestamp: new Date().toLocaleTimeString(),
            summary: mappedResult.analysis_summary
          });
        }

        try {
          const saved = JSON.parse(localStorage.getItem("market_reports") || "[]");
          const newReport = { 
            type: "research",
            industry: form.industry, 
            region: form.region, 
            data: mappedResult,
            createdAt: new Date().toISOString()
          };
          saved.unshift(newReport);
          const updatedReports = saved.slice(0, 10);
          localStorage.setItem("market_reports", JSON.stringify(updatedReports));
          setSavedReports(updatedReports);
        } catch (err) {
          console.error("Error saving report:", err);
        }

      } else {
        setError(data.error || data.message || "Failed to analyze market. Please try again.");
      }
    } catch (err) {
      console.error("Market research error:", err);
      setError("Connection error. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const doCompare = async () => {
    setError("");
    setLoading(true);
    setCompareResult(null);
    setResult(null);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/market-analysis/compare/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          industry: form.industry,
          region_a: form.region,
          region_b: form.compareWith
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCompareResult(data);
        
        try {
          const saved = JSON.parse(localStorage.getItem("market_reports") || "[]");
          const newReport = { 
            type: "comparison",
            industry: form.industry, 
            region: form.region,
            compareWith: form.compareWith,
            data: data,
            createdAt: new Date().toISOString()
          };
          saved.unshift(newReport);
          const updatedReports = saved.slice(0, 10);
          localStorage.setItem("market_reports", JSON.stringify(updatedReports));
          setSavedReports(updatedReports);
        } catch (err) {
          console.error("Error saving comparison:", err);
        }

      } else {
        setError(data.error || data.message || "Failed to compare markets. Please try again.");
      }
    } catch (err) {
      console.error("Market comparison error:", err);
      setError("Connection error. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const data = tab === "research" ? result : compareResult;
    if (data) {
      try {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${tab === "research" ? "market_research" : "market_comparison"}_${form.industry}_${new Date().toISOString()}.json`;
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

  const exportToExcel = () => {
    const data = tab === "research" ? result : compareResult;
    if (!data) return;

    try {
      let csvContent = "";
      
      if (tab === "research") {
        csvContent = `"Market Research Report"\n`;
        csvContent += `"Industry","${form.industry}"\n`;
        csvContent += `"Region","${form.region}"\n`;
        csvContent += `"Date","${new Date().toLocaleString()}"\n\n`;
        
        csvContent += `"METRIC","VALUE"\n`;
        csvContent += `"TAM","${data.market_size_tam || 'N/A'}"\n`;
        csvContent += `"SAM","${data.market_size_sam || 'N/A'}"\n`;
        csvContent += `"SOM","${data.market_size_som || 'N/A'}"\n`;
        csvContent += `"Growth Rate","${data.growth_rate || 'N/A'}"\n`;
        csvContent += `"Market Maturity","${data.market_maturity || 'N/A'}"\n`;
        csvContent += `"Competition Intensity","${data.competition_intensity || 'N/A'}"\n`;
        csvContent += `"Opportunity Score","${data.opportunity_score || 'N/A'}/10"\n\n`;
        
        if (data.market_drivers && data.market_drivers.length > 0) {
          csvContent += `"MARKET DRIVERS"\n`;
          data.market_drivers.forEach(driver => {
            csvContent += `"Driver","${driver.replace(/"/g, '""')}"\n`;
          });
          csvContent += `\n`;
        }
        
        if (data.market_barriers && data.market_barriers.length > 0) {
          csvContent += `"MARKET BARRIERS"\n`;
          data.market_barriers.forEach(barrier => {
            csvContent += `"Barrier","${barrier.replace(/"/g, '""')}"\n`;
          });
          csvContent += `\n`;
        }
        
        if (data.key_trends && data.key_trends.length > 0) {
          csvContent += `"KEY TRENDS"\n`;
          data.key_trends.forEach(trend => {
            csvContent += `"Trend","${trend.replace(/"/g, '""')}"\n`;
          });
          csvContent += `\n`;
        }
        
        if (data.customer_segments && data.customer_segments.length > 0) {
          csvContent += `"CUSTOMER SEGMENTS"\n`;
          data.customer_segments.forEach(segment => {
            csvContent += `"Segment","${segment.replace(/"/g, '""')}"\n`;
          });
          csvContent += `\n`;
        }
        
        if (data.regulatory_factors && data.regulatory_factors.length > 0) {
          csvContent += `"REGULATORY FACTORS"\n`;
          data.regulatory_factors.forEach(factor => {
            csvContent += `"Factor","${factor.replace(/"/g, '""')}"\n`;
          });
          csvContent += `\n`;
        }
        
        if (data.entry_strategies && data.entry_strategies.length > 0) {
          csvContent += `"ENTRY STRATEGIES"\n`;
          data.entry_strategies.forEach(strategy => {
            csvContent += `"Strategy","${strategy.replace(/"/g, '""')}"\n`;
          });
          csvContent += `\n`;
        }
        
        if (data.analysis_summary) {
          csvContent += `"EXECUTIVE SUMMARY"\n`;
          csvContent += `"Summary","${data.analysis_summary.replace(/"/g, '""')}"\n`;
        }
        
      } else {
        csvContent = `"Market Comparison Report"\n`;
        csvContent += `"Industry","${form.industry}"\n`;
        csvContent += `"Market A","${form.region}"\n`;
        csvContent += `"Market B","${form.compareWith}"\n`;
        csvContent += `"Date","${new Date().toLocaleString()}"\n\n`;
        
        csvContent += `"METRIC","${form.region}","${form.compareWith}"\n`;
        
        const metrics = [];
        if (compareResult) {
          Object.entries(compareResult).forEach(([key, value]) => {
            if (key !== "region_a" && key !== "region_b" && key !== "error" && key !== "verdict" && key !== "hybrid_strategy") {
              if (typeof value === "object" && value !== null) {
                metrics.push({
                  metric: key.replace(/_/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
                  valueA: value[form.region] || value[0] || "N/A",
                  valueB: value[form.compareWith] || value[1] || "N/A"
                });
              }
            }
          });
        }
        
        metrics.forEach(metric => {
          csvContent += `"${metric.metric}","${metric.valueA}","${metric.valueB}"\n`;
        });
        
        if (compareResult.verdict) {
          csvContent += `\n"VERDICT","${compareResult.verdict.replace(/"/g, '""')}",""\n`;
        }
        
        if (compareResult.hybrid_strategy) {
          csvContent += `"HYBRID STRATEGY","${compareResult.hybrid_strategy.replace(/"/g, '""')}",""\n`;
        }
      }
      
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tab === "research" ? "market_research" : "market_comparison"}_${form.industry}_${new Date().toISOString().slice(0, 19)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Excel export error:", err);
      setError("Failed to export to Excel");
    }
  };

  const MetricCard = ({ icon: Icon, title, value, color, onClick }) => (
    <div 
      onClick={onClick}
      style={{
        padding: "1rem",
        background: "var(--surface2)",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color || "#6c63ff"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
        <Icon className="w-4 h-4" style={{ color: color || "#6c63ff" }} />
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{title}</span>
      </div>
      <div style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--text)" }}>{value}</div>
    </div>
  );

  const renderResearchResult = () => {
    if (!result) return null;
    
    return (
      <div style={{ animation: "fadeIn 0.5s ease-out" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: 40,
              height: 40,
              background: `linear-gradient(135deg, ${selectedIndustry?.color || "#6c63ff"}, ${selectedIndustry?.color || "#6c63ff"}dd)`,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem"
            }}>
              {selectedIndustry?.icon || "📊"}
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--text)", margin: 0 }}>
                {form.industry} Market Research
              </h3>
              <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem", margin: "0.25rem 0 0" }}>
                <MapPin className="w-3 h-3" />
                {form.region}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={exportToExcel}
              style={{
                padding: "0.5rem",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#43e97b"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              title="Export to Excel"
            >
              <FileSpreadsheet className="w-4 h-4" style={{ color: "#43e97b" }} />
            </button>
            <button
              onClick={handleExport}
              style={{
                padding: "0.5rem",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#6c63ff"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              title="Export as JSON"
            >
              <Download className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            </button>
            <button
              style={{
                padding: "0.5rem",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#6c63ff"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              title="Share"
            >
              <Share2 className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            </button>
            <button
              style={{
                padding: "0.5rem",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#6c63ff"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              title="Save"
            >
              <Bookmark className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "0.75rem",
          marginBottom: "1.5rem"
        }}>
          {result.market_size_tam && <MetricCard icon={DollarSign} title="TAM" value={result.market_size_tam} color="#43e97b" />}
          {result.market_size_sam && <MetricCard icon={Target} title="SAM" value={result.market_size_sam} color="#38bdf8" />}
          {result.market_size_som && <MetricCard icon={Zap} title="SOM" value={result.market_size_som} color="#fbbf24" />}
          {result.growth_rate && <MetricCard icon={TrendingUp} title="Growth Rate" value={result.growth_rate} color="#6c63ff" />}
          {result.opportunity_score && <MetricCard icon={Award} title="Opportunity Score" value={`${result.opportunity_score}/10`} color="#fbbf24" />}
          {result.market_maturity && <MetricCard icon={Activity} title="Maturity Stage" value={result.market_maturity} color="#6c63ff" />}
          {result.competition_intensity && <MetricCard icon={Shield} title="Competition" value={result.competition_intensity} color="#ff6584" />}
        </div>

        {(result.market_drivers?.length > 0 || result.market_barriers?.length > 0) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            {result.market_drivers?.length > 0 && (
              <div style={{ padding: "1rem", background: "var(--surface2)", borderRadius: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <Zap className="w-4 h-4" style={{ color: "#43e97b" }} />
                  <h4 style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--text)", margin: 0 }}>Market Drivers</h4>
                </div>
                <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                  {result.market_drivers.map((driver, i) => (
                    <li key={i} style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                      {driver}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.market_barriers?.length > 0 && (
              <div style={{ padding: "1rem", background: "var(--surface2)", borderRadius: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <AlertCircle className="w-4 h-4" style={{ color: "#ff6584" }} />
                  <h4 style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--text)", margin: 0 }}>Market Barriers</h4>
                </div>
                <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                  {result.market_barriers.map((barrier, i) => (
                    <li key={i} style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                      {barrier}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {result.key_trends?.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <h4 style={{ fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)" }}>
              <TrendingUp className="w-4 h-4" style={{ color: "#38bdf8" }} />
              Key Trends
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {result.key_trends.map((trend, i) => (
                <span key={i} style={{
                  padding: "0.25rem 0.75rem",
                  background: "rgba(56,189,248,0.1)",
                  borderRadius: "100px",
                  fontSize: "0.75rem",
                  color: "#38bdf8"
                }}>
                  {trend}
                </span>
              ))}
            </div>
          </div>
        )}

        {result.customer_segments?.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <h4 style={{ fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)" }}>
              <Users className="w-4 h-4" style={{ color: "#43e97b" }} />
              Customer Segments
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {result.customer_segments.map((segment, i) => (
                <span key={i} style={{
                  padding: "0.25rem 0.75rem",
                  background: "rgba(67,233,123,0.1)",
                  borderRadius: "100px",
                  fontSize: "0.75rem",
                  color: "#43e97b"
                }}>
                  {segment}
                </span>
              ))}
            </div>
          </div>
        )}

        {result.regulatory_factors?.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <h4 style={{ fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)" }}>
              <Shield className="w-4 h-4" style={{ color: "#ff6584" }} />
              Regulatory Factors
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {result.regulatory_factors.map((factor, i) => (
                <span key={i} style={{
                  padding: "0.25rem 0.75rem",
                  background: "rgba(255,101,132,0.1)",
                  borderRadius: "100px",
                  fontSize: "0.75rem",
                  color: "#ff6584"
                }}>
                  {factor}
                </span>
              ))}
            </div>
          </div>
        )}

        {result.entry_strategies?.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <h4 style={{ fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)" }}>
              <Target className="w-4 h-4" style={{ color: "#6c63ff" }} />
              Entry Strategies
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {result.entry_strategies.map((strategy, i) => (
                <div key={i} style={{
                  padding: "0.75rem",
                  background: "rgba(108,99,255,0.05)",
                  borderRadius: "10px",
                  border: "1px solid rgba(108,99,255,0.2)",
                  fontSize: "0.8rem",
                  color: "var(--text)"
                }}>
                  {strategy}
                </div>
              ))}
            </div>
          </div>
        )}

        {result.analysis_summary && (
          <div style={{
            padding: "1rem",
            background: "linear-gradient(135deg, rgba(108,99,255,0.05), rgba(255,101,132,0.03))",
            borderRadius: "12px",
            border: "1px solid rgba(108,99,255,0.2)",
            marginTop: "1rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Lightbulb className="w-4 h-4" style={{ color: "#fbbf24" }} />
              <h4 style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--text)", margin: 0 }}>Executive Summary</h4>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
              {result.analysis_summary}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderComparisonResult = () => {
    if (!compareResult) return null;
    
    const comparisonMetrics = [];
    if (compareResult) {
      Object.entries(compareResult).forEach(([key, value]) => {
        if (key !== "region_a" && key !== "region_b" && key !== "error" && key !== "verdict" && key !== "hybrid_strategy") {
          if (typeof value === "object" && value !== null) {
            comparisonMetrics.push({
              metric: key.replace(/_/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
              valueA: value[form.region] || value[0] || "N/A",
              valueB: value[form.compareWith] || value[1] || "N/A"
            });
          }
        }
      });
    }
    
    return (
      <div style={{ animation: "fadeIn 0.5s ease-out" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 40,
              height: 40,
              background: `linear-gradient(135deg, ${selectedIndustry?.color || "#6c63ff"}, ${selectedIndustry?.color || "#6c63ff"}dd)`,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem"
            }}>
              {selectedIndustry?.icon || "📊"}
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--text)", margin: 0 }}>
                Market Comparison: {form.region} vs {form.compareWith}
              </h3>
              <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>{form.industry}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={exportToExcel}
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
                color: "#43e97b",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#43e97b"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <FileSpreadsheet className="w-3 h-3" />
              Export to Excel
            </button>
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
              Export JSON
            </button>
          </div>
        </div>

        <div style={{
          background: "var(--surface)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          overflow: "hidden",
          marginBottom: "1.5rem"
        }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(108,99,255,0.1), rgba(255,101,132,0.05))",
            padding: "1rem",
            borderBottom: "1px solid var(--border)"
          }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--text)", margin: 0 }}>
              Market Comparison Dashboard
            </h4>
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Side-by-side comparison of {form.region} vs {form.compareWith}
            </p>
          </div>
          
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface2)", borderBottom: "2px solid var(--border)" }}>
                <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)", fontSize: "0.85rem", fontWeight: "600" }}>
                  Metric
                </th>
                <th style={{ padding: "1rem", textAlign: "left", color: "#6c63ff", fontSize: "0.85rem", fontWeight: "600", borderLeft: "1px solid var(--border)" }}>
                  {form.region}
                </th>
                <th style={{ padding: "1rem", textAlign: "left", color: "#ff6584", fontSize: "0.85rem", fontWeight: "600", borderLeft: "1px solid var(--border)" }}>
                  {form.compareWith}
                </th>
                <th style={{ padding: "1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: "500", borderLeft: "1px solid var(--border)" }}>
                  Winner
                </th>
               </tr>
            </thead>
            <tbody>
              {comparisonMetrics.map((metric, idx) => {
                let winner = "";
                let winnerColor = "";
                const metricLower = metric.metric.toLowerCase();
                
                const parseValue = (val) => {
                  const num = parseFloat(val);
                  return isNaN(num) ? null : num;
                };
                
                const numA = parseValue(metric.valueA);
                const numB = parseValue(metric.valueB);
                
                if (metricLower.includes("size") || metricLower.includes("tam") || metricLower.includes("sam") || metricLower.includes("som") || metricLower.includes("growth") || metricLower.includes("opportunity")) {
                  if (numA !== null && numB !== null) {
                    winner = numA > numB ? form.region : numB > numA ? form.compareWith : "Equal";
                  } else {
                    winner = "Compare";
                  }
                } else if (metricLower.includes("competition") || metricLower.includes("regulatory") || metricLower.includes("barrier")) {
                  if (numA !== null && numB !== null) {
                    winner = numA < numB ? form.region : numB < numA ? form.compareWith : "Equal";
                  } else {
                    winner = "Compare";
                  }
                } else {
                  winner = "Compare";
                }
                
                if (winner === form.region) winnerColor = "#6c63ff";
                else if (winner === form.compareWith) winnerColor = "#ff6584";
                else if (winner === "Equal") winnerColor = "#43e97b";
                else winnerColor = "var(--text-muted)";
                
                return (
                  <tr key={idx} style={{ borderBottom: idx === comparisonMetrics.length - 1 ? "none" : "1px solid var(--border)" }}>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.8rem", color: "var(--text)", fontWeight: "500" }}>
                      {metric.metric}
                    </td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.8rem", color: "var(--text)", borderLeft: "1px solid var(--border)" }}>
                      {metric.valueA}
                    </td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.8rem", color: "var(--text)", borderLeft: "1px solid var(--border)" }}>
                      {metric.valueB}
                    </td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.75rem", textAlign: "center", borderLeft: "1px solid var(--border)" }}>
                      {winner !== "Compare" && winner !== "Equal" && (
                        <span style={{
                          display: "inline-block",
                          padding: "0.2rem 0.5rem",
                          background: `${winnerColor}20`,
                          color: winnerColor,
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          fontWeight: "600"
                        }}>
                          ✓ {winner}
                        </span>
                      )}
                      {winner === "Equal" && (
                        <span style={{ color: "#43e97b", fontSize: "0.7rem", fontWeight: "600" }}>Equal</span>
                      )}
                      {winner === "Compare" && (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {compareResult.verdict && (
          <div style={{
            padding: "1rem",
            background: "linear-gradient(135deg, rgba(108,99,255,0.05), rgba(255,101,132,0.03))",
            borderRadius: "12px",
            border: "1px solid rgba(108,99,255,0.2)",
            marginTop: "1rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Award className="w-4 h-4" style={{ color: "#fbbf24" }} />
              <h4 style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--text)", margin: 0 }}>Verdict</h4>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
              {compareResult.verdict}
            </p>
            {compareResult.hybrid_strategy && (
              <div style={{ marginTop: "0.75rem", padding: "0.5rem", background: "rgba(108,99,255,0.05)", borderRadius: "8px" }}>
                <p style={{ fontSize: "0.75rem", color: "#6c63ff", fontWeight: "500", margin: 0 }}>
                  💡 {compareResult.hybrid_strategy}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
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
          
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #38bdf8, #6c63ff)",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <BarChart3 className="w-7 h-7" style={{ color: "white" }} />
              </div>
              <div>
                <h2 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "Syne, sans-serif", color: "var(--text)", margin: 0 }}>
                  Market Intelligence
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0.25rem 0 0" }}>
                  AI-powered market research and comparative analysis
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
              { id: "research", label: "Market Research", icon: <Target className="w-4 h-4" /> },
              { id: "compare", label: "Compare Markets", icon: <Scale className="w-4 h-4" /> }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  setResult(null);
                  setCompareResult(null);
                  setError("");
                }}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: tab === t.id ? "linear-gradient(135deg, #38bdf8, #6c63ff)" : "transparent",
                  border: tab === t.id ? "none" : "1px solid var(--border)",
                  borderRadius: "12px",
                  color: tab === t.id ? "white" : "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "all 0.3s ease"
                }}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
            
            <div style={{
              background: "var(--surface)",
              borderRadius: "20px",
              border: "1px solid var(--border)",
              padding: "2rem"
            }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)" }}>
                <Globe className="w-5 h-5" style={{ color: "#38bdf8" }} />
                {tab === "research" ? "Research Parameters" : "Comparison Parameters"}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "1.5rem" }}>
                {tab === "research" ? "Select industry and region for analysis" : "Compare markets across regions"}
              </p>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>Industry</label>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                  gap: "0.5rem"
                }}>
                  {INDUSTRIES.map(industry => (
                    <button
                      key={industry.value}
                      onClick={() => setField("industry", industry.value)}
                      style={{
                        padding: "0.5rem 0.5rem",
                        background: form.industry === industry.value 
                          ? `linear-gradient(135deg, ${industry.color}, ${industry.color}dd)`
                          : "var(--surface2)",
                        border: form.industry === industry.value ? "none" : "1px solid var(--border)",
                        borderRadius: "8px",
                        color: form.industry === industry.value ? "white" : "var(--text)",
                        cursor: "pointer",
                        fontSize: "0.7rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.25rem",
                        transition: "all 0.3s ease"
                      }}
                    >
                      <span>{industry.icon}</span>
                      <span>{industry.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  {tab === "compare" ? "Market A — Region" : "Region"}
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
                  {REGIONS.map(r => (
                    <option key={r.value} value={r.value}>
                      {r.icon} {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {tab === "compare" && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Market B — Compare With
                  </label>
                  <select
                    value={form.compareWith}
                    onChange={e => setField("compareWith", e.target.value)}
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
                    {REGIONS.map(r => (
                      <option key={r.value} value={r.value}>
                        {r.icon} {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                onClick={tab === "research" ? doResearch : doCompare}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  background: "linear-gradient(135deg, #38bdf8, #6c63ff)",
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
                    <div style={{ width: 18, height: 18, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    <span>Analyzing Market Data...</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>{tab === "research" ? "Run Market Research" : "Compare Markets"}</span>
                  </>
                )}
              </button>
            </div>

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
                  <h4 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem", color: "var(--text)" }}>Analyzing Market Data</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    Our AI is analyzing market trends, competition, and opportunities...
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
                        width: "70%",
                        height: "100%",
                        background: "linear-gradient(90deg, #38bdf8, #6c63ff)",
                        borderRadius: 2,
                        animation: "pulse 1.5s ease-in-out infinite"
                      }} />
                    </div>
                  </div>
                </div>
              )}

              {!loading && result && renderResearchResult()}
              {!loading && compareResult && renderComparisonResult()}
              
              {!loading && !result && !compareResult && (
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
                    <PieChart className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
                  </div>
                  <h4 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem", color: "var(--text)" }}>Ready to Analyze</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    {tab === "research" 
                      ? "Select parameters and run market research" 
                      : "Select regions and compare markets"}
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginTop: "0.5rem" }}>
                    Get comprehensive insights about market size, growth, competition, and opportunities
                  </p>
                </div>
              )}
            </div>
          </div>
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
      `}</style>
    </div>
  );
}
