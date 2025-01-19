import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import api from "../services/api";
import AddClientModal from "../components/AddClientModal";
import { useNavigate } from "react-router-dom";

export default function ClientList() {
  const { user } = useSelector(selectAuth);
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [statusLoading, setStatusLoading] = useState(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      // Updated API endpoint
      const response = await api.get("/users/clients");

      if (!response.data) {
        throw new Error("No data received from server");
      }

      setClients(response.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch clients"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "lawyer") {
      fetchClients();
    }
  }, [user]);

  // Handle status change
  const handleStatusChange = async (clientId, currentStatus) => {
    try {
      setStatusLoading(clientId);
      const response = await api.put(`/users/clients/${clientId}/status`, {
        status: currentStatus === "active" ? "inactive" : "active",
      });

      if (response?.data) {
        setClients((prevClients) =>
          prevClients.map((client) =>
            client.id === clientId
              ? { ...client, status: response.data.status }
              : client
          )
        );
        // Show success message
        alert(`Client status updated successfully`);
      }
    } catch (err) {
      console.error("Error updating client status:", err);
      alert(err.response?.data?.message || "Failed to update client status");
    } finally {
      setStatusLoading(null);
    }
  };

  // Handle view details
  const handleViewDetails = (clientId) => {
    navigate(`/lawyer/clients/${clientId}`);
  };

  // Handle adding new client
  const handleAddClient = async (newClient) => {
    try {
      const response = await api.post("/users/register/client", {
        ...newClient,
        role: "client",
        lawyerId: user.id,
      });

      if (response?.data?.client) {
        setClients((prevClients) => [response.data.client, ...prevClients]);
        setShowAddModal(false);
        // Show success message
        alert(
          `Client created successfully!\n\nPlease provide these credentials to the client:\nEmail: ${newClient.email}\nPassword: ${newClient.password}`
        );
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Error adding client:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to create client. Please try again."
      );
    }
  };

  // Filter and pagination logic
  const filteredClients =
    clients?.filter(
      (client) =>
        client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client?.mobile?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredClients.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredClients.length / entriesPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 mt-2 text-white rounded bg-primary-600 hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Clients</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-white rounded bg-primary-600 hover:bg-primary-700"
        >
          + Add Client
        </button>
      </div>

      <div className="overflow-hidden bg-white rounded-lg shadow">
        {/* Search and entries per page controls */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span>Show</span>
              <select
                className="px-2 py-1 border rounded"
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>
            <div>
              <input
                type="search"
                placeholder="Search..."
                className="w-64 px-3 py-1 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Clients table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  No
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Client Name
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Mobile
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Cases
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEntries.map((client, index) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {indexOfFirstEntry + index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {client.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {client.mobile}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {client.caseCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={client.status === "active"}
                          onChange={() =>
                            handleStatusChange(client.id, client.status)
                          }
                          disabled={statusLoading === client.id}
                        />
                        <div
                          className={`w-11 h-6 bg-gray-200 rounded-full peer 
                          peer-focus:outline-none peer-focus:ring-4 
                          peer-focus:ring-blue-300 
                          dark:peer-focus:ring-blue-800 
                          peer-checked:after:translate-x-full 
                          peer-checked:after:border-white 
                          after:content-[''] 
                          after:absolute 
                          after:top-[2px] 
                          after:left-[2px] 
                          after:bg-white 
                          after:border-gray-300 
                          after:border 
                          after:rounded-full 
                          after:h-5 
                          after:w-5 
                          after:transition-all 
                          dark:border-gray-600 
                          peer-checked:bg-blue-600
                          ${statusLoading === client.id ? "opacity-50" : ""}`}
                        ></div>
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {statusLoading === client.id ? (
                            <span className="inline-block animate-spin">
                              ⌛
                            </span>
                          ) : (
                            client.status
                          )}
                        </span>
                      </label>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleViewDetails(client.id)}
                        className="font-medium text-primary-600 hover:text-primary-900"
                      >
                        View Details
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() =>
                          handleStatusChange(client.id, client.status)
                        }
                        className={`font-medium ${
                          client.status === "active"
                            ? "text-red-600 hover:text-red-900"
                            : "text-green-600 hover:text-green-900"
                        }`}
                        disabled={statusLoading === client.id}
                      >
                        {client.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstEntry + 1} to{" "}
              {Math.min(indexOfLastEntry, filteredClients.length)} of{" "}
              {filteredClients.length} entries
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-primary-600 text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <AddClientModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddClient}
        />
      )}
    </div>
  );
}
