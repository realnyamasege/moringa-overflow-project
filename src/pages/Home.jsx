// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { fetchQuestions } from '../services/api';
import QuestionCard from '../components/QuestionCard';

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
    <div className="container">
      <h2>All Questions</h2>
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
}

export default Home;
