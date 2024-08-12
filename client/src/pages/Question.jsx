import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaArrowDown, FaStar, FaTrash, FaCheck, FaTag } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [votes, setVotes] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(`http://localhost:5000/authenticated_user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error("Failed to fetch current user");

        const data = await response.json();
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching current user:", error);
        toast.error("Failed to fetch current user. Redirecting to login.");
        navigate("/loginPage");
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:5000/questions');
        if (!response.ok) throw new Error('Failed to fetch questions');

        const data = await response.json();
        setQuestions(data);

        // Initialize votes
        const initialVotes = data.reduce((acc, question) => {
          acc[question.id] = {
            upvotes: question.upvotes,
            downvotes: question.downvotes,
            userVote: null,
          };
          return acc;
        }, {});
        setVotes(initialVotes);

        // Extract unique tags
        const allTags = data.flatMap(question => question.tags || []);
        const uniqueTags = [...new Set(allTags)];
        setTags(uniqueTags);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error('Failed to fetch questions. Please try again later.');
      }
    };

    fetchCurrentUser();
    fetchQuestions();
  }, [navigate]);

  const handlePostClick = (id) => {
    navigate(`/UpdateQuestion/${id}`);
  };

  const updateVotes = async (id, newUpvotes, newDownvotes) => {
    try {
      const response = await fetch(`http://localhost:5000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ upvotes: newUpvotes, downvotes: newDownvotes }),
      });

      if (!response.ok) throw new Error('Failed to update vote count');
    } catch (error) {
      console.error('Error updating vote count:', error);
    }
  };

  const handleVote = (id, voteType) => {
    setVotes(prevVotes => {
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

      updateVotes(id, newUpvotes, newDownvotes);

      return {
        ...prevVotes,
        [id]: { upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote },
      };
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/questions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete question');

      setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== id));
      toast.success('Question deleted successfully');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const handleMarkResolved = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resolved: true }),
      });

      if (!response.ok) throw new Error('Failed to mark question as resolved');

      setQuestions(prevQuestions =>
        prevQuestions.map(q => q.id === id ? { ...q, resolved: true } : q)
      );

      toast.success('Question marked as resolved');
    } catch (error) {
      console.error('Error marking question as resolved:', error);
      toast.error('Failed to mark question as resolved');
    }
  };

  const handleBadge = async (id) => {
    const question = questions.find(q => q.id === id);
    if (!question) return;

    const userBadges = question.badges.filter(badge => badge.adminId === currentUser.id);
    if (userBadges.length >= 5) {
      return toast.error('You have already added 5 badges to this question');
    }

    const newBadge = {
      adminId: currentUser.id,
      count: 1,
    };

    const updatedBadges = [...question.badges, newBadge];

    try {
      const response = await fetch(`http://localhost:5000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ badges: updatedBadges }),
      });

      if (!response.ok) throw new Error('Failed to add badge');

      setQuestions(prevQuestions =>
        prevQuestions.map(q => q.id === id ? { ...q, badges: updatedBadges } : q)
      );
      toast.success('Badge added to the question');
    } catch (error) {
      console.error('Error adding badge:', error);
    }
  };

  const handleRemoveBadge = async (id) => {
    const question = questions.find(q => q.id === id);
    if (!question) return;

    const updatedBadges = question.badges.filter(badge => badge.adminId !== currentUser.id);

    try {
      const response = await fetch(`http://localhost:5000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ badges: updatedBadges }),
      });

      if (!response.ok) throw new Error('Failed to remove badge');

      setQuestions(prevQuestions =>
        prevQuestions.map(q => q.id === id ? { ...q, badges: updatedBadges } : q)
      );
      toast.success('Badge removed from the question');
    } catch (error) {
      console.error('Error removing badge:', error);
    }
  };

  const filteredQuestions = questions
    .filter(question =>
      question.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      question.content.toLowerCase().includes(searchKeyword.toLowerCase())
    )
    .filter(question =>
      filterTag ? question.tags.includes(filterTag) : true
    );

  const sortedQuestions = filteredQuestions.sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Questions</h1>
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Search questions..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="p-3 border border-blue-300 rounded-lg w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
        />
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="p-3 border border-blue-300 rounded-lg w-full md:w-1/2 mt-4 md:mt-0 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
        >
          <option value="">All Tags</option>
          {tags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {sortedQuestions.map(question => (
          <div key={question.id} className={`bg-white p-6 rounded-lg shadow-lg ${question.resolved ? 'border border-green-500' : ''}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => handlePostClick(question.id)}>
                {question.title}
              </h2>
              {currentUser && currentUser.role === 'admin' && (
                <button
                  onClick={() => handleDelete(question.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaTrash size={20} />
                </button>
              )}
            </div>
            <p className="text-gray-700 mb-4">{question.content}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map(tag => (
                <span key={tag} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <FaTag className="inline-block mr-1" />
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {question.badges.map((badge, index) => (
                <div key={index} className="flex items-center bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  <FaStar className="inline-block mr-1" />
                  {`Badge ${badge.count} `}
                  {badge.adminId === currentUser?.id && (
                    <button
                      onClick={() => handleRemoveBadge(question.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <FaTrash size={16} />
                    </button>
                  )}
                </div>
              ))}
              {currentUser && (
                <button
                  onClick={() => handleBadge(question.id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm hover:bg-yellow-600 transition"
                >
                  Add Badge
                </button>
              )}
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleVote(question.id, 'upvote')}
                className={`flex items-center text-blue-600 ${votes[question.id]?.userVote === 'up' ? 'font-bold' : ''}`}
              >
                <FaArrowUp size={20} />
                <span className="ml-2">{votes[question.id]?.upvotes || 0}</span>
              </button>
              <button
                onClick={() => handleVote(question.id, 'downvote')}
                className={`ml-4 flex items-center text-red-600 ${votes[question.id]?.userVote === 'down' ? 'font-bold' : ''}`}
              >
                <FaArrowDown size={20} />
                <span className="ml-2">{votes[question.id]?.downvotes || 0}</span>
              </button>
              {question.resolved && (
                <span className="ml-4 text-green-500 flex items-center">
                  <FaCheck size={18} className="mr-2" />
                  Resolved
                </span>
              )}
            </div>
            {currentUser && currentUser.role === 'admin' && !question.resolved && (
              <button
                onClick={() => handleMarkResolved(question.id)}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Mark as Resolved
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
