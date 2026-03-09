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
  ArrowLeft
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
    
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
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
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setServerError(data.message || "Failed to reset password. Link may be expired.");
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

  if (success) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0f] overflow-hidden font-mono">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(108, 99, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108, 99, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="bg-[#12121a] rounded-3xl border border-[#2a2a3d] p-12 max-w-md w-full text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#6c63ff] to-[#43e97b] rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2 font-syne">
              Password Reset! 🔐
            </h2>
            <p className="text-[#7878a0] mb-6">
              Your password has been successfully reset. Redirecting to login...
            </p>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-[#6c63ff] to-[#43e97b] h-2 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] overflow-hidden font-mono">
      {/* Animated Background */}
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

      <div className="absolute top-20 -left-20 w-96 h-96 bg-[#6c63ff] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#ff6584] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-[#12121a] rounded-3xl border border-[#2a2a3d] p-8 lg:p-10 hover:border-[#6c63ff] transition-all duration-500">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-[#1a1a26] rounded-2xl border border-[#2a2a3d] mb-4">
                <KeyRound className="w-6 h-6 text-[#6c63ff]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 font-syne">
                Create New Password
              </h2>
              <p className="text-[#7878a0] text-sm">
                Enter your new password below
              </p>
            </div>

            {serverError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* New Password */}
              <div className="space-y-2">
                <label className="text-sm text-[#e8e8f0] font-medium">New Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7878a0] group-hover/input:text-[#6c63ff] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-[#1a1a26] border border-[#2a2a3d] rounded-xl text-white placeholder-[#7878a0] focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7878a0] hover:text-[#6c63ff] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#7878a0]">Password strength</span>
                      <span className={
                        passwordStrength < 40 ? 'text-red-500' :
                        passwordStrength < 70 ? 'text-yellow-500' :
                        'text-[#43e97b]'
                      }>
                        {passwordStrength < 40 ? 'Weak' :
                         passwordStrength < 70 ? 'Medium' :
                         'Strong'}
                      </span>
                    </div>
                    <div className="h-1 bg-[#1a1a26] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm text-[#e8e8f0] font-medium">Confirm Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7878a0] group-hover/input:text-[#6c63ff] transition-colors" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-[#1a1a26] border border-[#2a2a3d] rounded-xl text-white placeholder-[#7878a0] focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7878a0] hover:text-[#6c63ff] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group/btn overflow-hidden mt-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#6c63ff] to-[#43e97b] opacity-100 group-hover/btn:opacity-90 transition-opacity rounded-xl" />
                <div className="relative flex items-center justify-center gap-2 py-4 text-white font-medium">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <Lock className="w-4 h-4" />
                    </>
                  )}
                </div>
              </button>

              {/* Back to Login */}
              <div className="text-center">
                <a 
                  href="/login" 
                  className="inline-flex items-center gap-2 text-[#7878a0] hover:text-[#6c63ff] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Login</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}