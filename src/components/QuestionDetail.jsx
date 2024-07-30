// src/components/QuestionDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchQuestion } from '../services/api';
import AnswerList from './AnswerList';

function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getQuestion = async () => {
      try {
        const data = await fetchQuestion(id);
        setQuestion(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getQuestion();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="question-detail">
      <h1>{question.title}</h1>
      <p>{question.description}</p>
      <AnswerList answers={question.answers} />
    </div>
  );
}

export default QuestionDetail;
