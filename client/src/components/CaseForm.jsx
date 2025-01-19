import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import { toast } from "react-hot-toast";
import api from "../services/api";

export default function CaseForm({ onSubmit, initialData = null, onCancel }) {
  const { user } = useSelector(selectAuth);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    clientId: initialData?.clientId || "",
    caseType: initialData?.caseType || "",
    status: initialData?.status || "open",
    priority: initialData?.priority || "medium",
    courtDetails: initialData?.courtDetails || "",
    filingDate: initialData?.filingDate
      ? new Date(initialData.filingDate).toISOString().split("T")[0]
      : "",
    nextHearingDate: initialData?.nextHearingDate
      ? new Date(initialData.nextHearingDate).toISOString().split("T")[0]
      : "",
    judgeName: initialData?.judgeName || "",
    courtRoom: initialData?.courtRoom || ""
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/clients");
      setClients(response.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to load clients");
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "clientId" ? (value ? parseInt(value, 10) : "") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Add lawyer ID to the form data
      const caseData = {
        ...formData,
        lawyerId: user.id
      };

      await onSubmit(caseData);
      toast.success(initialData ? "Case updated successfully" : "Case created successfully");
      
      if (!initialData) {
        // Reset form only for new cases
        setFormData({
          title: "",
          description: "",
          clientId: "",
          caseType: "",
          status: "open",
          priority: "medium",
          courtDetails: "",
          filingDate: "",
          nextHearingDate: "",
          judgeName: "",
          courtRoom: ""
        });
      }
    } catch (err) {
      console.error("Error saving case:", err);
      setError(err.message || "Failed to save case");
      toast.error(err.message || "Failed to save case");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !clients.length) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 text-red-800 rounded-lg bg-red-50">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Client *
        </label>
        <select
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Case Type *
        </label>
        <select
          name="caseType"
          value={formData.caseType}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        >
          <option value="">Select case type</option>
          <option value="civil">Civil</option>
          <option value="criminal">Criminal</option>
          <option value="family">Family</option>
          <option value="corporate">Corporate</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Court Details
        </label>
        <input
          type="text"
          name="courtDetails"
          value={formData.courtDetails}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Filing Date
          </label>
          <input
            type="date"
            name="filingDate"
            value={formData.filingDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Next Hearing Date
          </label>
          <input
            type="date"
            name="nextHearingDate"
            value={formData.nextHearingDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Judge Name
          </label>
          <input
            type="text"
            name="judgeName"
            value={formData.judgeName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Court Room
          </label>
          <input
            type="text"
            name="courtRoom"
            value={formData.courtRoom}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : initialData ? "Update Case" : "Create Case"}
        </button>
      </div>
    </form>
  );
}
