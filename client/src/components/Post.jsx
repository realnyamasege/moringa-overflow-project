import React from 'react';
import { Link } from 'react-router-dom';

const Post = ({ post }) => {
  return (
    <Link to={`/Question/${post.id}`} className="border p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-2">{post.content}</p>
        <p className="text-gray-500 text-sm">By <span className="italic">{post.author}</span></p>
      </div>
    </Link>
  );
};

export default Post;
