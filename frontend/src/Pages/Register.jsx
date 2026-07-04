import axios from 'axios';
import React, { useState } from 'react'
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate()
    const [loading , setLoading] = useState(false);
    const [inputData , setInputData] = useState({});
    const {setAuthUser} = useContext(AuthContext);

    const handelInput=(e)=>{
        setInputData({
            ...inputData , [e.target.id]:e.target.value
        })
    }
console.log(inputData);
    const selectGender=(selectGender)=>{
        setInputData((prev)=>({
            ...prev , gender:selectGender === inputData.gender ? '' : selectGender
        }))
    }

    const handelSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true)
        if(inputData.password !== inputData.confpassword.toLowerCase()){
            setLoading(false)
            return toast.error("Password Dosen't match")
        }
        try {
            const register = await axios.post(`http://localhost:8000/chat/auth/register`,inputData,{withCredentials: true});
            const data = register.data;
            if(data.success === false){
                setLoading(false)
                toast.error(data.message)
                return console.log(data.message);
            }
            toast.success(data?.message)
            localStorage.setItem('chatapp',JSON.stringify(data));
            setAuthUser(data);
            setLoading(false)
            navigate('/login')
        } catch (error) {
            setLoading(false)
            console.log(error);
            toast.error(error?.response?.data?.message)
        }
    }

  return (
  <div className='flex flex-col items-center justify-center 
                  w-full max-w-md mx-auto px-4'>
    <div className='w-full p-6 rounded-lg shadow-lg
                    bg-gray-400 bg-clip-padding
                    backdrop-filter backdrop-blur-lg bg-opacity-0'>

      <h1 className='text-2xl sm:text-3xl font-bold text-center text-gray-300'>
        Register <span className='text-gray-950'>Chatters</span>
      </h1>

      <form onSubmit={handelSubmit} className='flex flex-col text-black'>
        {/* Fullname */}
        <div>
          <label className='label p-2'>
            <span className='font-bold text-gray-950 text-base sm:text-xl label-text'>
              Full Name :
            </span>
          </label>
          <input id='fullName' type='text' onChange={handelInput}
            placeholder='Enter Full Name' required
            className='w-full input input-bordered h-10 rounded bg-amber-50'/>
        </div>

        {/* Username */}
        <div>
          <label className='label p-2'>
            <span className='font-bold text-gray-950 text-base sm:text-xl label-text'>
              Username :
            </span>
          </label>
          <input id='userName' type='text' onChange={handelInput}
            placeholder='Enter UserName' required
            className='w-full input input-bordered h-10 rounded bg-amber-50'/>
        </div>

        {/* Email */}
        <div>
          <label className='label p-2'>
            <span className='font-bold text-gray-950 text-base sm:text-xl label-text'>
              Email :
            </span>
          </label>
          <input id='email' type='email' onChange={handelInput}
            placeholder='Enter email' required
            className='w-full input input-bordered h-10 rounded bg-amber-50'/>
        </div>

        {/* Password */}
        <div>
          <label className='label p-2'>
            <span className='font-bold text-gray-950 text-base sm:text-xl label-text'>
              Password :
            </span>
          </label>
          <input id='password' type='password' onChange={handelInput}
            placeholder='Enter password' required
            className='w-full input input-bordered h-10 rounded bg-amber-50'/>
        </div>

        {/* Confirm Password */}
        <div>
          <label className='label p-2'>
            <span className='font-bold text-gray-950 text-base sm:text-xl label-text'>
              Confirm Password :
            </span>
          </label>
          <input id='confpassword' type='password' onChange={handelInput}
            placeholder='Enter Confirm password' required
            className='w-full input input-bordered h-10 rounded bg-amber-50'/>
        </div>

        {/* Gender */}
        <div className='flex gap-4 mt-2'>
          <label className='cursor-pointer label flex gap-2'>
            <span className='label-text font-semibold text-gray-950'>Male</span>
            <input type='checkbox'
              onChange={() => selectGender('male')}
              checked={inputData.gender === 'male'}
              className='checkbox checkbox-info'/>
          </label>
          <label className='cursor-pointer label flex gap-2'>
            <span className='label-text font-semibold text-gray-950'>Female</span>
            <input type='checkbox'
              onChange={() => selectGender('female')}
              checked={inputData.gender === 'female'}
              className='checkbox checkbox-info'/>
          </label>
        </div>

        <button type='submit'
          className='mt-4 self-center w-full sm:w-auto px-6 py-2 
                     bg-gray-950 text-lg hover:bg-gray-900 
                     text-white rounded-lg transition-transform 
                     hover:scale-105'>
          {loading ? "Loading..." : "Register"}
        </button>
      </form>

      <div className='pt-3'>
        <p className='text-sm font-semibold text-gray-800'>
          Already have an Account?{' '}
          <Link to='/login'>
            <span className='text-gray-950 font-bold underline 
                           cursor-pointer hover:text-green-950'>
              Login Now!!
            </span>
          </Link>
        </p>
      </div>
    </div>
  </div>
)
}

export default Register