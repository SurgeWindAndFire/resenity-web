import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateMatch from "./pages/CreateMatch";
import History from "./pages/History";
import ViewPrediction from "./pages/ViewPrediction";
import LiveGame from "./pages/LiveGame";
import Demo from "./pages/Demo";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/create-match" 
            element={
              <ProtectedRoute>
                <CreateMatch />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/history" 
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/prediction/:id" 
            element={
              <ProtectedRoute>
                <ViewPrediction />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/live-game" 
            element={
              <ProtectedRoute>
                <LiveGame />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}