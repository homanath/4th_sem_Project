import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import api from "../services/api";
import StatCard from "../components/StatCard";
import UpcomingSchedules from "../components/UpcomingSchedules";
import CaseStatusChart from "../components/CaseStatusChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { toast } from "react-hot-toast";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LawyerDashboard() {
  const { user } = useSelector(selectAuth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("month");
  const [stats, setStats] = useState({
    totalCases: 0,
    pendingCases: 0,
    totalClients: 0,
    upcomingSchedules: [],
    caseStatuses: [],
    monthlyStats: {
      labels: [],
      data: [],
    },
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/dashboard/lawyer", {
        params: { timeframe }
      });
      if (mounted) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    loadData();

    return () => {
      mounted = false;
    };
  }, [timeframe]);

  const chartData = {
    labels: stats.monthlyStats.labels,
    datasets: [
      {
        label: "New Cases",
        data: stats.monthlyStats.data,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      <div className="flex justify-end">
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="block w-40 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Cases" value={stats.totalCases} icon="cases" />
        <StatCard
          title="Pending Cases"
          value={stats.pendingCases}
          icon="pending"
        />
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon="clients"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Case Status Overview</h2>
          <CaseStatusChart statuses={stats.caseStatuses} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Monthly Case Trends</h2>
          {chartData.labels.length > 0 ? (
            <div className="h-64">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p className="text-center text-gray-500">No data available</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Upcoming Schedules</h2>
        <UpcomingSchedules schedules={stats.upcomingSchedules} />
      </div>
    </div>
  );
}
