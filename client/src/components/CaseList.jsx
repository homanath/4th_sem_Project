import { useState, useEffect } from "react";
import api from "../services/api";
import { Plus } from "lucide-react";

export default function CaseList() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCase, setNewCase] = useState({
    title: "",
    caseNumber: "",
    description: "",
    status: "pending",
    clientId: "",
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/cases");
      setCases(response.data);
    } catch (err) {
      setError("Failed to fetch cases");
      console.error("Error fetching cases:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCase = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/cases", newCase);
      setCases([...cases, response.data]);
      setIsModalOpen(false);
      setNewCase({
        title: "",
        caseNumber: "",
        description: "",
        status: "pending",
        clientId: "",
      });
    } catch (err) {
      setError("Failed to add case");
      console.error("Error adding case:", err);
    }
  };

  const filteredCases = cases.filter(
    (case_) =>
      case_.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading cases...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Cases</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search cases..."
            className="px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus size={20} />
            Add New Case
          </button>
        </div>
      </div>

      {filteredCases.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No cases found</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredCases.map((case_) => (
              <li key={case_.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary-600 truncate">
                        {case_.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Case Number: {case_.caseNumber}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          case_.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {case_.status}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add New Case</h2>
            <form onSubmit={handleAddCase} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={newCase.title}
                  onChange={(e) =>
                    setNewCase({ ...newCase, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Case Number
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={newCase.caseNumber}
                  onChange={(e) =>
                    setNewCase({ ...newCase, caseNumber: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  rows="3"
                  value={newCase.description}
                  onChange={(e) =>
                    setNewCase({ ...newCase, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={newCase.status}
                  onChange={(e) =>
                    setNewCase({ ...newCase, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                >
                  Add Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
