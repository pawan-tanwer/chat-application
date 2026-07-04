import React from 'react'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import{Routes,Route} from "react-router-dom"
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import VerifyUser from './utils/VerifyUser';

const App = () => {
  return (
    <div className='p-2 w-screen h-screen flex items-center justify-center bg-gray-600'>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route element={<VerifyUser/>}>
        <Route path='/' element={<Home/>}/>
        </Route>
      </Routes>
      <ToastContainer/>
    </div>
  )
}

export default App
