// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import QuestionList from '../components/QuestionList';

function Home() {
  return (
    <div>
      <h1>Welcome to Moringa Overflow</h1>
      <Link to="/ask">
        <button>Ask a Question</button>
      </Link>
      <QuestionList />
    </div>
  );
}

export default Home;
