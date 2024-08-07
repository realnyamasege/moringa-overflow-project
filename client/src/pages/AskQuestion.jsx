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
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("access_token");
    if (!userId) {
      toast.error("No user logged in");
      navigate("/LoginPage");
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
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleTagRemove = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3000/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: currentUser.id,
        author: currentUser.name,
        title,
        content,
        tags,
        codeSnippet,
        link,
        upvotes: 0,
        downvotes: 0,
        resolved: false,
        answers: [],
        badges: [],
      }),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success('Question submitted successfully!');
        navigate('/Questions');
      })
      .catch((error) => {
        toast.error('Failed to submit the question.');
        console.error('Error:', error);
      });
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
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleTagKeyPress}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter tags and press Enter"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
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
