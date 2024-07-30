import React, { useState } from 'react';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your reset password logic here
    try {
      // Mock reset password API call
      console.log('Reset Password:', { email });
      setMessage('A reset link has been sent to your email address');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
        {error && <div className="error">{error}</div>}
        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
}

export default ResetPassword;
