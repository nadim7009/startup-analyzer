import { useState, useEffect } from "react";
import {
  Brain,
  Target,
  Zap,
  Globe,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Activity,
  Award,
  Cpu,
  Lightbulb,
  TrendingUp,
  FolderOpen,
  PlusCircle,
  BarChart3,
  Users,
  Rocket,
  Star,
  Calendar
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import IdeaGenerator from "../components/IdeaGenerator";
import MarketAnalysis from "../components/MarketAnalysis";
import CompetitorIntelligence from "../components/CompetitorIntelligence";
import SkillsGapAnalysis from "../components/SkillsGapAnalysis";

export default function Dashboard() {
  const [ideas, setIdeas] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [skills, setSkills] = useState([]);
  const [activeModule, setActiveModule] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }));
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);

      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.log("No token found");
          setIsLoading(false);
          return;
        }

        const ideasRes = await fetch("http://127.0.0.1:8000/api/ideas/", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (ideasRes.ok) {
          const data = await ideasRes.json();
          setIdeas(Array.isArray(data) ? data : []);
        }

        const marketsRes = await fetch("http://127.0.0.1:8000/api/market-analysis/", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (marketsRes.ok) {
          const data = await marketsRes.json();
          setMarkets(Array.isArray(data) ? data : []);
        }

        const competitorsRes = await fetch("http://127.0.0.1:8000/api/competitors/", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (competitorsRes.ok) {
          const data = await competitorsRes.json();
          setCompetitors(Array.isArray(data) ? data : []);
        }

        const skillsRes = await fetch("http://127.0.0.1:8000/api/skills-gap-analysis/", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (skillsRes.ok) {
          const data = await skillsRes.json();
          setSkills(Array.isArray(data) ? data : []);
        }

      } catch (error) {
        console.error("FETCH ERROR:", error);
      }

      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  const globalData = {
    generatedIdeas: ideas,
    marketAnalyses: markets,
    competitors: competitors,
    skillsAnalyses: skills,
  };

  const quickActions = [
    { 
      id: "ideas", 
      label: "Generate Startup Idea", 
      icon: <Brain className="w-5 h-5" />, 
      color: "#6c63ff", 
      desc: "AI-powered idea creation with viability scoring",
      bgGradient: "linear-gradient(135deg, rgba(108,99,255,0.1), rgba(108,99,255,0.02))"
    },
    { 
      id: "market", 
      label: "Market Research", 
      icon: <Globe className="w-5 h-5" />, 
      color: "#38bdf8", 
      desc: "Analyze markets for any industry or region",
      bgGradient: "linear-gradient(135deg, rgba(56,189,248,0.1), rgba(56,189,248,0.02))"
    },
    { 
      id: "competitors", 
      label: "Competitor Intel", 
      icon: <Target className="w-5 h-5" />, 
      color: "#ff6584", 
      desc: "Identify and analyze key competitors",
      bgGradient: "linear-gradient(135deg, rgba(255,101,132,0.1), rgba(255,101,132,0.02))"
    },
    { 
      id: "skills", 
      label: "Skills Gap Analysis", 
      icon: <Zap className="w-5 h-5" />, 
      color: "#43e97b", 
      desc: "Compare your skills with startup needs",
      bgGradient: "linear-gradient(135deg, rgba(67,233,123,0.1), rgba(67,233,123,0.02))"
    },
  ];

  const tips = [
    { text: "Combine two unrelated industries for breakthrough startup ideas", icon: "🚀", category: "Innovation" },
    { text: "Focus on markets with 15-25% annual growth for best opportunities", icon: "📈", category: "Market Analysis" },
    { text: "Skills gaps in AI/ML are the biggest bottleneck for tech startups", icon: "🧠", category: "Trend Alert" },
    { text: "B2B SaaS has 3x higher survival rate than B2C consumer apps", icon: "💼", category: "Insight" },
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const tip = tips[currentTipIndex];

  let content;

  if (activeModule === "ideas") {
    content = <IdeaGenerator />;
  } else if (activeModule === "market") {
    content = <MarketAnalysis />;
  } else if (activeModule === "competitors") {
    content = <CompetitorIntelligence />;
  } else if (activeModule === "skills") {
    content = <SkillsGapAnalysis />;
  } else {
    content = (
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* Hero Welcome Section */}
        <div style={{
          background: "linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%)",
          border: "1px solid var(--border)",
          borderRadius: "28px",
          padding: "2rem",
          marginBottom: "2rem",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 250,
            height: 250,
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            opacity: 0.1,
            borderRadius: "50%"
          }} />
          <div style={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 200,
            height: 200,
            background: "radial-gradient(circle, var(--accent2) 0%, transparent 70%)",
            opacity: 0.1,
            borderRadius: "50%"
          }} />
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                <div style={{
                  width: 56,
                  height: 56,
                  background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(108,99,255,0.3)"
                }}>
                  <Cpu className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "Syne, sans-serif", color: "var(--text)", margin: 0 }}>
                    {greeting}, Founder
                  </h1>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
                    <Clock className="w-3 h-3" />
                    {currentTime} · System Online
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.25rem 0.75rem", background: "rgba(108,99,255,0.1)", borderRadius: "100px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#43e97b" }} />
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>All systems operational</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.25rem 0.75rem", background: "rgba(56,189,248,0.1)", borderRadius: "100px" }}>
                  <Rocket className="w-3 h-3" style={{ color: "#38bdf8" }} />
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>AI Ready</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <div style={{
                padding: "0.75rem 1.25rem",
                background: "rgba(108,99,255,0.1)",
                borderRadius: "100px",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                backdropFilter: "blur(10px)"
              }}>
                <Activity className="w-4 h-4" style={{ color: "#6c63ff" }} />
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Total Ideas</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--text)" }}>{ideas.length}</div>
                </div>
              </div>
              <div style={{
                padding: "0.75rem 1.25rem",
                background: "rgba(56,189,248,0.1)",
                borderRadius: "100px",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}>
                <Globe className="w-4 h-4" style={{ color: "#38bdf8" }} />
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Markets</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--text)" }}>{markets.length}</div>
                </div>
              </div>
              <div style={{
                padding: "0.75rem 1.25rem",
                background: "rgba(255,101,132,0.1)",
                borderRadius: "100px",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}>
                <Target className="w-4 h-4" style={{ color: "#ff6584" }} />
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Competitors</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--text)" }}>{competitors.length}</div>
                </div>
              </div>
              <div style={{
                padding: "0.75rem 1.25rem",
                background: "rgba(67,233,123,0.1)",
                borderRadius: "100px",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}>
                <Zap className="w-4 h-4" style={{ color: "#43e97b" }} />
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Skills</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--text)" }}>{skills.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - 4 Cards in a Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          {[
            { label: "Total Ideas", value: ideas.length, icon: Brain, color: "#6c63ff", change: "+12%", bgColor: "rgba(108,99,255,0.1)", trend: "up" },
            { label: "Markets Analyzed", value: markets.length, icon: Globe, color: "#38bdf8", change: "+8%", bgColor: "rgba(56,189,248,0.1)", trend: "up" },
            { label: "Competitors Tracked", value: competitors.length, icon: Target, color: "#ff6584", change: "+23%", bgColor: "rgba(255,101,132,0.1)", trend: "up" },
            { label: "Skills Analyzed", value: skills.length, icon: Zap, color: "#43e97b", change: "+15%", bgColor: "rgba(67,233,123,0.1)", trend: "up" },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "1.5rem",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = stat.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, background: stat.bgColor, borderRadius: "50%", opacity: 0.5 }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</p>
                    <div style={{ fontSize: "2.5rem", fontWeight: "bold", fontFamily: "Syne, sans-serif", color: "var(--text)", lineHeight: 1 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#43e97b", marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <TrendingUp className="w-3 h-3" />
                      {stat.change} vs last month
                    </div>
                  </div>
                  <div style={{
                    width: 52,
                    height: 52,
                    background: stat.bgColor,
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions & AI Insight Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          {/* Quick Actions */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", fontFamily: "Syne, sans-serif", color: "var(--text)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Zap className="w-4 h-4" style={{ color: "#6c63ff" }} />
                Quick Actions
              </h3>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>4 modules available</span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => setActiveModule(action.id)}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "1rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = action.color;
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div style={{
                    width: 44,
                    height: 44,
                    background: `${action.color}20`,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {action.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: "var(--text)" }}>{action.label}</span>
                      <ArrowRight className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Insight Card */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", fontFamily: "Syne, sans-serif", color: "var(--text)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Sparkles className="w-4 h-4" style={{ color: "#fbbf24" }} />
                AI Insight
              </h3>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Daily tip</span>
            </div>
            
            <div style={{
              background: "linear-gradient(135deg, rgba(108,99,255,0.08), rgba(255,101,132,0.04))",
              border: "1px solid rgba(108,99,255,0.2)",
              borderRadius: "20px",
              padding: "1.5rem",
              height: "100%"
            }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div>
                    <span style={{ fontSize: "0.65rem", fontWeight: "bold", color: "#6c63ff", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {tip.category}
                    </span>
                    <h4 style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--text)", marginTop: "0.25rem", marginBottom: "0.5rem" }}>
                      {tip.icon} {tip.text}
                    </h4>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Sparkles className="w-3 h-3" style={{ color: "#6c63ff" }} />
                      <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Updated daily</span>
                    </div>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      {tips.map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: i === currentTipIndex ? 20 : 6,
                            height: 4,
                            borderRadius: 2,
                            background: i === currentTipIndex ? "#6c63ff" : "var(--border)",
                            transition: "all 0.3s"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section - Full Width */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "1.5rem",
          marginBottom: "1.5rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Activity className="w-5 h-5" style={{ color: "#6c63ff" }} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", fontFamily: "Syne, sans-serif", color: "var(--text)", margin: 0 }}>
                Recent Activity
              </h3>
            </div>
            <button
              onClick={() => setActiveModule("ideas")}
              style={{
                fontSize: "0.75rem",
                color: "#6c63ff",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem"
              }}
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
              <div className="spinner" style={{ width: 32, height: 32 }} />
            </div>
          ) : (ideas.length === 0 && markets.length === 0 && competitors.length === 0 && skills.length === 0) ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "2.5rem",
              background: "var(--surface2)",
              borderRadius: "16px"
            }}>
              <div style={{
                width: 72,
                height: 72,
                background: "var(--border)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem"
              }}>
                <Lightbulb className="w-8 h-8" style={{ color: "var(--text-muted)" }} />
              </div>
              <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>No activity yet</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Generate your first startup idea or analyze a market to get started</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "0.75rem" }}>
              {/* Recent Ideas */}
              {ideas.slice(0, 3).map((idea) => (
                <div
                  key={idea.id}
                  onClick={() => setActiveModule("ideas")}
                  style={{
                    padding: "1rem",
                    background: "var(--surface2)",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(108,99,255,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--surface2)"}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    background: "rgba(108,99,255,0.15)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Brain className="w-4 h-4" style={{ color: "#6c63ff" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.8rem", color: "var(--text)", fontWeight: "500" }}>{idea.title}</p>
                    <p style={{ fontSize: "0.6rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Calendar className="w-3 h-3" />
                      {new Date(idea.created_at || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{
                    padding: "0.25rem 0.5rem",
                    background: "rgba(67,233,123,0.15)",
                    borderRadius: "100px",
                    fontSize: "0.6rem",
                    color: "#43e97b"
                  }}>
                    Idea
                  </div>
                </div>
              ))}

              {/* Recent Markets */}
              {markets.slice(0, 2).map((market) => (
                <div
                  key={market.id}
                  onClick={() => setActiveModule("market")}
                  style={{
                    padding: "1rem",
                    background: "var(--surface2)",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(56,189,248,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--surface2)"}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    background: "rgba(56,189,248,0.15)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Globe className="w-4 h-4" style={{ color: "#38bdf8" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.8rem", color: "var(--text)", fontWeight: "500" }}>{market.industry} - {market.region}</p>
                    <p style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(market.created_at || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{
                    padding: "0.25rem 0.5rem",
                    background: "rgba(56,189,248,0.15)",
                    borderRadius: "100px",
                    fontSize: "0.6rem",
                    color: "#38bdf8"
                  }}>
                    Market
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setActiveModule("ideas")}
            style={{
              width: "100%",
              marginTop: "1rem",
              padding: "0.75rem",
              background: "linear-gradient(135deg, #6c63ff, #ff6584)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "0.85rem",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.01)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <PlusCircle className="w-4 h-4" />
            Generate New Idea
          </button>
        </div>

        {/* Performance Summary */}
        {(ideas.length > 0 || markets.length > 0 || competitors.length > 0 || skills.length > 0) && (
          <div style={{
            padding: "1.25rem",
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(67,233,123,0.05), rgba(108,99,255,0.03))",
            border: "1px solid rgba(67,233,123,0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: 44,
                height: 44,
                background: "linear-gradient(135deg, #43e97b, #6feca0)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Your Progress</p>
                <p style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--text)" }}>
                  {ideas.length + markets.length + competitors.length + skills.length} total analyses
                </p>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <div><p style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Ideas</p><p style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--text)" }}>{ideas.length}</p></div>
              <div><p style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Markets</p><p style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--text)" }}>{markets.length}</p></div>
              <div><p style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Competitors</p><p style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--text)" }}>{competitors.length}</p></div>
              <div><p style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Skills</p><p style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--text)" }}>{skills.length}</p></div>
            </div>
          </div>
        )}
      </div>
    );
  }

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
        {content}
      </div>
    </div>
  );
}