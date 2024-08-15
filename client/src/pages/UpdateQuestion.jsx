import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaCheck, FaTrash, FaPencilAlt, FaTimes} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateQuestions = () => {
  const { id, userId } = useParams();
  const [error, setError] = useState('');
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]); // Initialize as array
  const [answerText, setAnswerText] = useState('');
  const [link, setLink] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedAnswerContent, setEditedAnswerContent] = useState('');
  const storedCurrentUsers = JSON.parse(localStorage.getItem('currentUser'));
  const navigate = useNavigate();
  const [ currentUser, setCurrentUser] = useState(storedCurrentUsers);

  
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      toast.error("No user logged in");
      navigate("/login");
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/authenticated_user", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        });

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

    fetchCurrentUser();
  }, [navigate]);
  
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`http://localhost:5000/questions/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setQuestion(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching question:', error);
        toast.error('Failed to fetch question');
      }
    };
    fetchQuestion();
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchAnswers(id);
    }
  }, [id]);

  const fetchAnswers = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/questions/${id}/answers`);
      if (!response.ok) throw new Error('Failed to fetch answers');
      const data = await response.json();
      setAnswers(data);
    } catch (error) {
      console.error('Error fetching answers:', error);
    }
  };

  const handleVote = async (type) => {
    try {
      const response = await fetch(`http://localhost:5000/questions/${id}/vote`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        const updatedQuestion = await response.json();
        setQuestion(updatedQuestion);
        toast.success('Vote updated successfully');
      } else {
        throw new Error('Failed to update vote');
      }
    } catch (error) {
      console.error('Error updating vote:', error);
      toast.error('Failed to update vote');
    }
  };

  const handleAnswerVote = async (answer_id, type) => {
    // Ensure type is either 'upvote' or 'downvote'
    const voteType = type === 'up' ? 'upvote' : 'downvote';
  
    console.log(`Sending vote type: ${voteType}`);  // Verify the type value
  
    try {
      const response = await fetch(`http://localhost:5000/answers/${answer_id}/vote`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ voteType })  // Correctly format the voteType
      });
  
      console.log('Response status:', response.status);  // Log response status
      if (response.ok) {
        const updatedAnswer = await response.json();
        setAnswers(prevAnswers =>
          prevAnswers.map(ans =>
            ans.id === updatedAnswer.id ? updatedAnswer : ans
          )
        );
        toast.success('Answer vote updated successfully');
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to update answer vote: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating answer vote:', error);
      toast.error('Failed to update answer vote');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!answerText) {
      toast.error('Please fill out all required fields.');
      return;
    }
  
    try {
      const newAnswer = {
        question_id: question.id,
        answer: answerText,
        link,
        codeSnippet,
        is_accepted: isAccepted,
        user_id: userId,
      };
  
      const response = await fetch('http://localhost:5000/answers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAnswer),
      });
  
      if (response.ok) {
        const createdAnswer = await response.json();
        setAnswerText('');
        setLink('');
        setCodeSnippet('');
        setAnswers(prevAnswers => [createdAnswer, ...prevAnswers]);
        toast.success('Answer submitted successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit answer');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer');
    }
  };
  
  const handleSelectAcceptedAnswer = async (answerId) => {
    try {
      const response = await fetch(`http://localhost:5000/questions/${id}/accept/${answerId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to mark answer as accepted');
      }
  
      const updatedQuestion = await response.json();
      setQuestion(updatedQuestion);
      toast.success('Answer marked as accepted');
    } catch (error) {
      console.error('Error marking answer as accepted:', error);
      toast.error('Failed to mark answer as accepted');
    }
  };
  const handleDeleteAnswer = async (answerId) => {
    try {
      const response = await fetch(`http://localhost:5000/answers/${answerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        setAnswers(prevAnswers => prevAnswers.filter(answer => answer.id !== answerId));
        toast.success('Answer deleted successfully');
      } else {
        throw new Error('Failed to delete answer');
      }
    } catch (error) {
      console.error('Error deleting answer:', error);
      toast.error('Failed to delete answer');
    }
  };
  const handleEditAnswer = async (answer) => {
    // Debug logging
    console.log('Attempting to edit answer:', answer);
    console.log('Current user ID:', currentUser.id);

    
    if (String(answer.userId) === String(storedCurrentUsers?.id)) {
        // Set state for editing
        setEditingAnswerId(answer.id);
        setEditedAnswerContent(answer.answer);
    } else {
        // Log and show error
        console.error('Access token mismatch:', answer.userId, storedCurrentUsers?.id);
        toast.error('You can only edit your own answers.');
        return;
    }

    const updateAnswer = async () => {
      try {
        const response = await fetch(`http://localhost:5000/answers/${answer.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answer: editedAnswerContent }),
        });

        if (response.ok) {
          const updatedAnswer = await response.json();
          // Update the answer in your state or context
          toast.success('Answer updated successfully.');
        } else {
          throw new Error('Failed to update the answer.');
        }
      } catch (error) {
        console.error('Error updating the answer:', error);
        toast.error('Failed to update the answer.');
      }
    };

    updateAnswer();
  };
  const handleSaveAnswerEdit = async (answerId) => {
    const updatedAnswers = question.answers.map(answer => {
      if (answer.id === editingAnswerId) {
        return { ...answer, answer: editedAnswerContent };
      }
      return answer;
    });

    try {
      const response = await fetch(`http://localhost:5000/answers/${answerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
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

  

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', gap: '20px' }}>
      {/* Question Details Section */}
      <div style={{ flex: '2', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>{question.title}</h1>
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>{question.content}</p>
        {question.link && (
          <a href={question.link} style={{ color: '#1e90ff', textDecoration: 'underline', marginBottom: '10px', display: 'block' }} target="_blank" rel="noopener noreferrer">
            Related link
          </a>
        )}
        {question.code_snippet && (
          <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px', overflowX: 'auto', marginBottom: '20px' }}>
            <code>{question.code_snippet}</code>
          </pre>
        )}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => handleVote('up')} style={{ fontSize: '18px', marginRight: '10px', cursor: 'pointer', background: 'none', border: 'none', color: userVote === 'up' ? '#4caf50' : '#757575' }}>
            <FaArrowUp />
          </button>
          <span style={{ fontSize: '18px', marginRight: '10px' }}>{question.upvotes}</span>
          <button onClick={() => handleVote('down')} style={{ fontSize: '18px', marginRight: '10px', cursor: 'pointer', background: 'none', border: 'none', color: userVote === 'down' ? '#f44336' : '#757575' }}>
            <FaArrowDown />
          </button>
          <span style={{ fontSize: '18px', marginRight: '10px' }}>{question.downvotes}</span>
        </div>
        <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Answers</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {answers.length > 0 ? (
        answers.map((answer) => (
          <div key={answer.id} style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <p style={{ fontSize: '16px', marginBottom: '10px' }}>{answer.answer}</p>
            {answer.link && (
              <a href={answer.link} style={{ color: '#1e90ff', textDecoration: 'underline', marginBottom: '10px', display: 'block' }} target="_blank" rel="noopener noreferrer">
                Related link
              </a>
            )}
            {answer.codeSnippet && (
              <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px', overflowX: 'auto', marginBottom: '20px' }}>
                <code style={{ whiteSpace: 'pre-wrap' }}>{answer.codeSnippet}</code>
              </pre>
            )}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <button onClick={() => handleAnswerVote(answer.id, 'up')} style={{ fontSize: '18px', marginRight: '10px', cursor: 'pointer', background: 'none', border: 'none', color: answer.userVote === 'up' ? '#4caf50' : '#757575' }}>
                <FaArrowUp />
              </button>
              <span style={{ fontSize: '18px', marginRight: '10px' }}>{answer.upvotes}</span>
              <button onClick={() => handleAnswerVote(answer.id, 'down')} style={{ fontSize: '18px', marginRight: '10px', cursor: 'pointer', background: 'none', border: 'none', color: answer.userVote === 'down' ? '#f44336' : '#757575' }}>
                <FaArrowDown />
              </button>
              <span style={{ fontSize: '18px', marginRight: '10px' }}>{answer.downvotes}</span>
              {storedCurrentUsers && question && storedCurrentUsers.id === question.user_id && question.accepted_answer && (
                <button onClick={() => handleSelectAcceptedAnswer(answer.id)} style={{ fontSize: '18px', cursor: 'pointer', background: 'none', border: 'none', color: '#f44336', marginLeft: '10px' }}>
                  <FaCheck />
                </button>
              )}
              {storedCurrentUsers?.id === answer.userId && (
                <div className="flex items-center space-x-4">
                  <FaPencilAlt
                    onClick={() => handleEditAnswer(answer)}
                    className="text-gray-600 cursor-pointer"
                  />
                  <button
                    onClick={() => handleDeleteAnswer(answer.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash className="text-xl" />
                  </button>
                </div>
              )}
            </div>
            {editingAnswerId === answer.id && (
              <div className={`border border-gray-300 rounded-lg p-4 flex justify-between items-start ${answer.accepted ? 'bg-green-100' : ''}`}>
                <div className="flex-1">
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
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No answers yet.</p>
      )}
        </div>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Submit Your Answer</h2>
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Your answer"
            required
            style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '10px' }}
          />
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Link (optional)"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '10px' }}
          />
          <textarea
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            placeholder="Code snippet (optional)"
            style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '10px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#4caf50', color: '#fff', cursor: 'pointer' }}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuestions;
