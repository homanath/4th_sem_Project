import { useState, useEffect } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    totalClients: 0,
    totalCases: 0,
    recentActivities: [],
    userStats: {
      labels: [],
      data: [],
    },
    caseStats: {
      labels: [],
      data: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/api/admin/dashboard");
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 text-center bg-red-50 rounded-md">
        {error}
      </div>
    );
  }

  const userChartData = {
    labels: ["Lawyers", "Clients", "Total Users"],
    datasets: [
      {
        data: [stats.totalLawyers, stats.totalClients, stats.totalUsers],
        backgroundColor: ["#4F46E5", "#10B981", "#6366F1"],
      },
    ],
  };

  const caseChartData = {
    labels: stats.caseStats.labels,
    datasets: [
      {
        label: "Cases by Status",
        data: stats.caseStats.data,
        backgroundColor: "#4F46E5",
      },
    ],
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <button
          onClick={() => fetchDashboardData()}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="users"
          trend={"+5%"}
        />
        <StatCard
          title="Total Lawyers"
          value={stats.totalLawyers}
          icon="lawyer"
          trend={"+2%"}
        />
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon="client"
          trend={"+8%"}
        />
        <StatCard
          title="Total Cases"
          value={stats.totalCases}
          icon="case"
          trend={"+12%"}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">User Distribution</h2>
          <div className="h-64">
            <Doughnut
              data={userChartData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Case Status Overview</h2>
          <div className="h-64">
            <Bar
              data={caseChartData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Recent Activities</h2>
          <div className="flow-root">
            <ul className="-mb-8">
              {stats.recentActivities.map((activity, index) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index !== stats.recentActivities.length - 1 && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex space-x-3">
                      <div className="flex items-center">
                        <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center ring-8 ring-white">
                          {/* Icon based on activity type */}
                          <span className="text-primary-600">
                            {activity.icon}
                          </span>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {activity.description}
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
