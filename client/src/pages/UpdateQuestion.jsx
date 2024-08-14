import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom'; // Import useParams

const UpdateQuestions = () => {
  const { id } = useParams(); // Use useParams to get route parameters
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [link, setLink] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`http://localhost:5000/questions/${id}`);
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
      } else {
        throw new Error('Failed to update vote');
      }
    } catch (error) {
      console.error('Error updating vote:', error);
      toast.error('Failed to update vote');
    }
  };

  const handleAnswerVote = async (answerId, type) => {
    try {
      const response = await fetch(`http://localhost:5000/votes/${answerId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });
  
      if (response.ok) {
        const updatedAnswer = await response.json();
        setQuestion((prevQuestion) => ({
          ...prevQuestion,
          answers: prevQuestion.answers.map((ans) =>
            ans.id === updatedAnswer.id ? updatedAnswer : ans
          ),
        }));
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
    try {
      const newAnswer = {
        id: Date.now().toString(),
        userId: currentUser?.id,
        author: currentUser?.name,
        questionId: question.id,
        answer,
        link,
        codeSnippet,
        upvotes: 0,
        downvotes: 0,
        accepted: false,
        votes: [],
      };
      const updatedAnswers = [...(question.answers || []), newAnswer];

      const response = await fetch(`http://localhost:5000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: updatedAnswers }),
      });

      if (response.ok) {
        setQuestion({ ...question, answers: updatedAnswers });
        setAnswer('');
        setLink('');
        setCodeSnippet('');
        toast.success('Answer submitted successfully');
      } else {
        throw new Error('Failed to submit answer');
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

      if (response.ok) {
        const updatedQuestion = await response.json();
        setQuestion(updatedQuestion);
        toast.success('Answer marked as accepted');
      } else {
        throw new Error('Failed to mark answer as accepted');
      }
    } catch (error) {
      console.error('Error marking answer as accepted:', error);
      toast.error('Failed to mark answer as accepted');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ display: 'flex', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <div className="question-details" style={{ flex: '2', marginRight: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>{question.title}</h1>
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>{question.content}</p>
        {question.codeSnippet && (
          <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px', overflowX: 'auto', marginBottom: '20px' }}>
            <code>{question.codeSnippet}</code>
          </pre>
        )}
        {question.tags && (
          <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {question.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#e0e0e0',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  color: '#333',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
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
          <h2 style={{ fontSize: '20px' }}>Answers</h2>
          {question.answers?.map(answer => (
            <div key={answer.id} style={{ padding: '10px', marginBottom: '10px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>{answer.answer}</p>
              {answer.link && (
                <a href={answer.link} style={{ color: '#1e90ff', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">
                  Related link
                </a>
              )}
              {answer.codeSnippet && (
                <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px', overflowX: 'auto', marginTop: '10px' }}>
                  <code>{answer.codeSnippet}</code>
                </pre>
              )}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <button onClick={() => handleAnswerVote(answer.id, 'upvote')} style={{ fontSize: '18px', marginRight: '10px', cursor: 'pointer', background: 'none', border: 'none', color: '#4caf50' }}>
                  <FaArrowUp />
                </button>
                <span style={{ fontSize: '18px', marginRight: '10px' }}>{answer.upvotes}</span>
                <button onClick={() => handleAnswerVote(answer.id, 'downvote')} style={{ fontSize: '18px', marginRight: '10px', cursor: 'pointer', background: 'none', border: 'none', color: '#f44336' }}>
                  <FaArrowDown />
                </button>
                <span style={{ fontSize: '18px', marginRight: '10px' }}>{answer.downvotes}</span>
              </div>
              {currentUser?.id === question.userId && !answer.accepted && (
                <button onClick={() => handleSelectAcceptedAnswer(answer.id)} style={{ backgroundColor: '#4caf50', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                  Mark as Accepted
                </button>
              )}
              {answer.accepted && <p style={{ color: '#4caf50', fontSize: '16px' }}>Accepted <FaCheck /></p>}
            </div>
          ))}
        </div>
      </div>
      <div className="answer-form" style={{ flex: '1', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Submit Your Answer</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Related link (optional)"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="Code snippet (optional)"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}
            />
          </div>
          <button type="submit" style={{ backgroundColor: '#4caf50', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
            Submit Answer
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuestions;
