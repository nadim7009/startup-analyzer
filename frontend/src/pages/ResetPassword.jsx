import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Shield,
  Sparkles,
  Cpu,
  KeyRound,
  ArrowLeft,
  Zap
} from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
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

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    const password = formData.password;
    
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    setPasswordStrength(Math.min(strength, 100));
  }, [formData.password]);

  const validateForm = () => {
    if (!formData.password) return "Password is required";
    if (formData.password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) 
      return "Password must contain uppercase, lowercase, and number";
    if (formData.password !== formData.confirmPassword) 
      return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      setServerError(error);
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reset-password/${token}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        // Auto redirect after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setServerError(data.message || "Failed to reset password. The link may have expired.");
      }
    } catch (error) {
      setServerError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 70) return "bg-yellow-500";
    if (passwordStrength < 90) return "bg-green-500";
    return "bg-[#43e97b]";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Medium";
    if (passwordStrength < 90) return "Strong";
    return "Very Strong";
  };

  // Success State
  if (success) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0f] overflow-hidden font-mono">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(108, 99, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108, 99, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
        
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#6c63ff] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#43e97b] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" />

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="bg-[#12121a] rounded-3xl border border-[#2a2a3d] p-12 max-w-md w-full text-center hover:border-[#6c63ff] transition-all duration-500 group">
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#6c63ff] to-[#43e97b] rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-6 transition-transform">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-[#6c63ff] to-[#43e97b] rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2 font-syne">
              Password Reset! 🔐
            </h2>
            <p className="text-[#7878a0] mb-6">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            
            <div className="bg-[#1a1a26] rounded-xl p-4 mb-6 border border-[#2a2a3d]">
              <p className="text-sm text-[#e8e8f0] flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-[#6c63ff]" />
                Redirecting to login in 3 seconds...
              </p>
            </div>
            
            <button
              onClick={() => navigate("/login")}
              className="w-full relative group/btn overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#6c63ff] to-[#43e97b] opacity-100 group-hover/btn:opacity-90 transition-opacity rounded-xl" />
              <div className="relative flex items-center justify-center gap-2 py-4 text-white font-medium">
                <span>Go to Login</span>
                <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Reset Password Form
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
      <div className="absolute top-20 -left-20 w-96 h-96 bg-[#6c63ff] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#ff6584] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#43e97b] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Left Panel - Branding & Password Tips */}
          <div className="flex-1 flex flex-col justify-between p-8 lg:p-12 bg-[#12121a] rounded-3xl border border-[#2a2a3d] backdrop-blur-sm hover:border-[#6c63ff] transition-all duration-500 group">
            
            {/* Logo and Title */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#6c63ff] to-[#43e97b] rounded-xl flex items-center justify-center transform -rotate-3 group-hover:rotate-0 transition-transform">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#6c63ff] to-[#43e97b] rounded-xl opacity-50 blur group-hover:opacity-75 transition-opacity" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6c63ff] to-[#43e97b] bg-clip-text text-transparent font-syne">
                    StartupAI
                  </h1>
                  <p className="text-[#7878a0] text-sm">Secure Password Reset</p>
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-syne">
                Create New
                <br />
                <span className="bg-gradient-to-r from-[#6c63ff] via-[#43e97b] to-[#ff6584] bg-clip-text text-transparent">
                  Password
                </span>
              </h2>

              <p className="text-[#7878a0] text-lg mb-8 leading-relaxed">
                Choose a strong password that you don't use for other services to keep your account secure.
              </p>

              {/* Password Requirements */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold mb-3">Password Requirements:</h3>
                {[
                  { text: "At least 8 characters long", check: formData.password.length >= 8 },
                  { text: "Contains uppercase letter (A-Z)", check: /[A-Z]/.test(formData.password) },
                  { text: "Contains lowercase letter (a-z)", check: /[a-z]/.test(formData.password) },
                  { text: "Contains number (0-9)", check: /[0-9]/.test(formData.password) },
                  { text: "Contains special character (!@#$%)", check: /[^A-Za-z0-9]/.test(formData.password) }
                ].map((req, index) => (
                  <div key={index} className="flex items-center gap-3 text-[#e8e8f0]">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      req.check ? 'bg-[#43e97b]/20' : 'bg-[#2a2a3d]'
                    }`}>
                      {req.check ? (
                        <CheckCircle className="w-3 h-3 text-[#43e97b]" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#7878a0]" />
                      )}
                    </div>
                    <span className="text-sm">{req.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Tip */}
            <div className="mt-8 p-6 bg-[#1a1a26] rounded-2xl border border-[#2a2a3d] relative">
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-5 h-5 text-[#6c63ff]" />
              </div>
              <p className="text-[#e8e8f0] text-sm">
                <span className="text-[#ff6584] font-bold">🔐 Pro Tip:</span> Use a password manager to generate and store strong, unique passwords for all your accounts.
              </p>
            </div>
          </div>

          {/* Right Panel - Reset Password Form */}
          <div className="flex-1 bg-[#12121a] rounded-3xl border border-[#2a2a3d] p-8 lg:p-12 backdrop-blur-sm hover:border-[#6c63ff] transition-all duration-500">
            
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-[#1a1a26] rounded-2xl border border-[#2a2a3d] mb-4">
                <KeyRound className="w-6 h-6 text-[#6c63ff]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-syne">Reset Your Password</h3>
              <p className="text-[#7878a0] text-sm">
                Enter your new password below
              </p>
            </div>

            {/* Error Message */}
            {serverError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* New Password Field */}
              <div className="space-y-2">
                <label className="text-sm text-[#e8e8f0] font-medium">New Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7878a0] group-hover/input:text-[#6c63ff] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({...formData, password: e.target.value});
                      if (serverError) setServerError("");
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-4 bg-[#1a1a26] border rounded-xl text-white placeholder-[#7878a0] focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 outline-none transition-all ${
                      formData.password 
                        ? passwordStrength >= 70 
                          ? 'border-[#43e97b]/50' 
                          : passwordStrength >= 40 
                            ? 'border-yellow-500/50'
                            : 'border-red-500/50'
                        : 'border-[#2a2a3d]'
                    }`}
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
                
                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#7878a0]">Password strength</span>
                      <span className={
                        passwordStrength < 40 ? 'text-red-500' :
                        passwordStrength < 70 ? 'text-yellow-500' :
                        passwordStrength < 90 ? 'text-green-500' :
                        'text-[#43e97b]'
                      }>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#1a1a26] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm text-[#e8e8f0] font-medium">Confirm Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7878a0] group-hover/input:text-[#6c63ff] transition-colors" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({...formData, confirmPassword: e.target.value});
                      if (serverError) setServerError("");
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-4 bg-[#1a1a26] border rounded-xl text-white placeholder-[#7878a0] focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 outline-none transition-all ${
                      formData.confirmPassword && formData.password
                        ? formData.password === formData.confirmPassword
                          ? 'border-[#43e97b]/50'
                          : 'border-red-500/50'
                        : 'border-[#2a2a3d]'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7878a0] hover:text-[#6c63ff] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Match Indicator */}
                {formData.confirmPassword && formData.password && (
                  <p className={`text-xs flex items-center gap-1 mt-1 ${
                    formData.password === formData.confirmPassword 
                      ? 'text-[#43e97b]' 
                      : 'text-red-500'
                  }`}>
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Passwords match
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        Passwords do not match
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group/btn overflow-hidden mt-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#6c63ff] to-[#43e97b] opacity-100 group-hover/btn:opacity-90 transition-opacity rounded-xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                <div className="relative flex items-center justify-center gap-2 py-4 text-white font-medium">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <Lock className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    </>
                  )}
                </div>
              </button>

              {/* Back to Login Link */}
              <div className="text-center mt-6">
                <a 
                  href="/login" 
                  className="inline-flex items-center gap-2 text-[#7878a0] hover:text-[#6c63ff] transition-colors group/back"
                >
                  <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" />
                  <span>Back to Login</span>
                </a>
              </div>
            </form>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-[#2a2a3d]">
              <Shield className="w-4 h-4 text-[#43e97b]" />
              <span className="text-xs text-[#7878a0]">256-bit encryption · Secure password reset</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}