import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Trash2,
  CheckCheck,
  Eye,
  Clock,
  Calendar,
  Settings,
  ArrowRight   // ← ADD THIS LINE
} from "lucide-react";
import Sidebar from "../components/Sidebar";

import IdeaGenerator from "../components/IdeaGenerator";
import MarketAnalysis from "../components/MarketAnalysis";
import CompetitorIntelligence from "../components/CompetitorIntelligence";
import SkillsGapAnalysis from "../components/SkillsGapAnalysis";


export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [activeModule, setActiveModule] = useState("notifications");

  // Get data from localStorage for sidebar stats
  const ideas = JSON.parse(localStorage.getItem("saved_ideas") || "[]");
  const markets = JSON.parse(localStorage.getItem("market_reports") || "[]");
  const competitors = JSON.parse(localStorage.getItem("competitor_reports") || "[]");
  const skills = JSON.parse(localStorage.getItem("skills_reports") || "[]");

  const globalData = {
    generatedIdeas: ideas,
    marketAnalyses: markets,
    competitors: competitors,
    skillsAnalyses: skills
  };

  // Load notifications from localStorage
  useEffect(() => {
    const loadNotifications = () => {
      setLoading(true);
      try {
        const saved = JSON.parse(localStorage.getItem("notifications") || "[]");
        
        if (saved.length === 0) {
          const sampleNotifications = [
            {
              id: Date.now(),
              type: "success",
              title: "Welcome to StartupAI!",
              message: "Start your journey by generating your first startup idea.",
              time: "Just now",
              read: false,
              action: "/ideas",
              createdAt: new Date().toISOString()
            },
            {
              id: Date.now() + 1,
              type: "info",
              title: "Market Analysis Available",
              message: "Analyze markets to get insights about growth opportunities.",
              time: "1 hour ago",
              read: false,
              action: "/market",
              createdAt: new Date().toISOString()
            }
          ];
          setNotifications(sampleNotifications);
          localStorage.setItem("notifications", JSON.stringify(sampleNotifications));
        } else {
          const sorted = saved.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setNotifications(sorted);
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadNotifications();
    
    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("notifications") || "[]");
      const sorted = updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sorted);
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications, loading]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const deleteSelected = () => {
    setNotifications(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
    setSelectedNotifications([]);
    setSelectMode(false);
  };

  const toggleSelectNotification = (id) => {
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  const clearAllNotifications = () => {
    if (window.confirm("Delete all notifications?")) {
      setNotifications([]);
      setSelectedNotifications([]);
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getNotificationBg = (type, read) => {
    if (read) return "var(--surface)";
    switch(type) {
      case "success":
        return "rgba(67,233,123,0.05)";
      case "warning":
        return "rgba(251,191,36,0.05)";
      case "error":
        return "rgba(255,101,132,0.05)";
      default:
        return "rgba(108,99,255,0.05)";
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.action) {
      navigate(notification.action);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return true;
  }).filter(notif => {
    if (typeFilter === "all") return true;
    return notif.type === typeFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

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
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Bell className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "Syne, sans-serif", color: "var(--text)", margin: 0 }}>
                  Notifications
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
                  Stay updated with your startup activity and AI insights
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem"
          }}>
            <div style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "1rem",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--text)" }}>
                {notifications.length}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Total Notifications</div>
            </div>
            <div style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "1rem",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#6c63ff" }}>
                {unreadCount}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Unread</div>
            </div>
            <div style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "1rem",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#43e97b" }}>
                {notifications.filter(n => n.type === "success").length}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Achievements</div>
            </div>
            <div style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "1rem",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff6584" }}>
                {notifications.filter(n => n.type === "warning").length}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Alerts</div>
            </div>
          </div>
          
          {/* Filter Bar */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid var(--border)"
          }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setFilter("all")}
                style={{
                  padding: "0.5rem 1rem",
                  background: filter === "all" ? "linear-gradient(135deg, #6c63ff, #ff6584)" : "var(--surface2)",
                  border: "none",
                  borderRadius: "8px",
                  color: filter === "all" ? "white" : "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  transition: "all 0.2s"
                }}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                style={{
                  padding: "0.5rem 1rem",
                  background: filter === "unread" ? "linear-gradient(135deg, #6c63ff, #ff6584)" : "var(--surface2)",
                  border: "none",
                  borderRadius: "8px",
                  color: filter === "unread" ? "white" : "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  transition: "all 0.2s"
                }}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter("read")}
                style={{
                  padding: "0.5rem 1rem",
                  background: filter === "read" ? "linear-gradient(135deg, #6c63ff, #ff6584)" : "var(--surface2)",
                  border: "none",
                  borderRadius: "8px",
                  color: filter === "read" ? "white" : "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  transition: "all 0.2s"
                }}
              >
                Read
              </button>
              
              <div style={{ width: "1px", background: "var(--border)", margin: "0 0.5rem" }} />
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{
                  padding: "0.5rem 1rem",
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--text)",
                  cursor: "pointer",
                  fontSize: "0.8rem"
                }}
              >
                <option value="all">All Types</option>
                <option value="success">Success</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {selectMode && (
                <>
                  <button
                    onClick={deleteSelected}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "rgba(255,101,132,0.1)",
                      border: "1px solid #ff6584",
                      borderRadius: "8px",
                      color: "#ff6584",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete Selected ({selectedNotifications.length})
                  </button>
                  <button
                    onClick={() => { setSelectMode(false); setSelectedNotifications([]); }}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      fontSize: "0.8rem"
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
              
              <button
                onClick={() => setSelectMode(!selectMode)}
                style={{
                  padding: "0.5rem 1rem",
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                {selectMode ? <X className="w-3 h-3" /> : <CheckCheck className="w-3 h-3" />}
                {selectMode ? "Exit Select" : "Select"}
              </button>
              
              <button
                onClick={markAllAsRead}
                style={{
                  padding: "0.5rem 1rem",
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <CheckCheck className="w-3 h-3" />
                Mark All Read
              </button>
              
              <button
                onClick={clearAllNotifications}
                style={{
                  padding: "0.5rem 1rem",
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <Trash2 className="w-3 h-3" />
                Clear All
              </button>
            </div>
          </div>
          
          {/* Notifications List */}
          {loading ? (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px"
            }}>
              <div className="spinner" style={{ width: 40, height: 40 }} />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "3rem",
              textAlign: "center"
            }}>
              <Bell className="w-16 h-16" style={{ color: "var(--text-muted)", margin: "0 auto 1rem" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--text)", marginBottom: "0.5rem" }}>
                No Notifications
              </h3>
              <p style={{ color: "var(--text-muted)" }}>
                {filter !== "all" ? "No notifications match your filters." : "You're all caught up! New notifications will appear here."}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "1rem",
                    background: getNotificationBg(notif.type, notif.read),
                    border: `1px solid ${notif.read ? "var(--border)" : "rgba(108,99,255,0.3)"}`,
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    position: "relative"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateX(4px)";
                    e.currentTarget.style.borderColor = "#6c63ff";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.borderColor = notif.read ? "var(--border)" : "rgba(108,99,255,0.3)";
                  }}
                >
                  {/* Unread indicator */}
                  {!notif.read && (
                    <div style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      width: "8px",
                      height: "8px",
                      background: "#6c63ff",
                      borderRadius: "50%"
                    }} />
                  )}
                  
                  {/* Checkbox for select mode */}
                  {selectMode && (
                    <div onClick={(e) => { e.stopPropagation(); toggleSelectNotification(notif.id); }} style={{ flexShrink: 0 }}>
                      <div style={{
                        width: "20px",
                        height: "20px",
                        border: `2px solid ${selectedNotifications.includes(notif.id) ? "#6c63ff" : "var(--border)"}`,
                        borderRadius: "4px",
                        background: selectedNotifications.includes(notif.id) ? "#6c63ff" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        {selectedNotifications.includes(notif.id) && <CheckCheck className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div style={{ flexShrink: 0 }}>
                    {getNotificationIcon(notif.type)}
                  </div>
                  
                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: "bold", color: "var(--text)", margin: 0 }}>
                        {notif.title}
                      </h4>
                      {notif.count && (
                        <span style={{
                          padding: "0.125rem 0.5rem",
                          background: "#6c63ff",
                          borderRadius: "100px",
                          fontSize: "0.65rem",
                          color: "white"
                        }}>
                          +{notif.count}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                      {notif.message}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Clock className="w-3 h-3" />
                        {notif.time}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Calendar className="w-3 h-3" />
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  {!selectMode && (
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      {!notif.read && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                          style={{
                            padding: "0.25rem",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--text-muted)",
                            borderRadius: "4px"
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          title="Mark as read"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                        style={{
                          padding: "0.25rem",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-muted)",
                          borderRadius: "4px"
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ArrowRight className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Settings Section */}
          <div style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px"
          }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--text)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Settings className="w-4 h-4" />
              Notification Settings
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ fontWeight: "500", color: "var(--text)" }}>Email Notifications</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Receive notifications via email</div>
                </div>
                <label style={{ position: "relative", display: "inline-block", width: "50px", height: "24px" }}>
                  <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "var(--surface2)",
                    borderRadius: "34px",
                    transition: "0.3s"
                  }} />
                </label>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ fontWeight: "500", color: "var(--text)" }}>Push Notifications</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Show notifications in browser</div>
                </div>
                <label style={{ position: "relative", display: "inline-block", width: "50px", height: "24px" }}>
                  <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "#6c63ff",
                    borderRadius: "34px",
                    transition: "0.3s"
                  }} />
                </label>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ fontWeight: "500", color: "var(--text)" }}>Weekly Digest</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Get weekly summary of your activity</div>
                </div>
                <label style={{ position: "relative", display: "inline-block", width: "50px", height: "24px" }}>
                  <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "var(--surface2)",
                    borderRadius: "34px",
                    transition: "0.3s"
                  }} />
                </label>
              </div>
            </div>
          </div>
          
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
