import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "./store/slices/authSlice";

// Layout
import Layout from "./components/Layout";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard Pages
import LawyerDashboard from "./pages/LawyerDashboard";

// Components and Pages
import CaseList from "./components/CaseList";
import Notifications from "./pages/Notifications";
import Schedules from "./pages/Schedules";
import Profile from "./pages/Profile";
import ClientList from "./pages/ClientList";

import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import MyCases from "./pages/MyCases";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { user } = useSelector(selectAuth);

  // Helper function to get the appropriate dashboard component
  const getDashboardComponent = () => {
    if (!user) return <Navigate to="/login" />;

    switch (user.role) {
      case "admin":
        return <LawyerDashboard />;
      case "lawyer":
        return <LawyerDashboard />;
      case "client":
        return <LawyerDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes within Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard route */}
          <Route path="/dashboard" element={getDashboardComponent()} />

          {/* Admin routes */}
          <Route
            path="/lawyers"
            element={
              <ProtectedRoute roles={["admin"]}>
                <LawyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Lawyer routes */}
          <Route
            path="/cases"
            element={
              <ProtectedRoute roles={["lawyer", "admin"]}>
                <CaseList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedRoute roles={["lawyer"]}>
                <ClientList />
              </ProtectedRoute>
            }
          />

          {/* Client routes */}
          <Route
            path="/my-cases"
            element={
              <ProtectedRoute roles={["client"]}>
                <MyCases />
              </ProtectedRoute>
            }
          />

          {/* Shared routes */}
          <Route
            path="/schedules"
            element={
              <ProtectedRoute roles={["lawyer", "client"]}>
                <Schedules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute roles={["lawyer", "client"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
