import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaArrowDown, FaAward } from 'react-icons/fa';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [votes, setVotes] = useState({});
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
        // Initialize votes state with current upvotes and downvotes
        const initialVotes = {};
        data.forEach((question) => {
          initialVotes[question.id] = {
            upvotes: question.upvotes,
            downvotes: question.downvotes,
            userVote: null, // no initial vote by the user
          };
        });
        setVotes(initialVotes);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handlePostClick = (id) => {
    navigate(`/UpdateQuestion/${id}`);
  };

  const updateVotes = async (id, newUpvotes, newDownvotes) => {
    try {
      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ upvotes: newUpvotes, downvotes: newDownvotes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update vote count');
      }
    } catch (error) {
      console.error('Error updating vote count:', error);
    }
  };

  const handleVote = (id, voteType) => {
    setVotes((prevVotes) => {
      const questionVotes = prevVotes[id];
      let newUpvotes = questionVotes.upvotes;
      let newDownvotes = questionVotes.downvotes;
      let newUserVote = questionVotes.userVote;

      if (voteType === 'upvote') {
        if (newUserVote === 'up') {
          newUpvotes--;
          newUserVote = null;
        } else {
          newUpvotes++;
          if (newUserVote === 'down') newDownvotes--;
          newUserVote = 'up';
        }
      } else if (voteType === 'downvote') {
        if (newUserVote === 'down') {
          newDownvotes--;
          newUserVote = null;
        } else {
          newDownvotes++;
          if (newUserVote === 'up') newUpvotes--;
          newUserVote = 'down';
        }
      }

      // Update state and backend
      updateVotes(id, newUpvotes, newDownvotes);

      return {
        ...prevVotes,
        [id]: { upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote },
      };
    });
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
                <h2
                  className="text-2xl font-bold text-gray-800 cursor-pointer"
                  onClick={() => handlePostClick(question.id)}
                >
                  {question.title}
                </h2>
                <p className="text-gray-700 mt-2">{question.content}</p>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div
                  className="flex items-center space-x-1 text-blue-500 cursor-pointer"
                  onClick={() => handleVote(question.id, 'upvote')}
                >
                  <FaArrowUp className="text-blue-500 text-2xl mr-1" />
                  <span>{votes[question.id]?.upvotes || 0}</span>
                </div>
                <div
                  className="flex items-center space-x-1 text-red-500 cursor-pointer"
                  onClick={() => handleVote(question.id, 'downvote')}
                >
                  <FaArrowDown className="text-red-500 text-2xl mr-1" />
                  <span>{votes[question.id]?.downvotes || 0}</span>
                </div>
              </div>
              <div className="flex items-center text-yellow-600 mb-4">
                <FaAward className="text-yellow-500 text-2xl mr-2" />
                <span>{question.awards} {question.awards > 1 ? 'times' : 'time'}</span>
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

export default Questions;
