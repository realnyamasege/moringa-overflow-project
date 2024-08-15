import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaAward } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        toast.error("No user logged in");
        navigate("/loginPage");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/authenticated_user", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch current user");
        }

        const data = await response.json();
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching current user:", error);
        toast.error("Failed to fetch current user");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/loginPage");
    toast.success("Logged out successfully");
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (!currentUser) {
    return <div className="text-center text-gray-600">No user data available</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
      <div className="flex justify-center mb-4">
        <img
          src={currentUser.profile_image || "default-profile.png"}
          alt={currentUser.name ? `${currentUser.name}'s profile` : "User profile"}
          className="w-32 h-32 rounded-full object-cover"
        />
      </div>
      {currentUser.admin && (
        <div className="flex justify-center mb-4">
          <span className="inline-block bg-yellow-500 text-white text-sm font-semibold mr-2 px-2.5 py-0.5 rounded-full">
            Admin
          </span>
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <p className="mt-1 text-gray-800">{currentUser.name || "N/A"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <p className="mt-1 text-gray-800">{currentUser.phone_number || "N/A"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reputation Points
          </label>
          <p className="mt-1 text-gray-800">{currentUser.reputation_points || "0"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Badges
          </label>
          <div className="mt-1 flex flex-wrap">
            {currentUser.badges && currentUser.badges.length > 0 ? (
              currentUser.badges.map((badge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-blue-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full mb-1"
                >
                  <FaAward className="mr-1" /> {badge}
                </span>
              ))
            ) : (
              <p className="text-gray-600">No badges earned yet</p>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;