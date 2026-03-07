import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
  Globe,
  Cpu,
  Users,
  Target,
  ChevronRight
} from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [passwordStrength, setPasswordStrength] = useState(0);

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
    
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25; // Extra for special chars
    
    setPasswordStrength(Math.min(strength, 100));
  }, [formData.password]);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "username":
        if (!value) error = "Username is required";
        else if (value.length < 3) error = "Username must be at least 3 characters";
        else if (value.length > 20) error = "Username must be less than 20 characters";
        else if (!/^[a-zA-Z0-9_]+$/.test(value)) 
          error = "Username can only contain letters, numbers, and underscores";
        break;

      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) 
          error = "Please enter a valid email address";
        break;

      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8) error = "Password must be at least 8 characters";
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) 
          error = "Password must contain uppercase, lowercase, and number";
        break;

      case "confirmPassword":
        if (!value) error = "Please confirm your password";
        else if (value !== formData.password) error = "Passwords do not match";
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== "acceptTerms") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (serverError) setServerError("");

    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setServerError("");

      try {
        const res = await fetch("http://127.0.0.1:8000/api/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setRegistrationSuccess(true);
        } else {
          setServerError(data.message || "Registration failed. Please try again.");
        }
      } catch (error) {
        setServerError("Network error. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 70) return "bg-yellow-500";
    if (passwordStrength < 90) return "bg-green-500";
    return "bg-[#43e97b]";
  };

  const stats = [
    { icon: Users, value: "12.5K+", label: "Active Founders" },
    { icon: Target, value: "3.2K", label: "Startups Launched" },
    { icon: TrendingUp, value: "98%", label: "Success Rate" }
  ];

  if (registrationSuccess) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0f] overflow-hidden font-mono">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(108, 99, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108, 99, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
        
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#6c63ff] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#43e97b] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" style={{ animationDuration: '12s' }} />

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="bg-[#12121a] rounded-3xl border border-[#2a2a3d] p-12 max-w-md w-full text-center hover:border-[#6c63ff] transition-all duration-500 group">
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#6c63ff] to-[#43e97b] rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-6 transition-transform">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-[#6c63ff] to-[#43e97b] rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2 font-syne">
              Welcome to the Future! 🚀
            </h2>
            <p className="text-[#7878a0] mb-8">
              Your account has been created successfully. Get ready to analyze and launch your next big idea.
            </p>
            
            <button
              onClick={() => window.location.href = "/login"}
              className="w-full relative group/btn overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#6c63ff] to-[#43e97b] opacity-100 group-hover/btn:opacity-90 transition-opacity rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              <div className="relative flex items-center justify-center gap-2 py-4 text-white font-medium">
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#ff6584] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#43e97b] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse" style={{ animationDuration: '15s' }} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Left Panel - Value Proposition */}
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
                  <p className="text-[#7878a0] text-sm">Join the Intelligence Revolution</p>
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-syne">
                Begin Your
                <br />
                <span className="bg-gradient-to-r from-[#6c63ff] via-[#43e97b] to-[#ff6584] bg-clip-text text-transparent">
                  Startup Journey
                </span>
              </h2>

              <p className="text-[#7878a0] text-lg mb-8 leading-relaxed">
                Join thousands of founders using AI to validate ideas, analyze markets, and build successful startups.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-[#1a1a26] rounded-xl p-4 border border-[#2a2a3d] group/stat hover:border-[#6c63ff] transition-all">
                      <Icon className="w-5 h-5 text-[#6c63ff] mb-2" />
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
                  { icon: Globe, text: "Global Market Intelligence", color: "text-[#43e97b]" },
                  { icon: Shield, text: "Enterprise-Grade Security", color: "text-[#6c63ff]" }
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
            <div className="mt-8 p-6 bg-[#1a1a26] rounded-2xl border border-[#2a2a3d] relative">
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-5 h-5 text-[#6c63ff]" />
              </div>
              <p className="text-[#e8e8f0] text-sm italic mb-3">
                "StartupAI helped me validate my idea in days instead of months. The insights are incredibly accurate!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#ff6584] flex items-center justify-center text-white text-xs font-bold">
                  MA
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Michael Anderson</p>
                  <p className="text-[#7878a0] text-xs">Founder, AI Horizons</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Registration Form */}
          <div className="flex-1 bg-[#12121a] rounded-3xl border border-[#2a2a3d] p-8 lg:p-12 backdrop-blur-sm hover:border-[#6c63ff] transition-all duration-500">
            
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-[#1a1a26] rounded-2xl border border-[#2a2a3d] mb-4">
                <User className="w-6 h-6 text-[#6c63ff]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-syne">Create Account</h3>
              <p className="text-[#7878a0] text-sm">Start your 14-day free trial</p>
            </div>

            {/* Error Message */}
            {serverError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm text-[#e8e8f0] font-medium">Username</label>
                <div className="relative group/input">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7878a0] group-hover/input:text-[#6c63ff] transition-colors" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="johndoe123"
                    className={`w-full pl-12 pr-10 py-4 bg-[#1a1a26] border rounded-xl text-white placeholder-[#7878a0] focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 outline-none transition-all ${
                      touched.username && errors.username
                        ? 'border-red-500/50'
                        : touched.username && formData.username
                        ? 'border-[#43e97b]/50'
                        : 'border-[#2a2a3d]'
                    }`}
                    disabled={isLoading}
                  />
                  {touched.username && !errors.username && formData.username && (
                    <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#43e97b]" />
                  )}
                </div>
                {errors.username && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.username}
                  </p>
                )}
              </div>

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
                    onBlur={handleBlur}
                    placeholder="you@example.com"
                    className={`w-full pl-12 pr-10 py-4 bg-[#1a1a26] border rounded-xl text-white placeholder-[#7878a0] focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 outline-none transition-all ${
                      touched.email && errors.email
                        ? 'border-red-500/50'
                        : touched.email && formData.email
                        ? 'border-[#43e97b]/50'
                        : 'border-[#2a2a3d]'
                    }`}
                    disabled={isLoading}
                  />
                  {touched.email && !errors.email && formData.email && (
                    <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#43e97b]" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
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
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-4 bg-[#1a1a26] border rounded-xl text-white placeholder-[#7878a0] focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 outline-none transition-all ${
                      touched.password && errors.password
                        ? 'border-red-500/50'
                        : touched.password && formData.password && passwordStrength > 70
                        ? 'border-[#43e97b]/50'
                        : 'border-[#2a2a3d]'
                    }`}
                    disabled={isLoading}
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
                {touched.password && formData.password && (
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
                         passwordStrength < 90 ? 'Strong' : 'Very Strong'}
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
                
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm text-[#e8e8f0] font-medium">Confirm Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7878a0] group-hover/input:text-[#6c63ff] transition-colors" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-4 bg-[#1a1a26] border rounded-xl text-white placeholder-[#7878a0] focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 outline-none transition-all ${
                      touched.confirmPassword && errors.confirmPassword
                        ? 'border-red-500/50'
                        : touched.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-[#43e97b]/50'
                        : 'border-[#2a2a3d]'
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7878a0] hover:text-[#6c63ff] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3">
                <div className="relative flex items-center h-5">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="sr-only"
                  />
                  <div 
                    onClick={() => handleChange({ target: { name: 'acceptTerms', type: 'checkbox', checked: !formData.acceptTerms } })}
                    className={`w-4 h-4 border rounded flex items-center justify-center cursor-pointer transition-all ${
                      formData.acceptTerms 
                        ? 'bg-[#6c63ff] border-[#6c63ff]' 
                        : 'border-[#2a2a3d] hover:border-[#6c63ff]'
                    }`}
                  >
                    {formData.acceptTerms && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <label className="text-sm text-[#e8e8f0]">
                  I agree to the{" "}
                  <a href="/terms" className="text-[#6c63ff] hover:text-[#7c75ff] transition-colors">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-[#6c63ff] hover:text-[#7c75ff] transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.acceptTerms}
                </p>
              )}

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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-[#7878a0] text-sm mt-8">
              Already have an account?{' '}
              <a 
                href="/login" 
                className="text-[#6c63ff] font-medium hover:text-[#7c75ff] transition-colors relative group/register"
              >
                Sign in
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6c63ff] to-[#43e97b] group-hover/register:w-full transition-all duration-300" />
              </a>
            </p>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-[#2a2a3d]">
              <Shield className="w-4 h-4 text-[#43e97b]" />
              <span className="text-xs text-[#7878a0]">256-bit encrypted · 14-day free trial · No credit card</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}