import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import IdeaGenerator from "./components/IdeaGenerator";
import MarketAnalysis from "./components/MarketAnalysis";
import CompetitorIntelligence from "./components/CompetitorIntelligence";
import SkillsGapAnalysis from "./components/SkillsGapAnalysis";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Component Routes */}

      <Route
        path="/idea-generator"
        element={
          <ProtectedRoute>
            <IdeaGenerator />
          </ProtectedRoute>
        }
      />

      <Route
        path="/market-analysis"
        element={
          <ProtectedRoute>
            <MarketAnalysis />
          </ProtectedRoute>
        }
      />

      <Route
        path="/competitor-intelligence"
        element={
          <ProtectedRoute>
            <CompetitorIntelligence />
          </ProtectedRoute>
        }
      />

      <Route
        path="/skills-gap-analysis"
        element={
          <ProtectedRoute>
            <SkillsGapAnalysis />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}