import React from 'react'

export default function About() {
  return (
    <div className='container h-[100vh] mx-auto'>
   
    <div className='grid grid-cols-1  md:grid-cols-2'>
      <div>
        <img className='rounded-md' src = "https://static.vecteezy.com/system/resources/previews/008/167/404/non_2x/simply-soft-gradation-technology-background-free-vector.jpg" alt="about image"/>
      </div>
      <div className=' justify-center text-center pt-12'>         
         

      <h1 className='text-xl text-center my-2 underline font-semibold'>Problem Statement</h1>
            <p className=''>

         Moringa School, a renowned institution for coding and software development training, 
         lacks a dedicated platform for students and instructors to share knowledge, ask questions,
          and collaborate on coding problems. Existing platforms such as Stack Overflow are too broad 
          and do not cater specifically to the unique needs and curriculum of Moringa School. 
          The absence of a tailored platform leads to scattered information, reduced collaboration, 
          and missed learning opportunities.
            </p><br/><br/>


            <h1 className='text-xl text-center my-2 underline font-semibold'>Solution</h1>
            <p className=''>

            Develop a Stack Overflow clone specifically for Moringa School, tailored to its curriculum
             and user needs. This platform will allow students and instructors to ask and answer questions
              related to their courses and coding problems, tag questions with relevant topics and course 
              modules, upvote or downvote questions and answers to ensure quality content, and mark 
              questions as resolved when an accepted answer is provided. Users will be able to search 
              and filter questions based on tags, keywords, and user profiles, and earn reputation points 
              and badges for active participation and quality contributions. The platform will also integrate
               with Moringa School’s existing authentication system for seamless user management.
            </p><br/><br/>

               

       

      </div>
    </div>
  </div>
  )
}