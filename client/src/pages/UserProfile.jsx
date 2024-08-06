import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("access_token");
    if (!userId) {
      toast.error("No user logged in");
      navigate("/login");
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch current user");
        }
        const data = await response.json();
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching current user:", error);
        toast.error("Failed to fetch current user");
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/loginPage");
    toast.success("Logged out successfully");
  };

  if (!currentUser) {
    return <div className="text-center text-gray-600">Log in to view your profile</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
      <div className="flex justify-center mb-4">
        <img
          src={currentUser.profile_image}
          alt="profile"
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
          <p className="mt-1 text-gray-800">{currentUser.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <p className="mt-1 text-gray-800">{currentUser.phone_number}</p>
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
