import React, { useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import {auth} from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { addUser,removeUser } from '../utils/userSlice';

const Header = () => {

  const user = useSelector(store => store.user)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });  }

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const {uid,email,displayName,photoURL} = user;
        dispatch(addUser({uid:uid,email:email,displayName:displayName,photoURL:photoURL}))
        navigate("/browse")
      } else {
        dispatch(removeUser())
        // User is signed out
        navigate("/")
      }
    });
    return ()=> unsubscribe();
  },[])

  return (
    <div className="absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-40 flex justify-between">
        <img className='w-44' src='/assets/netflix-logo.png' alt='logo'/>
        {user &&  <div className="flex p-4">
          <img src={user?.photoURL} className='w-10 h-10 mx-3 rounded-full'/>
          <button onClick={handleSignOut} className='text-white'>Sign Out</button>
        </div>}
    </div>
  )
}

export default Header