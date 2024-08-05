import { createContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
// import {server_url} from "./context/config"


export const UserContext = createContext()

export const UserProvider = ({ children }) => 
{
    const nav = useNavigate()

    const [currentUser, setCurrentUser] = useState()
    const [onChange, setOnChange ] = useState(false)
    const [auth_token, setAuth_token] = useState( ()=> localStorage.getItem("access_token")? localStorage.getItem("access_token"): null )



    
   //    REGISTER USER
    const register_user = (name,email, profile_image, phone_number, password) =>{
        
        fetch(`${server_url}/users`, {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                email: email,
                profile_image: profile_image,
                password: password,
                phone_number: phone_number
               
            }),
            headers: {
              'Content-type': 'application/json',
            },
          })
        .then((response) => response.json())
        .then((res) =>{
            console.log(res);
         if(res.success)
            {
                toast.success(res.success)
                nav("/login")
            }
            else if(res.error)
            {
                toast.error(res.error)
            }
            else {
                toast.error("An error occured")
            }

        }).catch(e=>{console.log(e)

        })
    
    }
    const delete_user = ()  =>{
        fetch(`${server_url}/users/${currentUser.id}`, {
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
                nav("/login")
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

       //    Login USER
       const login_user = (email, password) =>{
         console.log(email,password)
        fetch(`${server_url}/login`, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password,
            }),
            headers: {
              'Content-type': 'application/json',
            },
          })
        .then((response) => response.json())
        .then((res) =>{
            console.log(res)
         if(res.access_token)
            {
                setAuth_token(res.access_token)
                localStorage.setItem("access_token", res.access_token)

                toast.success("Logged in Successfully!")
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


       //    Update USER
       const update_user = (name, phone_number, profile_image, password) =>{
        fetch(`${server_url}/users`, {
            method: 'PUT',
            body: JSON.stringify({
                name: name,
                password: password,
                phone_number: phone_number,
                profile_image: profile_image,
            }),
            headers: {
              'Content-type': 'application/json',
              'Authorization': `Bearer ${auth_token}`
            },
          })
        .then((response) => response.json())
        .then((res) =>{
         if(res.success)
            {
                toast.success(res.success)
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

    // Logout
    const logout = () =>{
        fetch(`${server_url}/logout` ,{
            method: 'DELETE',
            headers: {
              'Content-type': 'application/json',
              'Authorization': `Bearer ${auth_token}`
            },
          })
        .then((response) => response.json())
        .then((res) =>{
         if(res.success)
            {
                localStorage.removeItem("access_token")
                setCurrentUser(null)
                setAuth_token(null)
                setOnChange(!onChange)
                nav("/login")
                toast.success(res.success)
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

    useEffect(()=>{
        if(auth_token){
                fetch(`${server_url}/current_user`, {
                    headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${auth_token}`
                    } })
                .then((res)=>res.json())
                .then((data)=>{

                    if(data.email){
                        setCurrentUser(data)
                    }
                    else{
                        localStorage.removeItem("access_token")
                        setCurrentUser(null)
                        setAuth_token(null)
                        nav("/login")
                    }
                
                })
            }

  },[auth_token, onChange])

    const contextData ={
        auth_token, 
        currentUser,
        setCurrentUser,
        register_user,
        login_user,
        update_user,
        logout,
        delete_user

    }
    return (
        <UserContext.Provider value={contextData}>
            {children}
        </UserContext.Provider>
    )
}