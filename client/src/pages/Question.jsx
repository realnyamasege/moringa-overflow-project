import React, { useEffect, useState } from 'react';
import Post from '../components/Post';
import { useNavigate } from "react-router-dom";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:3000/questions');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handlePostClick = (id) => {
    navigate(`/UpdateQuestion/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Questions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question) => (
          <div key={question.id} onClick={() => handlePostClick(question.id)}>
            <Post post={question} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
