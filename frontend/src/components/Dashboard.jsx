import { useState, useEffect } from "react";
import {
  Lightbulb,
  TrendingUp,
  Users,
  Target,
  Zap,
  Compass,
  BarChart3,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Brain,
  Rocket,
  Activity,
  Award,
  Cpu,
  Eye,
  Globe,
  Shield
} from "lucide-react";

export default function Dashboard({ globalData, setActiveModule }) {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Format current time
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }));
  }, []);

  const quickActions = [
    { 
      id: "ideas", 
      label: "Generate Startup Idea", 
      icon: <Brain className="w-5 h-5" />, 
      color: "var(--accent)", 
      desc: "AI-powered idea creation with viability scoring",
      gradient: "from-[#6c63ff] to-[#8b7fff]",
      bgGradient: "from-[#6c63ff]/10 to-[#8b7fff]/5"
    },
    { 
      id: "market", 
      label: "Market Research", 
      icon: <Globe className="w-5 h-5" />, 
      color: "#38bdf8", 
      desc: "Analyze markets for any industry or region",
      gradient: "from-[#38bdf8] to-[#7dd3fc]",
      bgGradient: "from-[#38bdf8]/10 to-[#7dd3fc]/5"
    },
    { 
      id: "competitors", 
      label: "Competitor Intel", 
      icon: <Target className="w-5 h-5" />, 
      color: "var(--accent2)", 
      desc: "Identify and analyze key competitors",
      gradient: "from-[#ff6584] to-[#ff8a9f]",
      bgGradient: "from-[#ff6584]/10 to-[#ff8a9f]/5"
    },
    { 
      id: "skills", 
      label: "Skills Gap Analysis", 
      icon: <Zap className="w-5 h-5" />, 
      color: "var(--accent3)", 
      desc: "Compare your skills with startup needs",
      gradient: "from-[#43e97b] to-[#6feca0]",
      bgGradient: "from-[#43e97b]/10 to-[#6feca0]/5"
    },
  ];

  const tips = [
    {
      text: "Combine two unrelated industries for breakthrough startup ideas",
      icon: "🚀",
      category: "Innovation"
    },
    {
      text: "Focus on markets with 15-25% annual growth for best opportunities",
      icon: "📈",
      category: "Market Analysis"
    },
    {
      text: "Skills gaps in AI/ML are the biggest bottleneck for tech startups in 2026",
      icon: "🧠",
      category: "Trend Alert"
    },
    {
      text: "B2B SaaS has 3x higher survival rate than B2C consumer apps",
      icon: "💼",
      category: "Insight"
    },
    {
      text: "Startups with diverse founding teams are 30% more likely to succeed",
      icon: "👥",
      category: "Research"
    },
    {
      text: "The average successful startup pivots 2-3 times before finding product-market fit",
      icon: "🔄",
      category: "Stats"
    },
  ];
  
  // Rotate through tips
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [tips.length]);
  
  const tip = tips[currentTipIndex];

  // Calculate total stats
  const totalIdeas = globalData.generatedIdeas?.length || 0;
  const totalMarkets = globalData.marketAnalyses?.length || 0;
  const totalCompetitors = globalData.competitors?.length || 0;
  const totalActivities = totalIdeas + totalMarkets + totalCompetitors;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a26] to-[#12121a] border border-[#2a2a3d] p-6 group hover:border-[#6c63ff] transition-all duration-500">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #6c63ff 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>
        
        {/* Gradient Orb */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#6c63ff] rounded-full mix-blend-multiply filter blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
        
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#6c63ff] to-[#ff6584] rounded-xl flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-[#6c63ff] to-[#ff6584] rounded-xl opacity-40 blur" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-syne">
                  {greeting}, Founder
                </h2>
                <p className="text-sm text-[#7878a0] flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {currentTime} · System Online
                </p>
              </div>
            </div>
          </div>
          
          {/* Quick Stats Pills */}
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1.5 bg-[#1a1a26] rounded-full border border-[#2a2a3d] flex items-center gap-2">
              <Activity className="w-3 h-3 text-[#6c63ff]" />
              <span className="text-xs text-[#e8e8f0]">{totalActivities} Activities</span>
            </div>
            <div className="px-3 py-1.5 bg-[#1a1a26] rounded-full border border-[#2a2a3d] flex items-center gap-2">
              <Award className="w-3 h-3 text-[#ff6584]" />
              <span className="text-xs text-[#e8e8f0]">Pro Plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { 
            label: "Ideas Generated", 
            value: totalIdeas, 
            icon: <Brain className="w-6 h-6" />, 
            color: "var(--accent)",
            gradient: "from-[#6c63ff] to-[#8b7fff]",
            change: "+12%",
            trend: "up"
          },
          { 
            label: "Markets Analyzed", 
            value: totalMarkets, 
            icon: <Globe className="w-6 h-6" />, 
            color: "#38bdf8",
            gradient: "from-[#38bdf8] to-[#7dd3fc]",
            change: "+8%",
            trend: "up"
          },
          { 
            label: "Competitors Tracked", 
            value: totalCompetitors, 
            icon: <Target className="w-6 h-6" />, 
            color: "var(--accent2)",
            gradient: "from-[#ff6584] to-[#ff8a9f]",
            change: "+23%",
            trend: "up"
          },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="group relative bg-[#12121a] rounded-xl border border-[#2a2a3d] p-5 hover:border-[#6c63ff] transition-all duration-300 overflow-hidden"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
            
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm text-[#7878a0] mb-1">{stat.label}</p>
                <div className="text-3xl font-bold text-white font-syne">{stat.value}</div>
                
                {/* Trend Indicator */}
                <div className="flex items-center gap-1 mt-2">
                  <span className={`text-xs ${stat.trend === 'up' ? 'text-[#43e97b]' : 'text-[#ff6584]'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-[#7878a0]">vs last month</span>
                </div>
              </div>
              
              {/* Icon with Glow */}
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} p-2.5 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className={`absolute -inset-1 bg-gradient-to-br ${stat.gradient} rounded-xl opacity-20 blur group-hover:opacity-30 transition-opacity`} />
              </div>
            </div>

            {/* Progress Bar (example) */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a1a26]">
              <div 
                className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-500`}
                style={{ width: `${Math.min(stat.value * 10, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white font-syne flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#6c63ff]" />
            Quick Actions
          </h3>
          <span className="text-xs text-[#7878a0]">Choose a module to get started</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => setActiveModule(action.id)}
              className="group relative bg-[#12121a] border border-[#2a2a3d] rounded-xl p-5 hover:border-[#6c63ff] transition-all duration-300 text-left overflow-hidden"
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = action.color;
                e.currentTarget.style.boxShadow = `0 0 30px ${action.color}20`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              {/* Animated Border Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              <div className="relative flex items-start gap-4">
                {/* Icon with Gradient */}
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} p-2.5 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {action.icon}
                    </div>
                  </div>
                  <div className={`absolute -inset-1 bg-gradient-to-br ${action.gradient} rounded-xl opacity-30 blur group-hover:opacity-50 transition-opacity`} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base font-semibold text-white font-syne">{action.label}</h4>
                    <ArrowRight className="w-4 h-4 text-[#7878a0] group-hover:text-[#6c63ff] group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-[#7878a0] leading-relaxed">{action.desc}</p>
                  
                  {/* Action Hint */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-[#6c63ff] flex items-center gap-1">
                      Click to start
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Insight & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insight Card */}
        <div className="lg:col-span-2">
          <div className="relative bg-gradient-to-br from-[#1a1a26] to-[#12121a] rounded-xl border border-[#2a2a3d] p-6 group hover:border-[#6c63ff] transition-all duration-500 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, #6c63ff 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }} />
            </div>
            
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#6c63ff] rounded-full mix-blend-multiply filter blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
            
            <div className="relative">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#6c63ff] to-[#ff6584] rounded-xl p-2.5">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#6c63ff] to-[#ff6584] rounded-xl opacity-40 blur" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-semibold text-[#6c63ff] uppercase tracking-wider">
                        {tip.category}
                      </span>
                      <h3 className="text-lg font-semibold text-white font-syne mt-1">
                        AI Insight
                      </h3>
                    </div>
                    <span className="text-3xl">{tip.icon}</span>
                  </div>
                  
                  <p className="text-[#e8e8f0] text-base leading-relaxed mb-4">
                    "{tip.text}"
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#6c63ff]" />
                      <span className="text-xs text-[#7878a0]">Updated daily</span>
                    </div>
                    
                    {/* Dot indicators */}
                    <div className="flex gap-1.5">
                      {tips.map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            i === currentTipIndex ? 'bg-[#6c63ff] w-4' : 'bg-[#2a2a3d]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-[#12121a] rounded-xl border border-[#2a2a3d] p-6 h-full hover:border-[#6c63ff] transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white font-syne flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#6c63ff]" />
                Recent Activity
              </h3>
              {totalActivities > 0 && (
                <span className="text-xs text-[#7878a0]">Last 3 items</span>
              )}
            </div>

            {totalActivities > 0 ? (
              <div className="space-y-3">
                {/* Ideas */}
                {globalData.generatedIdeas?.slice(-2).reverse().map((idea, i) => (
                  <div
                    key={`idea-${i}`}
                    onClick={() => setActiveModule("ideas")}
                    className="flex items-center gap-3 p-3 bg-[#1a1a26] rounded-lg border border-[#2a2a3d] hover:border-[#6c63ff] transition-all cursor-pointer group/item"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#6c63ff] to-[#8b7fff] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{idea.industry}</p>
                      <p className="text-xs text-[#7878a0]">{idea.timestamp}</p>
                    </div>
                    <span className="px-2 py-1 bg-[#6c63ff]/10 rounded-full text-[10px] text-[#6c63ff] font-medium">
                      Idea
                    </span>
                  </div>
                ))}

                {/* Markets */}
                {globalData.marketAnalyses?.slice(-2).reverse().map((market, i) => (
                  <div
                    key={`market-${i}`}
                    onClick={() => setActiveModule("market")}
                    className="flex items-center gap-3 p-3 bg-[#1a1a26] rounded-lg border border-[#2a2a3d] hover:border-[#38bdf8] transition-all cursor-pointer group/item"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#38bdf8] to-[#7dd3fc] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{market.industry}</p>
                      <p className="text-xs text-[#7878a0]">{market.timestamp}</p>
                    </div>
                    <span className="px-2 py-1 bg-[#38bdf8]/10 rounded-full text-[10px] text-[#38bdf8] font-medium">
                      Market
                    </span>
                  </div>
                ))}

                {/* Competitors */}
                {globalData.competitors?.slice(-2).reverse().map((comp, i) => (
                  <div
                    key={`comp-${i}`}
                    onClick={() => setActiveModule("competitors")}
                    className="flex items-center gap-3 p-3 bg-[#1a1a26] rounded-lg border border-[#2a2a3d] hover:border-[#ff6584] transition-all cursor-pointer group/item"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#ff6584] to-[#ff8a9f] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{comp.name}</p>
                      <p className="text-xs text-[#7878a0]">{comp.timestamp}</p>
                    </div>
                    <span className="px-2 py-1 bg-[#ff6584]/10 rounded-full text-[10px] text-[#ff6584] font-medium">
                      Competitor
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <div className="w-16 h-16 bg-[#1a1a26] rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-[#2a2a3d]" />
                </div>
                <p className="text-sm text-[#7878a0] mb-2">No activity yet</p>
                <p className="text-xs text-[#7878a0]">Start by generating an idea or analyzing a market</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Insight (hidden if no data) */}
      {totalActivities > 0 && (
        <div className="bg-[#12121a] rounded-xl border border-[#2a2a3d] p-5 hover:border-[#6c63ff] transition-all">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#43e97b] to-[#6feca0] rounded-lg p-2">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#7878a0]">Your Progress</p>
                <p className="text-lg font-semibold text-white">
                  {totalActivities} total {totalActivities === 1 ? 'analysis' : 'analyses'} performed
                </p>
              </div>
            </div>
            
            {/* Mini stats */}
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-xs text-[#7878a0]">Ideas</p>
                <p className="text-base font-semibold text-white">{totalIdeas}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#7878a0]">Markets</p>
                <p className="text-base font-semibold text-white">{totalMarkets}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#7878a0]">Competitors</p>
                <p className="text-base font-semibold text-white">{totalCompetitors}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
