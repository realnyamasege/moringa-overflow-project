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
                src='data:image/jpeg;base64,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' 
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
