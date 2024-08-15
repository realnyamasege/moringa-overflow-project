import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const payload = {
      email,
      password
    };
  
    fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.error || "Network response was not ok");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Login response data:", data); // Debugging
  
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
  
          // Store user information in localStorage
          if (data.user) {
            localStorage.setItem("currentUser", JSON.stringify(data.user));
          }
  
          navigate("/Profile");
        } else {
          toast.error("Invalid email or password.");
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        toast.error("An error occurred. Please try again.");
      });
  };
  
  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={() => navigate("/reset-password")}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;