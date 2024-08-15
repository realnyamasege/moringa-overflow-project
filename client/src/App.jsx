import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from './pages/About';
import AskQuestion from './pages/AskQuestion';
import Layout from "./Layout";
import LayoutAdmin from './LayoutAdmin';
import AdminLogin from './pages/AdminLogin';
import NoPage from './pages/NoPage';
import Question from './pages/Question';
import UserProfile from './pages/UserProfile';
import UpdateQuestion from './pages/UpdateQuestion';
import Signup from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import RequestResetPassword from './pages/RequestResetPassword';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='about' element={<About />} />
            <Route path='AskQuestion' element={<AskQuestion />} />
            <Route path='Signup' element={<Signup />} />
            <Route path='LoginPage' element={<LoginPage />} />
            <Route path='Questions' element={<Question />} />
            <Route path='Profile' element={<UserProfile />} />
            <Route path='UpdateQuestion/:id' element={<UpdateQuestion />} />
            <Route path='reset-password' element={<RequestResetPassword />} />
            <Route path='*' element={<NoPage />} />
          </Route>
          <Route path='/admin' element={<LayoutAdmin />}>
            <Route path='login' element={<AdminLogin />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
