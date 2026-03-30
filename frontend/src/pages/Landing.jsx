import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Cpu,
  Target,
  BarChart3,
  Rocket,
  Sparkles,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Award,
  Eye,
  DollarSign,
  ThumbsUp,
  PieChart,
  Brain,
  Network,
  Clock,
  MessageCircle,
  BookOpen,
  PlayCircle,
  ChevronDown,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "../context/ThemeProvider";

export default function Landing() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [apiLoading, setApiLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null);

  // Check if backend is running
  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 405 || response.ok) {
        setBackendStatus('connected');
        console.log('✅ Backend connected successfully');
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      setBackendStatus('disconnected');
    }
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats = [
    { value: "10K+", label: "Active Users", icon: Users, change: "+156%", color: "from-blue-500 to-indigo-500" },
    { value: "50K+", label: "Ideas Analyzed", icon: TrendingUp, change: "+89%", color: "from-purple-500 to-pink-500" },
    { value: "95%", label: "Success Rate", icon: ThumbsUp, change: "+12%", color: "from-green-500 to-emerald-500" },
    { value: "$2B+", label: "Funding Secured", icon: DollarSign, change: "+204%", color: "from-orange-500 to-red-500" }
  ];

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze your startup idea against millions of data points.",
      color: "from-blue-500 to-indigo-500",
      stats: "99.9% accuracy",
      metric: "500M+ data points"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Market Sizing",
      description: "Get accurate TAM, SAM, and SOM calculations with competitor benchmarking.",
      color: "from-purple-500 to-pink-500",
      stats: "Real-time data",
      metric: "50+ markets"
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "Competitor Intel",
      description: "Track 100+ competitors automatically with SWOT analysis and market share data.",
      color: "from-green-500 to-emerald-500",
      stats: "24/7 tracking",
      metric: "10K+ competitors"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Risk Assessment",
      description: "Identify potential pitfalls and get mitigation strategies before you launch.",
      color: "from-orange-500 to-red-500",
      stats: "98% accuracy",
      metric: "50+ risk factors"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Insights",
      description: "Access market data from 50+ countries with localization recommendations.",
      color: "from-cyan-500 to-blue-500",
      stats: "50+ countries",
      metric: "100+ languages"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Validation",
      description: "Get comprehensive validation reports in under 60 seconds.",
      color: "from-yellow-500 to-orange-500",
      stats: "< 60 seconds",
      metric: "Instant results"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Founder, TechFlow",
      content: "StartupAI helped me validate my SaaS idea in days instead of months. We secured $500K in pre-seed funding!",
      rating: 5,
      avatar: "SJ",
      color: "from-blue-500 to-indigo-500",
      funding: "$500K"
    },
    {
      name: "Michael Chen",
      role: "CEO, AI Horizons",
      content: "The competitor analysis feature is incredible. We identified 3 untapped market segments.",
      rating: 5,
      avatar: "MC",
      color: "from-purple-500 to-pink-500",
      funding: "$2.1M"
    },
    {
      name: "Priya Patel",
      role: "Co-founder, GreenTech",
      content: "As a first-time founder, the risk assessment saved us from making costly mistakes.",
      rating: 5,
      avatar: "PP",
      color: "from-green-500 to-emerald-500",
      funding: "$750K"
    }
  ];

  const faqs = [
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI models are trained on data from 50,000+ successful and failed startups, achieving 95% accuracy in predicting market viability."
    },
    {
      question: "Can I try before buying?",
      answer: "Yes! Start with a 14-day free trial on any plan. No credit card required."
    },
    {
      question: "How often is market data updated?",
      answer: "Market data is refreshed daily from 100+ sources including Crunchbase, PitchBook, and industry reports."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade 256-bit encryption and are SOC2 Type II compliant."
    }
  ];

  // Theme-based styles
  const bgColor = isDark ? "#0a0a0f" : "#f8fafc";
  const surfaceColor = isDark ? "#12121a" : "#ffffff";
  const surface2Color = isDark ? "#1a1a26" : "#f1f5f9";
  const borderColor = isDark ? "#2a2a3d" : "#e2e8f0";
  const textColor = isDark ? "#e8e8f0" : "#0f172a";
  const textMuted = isDark ? "#7878a0" : "#64748b";

  return (
    <div className="relative min-h-screen overflow-x-hidden font-mono" style={{ background: bgColor, color: textColor }}>
      {/* Backend Status Indicator */}
      {backendStatus === 'connected' && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs border border-green-500/30">
          ✅ Backend Connected
        </div>
      )}

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-3 rounded-full transition-all duration-300 hover:scale-110"
        style={{ background: surface2Color, border: `1px solid ${borderColor}` }}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
      </button>

      {/* Animated Background Grid */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(108, 99, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108, 99, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      />

      {/* Gradient Orbs */}
      <div className="fixed top-20 -left-20 w-96 h-96 bg-[#6c63ff] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse pointer-events-none" />
      <div className="fixed bottom-20 -right-20 w-96 h-96 bg-[#ff6584] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse pointer-events-none" style={{ animationDuration: '12s' }} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl border-b py-3' : 'bg-transparent py-5'
      }`} style={{ background: scrolled ? `${surfaceColor}cc` : 'transparent', borderColor: borderColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 group/logo cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#6c63ff] to-[#ff6584] rounded-xl flex items-center justify-center transform -rotate-3 group-hover/logo:rotate-0 transition-all duration-500">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-[#6c63ff] to-[#ff6584] rounded-xl opacity-50 blur group-hover/logo:opacity-75 transition-opacity" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#6c63ff] to-[#ff6584] bg-clip-text text-transparent font-syne">
                  StartupAI
                </h1>
                <p className="text-xs" style={{ color: textMuted }}>Intelligence Platform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {['features', 'how-it-works', 'testimonials', 'faq'].map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  className="text-sm transition-colors relative group"
                  style={{ color: textMuted }}
                  onMouseEnter={e => e.currentTarget.style.color = '#6c63ff'}
                  onMouseLeave={e => e.currentTarget.style.color = textMuted}
                >
                  {section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6c63ff] to-[#ff6584] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={handleLogin}
                className="px-5 py-2 text-sm transition-colors relative group"
                style={{ color: textMuted }}
                onMouseEnter={e => e.currentTarget.style.color = '#6c63ff'}
                onMouseLeave={e => e.currentTarget.style.color = textMuted}
              >
                Log in
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6c63ff] to-[#ff6584] group-hover:w-full transition-all duration-300" />
              </button>
              <button
                onClick={handleSignUp}
                className="relative group/btn overflow-hidden px-5 py-2 rounded-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#6c63ff] to-[#ff6584] opacity-100 group-hover/btn:opacity-90 transition-opacity rounded-lg" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                <span className="relative text-white text-sm font-medium flex items-center gap-1">
                  Sign up free
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden transition-colors"
              style={{ color: textMuted }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 rounded-xl animate-fadeIn" style={{ background: surfaceColor, border: `1px solid ${borderColor}` }}>
              <div className="flex flex-col space-y-3 px-4">
                <a href="#features" className="py-2 transition-colors" style={{ color: textMuted }} onClick={() => setIsMenuOpen(false)}>Features</a>
                <a href="#how-it-works" className="py-2 transition-colors" style={{ color: textMuted }} onClick={() => setIsMenuOpen(false)}>How It Works</a>
                <a href="#testimonials" className="py-2 transition-colors" style={{ color: textMuted }} onClick={() => setIsMenuOpen(false)}>Testimonials</a>
                <a href="#faq" className="py-2 transition-colors" style={{ color: textMuted }} onClick={() => setIsMenuOpen(false)}>FAQ</a>
                <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: borderColor }}>
                  <button onClick={handleLogin} className="w-full px-4 py-2 text-sm transition-colors" style={{ color: textMuted }}>Log in</button>
                  <button onClick={handleSignUp} className="w-full relative group/btn overflow-hidden px-4 py-2 rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#6c63ff] to-[#ff6584] opacity-100 rounded-lg" />
                    <span className="relative text-white text-sm font-medium">Sign up free</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 hover:border-[#6c63ff] transition-all group cursor-pointer"
                 style={{ background: surface2Color, border: `1px solid ${borderColor}` }}>
              <Sparkles className="w-4 h-4 text-[#6c63ff] group-hover:animate-pulse" />
              <span className="text-sm" style={{ color: textMuted }}>AI-Powered Startup Intelligence</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: textMuted }} />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-syne leading-tight" style={{ color: textColor }}>
              Validate Your Startup
              <br />
              <span className="bg-gradient-to-r from-[#6c63ff] via-[#ff6584] to-[#43e97b] bg-clip-text text-transparent relative">
                Idea in Minutes
                <div className="absolute -inset-1 bg-gradient-to-r from-[#6c63ff] via-[#ff6584] to-[#43e97b] blur-3xl opacity-20 animate-pulse" />
              </span>
            </h1>

            <p className="text-xl max-w-3xl mx-auto mb-10 leading-relaxed" style={{ color: textMuted }}>
              Stop guessing. Start building with confidence. Our AI analyzes millions of data points to give you actionable insights about your startup idea in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button onClick={handleSignUp} className="relative group/btn overflow-hidden px-8 py-4 text-lg rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-[#6c63ff] to-[#ff6584] opacity-100 group-hover/btn:opacity-90 transition-opacity rounded-xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                <span className="relative text-white font-medium flex items-center gap-2">
                  Get Started Free
                  <Rocket className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 text-lg rounded-xl transition-all group flex items-center justify-center gap-2"
                style={{ border: `1px solid ${borderColor}`, color: textMuted }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6c63ff'; e.currentTarget.style.color = '#6c63ff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.color = textMuted; }}
              >
                <PlayCircle className="w-5 h-5" />
                See How It Works
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center group/stat relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover/stat:opacity-10 blur-xl rounded-full transition-opacity`} />
                    <div className={`inline-block p-3 rounded-xl border mb-3 group-hover/stat:border-[#6c63ff] transition-all relative`} style={{ background: surface2Color, borderColor: borderColor }}>
                      <Icon className="w-6 h-6 text-[#6c63ff]" />
                    </div>
                    <div className="text-3xl font-bold mb-1" style={{ color: textColor }}>{stat.value}</div>
                    <div className="text-sm mb-1" style={{ color: textMuted }}>{stat.label}</div>
                    <div className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-[#43e97b]' : 'text-[#ff6584]'}`}>
                      {stat.change}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-syne" style={{ color: textColor }}>
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-[#6c63ff] to-[#ff6584] bg-clip-text text-transparent relative">
                Validate and Launch
              </span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: textMuted }}>
              Comprehensive tools to analyze your market, track competitors, and make data-driven decisions.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {['all', 'analysis', 'market', 'financial'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    activeTab === tab 
                      ? 'bg-[#6c63ff] text-white' 
                      : ''
                  }`}
                  style={activeTab !== tab ? { background: surface2Color, color: textMuted } : {}}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl p-6 hover:border-[#6c63ff] transition-all duration-300 hover:shadow-xl relative overflow-hidden"
                style={{ background: surfaceColor, border: `1px solid ${borderColor}` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-2 mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: textColor }}>{feature.title}</h3>
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: textMuted }}>{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#6c63ff]">
                      <Zap className="w-3 h-3" />
                      <span>{feature.stats}</span>
                    </div>
                    <div className="text-xs" style={{ color: textMuted }}>{feature.metric}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: surface2Color }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-syne" style={{ color: textColor }}>
              From Idea to
              <br />
              <span className="bg-gradient-to-r from-[#6c63ff] to-[#43e97b] bg-clip-text text-transparent relative">
                Actionable Insights
              </span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: textMuted }}>
              Three simple steps to validate your startup idea with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { step: "01", title: "Describe Your Idea", description: "Tell us about your startup idea, target market, and business model.", icon: <Eye className="w-8 h-8" />, color: "from-blue-500 to-indigo-500", time: "2 minutes" },
              { step: "02", title: "AI Analysis", description: "Our AI analyzes your idea against millions of data points.", icon: <Brain className="w-8 h-8" />, color: "from-purple-500 to-pink-500", time: "60 seconds" },
              { step: "03", title: "Get Insights", description: "Receive a comprehensive report with market size and competitor analysis.", icon: <BarChart3 className="w-8 h-8" />, color: "from-green-500 to-emerald-500", time: "Instant" }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="rounded-2xl p-8 text-center group-hover:border-[#6c63ff] transition-all hover:shadow-xl" style={{ background: surfaceColor, border: `1px solid ${borderColor}` }}>
                  <div className="text-6xl font-bold mb-4 group-hover:text-[#6c63ff]/20 transition-colors" style={{ color: textMuted }}>{item.step}</div>
                  <div className={`w-20 h-20 mx-auto rounded-xl bg-gradient-to-br ${item.color} p-4 mb-4 group-hover:scale-110 transition-transform relative`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: textColor }}>{item.title}</h3>
                  <p className="text-sm mb-4" style={{ color: textMuted }}>{item.description}</p>
                  <div className="inline-flex items-center gap-1 text-xs text-[#6c63ff] px-3 py-1 rounded-full" style={{ background: surface2Color }}>
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-syne" style={{ color: textColor }}>
              Trusted by
              <br />
              <span className="bg-gradient-to-r from-[#6c63ff] to-[#ff6584] bg-clip-text text-transparent relative">
                10,000+ Founders
              </span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: textMuted }}>
              Hear from founders who validated their ideas and secured funding with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-2xl p-6 hover:border-[#6c63ff] transition-all group hover:shadow-xl"
                style={{ background: surfaceColor, border: `1px solid ${borderColor}` }}
              >
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#ff6584] text-[#ff6584]" />
                  ))}
                </div>
                <p className="text-sm mb-6 italic leading-relaxed" style={{ color: textMuted }}>"{testimonial.content}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-lg`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: textColor }}>{testimonial.name}</p>
                      <p className="text-xs" style={{ color: textMuted }}>{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#43e97b] font-semibold">Raised {testimonial.funding}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: surface2Color }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-syne" style={{ color: textColor }}>
              Frequently Asked
              <br />
              <span className="bg-gradient-to-r from-[#6c63ff] to-[#ff6584] bg-clip-text text-transparent relative">
                Questions
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden hover:border-[#6c63ff] transition-all group"
                style={{ background: surfaceColor, border: `1px solid ${borderColor}` }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: textColor }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6c63ff] group-hover:scale-150 transition-transform" />
                    {faq.question}
                  </h3>
                  <ChevronDown className={`w-5 h-5 transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} style={{ color: textMuted }} />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-sm pl-4" style={{ color: textMuted }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-12 text-center relative overflow-hidden group hover:border-[#6c63ff] transition-all" style={{ background: surfaceColor, border: `1px solid ${borderColor}` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#6c63ff]/10 to-[#ff6584]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4 font-syne" style={{ color: textColor }}>
                Ready to Validate Your
                <br />
                <span className="bg-gradient-to-r from-[#6c63ff] to-[#ff6584] bg-clip-text text-transparent">
                  Startup Idea?
                </span>
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: textMuted }}>
                Join 10,000+ founders who've used StartupAI to validate their ideas and launch successfully.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={handleSignUp} className="relative group/btn overflow-hidden px-8 py-4 text-lg rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6c63ff] to-[#ff6584] opacity-100 group-hover/btn:opacity-90 transition-opacity rounded-xl" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                  <span className="relative text-white font-medium flex items-center gap-2">
                    Start Your Free Trial
                    <Rocket className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button
                  onClick={() => window.location.href = "mailto:sales@startupai.com"}
                  className="px-8 py-4 text-lg rounded-xl transition-all"
                  style={{ border: `1px solid ${borderColor}`, color: textMuted }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6c63ff'; e.currentTarget.style.color = '#6c63ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.color = textMuted; }}
                >
                  Talk to Sales
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs" style={{ color: textMuted }}>
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-[#43e97b]" /> No credit card required</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-[#43e97b]" /> 14-day free trial</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-[#43e97b]" /> Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8" style={{ borderColor: borderColor }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#6c63ff] to-[#ff6584] rounded-lg flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold" style={{ color: textColor }}>StartupAI</span>
              </div>
              <p className="text-sm mb-4" style={{ color: textMuted }}>AI-powered startup intelligence platform helping founders validate ideas and launch successfully.</p>
              <div className="flex gap-4">
                <a href="#" className="transition-colors hover:text-[#6c63ff]" style={{ color: textMuted }}><Twitter className="w-5 h-5" /></a>
                <a href="#" className="transition-colors hover:text-[#6c63ff]" style={{ color: textMuted }}><Github className="w-5 h-5" /></a>
                <a href="#" className="transition-colors hover:text-[#6c63ff]" style={{ color: textMuted }}><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
            <div><h4 className="font-semibold mb-4" style={{ color: textColor }}>Product</h4><ul className="space-y-2"><li><a href="#features" className="text-sm transition-colors hover:text-[#6c63ff]" style={{ color: textMuted }}>Features</a></li><li><a href="#how-it-works" className="text-sm transition-colors hover:text-[#6c63ff]" style={{ color: textMuted }}>How it Works</a></li><li><a href="#" className="text-sm transition-colors hover:text-[#6c63ff]" style={{ color: textMuted }}>API</a></li></ul></div>
            <div><h4 className="font-semibold mb-4" style={{ color: textColor }}>Company</h4><ul className="space-y-2"><li><a href="#" className="text-sm transition-colors hover:text-[#6c63ff]" style={{ color: textMuted }}>About</a></li><li><a href="#" className="text-sm transition-colors hover:text-[#6c63ff]" style={{ color: textMuted }}>Blog</a></li><li><a href="#" className="text-sm transition-colors hover:text-[#6c63ff]" style={{ color: textMuted }}>Careers</a></li></ul></div>
            <div><h4 className="font-semibold mb-4" style={{ color: textColor }}>Resources</h4><ul className="space-y-2"><li><a href="#" className="text-sm transition-colors hover:text-[#6c63ff]" style={{ color: textMuted }}>Documentation</a></li><li><a href="#" className="text-sm transition-colors hover:text-[#6c63ff]" style={{ color: textMuted }}>Help Center</a></li><li><a href="#" className="text-sm transition-colors hover:text-[#6c63ff]" style={{ color: textMuted }}>Community</a></li></ul></div>
          </div>
          <div className="border-t pt-8 text-center text-xs" style={{ borderColor: borderColor, color: textMuted }}>
            © 2026 StartupAI. All rights reserved. Made with ❤️ for founders worldwide.
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
