import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";
import ThemeToggle from "./components/ThemeToggle";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import IdeaGenerator from "./components/IdeaGenerator";
import MarketAnalysis from "./components/MarketAnalysis";
import CompetitorIntelligence from "./components/CompetitorIntelligence";
import SkillsGapAnalysis from "./components/SkillsGapAnalysis";
import Notifications from "./components/Notifications";

function App() {
  const token = localStorage.getItem("token");

  return (
    <ThemeProvider>
      <ThemeToggle />
      <Routes>
        {/* Public Routes - Everyone can see */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes - Only logged in users */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ideas" 
          element={
            <ProtectedRoute>
              <IdeaGenerator />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/market" 
          element={
            <ProtectedRoute>
              <MarketAnalysis />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/competitors" 
          element={
            <ProtectedRoute>
              <CompetitorIntelligence />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/skills" 
          element={
            <ProtectedRoute>
              <SkillsGapAnalysis />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } 
        />
        
        {/* If logged in user tries to go to login/register, redirect to dashboard */}
        <Route 
          path="/login" 
          element={
            token ? <Navigate to="/dashboard" replace /> : <Login />
          } 
        />
        <Route 
          path="/register" 
          element={
            token ? <Navigate to="/dashboard" replace /> : <Register />
          } 
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;