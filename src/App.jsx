import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Spinner from "./components/ui/Spinner";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateMatch = lazy(() => import("./pages/CreateMatch"));
const History = lazy(() => import("./pages/History"));
const ViewPrediction = lazy(() => import("./pages/ViewPrediction"));
const LiveGame = lazy(() => import("./pages/LiveGame"));
const Demo = lazy(() => import("./pages/Demo"));
const Features = lazy(() => import("./pages/Features"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="page-loader">
      <Spinner size="large" text="Loading..." />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ToastProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/features" element={<Features />} />
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ToastProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}