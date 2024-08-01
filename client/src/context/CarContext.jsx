import { createContext, useContext, useEffect, useState } from "react"
import { UserContext } from "./UserContext"
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom"
import {server_url} from '../../config'


export const CarContext = createContext()

export const CarProvider = ({ children }) => 
{
   const nav = useNavigate()
   const {auth_token} = useContext(UserContext)
   
   const [car, setCar] = useState()
   const [cars, setCars] = useState([])
 //fetch available cars
   useEffect(()=>{
       fetch(`${server_url}/cars`, {
           headers: {
             'Content-type': 'application/json',
             "Authorization": `Bearer ${auth_token}`
           },
         })
       .then((response) => response.json())
       .then((res) => {
          setCars(res)
       });
   }, [auth_token])
   const singleCar = () => {
     fetch(`${server_url}/cars/${car.id}`, {
         headers: {
           'Content-type': 'application/json',
           "Authorization": `Bearer ${auth_token}`
         },
       })
      .then((response) => response.json())
      .then((res) => {
         console.log(res)
          setCar(res)
       });
   }
      
   const update_car = (name, model, year, price_per_day, car_image_url) => {
       fetch(`${server_url}/cars`, {
           method: 'PUT',
           body: JSON.stringify({
               name :name,
               model: model, 
               year: year, 
               price_per_day: price_per_day, 
               car_image_url :car_image_url  
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
            toast.success("Car updated Successfully!")
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

    const delete_car = ()  =>{
        fetch(`${server_url}/cars/${car.id}`, {
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
    
    const add_car = (name, model, year, price_per_day, car_image_url) =>{
        fetch( `${server_url}/cars`, {
            method: 'POST',
            body: JSON.stringify({
                name, model, year, price_per_day, car_image_url
                
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
        add_car,
        cars,
        update_car,
        delete_car,
        
    }
    return(
        <CarContext.Provider value={contextData}>
            {children}
        </CarContext.Provider>
    )
}