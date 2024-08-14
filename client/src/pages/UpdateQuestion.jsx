import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

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
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

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
      setError('Failed to load answers');
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
    try {
      const response = await fetch(`http://localhost:5000/answers/${answer_id}/vote`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        const updatedAnswer = await response.json();
        setAnswers(prevAnswers =>
          prevAnswers.map(ans =>
            ans.id === updatedAnswer.id ? updatedAnswer : ans
          )
        );
        toast.success('Answer vote updated successfully');
      } else {
        throw new Error('Failed to update answer vote');
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
        {currentUser && question && currentUser.id === question.user_id && !question.accepted_answer && (
          <button onClick={() => handleSelectAcceptedAnswer(answer.id)} style={{ fontSize: '18px', cursor: 'pointer', background: 'none', border: 'none', color: '#4caf50', marginLeft: '10px' }}>
            <FaCheck />
          </button>
        )}
      </div>
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
