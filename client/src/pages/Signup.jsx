import React, { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { toast } from 'react-toastify'

function Register() 
{
  const {register_user} = useContext(UserContext)

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [repeatPassword, setRepeatPassword] = useState()
  const [name, setName] = useState()
  const [profile_image, setProfileImage] = useState()
  const [phone_number, setPhone_number] = useState()
  const [is_carowner, setIsCarOwner] = useState("false")

  console.log(email, password,profile_image, repeatPassword, name, phone_number, is_carowner);
  function handleSubmit(e){
    e.preventDefault()

    if(password !== repeatPassword){
      toast.error("Passwords do not match")
      return
    }

    register_user(name,email,profile_image, phone_number,is_carowner, password)
    setEmail("")
    setPassword("")
    setRepeatPassword("")
    setProfileImage("")
    setName("")
    setPhone_number("")
    setIsCarOwner("false")
  }


  return (
   <div className='grid md:grid-cols-2 p-4'>
        <div>
          <img src='https://i.pinimg.com/564x/db/59/2e/db592eacd248afff9d03ad64906853d6.jpg'/>
        </div>

        
        <div className='p-3 mt-12 border rounded-xl bg-gray-200'>
            <h4 className='font-bold tex-2xl text-center'>Register new Account</h4>
            <form onSubmit={handleSubmit}>
            <div className="mb-5">
                <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="email" value={email || ""} onChange={(e)=> setEmail(e.target.value)} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="name@example.com" required />
            </div>
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                <input type="text" value={name || ""} onChange={(e)=> setName(e.target.value)} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="John Doe" required />
            </div>
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Image</label>
                <input type="text" value={profile_image || ""} onChange={(e)=> setProfileImage(e.target.value)} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="http:www.example.com" required />
            </div>
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                <input type="text" value={phone_number || ""} onChange={(e)=> setPhone_number(e.target.value)} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="07123456789" required />
            </div>
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                <input type="password" value={password || ""} onChange={(e)=> setPassword(e.target.value)}  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
            </div>
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repeat password</label>
                <input type="password" value={repeatPassword || ""} onChange={(e)=> setRepeatPassword(e.target.value)} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
            </div>

            <div className="mb-5">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Register as</label>
            <select onChange={ e => setIsCarOwner(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              {/* <option selected>Choose a country</option> */}
              <option selected value="false">User</option>
              <option value="true">Car Owner</option>
            </select>
            </div>

            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Register
            </button>
            </form>
        </div>
        

        <div></div>
        
    </div>
  )
}

export default Register