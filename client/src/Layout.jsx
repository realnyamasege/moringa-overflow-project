import React from 'react';
import { Link, Outlet, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout() {
  return (
    <div>
      <nav className="bg-white mt-6 border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span>
              <img src="./images/Logo.jpeg" alt="logo" width="250" height="95%" />
            </span>
          </Link>
          <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link to="/" className="block py-2 px-3 text-lg text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="block py-2 px-3 text-lg text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                  About
                </Link>
              </li>
              <li>
                <Link to="/AskQuestion" className="block py-2 px-3 text-lg text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                  Ask Question
                </Link>
              </li>
              <li>
                <Link to="/Questions" className="block py-2 px-3 text-lg text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                  Questions
                </Link>
              </li>
              <li>
                <Link to="/Profile" className="block py-2 px-3 text-lg text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/LoginPage">
                  <button 
                    data-modal-target="default-modal" 
                    data-modal-toggle="default-modal" 
                    className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
                    type="button">
                    Log in
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/Signup">
                  <button 
                    data-modal-target="default-modal" 
                    data-modal-toggle="default-modal" 
                    className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
                    type="button">
                    Sign up
                  </button>
                </Link>
              </li>
              <li>
                <input className="search" type="text" id="search" onKeyUp={() => search()} placeholder="Search" />
              </li>
            </ul>
          </div>
        </div>
      </nav> 
      {/* component */}
      <div className='bg-gray-100 text-lg container mx-auto min-h-[90vh]'>
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
        <ToastContainer />
        <Outlet />
      </div>

      <footer className="bg-white dark:bg-gray-900">
        <div className="mx-auto w-full max-w-screen-xl">
          <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4">
            <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Company</h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <a href="https://www.youtube.com/watch?v=4n4rBrs5-LY" className="hover:underline">About</a>
                </li>
                <li className="mb-4">
                  <a href="https://www.youtube.com/watch?v=4n4rBrs5-LY" className="hover:underline">Careers</a>
                </li>
                <li className="mb-4">
                  <a href="https://www.youtube.com/watch?v=4n4rBrs5-LY" className="hover:underline">Brand Center</a>
                </li>
                <li className="mb-4">
                  <a href="https://www.youtube.com/watch?v=4n4rBrs5-LY" className="hover:underline">Blog</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Help Center</h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <a href="https://discord.com" className="hover:underline">Discord Server</a>
                </li>
                <li className="mb-4">
                  <a href="https://X.com" className="hover:underline">X/Twitter</a>
                </li>
                <li className="mb-4">
                  <a href="https://Facebook.com" className="hover:underline">Facebook</a>
                </li>
                <li className="mb-4">
                  <a href="https://Linkedin.com" className="hover:underline">Linkedin</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">Contact Us</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <a href="https://www.youtube.com/watch?v=4n4rBrs5-LY" className="hover:underline">Privacy Policy</a>
                </li>
                <li className="mb-4">
                  <a href="https://www.youtube.com/watch?v=4n4rBrs5-LY" className="hover:underline">Terms & Conditions</a>
                </li>
                <li className="mb-4">
                  <a href="https://www.youtube.com/watch?v=4n4rBrs5-LY" className="hover:underline">Cookie Policy</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Subscribe</h2>
              <form>
                <label htmlFor="newsletter" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Enter your email</label>
                <div className="relative">
                  <input type="email" id="newsletter" className="block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your email address" required />
                  <button type="submit" className="absolute inset-y-0 right-0 px-3 py-2 text-white bg-blue-700 rounded-r-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Subscribe</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 py-4 text-center text-gray-500 dark:text-gray-400">
          <span>&copy; 2024 Moringa Overflow. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
}
