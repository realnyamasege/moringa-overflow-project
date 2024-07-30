// src/components/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function UserProfile() {
  const { user, logout } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setError('No user logged in');
    }
  }, [user]);

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div>Name: {user.name}</div>
      <div>Email: {user.email}</div>
      <div>Reputation: {user.reputation}</div>
      <div>Badges: {user.badges.join(', ')}</div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default UserProfile;
