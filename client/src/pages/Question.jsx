import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Blog() 
{
  const nav = useNavigate()
  const {id} = useParams()
  const [post, setPost] = useState({})

  useEffect(()=>{
    fetch(`http://localhost:3000/posts/${id}`)
    .then((res)=>res.json())
    .then((data)=>{
       setPost(data)
    })
  }, [id])

  const handleDelete = (id) =>{
    fetch(`http://localhost:3000/posts/${id}`, {
        method: 'DELETE',
      })
    .then((res) => res.json())
    .then((response)=>{
      nav("/")
        toast.success("Post deleted successfully!")
    })
    
}

  return (
    <div className='flex justify-center'>
      

<div class="w-[50vw] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <div>
        <img class="rounded-t-lg w-full h-[50vh]" src="https://images.pexels.com/photos/21273536/pexels-photo-21273536/free-photo-of-beautiful-pink-blossoms-in-spring.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
    </div>


    <button onClick={()=> handleDelete(post.id)} type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
            Delete
    </button>

    <Link to={`/update/${post.id}`} type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900">
            Update Blog
    </Link>

    <div class="p-5">
        <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{post.title}</h5>
        </a>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {post.content}
        </p>
        <p>By <span className='italic'>{post.author}</span> </p>


        <div className='bg-gray-300 p-4'>
        <h5>Comments {post && post.comments && post.comments.length}</h5>
        {
         post && post.comments && post.comments.map((comment)=>(
            <div className='p-2 bg-white mt-2' key={comment.id}>
            <p>{comment.text}</p>
            <p>{comment.author}</p>
            </div>
        ))
        }
        </div>
        
    </div>
</div>


    </div>
  )
}
