import React, { useState, useContext } from "react";
import { UserContext } from "../Context/UserContext";
import { toast } from "react-toastify";

export default function RequestResetPassword() {
  const [email, setEmail] = useState("");
  const { requestPasswordReset } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get the current frontend URL
      const frontendUrl = window.location.origin;
      await requestPasswordReset(email, frontendUrl);
      toast.success(
        "If a user with this email exists, a password reset link has been sent."
      );
    } catch (error) {
      toast.error("An error occurred while processing your request.");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@example.com"
            required
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Request Password Reset
        </button>
      </form>
    </div>
  );
}
