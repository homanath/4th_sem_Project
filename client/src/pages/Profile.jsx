import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, updateProfile } from "../store/slices/authSlice";
import api from "../services/api";
import { toast } from "react-hot-toast";

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    address: user?.address || "",
  });

  const [previewImage, setPreviewImage] = useState(
    user?.profilePicture || null
  );

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        address: user.address || "",
      });
      setPreviewImage(user.profilePicture || null);
    }
  }, [user]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("profilePicture", file);
      const response = await api.post("/api/users/profile/picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(updateProfile(response.data));
      setPreviewImage(response.data.profilePicture);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error("Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put("/api/users/profile", profileData);
      dispatch(updateProfile(response.data));
      setIsEditingProfile(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="p-6 space-y-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Profile Information
          </h3>
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        <div className="flex items-center space-x-6">
          <img
            src={previewImage || "/default-avatar.png"}
            alt="Profile"
            className="object-cover w-24 h-24 rounded-full"
          />
          {isEditingProfile && (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="text-blue-500 hover:underline"
              >
                Change Picture
              </button>
            </div>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="block w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                className="block w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile
              </label>
              <input
                type="tel"
                value={profileData.mobile}
                onChange={(e) =>
                  setProfileData({ ...profileData, mobile: e.target.value })
                }
                className="block w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                value={profileData.address}
                onChange={(e) =>
                  setProfileData({ ...profileData, address: e.target.value })
                }
                className="block w-full p-2 border rounded-md"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 text-gray-600 border rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {profileData.name}
            </p>
            <p>
              <strong>Email:</strong> {profileData.email}
            </p>
            <p>
              <strong>Mobile:</strong> {profileData.mobile}
            </p>
            <p>
              <strong>Address:</strong> {profileData.address}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
