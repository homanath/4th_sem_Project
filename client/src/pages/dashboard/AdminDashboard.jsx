import { useState, useEffect } from "react";
import api from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLawyers: 0,
    totalClients: 0,
    totalCases: 0,
    recentCases: [],
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/api/admin/dashboard-stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Stats cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Total Lawyers</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalLawyers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Total Clients</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalClients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Total Cases</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalCases}</p>
        </div>
      </div>
    </div>
  );
}
