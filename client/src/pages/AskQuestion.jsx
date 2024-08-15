import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function AskQuestion() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [link, setLink] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error("No user logged in");
        navigate("/LoginPage");
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/authenticated_user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
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
        navigate("/LoginPage");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Fetch existing questions to generate a new unique ID (for development)
      const questionsResponse = await fetch('http://localhost:5000/questions');
      if (!questionsResponse.ok) {
        throw new Error(`Failed to fetch questions: ${questionsResponse.statusText}`);
      }
  
      const questions = await questionsResponse.json();
      const newId = `q${questions.length + 1}`;
  
      // Prepare the question data
      const questionData = {
        id: newId,
        userId: currentUser.id,
        author: currentUser.name,
        title,
        content,
        tags: tags.split(',').map((tag) => tag.trim()), // Ensure tags are correctly formatted
        codeSnippet,
        link,
        upvotes: 0,
        downvotes: 0,
        resolved: false,
        answers: [],
        badges: [],
      };
  
      console.log('Submitting question:', questionData);
  
      // Submit the question
      const response = await fetch('http://localhost:5000/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(questionData), // Use `questionData` which includes formatted tags
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit the question: ${errorText}`);
      }
  
      toast.success('Question submitted successfully!');
      navigate('/Questions');
    } catch (error) {
      toast.error(`Failed to submit the question: ${error.message}`);
      console.error('Error:', error);
    }
  };
  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while checking authentication
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ask a Question</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-black">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter question title"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-black">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter question content"
            rows="5"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-black">Code Snippet</label>
          <textarea
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter code snippet (optional)"
            rows="3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-black">Link</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter link (optional)"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-black">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter tags and press Enter"
          />
          
        </div>
        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Submit Question
        </button>
      </form>
    </div>
  );
}