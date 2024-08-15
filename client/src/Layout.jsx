import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    setIsAuthenticated(!!accessToken);
  }, []);

  const handleLogin = () => {
    // Simulate login action (replace with actual login logic)
    localStorage.setItem('access_token', 'some-token');
    setIsAuthenticated(true);
    navigate("/Profile");
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    navigate("/"); // Redirect to home page
  };

  return (
    <div>
      <nav className="bg-white mt-6 border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <img src="./images/Logo.jpeg" alt="logo" width="250" height="95%" />
          </Link>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <ul className="hidden md:flex md:space-x-8 rtl:space-x-reverse">
              <li>
                <Link
                  to="/"
                  className="block py-2 px-3 text-lg text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block py-2 px-3 text-lg text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/AskQuestion"
                  className="block py-2 px-3 text-lg text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Ask Question
                </Link>
              </li>
              <li>
                <Link
                  to="/Questions"
                  className="block py-2 px-3 text-lg text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Questions
                </Link>
              </li>
              <li>
                <Link
                  to="/Profile"
                  className="block py-2 px-3 text-lg text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Profile
                </Link>
              </li>
            </ul>
            <div className="hidden md:flex md:items-center md:space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/LoginPage">
                    <button
                      onClick={handleLogin}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Log in
                    </button>
                  </Link>
                  <Link to="/Signup">
                    <button
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Sign up
                    </button>
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Log out
                </button>
              )}
            </div>
          </div>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </nav>

      <div className="bg-gray-100 text-lg container mx-auto min-h-[90vh]">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Outlet />
      </div>

      <footer className="bg-white dark:bg-gray-900">
        <div className="mx-auto w-full max-w-screen-xl">
          <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Company
              </h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <a
                    href="https://www.example.com/about"
                    className="hover:underline"
                  >
                    About
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://www.example.com/careers"
                    className="hover:underline"
                  >
                    Careers
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://www.example.com/brand-center"
                    className="hover:underline"
                  >
                    Brand Center
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://www.example.com/blog"
                    className="hover:underline"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Help Center
              </h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <a href="https://discord.com" className="hover:underline">
                    Discord Server
                  </a>
                </li>
                <li className="mb-4">
                  <a href="https://twitter.com" className="hover:underline">
                    Twitter
                  </a>
                </li>
                <li className="mb-4">
                  <a href="https://facebook.com" className="hover:underline">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://youtube.com" className="hover:underline">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Legal
              </h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <a
                    href="https://www.example.com/privacy"
                    className="hover:underline"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://www.example.com/terms"
                    className="hover:underline"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://www.example.com/cookie-policy"
                    className="hover:underline"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Download
              </h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <a href="https://www.example.com/download" className="hover:underline">
                    App Store
                  </a>
                </li>
                <li className="mb-4">
                  <a href="https://www.example.com/download" className="hover:underline">
                    Google Play
                  </a>
                </li>
                <li className="mb-4">
                  <a href="https://www.example.com/download" className="hover:underline">
                    Windows Store
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 p-4 text-center dark:bg-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 Your Company. All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
