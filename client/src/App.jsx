import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import About from './pages/About';
import AskQuestion from './pages/AskQuestion';
import Layout from "./Layout"
import LayoutAdmin from './LayoutAdmin';
import AdminLogin from './pages/AdminLogin';
import NoPage from './pages/NoPage';
import Question from './pages/Question';
import UpdateQuestion from './pages/UpdateQuestion';

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/AskQuestion' element={<AskQuestion />} />
        <Route path='/Question/:id' element={<Question />} />
        <Route path='/update/:post_id' element={<UpdateQuestion />} />

        <Route path="*" element={<NoPage />} />
      </Route>
      <Route path='/admin/' element={<LayoutAdmin/>}>
        <Route path='login' element={<AdminLogin />} />
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
