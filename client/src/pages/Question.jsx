import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Post from '../components/Post';
import { useNavigate } from "react-router-dom";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:3000/questions');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
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

  const handleVote = async (id, type) => {
    try {
      const updatedQuestions = questions.map((question) => {
        if (question.id === id) {
          if (type === 'upvote') {
            return { ...question, upvotes: question.upvotes + 1 };
          } else if (type === 'downvote') {
            return { ...question, downvotes: question.downvotes + 1 };
          }
        }
        return question;
      });

      setQuestions(updatedQuestions);

      // Find the question with the updated votes
      const question = updatedQuestions.find(q => q.id === id);

      // Send the updated data to the backend
      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          upvotes: question.upvotes,
          downvotes: question.downvotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update vote count');
      }
    } catch (error) {
      console.error('Error updating vote count:', error);
      // Optionally, revert the local state update if the backend update fails
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-800">Questions</h1>
      <div className="space-y-6">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6"
          >
            <div className="flex-grow">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 cursor-pointer" onClick={() => handlePostClick(question.id)}>
                  {question.title}
                </h2>
                <p className="text-gray-700 mt-2">{question.content}</p>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1 text-blue-500 cursor-pointer" onClick={() => handleVote(question.id, 'upvote')}>
                  <i className="fas fa-arrow-up"></i>
                  <span>{question.upvotes}</span>
                </div>
                <div className="flex items-center space-x-1 text-red-500 cursor-pointer" onClick={() => handleVote(question.id, 'downvote')}>
                  <i className="fas fa-arrow-down"></i>
                  <span>{question.downvotes}</span>
                </div>
              </div>
              <div className="flex items-center text-yellow-600 mb-4">
                <i className="fas fa-award mr-2"></i>
                <span>Awarded {question.awards} {question.awards > 1 ? 'times' : 'time'}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags && question.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-gray-500 text-sm">
                <span>By {question.author}</span> &middot; 
                <span className="ml-2">{question.comments.length} {question.comments.length === 1 ? 'comment' : 'comments'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Questions.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      upvotes: PropTypes.number.isRequired,
      downvotes: PropTypes.number.isRequired,
      comments: PropTypes.arrayOf(PropTypes.object).isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      awards: PropTypes.number.isRequired,
      author: PropTypes.string.isRequired,
    })
  ),
};

export default Questions;
