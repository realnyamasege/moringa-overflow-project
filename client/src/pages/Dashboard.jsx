// import React, { useContext } from 'react'
// import { PostContext } from '../context/PostContext'
// import { UserContext } from '../context/UserContext'
// import { Link } from 'react-router-dom'

function Dashboard() 
{
  const {currentUser} = useContext(UserContext)
  
  const {posts, delete_Post} = useContext(PostContext)


 
  return (
<div className='py-8'>
  {currentUser && currentUser.email?
  <div>
  <h1 className='text-2xl m-6 text-center '>All Questions {posts && posts.length}</h1>
    <div className='grid grid-cols-2 md:grid-cols-3  xxl:grid-cols-4 gap-4 p-4'>
      {
        posts && posts?.map((Post, index) => (
          <div  className="block rounded-lg bg-white md:min-h-[40vh] shadow-secondary-1 dark:bg-surface-dark">
              <a href="#!">
                <img
                  className="rounded-t-lg "
                  src={Post && Post.Post_image_url}
                  alt={Post && Post.name} />
              </a>
          <div className="p-6 text-surface dark:text-white">
            <h5 className="mb-2 text-xl font-medium leading-tight">{Post && Post.name}</h5>
            <p className="mb-4 text-base">
               {Post && Post.model}
            </p>

            <div>
              <span className="my-1 grid grid-cols-2 text-sm  uppercase">
                <span className='font-semibold'>Year : </span>
                <span>{Post && Post.year}</span>
              </span>
              <span className="my-1 grid grid-cols-2 text-xs  uppercase">
                <span className='font-semibold'>Price : </span>
                <span>{Post && Post.price_per_day}</span>
              </span>
              </div>
              {currentUser && currentUser.is_Postowner== "true" ?
              
              <Link to ='/updatePost'
                type="button" onClick = {()=> update_Post(Post.id)}
                className="inline-block rounded bg-blue-700 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
              >
                Update Post
              </Link>
             
              :
              <button
              type="button" onClick = {()=> handleSubmit(Post.id)}
              className="inline-block rounded bg-green-700 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
            >
              Rent Post
            </button>
              }
          </div>
        </div>


        ))
      }
    </div>
    </div>
    :
    <span>Relogin to view this pages</span>}
</div>  
  )
}

export default Dashboard