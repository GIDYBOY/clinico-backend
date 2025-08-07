import React from 'react'
import {Settings} from "lucide-react";
import { Input } from "@/ui/Input";
import { useAuth } from '@/context/AuthContext';
import { NavLink } from 'react-router-dom';


function Header() {
  const {isAuthenticated, logout} = useAuth();

  return (
    <header className='w-full shadow-md '>
      <div className=''>
        <div className="bg-gray-100 border-b px-4 py-3 flex justify-between items-center gap-10">
            <Settings color="black" className='w-[150px] h-[50px]'/>

            {!isAuthenticated ? 
            (
              <>
              <NavLink to="/" className="text-sm">Sign In</NavLink>
              </>
            ) :

            <div className="">
              <NavLink to='/dashboard' className="p-2 outline rounded-full mx-2">Dashboard</NavLink>
              <button onClick={logout}  className='p-2 text-md rounded-full outline'>SignOut</button>
            </div>
            }
        </div>
      </div>
    </header>
  )
}

export default Header