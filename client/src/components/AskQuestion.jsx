// src/components/AskQuestion.jsx
import React, { useState } from 'react';
import { postQuestion } from '../services/api';
import { useNavigate } from 'react-router-dom';

function AskQuestion() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const questionData = { title, description };
      await postQuestion(questionData);
      navigate('/'); // Redirect to the home page or questions list
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Type your Question below</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Post Question</button>
        {error && <div>Error: {error}</div>}
      </form>
    </div>
  );
}

export default AskQuestion;
