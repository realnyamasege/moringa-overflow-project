import React from 'react';

export default function About() {
  return (
    <div className='container mx-auto px-5 py-10'>
      <div className='flex flex-col items-center'>
        {/* Image Section */}
        <div className='w-full md:w-3/4'>
          <img 
            className='rounded-md w-full h-auto' 
            src="https://static.vecteezy.com/system/resources/previews/008/167/404/non_2x/simply-soft-gradation-technology-background-free-vector.jpg" 
            alt="About"
          />
        </div>

        {/* Text Section */}
        <div className='mt-10 w-full md:w-3/4 text-center'>
          <br/>
          <h1 className='text-xl my-2 underline font-semibold'>Solution</h1>
          <p className='leading-relaxed'>
            Develop a Stack Overflow clone specifically for Moringa School, tailored to its curriculum
            and user needs. This platform will allow students and instructors to ask and answer questions
            related to their courses and coding problems, tag questions with relevant topics and course 
            modules, upvote or downvote questions and answers to ensure quality content, and mark 
            questions as resolved when an accepted answer is provided. Users will be able to search 
            and filter questions based on tags, keywords, and user profiles, and earn reputation points 
            and badges for active participation and quality contributions. The platform will also integrate
            with Moringa School’s existing authentication system for seamless user management.
          </p>
        </div>
      </div>
    </div>
  );
}