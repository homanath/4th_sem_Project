import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import api from "../services/api";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Update Redux state
      dispatch(logout());

      // Show success message
      toast.success("Logged out successfully");

      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <nav>
      {/* Other nav items... */}

      {user?.role === "admin" && (
        <Link
          to="/admin/dashboard"
          className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Admin Dashboard
        </Link>
      )}

      <button
        onClick={handleLogout}
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        Logout
      </button>
    </nav>
  );
}
