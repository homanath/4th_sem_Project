import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";

export default function NotFound() {
  const { isAuthenticated } = useSelector(selectAuth);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-2xl font-semibold text-gray-600">
          Page not found
        </p>
        <p className="mt-2 text-gray-500">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="text-primary-600 hover:text-primary-500"
          >
            Go back to {isAuthenticated ? "dashboard" : "home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
