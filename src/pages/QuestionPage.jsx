// src/pages/QuestionPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchQuestion } from '../services/api';
import AnswerList from '../components/AnswerList';

function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const data = await fetchQuestion(id);
        setQuestion(data);
      } catch (error) {
        setError(error.message);
      }
    };

    loadQuestion();
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!question) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>{question.title}</h2>
      <p>{question.description}</p>
      <AnswerList answers={question.answers} />
    </div>
  );
}

export default QuestionDetail;
