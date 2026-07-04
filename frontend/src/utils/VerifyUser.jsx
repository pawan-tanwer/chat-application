import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom';

const VerifyUser = () => {
 const{authUser} = useContext(AuthContext);

 return authUser? <Outlet/> : <Navigate to={'/login'}/>
}

export default VerifyUser
