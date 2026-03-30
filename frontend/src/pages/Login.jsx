import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, LogIn, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeProvider";

export default function Login() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        navigate("/dashboard");
      } else {
        setError(data.detail || data.error || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Cannot connect to server. Please make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const bgGradient = isDark 
    ? "from-black via-gray-900 to-black"
    : "from-gray-50 via-white to-gray-100";
  
  const cardBg = isDark ? "bg-white/5 backdrop-blur-sm" : "bg-white shadow-xl";
  const cardBorder = isDark ? "border-white/10" : "border-gray-200";
  const inputBg = isDark ? "bg-black/50" : "bg-gray-50";
  const inputBorder = isDark ? "border-white/10" : "border-gray-200";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${bgGradient} p-4 transition-all duration-300`}>
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? 'white' : 'black'} 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${isDark ? 'bg-white' : 'bg-black'} rounded-2xl shadow-xl mb-4`}>
            <Sparkles className={`w-8 h-8 ${isDark ? 'text-black' : 'text-white'}`} />
          </div>
          <h1 className={`text-4xl font-bold ${textColor} tracking-tight`}>Welcome Back</h1>
          <p className={`${textMuted} mt-2`}>Sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className={`${cardBg} rounded-2xl p-8 border ${cardBorder} shadow-2xl transition-all duration-300`}>
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className={`block text-sm font-medium ${textMuted} mb-2`}>Email Address</label>
              <div className="relative group">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'} group-focus-within:text-[#6c63ff] transition-colors`} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 ${inputBg} border ${inputBorder} rounded-xl ${textColor} placeholder:${isDark ? 'text-gray-500' : 'text-gray-400'} focus:outline-none focus:border-[#6c63ff] transition-all duration-300`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${textMuted} mb-2`}>Password</label>
              <div className="relative group">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'} group-focus-within:text-[#6c63ff] transition-colors`} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-3 ${inputBg} border ${inputBorder} rounded-xl ${textColor} placeholder:${isDark ? 'text-gray-500' : 'text-gray-400'} focus:outline-none focus:border-[#6c63ff] transition-all duration-300`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'} hover:text-[#6c63ff] transition-colors`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 bg-gray-100 accent-[#6c63ff]"
                />
                <span className={`text-sm ${textMuted}`}>Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#6c63ff] hover:text-[#ff6584] transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#6c63ff] to-[#ff6584] py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </div>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className={`text-sm ${textMuted}`}>
              Don't have an account?{" "}
              <button
                type="button"
                className="text-[#6c63ff] hover:text-[#ff6584] transition-colors font-medium"
                onClick={() => navigate("/register")}
              >
                Create free account
              </button>
            </p>
          </div>
        </form>

        <p className={`text-center text-xs ${textMuted} mt-6`}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}