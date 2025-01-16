export default function CaseStatusChart({ statuses = [] }) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Case Status Overview
      </h2>
      <div className="space-y-4">
        {statuses.length === 0 ? (
          <p className="text-gray-500">No case status data available</p>
        ) : (
          statuses.map((status) => (
            <div
              key={status.status}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColor(
                    status.status
                  )}`}
                />
                <p className="ml-2 text-sm font-medium text-gray-900">
                  {status.status.charAt(0).toUpperCase() +
                    status.status.slice(1)}
                </p>
              </div>
              <p className="text-sm text-gray-500">{status.count}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case "open":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    case "closed":
      return "bg-gray-500";
    case "archived":
      return "bg-red-500";
    default:
      return "bg-gray-300";
  }
}
