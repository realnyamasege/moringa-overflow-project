// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AskQuestion from './pages/AskQuestionPage';
import QuestionDetail from './pages/QuestionPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfile from './components/UserProfile';
import ResetPassword from './pages/ResetPassword';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ask" element={<AskQuestion />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;