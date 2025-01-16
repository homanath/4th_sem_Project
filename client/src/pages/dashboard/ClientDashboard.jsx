import { useState, useEffect } from "react";
import api from "../../services/api";

export default function ClientDashboard() {
  const [stats, setStats] = useState({
    activeCases: 0,
    upcomingSchedules: [],
    recentNotifications: [],
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/api/client/dashboard-stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Client Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Active Cases</h2>
          <p className="text-3xl font-bold">{stats.activeCases}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Upcoming Schedules</h2>
          {/* Add schedules list */}
        </div>
      </div>
    </div>
  );
}
