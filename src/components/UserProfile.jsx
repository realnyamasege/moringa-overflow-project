import React, { useState, useEffect } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock fetch user profile
    const fetchUser = async () => {
      try {
        const userData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          reputation: 1234,
          badges: ['Gold', 'Silver', 'Bronze'],
        };
        setUser(userData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div>Name: {user.name}</div>
      <div>Email: {user.email}</div>
      <div>Reputation: {user.reputation}</div>
      <div>Badges: {user.badges.join(', ')}</div>
      {/* Add more user profile details */}
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default UserProfile;
