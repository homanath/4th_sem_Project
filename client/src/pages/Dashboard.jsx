import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import api from "../services/api";
import StatCard from "../components/StatCard";
import UpcomingSchedules from "../components/UpcomingSchedules";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const { user } = useSelector(selectAuth);
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    upcomingSchedules: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/dashboard/client");
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your cases.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Cases" value={stats.totalCases} icon="cases" />
        <StatCard
          title="Active Cases"
          value={stats.activeCases}
          icon="pending"
        />
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-lg font-medium">Upcoming Schedules</h2>
        <UpcomingSchedules schedules={stats.upcomingSchedules} />
      </div>
    </div>
  );
}
