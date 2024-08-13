import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowUp, FaArrowDown, FaTrash, FaCheck, FaStar, FaPencilAlt } from 'react-icons/fa';

const UpdateQuestions = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [question, setQuestion] = useState({});
  const [answer, setAnswer] = useState('');
  const [link, setLink] = useState('');
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [userVote, setUserVote] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedAnswerContent, setEditedAnswerContent] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem("access_token");
    if (!userId) {
      toast.error("No user logged in");
      navigate("/login");
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data);
        } else {
          throw new Error("Failed to fetch current user");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        toast.error("Failed to fetch current user");
      }
    };

    const fetchQuestion = async () => {
      try {
        const response = await fetch(`http://localhost:3000/questions/${id}`);
        if (response.ok) {
          const data = await response.json();

          // Check if the current user has already viewed the question
          if (!data.views.includes(userId)) {
            data.views.push(userId);
            data.viewCount += 1;

            // Update the views and viewCount in the database
            await fetch(`http://localhost:3000/questions/${id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                views: data.views,
                viewCount: data.viewCount,
              }),
            });
          }

          setQuestion(data);
          setUpvotes(data.upvotes);
          setDownvotes(data.downvotes);

          // Check if the user has already voted on this question
          const userVoteStatus = data.votes?.find(vote => vote.userId === userId);
          if (userVoteStatus) {
            setUserVote(userVoteStatus.type);
          }
        } else {
          throw new Error('Failed to fetch question');
        }
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    fetchCurrentUser().then(fetchQuestion).finally(() => setLoading(false));
  }, [id, navigate]);

  const updateVotes = async (newUpvotes, newDownvotes, voteType) => {
    try {
      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ upvotes: newUpvotes, downvotes: newDownvotes, userVote: voteType }),
      });

      if (!response.ok) {
        throw new Error('Failed to update vote count');
      }
    } catch (error) {
      console.error('Error updating vote count:', error);
    }
  };

  const handleVote = (voteType) => {
    let newUpvotes = upvotes;
    let newDownvotes = downvotes;
    let newVote = null;

    if (voteType === 'up') {
      if (userVote === 'up') {
        newUpvotes -= 1;
      } else {
        newUpvotes += 1;
        if (userVote === 'down') newDownvotes -= 1;
      }
      newVote = userVote === 'up' ? null : 'up';
    } else if (voteType === 'down') {
      if (userVote === 'down') {
        newDownvotes -= 1;
      } else {
        newDownvotes += 1;
        if (userVote === 'up') newUpvotes -= 1;
      }
      newVote = userVote === 'down' ? null : 'down';
    }

    setUpvotes(newUpvotes);
    setDownvotes(newDownvotes);
    setUserVote(newVote);
    updateVotes(newUpvotes, newDownvotes, newVote);
  };

  const handleUpvote = () => handleVote('up');
  const handleDownvote = () => handleVote('down');

  const handleAnswerVote = async (answerId, voteType) => {
    const updatedAnswers = question.answers.map(answer => {
      if (answer.id === answerId) {
        if (!answer.votes) answer.votes = [];
        const existingVote = answer.votes.find(vote => vote.userId === currentUser.id);
        let newUpvotes = answer.upvotes || 0;
        let newDownvotes = answer.downvotes || 0;

        if (voteType === 'upvote') {
          if (existingVote) {
            if (existingVote.type === 'upvote') {
              newUpvotes -= 1;
              answer.votes = answer.votes.filter(vote => vote.userId !== currentUser.id);
            } else {
              newUpvotes += 1;
              newDownvotes -= 1;
              existingVote.type = 'upvote';
            }
          } else {
            newUpvotes += 1;
            answer.votes.push({ userId: currentUser.id, type: 'upvote' });
          }
        } else if (voteType === 'downvote') {
          if (existingVote) {
            if (existingVote.type === 'downvote') {
              newDownvotes -= 1;
              answer.votes = answer.votes.filter(vote => vote.userId !== currentUser.id);
            } else {
              newDownvotes += 1;
              newUpvotes -= 1;
              existingVote.type = 'downvote';
            }
          } else {
            newDownvotes += 1;
            answer.votes.push({ userId: currentUser.id, type: 'downvote' });
          }
        }

        return {
          ...answer,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
        };
      }
      return answer;
    });

    try {
      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: updatedAnswers }),
      });

      if (response.ok) {
        setQuestion({ ...question, answers: updatedAnswers });
      } else {
        throw new Error('Failed to update answer votes');
      }
    } catch (error) {
      console.error('Error updating answer votes:', error);
    }
  };

  const handleSelectAcceptedAnswer = async (answerId) => {
    const updatedAnswers = question.answers.map(answer => ({
      ...answer,
      accepted: answer.id === answerId
    }));

    try {
      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: updatedAnswers, resolved: true }),
      });

      if (response.ok) {
        setQuestion({ ...question, answers: updatedAnswers, resolved: true });
        toast.success('Answer accepted and question marked as resolved');
        // Update the user who provided the accepted answer
        const answer = updatedAnswers.find(ans => ans.id === answerId);
        if (answer) {
          const userResponse = await fetch(`http://localhost:3000/users/${answer.userId}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            userData.reputation_points += 5;
            const userUpdateResponse = await fetch(`http://localhost:3000/users/${answer.userId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ reputation_points: userData.reputation_points }),
            });
            if (!userUpdateResponse.ok) {
              throw new Error('Failed to update user reputation points');
            }
          } else {
            throw new Error('Failed to fetch user data');
          }
        }
      } else {
        throw new Error('Failed to accept answer');
      }
    } catch (error) {
      console.error('Error accepting answer:', error);
      toast.error('Failed to accept answer');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newAnswer = {
        id: Date.now().toString(),
        userId: currentUser?.id,
        author: currentUser?.name,
        questionId: question.id,
        answer,
        link,
        upvotes: 0,
        downvotes: 0,
        accepted: false,
        votes: [],
      };
      const updatedAnswers = question.answers ? [...question.answers, newAnswer] : [newAnswer];

      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: updatedAnswers }),
      });

      if (response.ok) {
        toast.success('Answer added successfully');
        setQuestion({ ...question, answers: updatedAnswers });
        setAnswer('');
        setLink('');
        // Update user's reputation points
        const userResponse = await fetch(`http://localhost:3000/users/${currentUser.id}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          userData.reputation_points += 5;
          const userUpdateResponse = await fetch(`http://localhost:3000/users/${currentUser.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reputation_points: userData.reputation_points }),
          });
          if (!userUpdateResponse.ok) {
            throw new Error('Failed to update user reputation points');
          }
          setCurrentUser(userData);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } else {
        throw new Error('Failed to add answer');
      }
    } catch (error) {
      console.error('Error adding answer:', error);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      const updatedAnswers = question.answers.filter(ans => ans.id !== answerId);

      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: updatedAnswers }),
      });

      if (response.ok) {
        toast.success('Answer deleted successfully');
        setQuestion({ ...question, answers: updatedAnswers });
      } else {
        throw new Error('Failed to delete answer');
      }
    } catch (error) {
      console.error('Error deleting answer:', error);
    }
  };

  const handleBadge = async () => {
    const userBadgeCount = question.badges?.filter(badge => badge.adminId === currentUser.id).length || 0;
    if (userBadgeCount >= 5) {
      return toast.error('You have already added 5 badges to this question');
    }

    const newBadge = {
      adminId: currentUser.id,
      count: 1,
    };

    const updatedBadges = [...(question.badges || []), newBadge];

    try {
      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ badges: updatedBadges }),
      });

      if (response.ok) {
        setQuestion({ ...question, badges: updatedBadges });
        toast.success('Badge added to the question');
      } else {
        throw new Error('Failed to add badge');
      }
    } catch (error) {
      console.error('Error adding badge:', error);
    }
  };

  const handleRemoveBadge = async () => {
    let removedBadgesCount = 0;
    const updatedBadges = question.badges?.filter(badge => {
      if (badge.adminId === currentUser.id && removedBadgesCount < 1) {
        removedBadgesCount++;
        return false;
      }
      return true;
    }) || [];

    try {
      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ badges: updatedBadges }),
      });

      if (response.ok) {
        setQuestion({ ...question, badges: updatedBadges });
        toast.success('Badge removed from the question');
      } else {
        throw new Error('Failed to remove badge');
      }
    } catch (error) {
      console.error('Error removing badge:', error);
    }
  };

  const handleEditAnswer = (answer) => {
    if (answer.userId === currentUser.id) {
      setEditingAnswerId(answer.id);
      setEditedAnswerContent(answer.answer);
    } else {
      toast.error('You can only edit your own answers.');
    }
  };

  const handleSaveAnswerEdit = async () => {
    const updatedAnswers = question.answers.map(answer => {
      if (answer.id === editingAnswerId) {
        return { ...answer, answer: editedAnswerContent };
      }
      return answer;
    });

    try {
      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: updatedAnswers }),
      });

      if (response.ok) {
        setQuestion({ ...question, answers: updatedAnswers });
        setEditingAnswerId(null);
        toast.success('Answer updated successfully');
      } else {
        throw new Error('Failed to update answer');
      }
    } catch (error) {
      console.error('Error updating answer:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const sortedAnswers = question.answers?.sort((a, b) => b.upvotes - a.upvotes) || [];

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-start gap-6">
        <div className="flex-1">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{question.title}</h1>
          </div>
          <div className="mt-4">
            <p className="text-gray-700 mt-4">{question.content}</p>
          </div>
          {question.codeSnippet && (
            <div className="mt-4 bg-gray-100 p-4 rounded-lg overflow-x-auto">
              <h3 className="text-lg font-semibold">Code Snippet:</h3>
              <pre className="bg-gray-200 p-2 rounded-lg">
                <code className="whitespace-pre-wrap break-words">{question.codeSnippet}</code>
              </pre>
            </div>
          )}
          {question.link && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Link:</h3>
              <a href={question.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {question.link}
              </a>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {question.tags && question.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center mt-4 space-x-4">
            <div
              className={`flex items-center space-x-1 cursor-pointer ${userVote === 'up' ? 'text-blue-500' : 'text-gray-500'}`}
              onClick={handleUpvote}
            >
              <FaArrowUp className={`text-2xl mr-4 ${userVote === 'up' ? 'text-blue-500' : 'text-gray-500'}`} />
              <span>{upvotes}</span>
            </div>
            <div
              className={`flex items-center space-x-1 cursor-pointer ${userVote === 'down' ? 'text-red-500' : 'text-gray-500'}`}
              onClick={handleDownvote}
            >
              <FaArrowDown className={`text-2xl mr-4 ${userVote === 'down' ? 'text-red-500' : 'text-gray-500'}`} />
              <span>{downvotes}</span>
            </div>
          </div>
          {question.resolved && (
            <div className="mt-4 text-sm text-green-500">
              Approved
            </div>
          )}
          {currentUser?.admin && (
            <>
              <div
                onClick={handleBadge}
                className="mt-4 flex items-center cursor-pointer text-yellow-500 hover:text-yellow-600"
              >
                <FaStar className="mr-2" /> Add Badge
              </div>
              <div
                onClick={handleRemoveBadge}
                className="mt-4 flex items-center cursor-pointer text-yellow-500 hover:text-yellow-600"
              >
                <FaStar className="mr-2" /> Remove Badge
              </div>
            </>
          )}
          <div className="mt-4 text-sm text-gray-500">
            <span>By {question.author}</span>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">Answers</h2>
            <div className="mt-4 space-y-4">
              {sortedAnswers.map((cmt, index) => (
                <div key={index} className={`border border-gray-300 rounded-lg p-4 flex justify-between items-start ${cmt.accepted ? 'bg-green-100' : ''}`}>
                  <div className="flex-1">
                    {editingAnswerId === cmt.id ? (
                      <>
                        <textarea
                          value={editedAnswerContent}
                          onChange={(e) => setEditedAnswerContent(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                          rows="3"
                        />
                        <button
                          onClick={handleSaveAnswerEdit}
                          className="text-blue-600 hover:text-blue-800 mt-2"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-800">{cmt.answer}</p>
                        {cmt.link && (
                          <div className="mt-2">
                            <h3 className="text-sm font-semibold">Link:</h3>
                            <a href={cmt.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                              {cmt.link}
                            </a>
                          </div>
                        )}
                      </>
                    )}
                    <p className="text-sm text-gray-500 mt-2">- {cmt.author}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div
                        className={`flex items-center space-x-1 cursor-pointer ${cmt.votes?.find(vote => vote.userId === currentUser.id && vote.type === 'upvote') ? 'text-blue-500' : 'text-gray-500'}`}
                        onClick={() => handleAnswerVote(cmt.id, 'upvote')}
                      >
                        <FaArrowUp className={`text-xl mr-2 ${cmt.votes?.find(vote => vote.userId === currentUser.id && vote.type === 'upvote') ? 'text-blue-500' : 'text-gray-500'}`} />
                        <span>{cmt.upvotes || 0}</span>
                      </div>
                      <div
                        className={`flex items-center space-x-1 cursor-pointer ${cmt.votes?.find(vote => vote.userId === currentUser.id && vote.type === 'downvote') ? 'text-red-500' : 'text-gray-500'}`}
                        onClick={() => handleAnswerVote(cmt.id, 'downvote')}
                      >
                        <FaArrowDown className={`text-xl mr-2 ${cmt.votes?.find(vote => vote.userId === currentUser.id && vote.type === 'downvote') ? 'text-red-500' : 'text-gray-500'}`} />
                        <span>{cmt.downvotes || 0}</span>
                      </div>
                      {currentUser?.id === cmt.userId && (
                        <div className="flex items-center space-x-4">
                          <FaPencilAlt
                            onClick={() => handleEditAnswer(cmt)}
                            className="text-gray-600 cursor-pointer"
                          />
                          <button
                            onClick={() => handleDeleteAnswer(cmt.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash className="text-xl" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {question.answers && question.answers.length === 0 && (
                <p className="text-gray-500">No Answers yet.</p>
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
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Link</label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter link (optional)"
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
