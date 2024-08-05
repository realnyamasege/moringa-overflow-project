import React from 'react';
import { FaArrowUp, FaArrowDown, FaAward, FaEye, FaShareAlt } from 'react-icons/fa';

export default function Landing() {
  return (
    <div className='bg-gray-100 min-h-screen py-8 px-4 md:px-16'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Main Content Area */}
        <div className='md:col-span-2 flex flex-col items-center'>
          <div className='w-full flex justify-center'>
            <img 
              className='h-[60vh] object-cover rounded-lg shadow-md' 
              src='https://t4.ftcdn.net/jpg/03/08/69/75/360_F_308697506_9dsBYHXm9FwuW0qcEqimAEXUvzTwfzwe.jpg' 
              alt='Community Image'
            />
          </div>
          <p className='p-8 mt-8 text-center text-xl font-light mx-4 md:mx-8 italic'>
            Join Moringa Overflow today and become a part of a thriving community dedicated to enhancing learning and collaboration at Moringa School!
          </p>
        </div>
        
        {/* Sidebar */}
        <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200'>
          <h2 className='text-2xl font-semibold mb-5'>Featured Sections</h2>
          <div className='mb-6'>
            <div className='flex items-center mb-4'>
              <FaArrowUp className='text-blue-500 text-2xl mr-4' />
              <div>
                <h3 className='text-lg font-medium'>Top Posts</h3>
                <p className='text-sm text-gray-600'>See the most upvoted posts of the week.</p>
              </div>
            </div>
            <div className='flex items-center mb-4'>
              <FaArrowDown className='text-red-500 text-2xl mr-4' />
              <div>
                <h3 className='text-lg font-medium'>Newest Posts</h3>
                <p className='text-sm text-gray-600'>Check out the latest posts by the community.</p>
              </div>
            </div>
            <div className='flex items-center mb-4'>
              <FaAward className='text-yellow-500 text-2xl mr-4' />
              <div>
                <h3 className='text-lg font-medium'>Top Contributors</h3>
                <p className='text-sm text-gray-600'>Recognize the most active contributors.</p>
              </div>
            </div>
            <div className='flex items-center mb-4'>
              <FaEye className='text-green-500 text-2xl mr-4' />
              <div>
                <h3 className='text-lg font-medium'>Popular Topics</h3>
                <p className='text-sm text-gray-600'>Explore the most discussed topics.</p>
              </div>
            </div>
            <div className='flex items-center mb-4'>
              <FaShareAlt className='text-purple-500 text-2xl mr-4' />
              <div>
                <h3 className='text-lg font-medium'>Share Your Ideas</h3>
                <p className='text-sm text-gray-600'>Submit your own questions or posts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
