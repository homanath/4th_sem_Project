import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
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
    courtDetails: initialData?.courtDetails || "",
    filingDate: initialData?.filingDate
      ? new Date(initialData.filingDate).toISOString().split("T")[0]
      : "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get("/api/users/clients");
      setClients(response.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to load clients");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "clientId" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSubmit(formData);
      setFormData({
        title: "",
        description: "",
        clientId: "",
        caseType: "",
        courtDetails: "",
        filingDate: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 text-red-800 rounded-lg bg-red-50">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
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
          Client
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
          Case Type
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
