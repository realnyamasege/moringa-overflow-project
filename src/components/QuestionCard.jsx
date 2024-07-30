// src/components/QuestionCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function QuestionCard({ question }) {
  return (
    <div className="question-card">
      <h3><Link to={`/questions/${question.id}`}>{question.title}</Link></h3>
      <p>{question.description}</p>
      <div>
        <span>{question.replies} Replies</span>
        <span>{question.views} Views</span>
        <span>{question.awards} Awards</span>
      </div>
    </div>
  );
}

export default QuestionCard;
