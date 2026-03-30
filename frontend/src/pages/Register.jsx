import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { useTheme } from "../context/ThemeProvider";

export default function Register() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        if (data.email) {
          setError(data.email[0]);
        } else if (data.error) {
          setError(data.error);
        } else if (data.message) {
          setError(data.message);
        } else {
          setError("Registration failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Register error:", err);
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
          <h1 className={`text-4xl font-bold ${textColor} tracking-tight`}>Create Account</h1>
          <p className={`${textMuted} mt-2`}>Start your startup journey today</p>
        </div>

        <form onSubmit={handleRegister} className={`${cardBg} rounded-2xl p-8 border ${cardBorder} shadow-2xl transition-all duration-300`}>
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${textMuted} mb-2`}>Full Name</label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted}`} />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 ${inputBg} border ${inputBorder} rounded-xl ${textColor} placeholder:${textMuted} focus:outline-none focus:border-[#6c63ff] transition-all duration-300`}
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${textMuted} mb-2`}>Email Address</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted}`} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 ${inputBg} border ${inputBorder} rounded-xl ${textColor} placeholder:${textMuted} focus:outline-none focus:border-[#6c63ff] transition-all duration-300`}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${textMuted} mb-2`}>Password</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Minimum 6 characters"
                  className={`w-full pl-10 pr-12 py-3 ${inputBg} border ${inputBorder} rounded-xl ${textColor} placeholder:${textMuted} focus:outline-none focus:border-[#6c63ff] transition-all duration-300`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${textMuted} hover:text-[#6c63ff] transition-colors`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className={`text-xs ${textMuted} mt-1`}>Password must be at least 6 characters</p>
            </div>

            <div>
              <label className={`block text-sm font-medium ${textMuted} mb-2`}>Confirm Password</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted}`} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-12 py-3 ${inputBg} border ${inputBorder} rounded-xl ${textColor} placeholder:${textMuted} focus:outline-none focus:border-[#6c63ff] transition-all duration-300`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${textMuted} hover:text-[#6c63ff] transition-colors`}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#6c63ff] to-[#ff6584] py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Create Free Account</span>
                </div>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className={`text-sm ${textMuted}`}>
              Already have an account?{" "}
              <button
                type="button"
                className="text-[#6c63ff] hover:text-[#ff6584] transition-colors font-medium"
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
            </p>
          </div>
        </form>

        <p className={`text-center text-xs ${textMuted} mt-6`}>
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}