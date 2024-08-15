import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaArrowDown, FaStar, FaTrash, FaCheck, FaTag, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [votes, setVotes] = useState({});
  const [views, setViews] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [tags, setTags] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
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

        // Initialize views
        const initialViews = data.reduce((acc, question) => {
          acc[question.id] = question.views || 0;
          return acc;
        }, {});
        setViews(initialViews);

        // Extract unique tags
        const allTags = data.flatMap(question => (Array.isArray(question.tags) ? question.tags : []));
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

  const handleUpdateQuestion = async () => {
    try {
      const response = await fetch(`http://localhost:5000/questions/${question.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust token retrieval if needed
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(',').map(tag => tag.trim()), // Assumes tags are entered as a comma-separated string
          code_snippet: codeSnippet,
          link,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update question');
      }

      // Show success notification and redirect
      toast.success('Question updated successfully!');
      history.push('/questions'); // Redirect to the list of questions or any other relevant page
    } catch (error) {
      setError(error.message);
      toast.error(`Error: ${error.message}`); // Show error notification
    }
  };

  useEffect(() => {
    const fetchViewCounts = async () => {
      try {
        // Map through questions and fetch view counts
        const viewCountPromises = questions.map(question =>
          fetch(`http://localhost:5000/views/${question.id}`).then(response => response.json())
        );
  
        // Wait for all promises to resolve
        const viewCounts = await Promise.all(viewCountPromises);
        const viewCountsMap = viewCounts.reduce((acc, view) => {
          acc[view.question_id] = view.view_count || 0;
          return acc;
        }, {});
  
        // Update state with the new view counts
        setViews(prevViews => ({
          ...prevViews,
          ...viewCountsMap,
        }));
      } catch (error) {
        console.error('Error fetching view counts:', error);
      }
    };
  
    // Fetch view counts if there are questions
    if (questions.length > 0) {
      fetchViewCounts();
    }
  }, [questions]); // Dependency array should include all variables that trigger the effect
  

  const handlePostClick = async (id) => {
    // Navigate to the update page
    navigate(`/UpdateQuestion/${id}`);
  
    try {
      // Make the PATCH request to record the view
      const response = await fetch('http://localhost:5000/views', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question_id: id }),
      });
  
      if (!response.ok) throw new Error('Failed to record view');
  
      // Update the view count in the local state
      setViews(prevViews => ({
        ...prevViews,
        [id]: (prevViews[id] || 0) + 1, // Increment the view count by 1
      }));
    } catch (error) {
      console.error('Error recording view:', error);
      // Optionally handle errors here
    }
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

        // Log the response to inspect it
        const text = await response.text();
        console.log('Response:', text);

        if (!response.ok) {
            throw new Error('Failed to update vote count');
        }

        const updatedQuestion = JSON.parse(text);
        console.log('Vote count updated:', updatedQuestion);
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
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        return;
      }
  
      const response = await fetch(`http://localhost:5000/questions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', // Optional, mainly needed if sending a body (not in DELETE requests)
          'Authorization': `Bearer ${token}`, // Add JWT token for authorization
        },
      });
  
      if (!response.ok) throw new Error('Failed to delete question');
  
      // Update state to remove the deleted question
      setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== id));
      toast.success('Question deleted successfully');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const handleMarkResolved = async (id) => {
    try {
      // Fetch the question details to verify ownership
      const questionResponse = await fetch(`http://localhost:5000/questions/${id}`);
      if (!questionResponse.ok) throw new Error('Failed to fetch question details');
  
      const question = await questionResponse.json();
  
      // Check if the current user is the owner of the question
      if (question.user_id !== currentUser.id) {
        toast.error('You are not authorized to mark this question as resolved');
        return;
      }
  
      // Proceed to mark the question as resolved
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
  const handleAddBadge = async (id) => {
    // Ensure currentUser and currentUser.role are defined
    if (!currentUser || currentUser.role !== 'admin') {
      return toast.error('You are not authorized to add a badge');
    }
  
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
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
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
      toast.error('Failed to add badge');
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

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchKeyword.toLowerCase()) &&
    (filterTag === '' || (Array.isArray(question.tags) && question.tags.includes(filterTag)))
  );

  const sortedQuestions = filteredQuestions.sort((a, b) => b.created_at - a.created_at);

 return (
  <div className="container mx-auto p-4">
    <div className="flex mb-4">
      <input
        type="text"
        placeholder="Search questions..."
        className="mb-4 md:mb-0 md:mr-4 p-2 border border-gray-300 rounded-lg w-full"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      <select
        className="p-2 border border-gray-300 rounded-lg w-full"
        value={filterTag}
        onChange={(e) => setFilterTag(e.target.value)}
      >
        <option value="">All Tags</option>
        {tags.map(tag => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </div>

    <div className="space-y-4">
      {sortedQuestions.length ? sortedQuestions.map(question => (
        <div key={question.id} className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 flex items-center" onClick={() => handlePostClick(question.id)}>
            {question.resolved && <FaCheck className="text-green-500 mr-2" />}
            {question.title}
            <div className="ml-auto flex items-center">
              <FaEye className="text-gray-500 mr-2" />
              <span>{views[question.id] || 0}</span>
            </div>
          </h2>
          <p className="text-gray-700 mb-4">{question.content}</p>
          
          <div className="flex items-center mb-4">
            <button
              onClick={() => handleVote(question.id, 'upvote')}
              className="flex items-center mr-4 text-blue-600 hover:text-blue-800"
            >
              <FaArrowUp />
              <span className="ml-1">{votes[question.id]?.upvotes || 0}</span>
            </button>
            <button
              onClick={() => handleVote(question.id, 'downvote')}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <FaArrowDown />
              <span className="ml-1">{votes[question.id]?.downvotes || 0}</span>
            </button>
          </div>
          <div className="flex mb-4">
            {(Array.isArray(question.tags) ? question.tags : []).map(tag => (
              <span
                key={tag}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm mr-2"
              >
                <FaTag className="inline-block mr-1" />
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center">
            {currentUser && (
              <>
                <button
                  onClick={() => handlePostClick(question.id)}
                  className="mr-4 text-green-600 hover:text-green-800"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(question.id)}
                  className="mr-4 text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => handleMarkResolved(question.id)}
                  className="mr-4 text-blue-600 hover:text-blue-800"
                >
                  Mark as Resolved
                </button>
                <button
                  onClick={() => handleAddBadge(question.id)} // Add handler for adding badge
                  className="mr-6 text-yellow-600 hover:text-yellow-800"
                >
                  <FaStar /> Add Badge
                </button>
                <button
                  onClick={() => handleRemoveBadge(question.id)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <FaStar />
                  Remove Badge
                </button>
              </>
            )}
          </div>
        </div>
      )) : (
        <p>No questions found</p>
      )}
    </div>

    {/* Update Question Form */}
    {editingQuestion && (
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-xl font-semibold mb-4">Update Question</h2>
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={(e) => {
          e.preventDefault();
          handleUpdateQuestion();
        }}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full"
              rows="4"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Code Snippet</label>
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full"
              rows="3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Link</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-lg"
          >
            Update Question
          </button>
          <button
            type="button"
            onClick={() => setEditingQuestion(null)}
            className="ml-4 bg-gray-300 text-gray-700 p-2 rounded-lg"
          >
            Cancel
          </button>
        </form>
      </div>
    )}
  </div>
);
};

export default Questions;
