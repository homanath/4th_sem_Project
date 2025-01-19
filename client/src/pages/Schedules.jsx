import { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "../services/api";
import { Plus } from "lucide-react";
import ScheduleForm from "../components/ScheduleForm";

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await api.get("/schedules");
      setSchedules(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async (formData) => {
    try {
      const response = await api.post("/schedules", formData);
      setSchedules([...schedules, response.data]);
      setShowAddForm(false);
    } catch (err) {
      console.error("Error creating schedule:", err);
      throw new Error(err.response?.data?.message || "Failed to create schedule");
    }
  };

  const handleEditSchedule = async (formData) => {
    try {
      const response = await api.put(`/schedules/${editingSchedule.id}`, formData);
      setSchedules(schedules.map((schedule) =>
        schedule.id === editingSchedule.id ? response.data : schedule
      ));
      setEditingSchedule(null);
    } catch (err) {
      console.error("Error updating schedule:", err);
      throw new Error(err.response?.data?.message || "Failed to update schedule");
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;

    try {
      await api.delete(`/schedules/${id}`);
      setSchedules(schedules.filter((schedule) => schedule.id !== id));
    } catch (err) {
      console.error("Error deleting schedule:", err);
      setError("Failed to delete schedule");
    }
  };

  const getStatusColor = (date) => {
    const scheduleDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (scheduleDate < today) {
      return "bg-gray-100 text-gray-800"; // Past
    } else if (scheduleDate.toDateString() === today.toDateString()) {
      return "bg-yellow-100 text-yellow-800"; // Today
    } else {
      return "bg-green-100 text-green-800"; // Upcoming
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Schedules</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Schedule
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 text-red-700 border border-red-400 rounded bg-red-50">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">Add New Schedule</h2>
            <ScheduleForm
              onSubmit={handleAddSchedule}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {editingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">Edit Schedule</h2>
            <ScheduleForm
              initialData={editingSchedule}
              onSubmit={handleEditSchedule}
              onCancel={() => setEditingSchedule(null)}
            />
          </div>
        </div>
      )}

      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        {schedules.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">No schedules found</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <li key={schedule.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-primary-600">
                        {schedule.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {schedule.description}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {format(new Date(schedule.date), "PPp")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          schedule.date
                        )}`}
                      >
                        {schedule.type}
                      </span>
                      <button
                        onClick={() => setEditingSchedule(schedule)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
