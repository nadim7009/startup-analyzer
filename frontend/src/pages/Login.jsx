import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  LogIn,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Target,
  ChevronRight,
  Sparkles,
  Globe,
  Cpu
} from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Interactive background effect
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear error when user types
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setServerError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        if (formData.rememberMe) {
          localStorage.setItem("authToken", data.access);
        } else {
          sessionStorage.setItem("authToken", data.access);
        }
        window.location.href = "/dashboard";
      } else {
        setServerError(data.message || "Invalid email or password");
      }
    } catch (error) {
      setServerError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { icon: Users, value: "12.5K", label: "Active Users", color: "from-blue-500 to-indigo-500" },
    { icon: TrendingUp, value: "3.2K", label: "Ideas Analyzed", color: "from-purple-500 to-pink-500" },
    { icon: Target, value: "98%", label: "Success Rate", color: "from-green-500 to-emerald-500" }
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] overflow-hidden font-mono">
      {/* Animated Background Grid */}
      <div 
        className="absolute inset-0 opacity-20"
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
      <div 
        className="absolute top-20 -left-20 w-96 h-96 bg-[#6c63ff] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"
        style={{ animationDuration: '8s' }}
      />
      <div 
        className="absolute bottom-20 -right-20 w-96 h-96 bg-[#ff6584] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"
        style={{ animationDuration: '12s' }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Left Panel - Branding & Stats */}
          <div className="flex-1 flex flex-col justify-between p-8 lg:p-12 bg-[#12121a] rounded-3xl border border-[#2a2a3d] backdrop-blur-sm hover:border-[#6c63ff] transition-all duration-500 group">
            
            {/* Logo and Title */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#6c63ff] to-[#ff6584] rounded-xl flex items-center justify-center transform rotate-3 group-hover:rotate-6 transition-transform">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#6c63ff] to-[#ff6584] rounded-xl opacity-50 blur group-hover:opacity-75 transition-opacity" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6c63ff] to-[#ff6584] bg-clip-text text-transparent font-syne">
                    StartupAI
                  </h1>
                  <p className="text-[#7878a0] text-sm">Intelligence Platform v2.0</p>
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-syne">
                Welcome Back,
                <br />
                <span className="bg-gradient-to-r from-[#6c63ff] via-[#ff6584] to-[#43e97b] bg-clip-text text-transparent">
                  Visionary
                </span>
              </h2>

              <p className="text-[#7878a0] text-lg mb-12 leading-relaxed">
                Access your AI-powered startup intelligence dashboard. 
                Analyze markets, track competitors, and validate ideas in real-time.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-12">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-[#1a1a26] rounded-xl p-4 border border-[#2a2a3d] group/stat hover:border-[#6c63ff] transition-all">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} p-2 mb-2`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-white font-bold text-lg">{stat.value}</div>
                      <div className="text-[#7878a0] text-xs">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Feature List */}
              <div className="space-y-4">
                {[
                  { icon: Zap, text: "AI-Powered Market Analysis", color: "text-[#6c63ff]" },
                  { icon: TrendingUp, text: "Real-time Competitor Tracking", color: "text-[#ff6584]" },
                  { icon: Globe, text: "Global Startup Intelligence", color: "text-[#43e97b]" }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 text-[#e8e8f0] group/feature">
                      <div className={`w-8 h-8 rounded-lg bg-[#1a1a26] border border-[#2a2a3d] flex items-center justify-center group-hover/feature:border-[#6c63ff] transition-colors`}>
                        <Icon className={`w-4 h-4 ${feature.color}`} />
                      </div>
                      <span className="text-sm">{feature.text}</span>
                      <ChevronRight className="w-4 h-4 text-[#7878a0] ml-auto opacity-0 group-hover/feature:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-12 p-6 bg-[#1a1a26] rounded-2xl border border-[#2a2a3d] relative">
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-5 h-5 text-[#6c63ff]" />
              </div>
              <p className="text-[#e8e8f0] text-sm italic mb-3">
                "This platform transformed how we validate startup ideas. The AI insights are incredibly accurate."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#ff6584] flex items-center justify-center text-white text-xs font-bold">
                  SJ
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Sarah Johnson</p>
                  <p className="text-[#7878a0] text-xs">Founder, TechFlow</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="flex-1 bg-[#12121a] rounded-3xl border border-[#2a2a3d] p-8 lg:p-12 backdrop-blur-sm hover:border-[#6c63ff] transition-all duration-500">
            
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-[#1a1a26] rounded-2xl border border-[#2a2a3d] mb-4">
                <LogIn className="w-6 h-6 text-[#6c63ff]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-syne">Secure Access</h3>
              <p className="text-[#7878a0] text-sm">Enter your credentials to continue</p>
            </div>

            {/* Error Message */}
            {serverError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{serverError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm text-[#e8e8f0] font-medium">Email Address</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7878a0] group-hover/input:text-[#6c63ff] transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-[#1a1a26] border border-[#2a2a3d] rounded-xl text-white placeholder-[#7878a0] focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 outline-none transition-all"
                    required
                  />
                  {formData.email && !serverError && (
                    <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#43e97b]" />
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm text-[#e8e8f0] font-medium">Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7878a0] group-hover/input:text-[#6c63ff] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-[#1a1a26] border border-[#2a2a3d] rounded-xl text-white placeholder-[#7878a0] focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7878a0] hover:text-[#6c63ff] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group/checkbox">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${
                      formData.rememberMe 
                        ? 'bg-[#6c63ff] border-[#6c63ff]' 
                        : 'border-[#2a2a3d] group-hover/checkbox:border-[#6c63ff]'
                    }`}>
                      {formData.rememberMe && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <span className="text-[#e8e8f0]">Remember me</span>
                </label>
                <a 
                  href="/forgot-password" 
                  className="text-[#6c63ff] hover:text-[#7c75ff] transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group/btn overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#6c63ff] to-[#ff6584] opacity-100 group-hover/btn:opacity-90 transition-opacity rounded-xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                <div className="relative flex items-center justify-center gap-2 py-4 text-white font-medium">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Access Dashboard</span>
                      <LogIn className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-[#7878a0] text-sm mt-8">
              New to StartupAI?{' '}
              <a 
                href="/register" 
                className="text-[#6c63ff] font-medium hover:text-[#7c75ff] transition-colors relative group/register"
              >
                Create account
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6c63ff] to-[#ff6584] group-hover/register:w-full transition-all duration-300" />
              </a>
            </p>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-[#2a2a3d]">
              <Shield className="w-4 h-4 text-[#43e97b]" />
              <span className="text-xs text-[#7878a0]">256-bit encrypted · SOC2 Type II · GDPR compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}