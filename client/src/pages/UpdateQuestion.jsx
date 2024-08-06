import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const UpdateQuestions = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [question, setQuestion] = useState({});
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [userVote, setUserVote] = useState(null); // null: no vote, 'up': upvote, 'down': downvote

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`http://localhost:3000/questions/${id}`);
        if (response.ok) {
          const data = await response.json();
          setQuestion(data);
          setUpvotes(data.upvotes);
          setDownvotes(data.downvotes);
        } else {
          throw new Error('Failed to fetch question');
        }
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    fetchQuestion();
  }, [id]);

  const updateVotes = async (newUpvotes, newDownvotes) => {
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

  const handleUpvote = () => {
    if (userVote === 'up') {
      setUpvotes(upvotes - 1);
      setUserVote(null);
      updateVotes(upvotes - 1, downvotes);
    } else {
      const newUpvotes = userVote === 'down' ? upvotes + 1 : upvotes + 1;
      const newDownvotes = userVote === 'down' ? downvotes - 1 : downvotes;
      setUpvotes(newUpvotes);
      setDownvotes(newDownvotes);
      setUserVote('up');
      updateVotes(newUpvotes, newDownvotes);
    }
  };

  const handleDownvote = () => {
    if (userVote === 'down') {
      setDownvotes(downvotes - 1);
      setUserVote(null);
      updateVotes(upvotes, downvotes - 1);
    } else {
      const newUpvotes = userVote === 'up' ? upvotes - 1 : upvotes;
      const newDownvotes = userVote === 'up' ? downvotes + 1 : downvotes + 1;
      setUpvotes(newUpvotes);
      setDownvotes(newDownvotes);
      setUserVote('down');
      updateVotes(newUpvotes, newDownvotes);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newComment = {
        comment,
        author,
        id: Date.now().toString() // unique id for the comment
      };
      const updatedComments = question.comments ? [...question.comments, newComment] : [newComment];

      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comments: updatedComments }),
      });

      if (response.ok) {
        toast.success('Comment added successfully');
        setQuestion({ ...question, comments: updatedComments });
        setComment('');
        setAuthor('');
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-start gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{question.title}</h1>
          <p className="text-gray-700 mt-4">{question.content}</p>
          <div className="flex items-center mt-4 space-x-4">
            <div
              className={`flex items-center space-x-1 cursor-pointer ${userVote === 'up' ? 'text-blue-500' : 'text-gray-500'}`}
              onClick={handleUpvote}
            >
              <FaArrowUp className="text-2xl mr-4" />
              <span>{upvotes}</span>
            </div>
            <div
              className={`flex items-center space-x-1 cursor-pointer ${userVote === 'down' ? 'text-red-500' : 'text-gray-500'}`}
              onClick={handleDownvote}
            >
              <FaArrowDown className="text-2xl mr-4" />
              <span>{downvotes}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {question.tags && question.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <span>By {question.author}</span>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
            <div className="mt-4 space-y-4">
              {question.comments && question.comments.map((cmt, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4">
                  <p className="text-gray-800">{cmt.comment}</p>
                  <p className="text-sm text-gray-500 mt-2">- {cmt.author}</p>
                </div>
              ))}
              {question.comments && question.comments.length === 0 && (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-2xl text-gray-900">Answer</h1>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Your Answer</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Author</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                type="text"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateQuestions;
