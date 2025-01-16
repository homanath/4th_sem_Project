import { format } from "date-fns";

export default function UpcomingSchedules({ schedules = [] }) {
  const getStatusColor = (date) => {
    const today = new Date();
    const scheduleDate = new Date(date);
    const diffDays = Math.ceil((scheduleDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-600"; // Past due
    if (diffDays <= 3) return "text-orange-600"; // Due soon
    return "text-green-600"; // Upcoming
  };

  const getScheduleIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "hearing":
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
            />
          </svg>
        );
      case "meeting":
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Upcoming Schedules
      </h2>
      <div className="space-y-4">
        {schedules.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No upcoming schedules
          </p>
        ) : (
          schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className={`flex-shrink-0 ${getStatusColor(schedule.date)}`}>
                {getScheduleIcon(schedule.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {schedule.title}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {schedule.Case?.title || "N/A"}
                </p>
                <p className={`text-sm ${getStatusColor(schedule.date)} mt-1`}>
                  {format(new Date(schedule.date), "PPp")}
                </p>
              </div>
              {schedule.description && (
                <div className="flex-shrink-0">
                  <button
                    className="text-gray-400 hover:text-gray-500"
                    title={schedule.description}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {schedules.length > 0 && (
        <div className="mt-4 text-right">
          <button
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            onClick={() => {
              /* Add view all schedules functionality */
            }}
          >
            View All Schedules →
          </button>
        </div>
      )}
    </div>
  );
}
