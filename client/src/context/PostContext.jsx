import { createContext, useContext, useEffect, useState } from "react"
import { UserContext } from "./UserContext"
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom"
import {server_url} from '../../config'


export const PostContext = createContext()

export const PostProvider = ({ children }) => 
{
   const nav = useNavigate()
   const {auth_token} = useContext(UserContext)
   
   const [Post, setPost] = useState()
   const [Posts, setPosts] = useState([])
 //fetch available Posts
   useEffect(()=>{
       fetch(`${server_url}/Posts`, {
           headers: {
             'Content-type': 'application/json',
             "Authorization": `Bearer ${auth_token}`
           },
         })
       .then((response) => response.json())
       .then((res) => {
          setPosts(res)
       });
   }, [auth_token])
   const singlePost = () => {
     fetch(`${server_url}/Posts/${Post.id}`, {
         headers: {
           'Content-type': 'application/json',
           "Authorization": `Bearer ${auth_token}`
         },
       })
      .then((response) => response.json())
      .then((res) => {
         console.log(res)
          setPost(res)
       });
   }
      
   const update_Post = (name, model, year, price_per_day, Post_image_url) => {
       fetch(`${server_url}/Posts`, {
           method: 'PUT',
           body: JSON.stringify({
               name :name,
               model: model, 
               year: year, 
               price_per_day: price_per_day, 
               Post_image_url :Post_image_url  
           }),
           headers:{
             'Content-type': 'application/json',
             "Authorization": `Bearer ${auth_token}`
           },
      })
      .then((response)=>response.json())
      .then((res) =>{
        
     if(res.success)
        {
            toast.success("Post updated Successfully!")
            nav("/dashboard")
        }
        else if(res.error)
        {
            toast.error(res.error)
        }
        else {
            toast.error("An error occured")
        }

    })}

    const delete_Post = ()  =>{
        fetch(`${server_url}/Posts/${Post.id}`, {
            method: 'DELETE',
            headers: {
              'Content-type': 'application/json',
              "Authorization": `Bearer ${auth_token}`
            },
          })
        .then((response) => response.json())
        .then((res) =>{
            if(res.success)
            {
                toast.success(res.success)
                nav("/dashboard")
                setCurrentUser(null)
            }
            else if(res.error)
            {
                toast.error(res.error)
            }
            else {
                toast.error("An error occured")
            }

        });
    }     
    
    const add_Post = (name, model, year, price_per_day, Post_image_url) =>{
        fetch( `${server_url}/Posts`, {
            method: 'POST',
            body: JSON.stringify({
                name, model, year, price_per_day, Post_image_url
                
            }),
            headers: {
              'Content-type': 'application/json',
              "Authorization": `Bearer ${auth_token}`
            },
          })
        .then((response) => response.json())
        .then((res) =>{
            
         if(res.success)
            {
                toast.success(res.success)
                nav("/dashboard")
            }
            else if(res.error)
            {
                toast.error(res.error)
            }
            else {
                toast.error("An error occured")
            }

        });
    
    } 

    const contextData ={
        add_Post,
        Posts,
        update_Post,
        delete_Post,
        
    }
    return(
        <PostContext.Provider value={contextData}>
            {children}
        </PostContext.Provider>
    )
}