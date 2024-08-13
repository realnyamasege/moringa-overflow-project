import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaAward, FaTrash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("access_token");
    if (!userId) {
      toast.error("No user logged in");
      navigate("/LoginPage");
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

        // If the user is an admin, fetch all users
        if (data.admin) {
          const usersResponse = await fetch("http://localhost:3000/users");
          if (!usersResponse.ok) {
            throw new Error("Failed to fetch users");
          }
          const usersData = await usersResponse.json();
          // Filter out other admins from the list
          const nonAdminUsers = usersData.filter(user => !user.admin);
          setUsers(nonAdminUsers);
        }
      } catch (error) {
        console.error("Error fetching current user or users:", error);
        toast.error("Failed to fetch data");
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      setUsers(users.filter(user => user.id !== userId));
      toast.success("User deleted successfully");
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reputation Points
          </label>
          <p className="mt-1 text-gray-800">{currentUser.reputation_points}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Badges
          </label>
          <div className="mt-1 flex flex-wrap">
            {currentUser.badges.map((badge, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-blue-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full mb-1"
              >
                <FaAward className="mr-1" /> {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
      {currentUser.admin && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Manage Users</h3>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm">
                <div onClick={() => handleUserSelect(user)} className="cursor-pointer">
                  <p className="text-gray-800 font-medium">{user.name}</p>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={handleLogout}
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Logout
      </button>
      {selectedUser && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-2">Selected User Details</h4>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-gray-800">{selectedUser.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-800">{selectedUser.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <p className="mt-1 text-gray-800">{selectedUser.phone_number}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Reputation Points</label>
              <p className="mt-1 text-gray-800">{selectedUser.reputation_points}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Badges</label>
              <div className="mt-1 flex flex-wrap">
                {selectedUser.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-blue-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full mb-1"
                  >
                    <FaAward className="mr-1" /> {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
