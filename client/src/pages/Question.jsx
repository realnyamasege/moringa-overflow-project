import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaArrowDown, FaStar, FaTrash, FaCheck, FaEye, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [votes, setVotes] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("access_token");
    if (!userId) {
      toast.error("No user logged in");
      navigate("/loginPage");
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch current user");
        }
        const data = await response.json();
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching current user:", error);
        toast.error("Failed to fetch current user");
      }
    };

    fetchCurrentUser();

    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:3000/questions');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setQuestions(data);
        const initialVotes = {};
        data.forEach(async (question) => {
          initialVotes[question.id] = {
            upvotes: question.upvotes,
            downvotes: question.downvotes,
            userVote: null,
          };
          // Track view
          await fetch(`http://localhost:3000/questions/${question.id}/view`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
          });
        });
        setVotes(initialVotes);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [navigate]);

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

      updateVotes(id, newUpvotes, newDownvotes);

      return {
        ...prevVotes,
        [id]: { upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote },
      };
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete question');
      }
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
      toast.success('Question deleted successfully');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const handleMarkResolved = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resolved: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark question as resolved');
      }

      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === id ? { ...q, resolved: true } : q
        )
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
      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ badges: updatedBadges }),
      });

      if (response.ok) {
        setQuestions(prevQuestions =>
          prevQuestions.map(q => q.id === id ? { ...q, badges: updatedBadges } : q)
        );
        toast.success('Badge added to the question');
      } else {
        throw new Error('Failed to add badge');
      }
    } catch (error) {
      console.error('Error adding badge:', error);
    }
  };

  const handleRemoveBadge = async (id) => {
    const question = questions.find(q => q.id === id);
    if (!question) return;

    const updatedBadges = question.badges.filter(badge => badge.adminId !== currentUser.id);

    try {
      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ badges: updatedBadges }),
      });

      if (response.ok) {
        setQuestions(prevQuestions =>
          prevQuestions.map(q => q.id === id ? { ...q, badges: updatedBadges } : q)
        );
        toast.success('Badge removed from the question');
      } else {
        throw new Error('Failed to remove badge');
      }
    } catch (error) {
      console.error('Error removing badge:', error);
    }
  };

  const handleEditToggle = (id) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, isEditing: !q.isEditing } : q
      )
    );
  };

  const handleSaveEdit = async (id, updatedTitle, updatedContent) => {
    try {
      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to save question edits');
      }

      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === id ? { ...q, title: updatedTitle, content: updatedContent, isEditing: false } : q
        )
      );
      toast.success('Question updated successfully');
    } catch (error) {
      console.error('Error saving question edits:', error);
      toast.error('Failed to save question edits');
    }
  };

  const filteredQuestions = questions
    .filter((question) =>
      question.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      question.content.toLowerCase().includes(searchKeyword.toLowerCase())
    )
    .filter((question) =>
      filterTag ? question.tags.includes(filterTag) : true
    );

  const sortedQuestions = filteredQuestions.sort(
    (a, b) => b.upvotes - a.upvotes
  );

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-800">Questions</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search questions..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full mb-4"
        />
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">All Tags</option>
          {[...new Set(questions.flatMap((q) => q.tags))].map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
      <div className="space-y-6">
        {sortedQuestions.map((question) => (
          <div
            key={question.id}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6"
          >
            <div className="flex-grow">
              <div className="mb-4">
                {question.isEditing ? (
                  <>
                    <input
                      type="text"
                      value={question.title}
                      onChange={(e) =>
                        setQuestions((prevQuestions) =>
                          prevQuestions.map((q) =>
                            q.id === question.id ? { ...q, title: e.target.value } : q
                          )
                        )
                      }
                      className="block w-full mb-2 p-2 border border-gray-300 rounded"
                    />
                    <textarea
                      value={question.content}
                      onChange={(e) =>
                        setQuestions((prevQuestions) =>
                          prevQuestions.map((q) =>
                            q.id === question.id ? { ...q, content: e.target.value } : q
                          )
                        )
                      }
                      className="block w-full mb-2 p-2 border border-gray-300 rounded"
                      rows="4"
                    />
                    <button
                      onClick={() => handleSaveEdit(question.id, question.title, question.content)}
                      className="text-green-600 hover:text-green-800 mr-2"
                    >
                      <FaSave className="text-2xl" />
                    </button>
                    <button
                      onClick={() => handleEditToggle(question.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTimes className="text-2xl" />
                    </button>
                  </>
                ) : (
                  <>
                    <h2
                      className="text-2xl font-bold text-gray-800 cursor-pointer"
                      onClick={() => handlePostClick(question.id)}
                    >
                      {question.title}
                    </h2>
                    <p className="text-gray-700 mt-2">{question.content}</p>
                  </>
                )}
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
                <FaStar
                  className="text-yellow-500 text-2xl mr-2 cursor-pointer"
                />
                <span>{question.badges?.length || 0} {question.badges?.length > 1 ? 'times' : 'time'}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <FaEye className="text-gray-500 text-2xl mr-2" />
                <span>{question.viewCount || 0}</span>
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
                <span className="ml-2">{question.answers?.length || 0} {question.answers?.length === 1 ? 'answer' : 'answers'}</span>
              </div>
            </div>
            <div className="flex-shrink-0 flex flex-col space-y-2">
              {currentUser?.id === question.userId && (
                <>
                  <button
                    onClick={() => handleEditToggle(question.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit className="text-2xl" />
                  </button>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash className="text-2xl" />
                  </button>
                </>
              )}
              {currentUser?.id === question.userId && !question.resolved && (
                <button
                  onClick={() => handleMarkResolved(question.id)}
                  className="text-green-600 hover:text-green-800"
                >
                  <FaCheck className="text-2xl" />
                </button>
              )}
              {question.resolved && (
                <div className="text-green-500">
                  <FaCheck className="text-2xl" />
                  <span className="ml-1">Resolved</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
