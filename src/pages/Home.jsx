// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { fetchQuestions } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import '../Home.css';

function Home() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestions();
        setQuestions(data);
      } catch (error) {
        setError(error.message);
      }
    };

    loadQuestions();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="home-container">
      <div className="main-content">
        <div className="welcome-banner">
          <img src="/path/to/banner-image.png" alt="Banner" />
          <p>
            Join Moringa Overflow today and become a part of a thriving community dedicated to enhancing learning and collaboration at Moringa School!
          </p>
        </div>
        <h2>All Questions</h2>
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
      <div className="recent-posts">
        <h3>Recent Posts</h3>
        {questions.slice(0, 3).map((question) => (
          <div key={question.id} className="recent-post">
            <img src={question.imageUrl} alt={question.title} />
            <div>
              <h4>{question.title}</h4>
              <p>{question.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
