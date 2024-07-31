// import React from 'react'

// export default function Landing() {
//   return (
//     <div className='grid bg-gray-100 mx-auto md:grid-cols-2 pt-3'>
//     <div className='mt-7 flex justify-center'>
//       <img className='h-[60vh]' src='https://i.pinimg.com/564x/a8/a2/80/a8a280e5b151fa9039000a04e9e9ccec.jpg'/>
//     </div>
//     <div className=''>
//       <p className='p-10 mt-10 text-center text-xl mx-10 italic'>Join Moringa Overflow today and become a part 
// of a thriving community dedicated to enhancing learning 
// and collaboration at Moringa School!</p>
//     </div>

//   </div>
// )
// }

import React from 'react';
import { FaArrowUp, FaArrowDown, FaAward, FaEye, FaShareAlt } from 'react-icons/fa';

export default function Landing() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 bg-gray-100 mx-auto pt-3'>
      
      {/* Main Content Area */}
      <div className='md:col-span-2 flex flex-col items-center p-5'>
        <div className='w-full flex justify-center'>
          <img 
            className='h-[60vh]' 
            src='https://t4.ftcdn.net/jpg/03/08/69/75/360_F_308697506_9dsBYHXm9FwuW0qcEqimAEXUvzTwfzwe.jpg' 
            alt='Community Image'
          />
        </div>
        <p className='p-10 mt-10 text-center text-xl mx-10 italic'>
          Join Moringa Overflow today and become a part of a thriving community dedicated to enhancing learning and collaboration at Moringa School!
        </p>
      </div>
      
      {/* Sidebar */}
      <div className='relative p-5'>
        <div className='border-l-2 border-gray-300 h-full absolute left-0'></div>
        <div className='pl-5'>
          <h2 className='text-2xl font-semibold mb-5'>Recent Posts</h2>
          {/* Example Post */}
          <div className='flex flex-col mb-5'>
            <div className='flex mb-2'>
              <img 
                className='w-16 h-16 object-cover rounded mr-3' 
                src='https://via.placeholder.com/150' 
                alt='Post Thumbnail'
              />
              <div>
                <h3 className='text-lg font-semibold'>How to Use React Hooks</h3>
                <p className='text-sm text-gray-600'>2 hours ago by John Doe</p>
              </div>
            </div>
            <div className='flex items-center text-gray-600 text-sm'>
              <div className='flex items-center mr-4'>
                <FaArrowUp className='mr-1' /> 20
                <FaArrowDown className='ml-2 mr-1' /> 5
              </div>
              <div className='flex items-center mr-4'>
                <FaAward className='mr-1' /> 1 Badge
              </div>
              <div className='flex items-center mr-4'>
                <FaEye className='mr-1' /> 150 Views
              </div>
              <div className='flex items-center mr-4'>
                <FaShareAlt className='mr-1' /> Share
              </div>
              <div className='flex items-center'>
                <span className='mr-1'>10</span> Replies
              </div>
            </div>
          </div>
          {/* Add more post items as needed */}
        </div>
      </div>
    </div>
  );
}
