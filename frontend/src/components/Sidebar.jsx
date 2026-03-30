import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Lightbulb,
  TrendingUp,
  Target,
  Brain,
  Zap,
  Activity,
  Award,
  ChevronRight,
  Settings,
  LogOut,
  HelpCircle,
  Bell,
  User,
  Sparkles,
  Cpu,
  Globe,
  Menu,
  X
} from "lucide-react";

export default function Sidebar({ activeModule, setActiveModule, globalData }) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [user, setUser] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
    
    // Load unread notifications count
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    const unread = notifications.filter(n => !n.read).length;
    setUnreadNotifications(unread);
  }, []);

  // Listen for notification changes
  useEffect(() => {
    const handleStorageChange = () => {
      const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
      const unread = notifications.filter(n => !n.read).length;
      setUnreadNotifications(unread);
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, activeIcon: <LayoutDashboard className="w-5 h-5" />, color: "#6c63ff", path: "/dashboard" },
    { id: "ideas", label: "Idea Generator", icon: <Lightbulb className="w-5 h-5" />, activeIcon: <Lightbulb className="w-5 h-5" />, color: "#6c63ff", path: "/ideas" },
    { id: "market", label: "Market Analysis", icon: <TrendingUp className="w-5 h-5" />, activeIcon: <TrendingUp className="w-5 h-5" />, color: "#38bdf8", path: "/market" },
    { id: "competitors", label: "Competitors", icon: <Target className="w-5 h-5" />, activeIcon: <Target className="w-5 h-5" />, color: "#ff6584", path: "/competitors" },
    { id: "skills", label: "Skills Gap", icon: <Brain className="w-5 h-5" />, activeIcon: <Brain className="w-5 h-5" />, color: "#43e97b", path: "/skills" },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" />, activeIcon: <Bell className="w-5 h-5" />, color: "#fbbf24", path: "/notifications", badge: unreadNotifications },
  ];

  const ideas = globalData?.generatedIdeas?.length || 0;
  const markets = globalData?.marketAnalyses?.length || 0;
  const competitors = globalData?.competitors?.length || 0;

  const stats = [
    { label: "Ideas", val: ideas, icon: <Lightbulb className="w-3 h-3" />, color: "#6c63ff" },
    { label: "Markets", val: markets, icon: <Globe className="w-3 h-3" />, color: "#38bdf8" },
    { label: "Competitors", val: competitors, icon: <Target className="w-3 h-3" />, color: "#ff6584" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleNavigation = (item) => {
    setActiveModule(item.id);
    navigate(item.path);
  };

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: isCollapsed ? "80px" : "280px",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        boxShadow: isCollapsed ? "none" : "2px 0 12px rgba(0,0,0,0.05)"
      }}
    >
      {/* Animated Background Gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: "radial-gradient(circle at 0% 0%, var(--accent) 0%, transparent 70%)",
          opacity: 0.05,
          pointerEvents: "none"
        }}
      />

      {/* Header / Logo Section */}
      <div style={{ 
        padding: isCollapsed ? "1.25rem 0" : "1.5rem 1.5rem", 
        borderBottom: "1px solid var(--border)",
        position: "relative",
        transition: "padding 0.3s ease"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: isCollapsed ? "center" : "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Logo Container */}
            <div
              style={{
                position: "relative",
                width: 38,
                height: 38,
                borderRadius: 12,
                background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(108,99,255,0.2)"
              }}
              onClick={() => navigate("/dashboard")}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(108,99,255,0.3)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(108,99,255,0.2)";
              }}
            >
              <Cpu className="w-5 h-5 text-white" />
            </div>

            {!isCollapsed && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    lineHeight: 1,
                    background: "linear-gradient(135deg, var(--text), var(--accent))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  StartupAI
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text-muted)",
                    marginTop: 2,
                    letterSpacing: "0.5px"
                  }}
                >
                  Intelligence Platform
                </div>
              </div>
            )}
          </div>

          {/* Collapse Toggle Button */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                color: "var(--text-muted)"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "var(--surface2)";
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <Menu className="w-4 h-4" />
            </button>
          )}
          
          {/* Expand button when collapsed */}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                position: "absolute",
                right: -12,
                top: 20,
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                color: "var(--text-muted)",
                zIndex: 10
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "var(--surface2)";
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div
          style={{
            margin: "1rem 1rem",
            padding: "0.75rem",
            background: "var(--surface2)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            cursor: "pointer",
            position: "relative",
            transition: "all 0.2s ease"
          }}
          onClick={() => setShowUserMenu(!showUserMenu)}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <User className="w-5 h-5 text-white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text)" }}>
                {user?.name || user?.username || "Founder"}
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                Pro Plan
              </div>
            </div>
            <ChevronRight className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
          </div>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div
              style={{
                position: "absolute",
                bottom: -100,
                left: 0,
                right: 0,
                background: "var(--surface)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                padding: "0.5rem",
                zIndex: 200,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
              }}
            >
              <button
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  borderRadius: "8px",
                  color: "var(--text)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <Settings className="w-3 h-3" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  borderRadius: "8px",
                  color: "#ff6584",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,101,132,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <LogOut className="w-3 h-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav style={{ 
        flex: 1, 
        padding: isCollapsed ? "0 0.5rem" : "0 0.8rem",
        marginTop: "0.5rem",
        overflowY: "auto",
        overflowX: "hidden"
      }}>
        {navItems.map((item) => {
          const isActive = activeModule === item.id;
          const isHovered = hoveredItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "flex-start",
                gap: isCollapsed ? 0 : "0.85rem",
                padding: isCollapsed ? "0.75rem" : "0.75rem 1rem",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background: isActive
                  ? `linear-gradient(90deg, ${item.color}20, transparent)`
                  : isHovered
                  ? "var(--surface2)"
                  : "transparent",
                color: isActive
                  ? item.color
                  : isHovered
                  ? "var(--text)"
                  : "var(--text-muted)",
                fontFamily: "Space Mono, monospace",
                fontSize: "0.82rem",
                marginBottom: "0.3rem",
                position: "relative",
                transition: "all 0.2s ease",
                textAlign: "left",
                borderLeft: isActive
                  ? `2px solid ${item.color}`
                  : "2px solid transparent"
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: isCollapsed ? "auto" : 24
              }}>
                {isActive ? item.activeIcon : item.icon}
              </div>
              
              {!isCollapsed && (
                <span style={{
                  flex: 1,
                  opacity: 1,
                  transition: "opacity 0.2s ease"
                }}>
                  {item.label}
                </span>
              )}

              {/* Badge for notifications */}
              {!isCollapsed && item.badge > 0 && (
                <span style={{
                  background: "#ff6584",
                  color: "white",
                  fontSize: "0.6rem",
                  padding: "0.125rem 0.375rem",
                  borderRadius: "100px",
                  marginLeft: "auto"
                }}>
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed mode */}
              {isCollapsed && isHovered && (
                <div
                  style={{
                    position: "absolute",
                    left: "100%",
                    marginLeft: "12px",
                    padding: "0.4rem 0.8rem",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "0.7rem",
                    color: "var(--text)",
                    whiteSpace: "nowrap",
                    zIndex: 200,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    pointerEvents: "none"
                  }}
                >
                  {item.label}
                  {item.badge > 0 && ` (${item.badge})`}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Stats Section */}
      <div
        style={{
          padding: isCollapsed ? "1rem 0" : "1rem 1.5rem",
          borderTop: "1px solid var(--border)",
          marginTop: "auto",
          transition: "padding 0.3s ease"
        }}
      >
        {!isCollapsed && (
          <div
            style={{
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              marginBottom: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <Activity className="w-3 h-3" />
            Session Stats
          </div>
        )}

        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "space-between",
              marginBottom: "0.5rem",
              gap: isCollapsed ? 0 : "0.5rem"
            }}
          >
            {!isCollapsed && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ color: s.color }}>{s.icon}</div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)"
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: s.color,
                    fontWeight: 600
                  }}
                >
                  {s.val}
                </span>
              </>
            )}
            
            {isCollapsed && (
              <div
                style={{
                  position: "relative",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  background: "var(--surface2)",
                  cursor: "pointer"
                }}
                title={`${s.label}: ${s.val}`}
              >
                <div style={{ color: s.color }}>{s.icon}</div>
                <span
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    fontSize: "0.5rem",
                    background: s.color,
                    color: "white",
                    borderRadius: "100px",
                    width: 14,
                    height: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold"
                  }}
                >
                  {s.val}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Help & Support */}
      {!isCollapsed && (
        <div style={{ padding: "1rem 1.5rem 1.5rem" }}>
          <button
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.5rem 1rem",
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              cursor: "pointer",
              color: "var(--text-muted)",
              fontSize: "0.72rem",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent)";
              e.currentTarget.style.background = "rgba(108,99,255,0.05)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.background = "var(--surface2)";
            }}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help & Support</span>
            <Sparkles className="w-3 h-3" style={{ marginLeft: "auto" }} />
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        nav::-webkit-scrollbar {
          width: 4px;
        }
        
        nav::-webkit-scrollbar-track {
          background: transparent;
        }
        
        nav::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 4px;
        }
        
        nav::-webkit-scrollbar-thumb:hover {
          background: var(--accent);
        }
      `}</style>
    </aside>
  );
}

// ChevronLeft icon
const ChevronLeft = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
