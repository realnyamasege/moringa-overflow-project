import React, { useEffect, useState } from 'react'
import Landing from '../components/Landing'
import Post from '../components/Post'
import { v4 as uuidv4 } from 'uuid';
import ReactPaginate from 'react-paginate';

export default function Home() 
{
  const [posts, setPosts] = useState([])

  useEffect(()=>{
    fetch("http://localhost:3000/posts")
    .then((res)=>res.json())
    .then((data)=>{
       setPosts(data)
    })


  },[])


  // REACT PAGINATION
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset +6;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = posts.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(posts.length /6);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected *6) % posts.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <div>

    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 '>
        {
          currentItems && currentItems.map((post)=>(
          <Post key={post.id} s post={post} />
          ))
        }



    </div>
    <Landing />
     <div className='flex flex-row justify-center my-20 bg-sky-200'>
        <ReactPaginate
        breakLabel="..."
        nextLabel="next >>"
        containerClassName="flex gap-4"
        activeClassName="text-sky-800 font-bold"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="<< previous"
        renderOnZeroPageCount={null}
      />
     </div>

    </div>
  )
}
