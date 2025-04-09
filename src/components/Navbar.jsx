import React from 'react';
import { Link } from 'react-router-dom';
const Navbar = (props) => {
  return (
    <nav className='fixed top-0 w-full flex items-center justify-between bg-white shadow-md py-4 px-6 z-50 border-2 border-lime-500'>
        <div className="logo">
            <button 
            onClick={props.toggle} 
            className="bg-lime-600 border-2 border-lime-500 ml-4 text-white px-4 py-2 rounded">
                <b>BUSES</b>
            </button>
        </div>
        <div className="logo">
            <span className='text-3xl ml-16 pl-12'><b>CBUS</b></span>
        </div>
        <ul className="flex  gap-8 mx-9">
            <li className=''>
                <Link to="/">Home</Link>
            </li>
            
            <li>
                <Link to="/About">About</Link>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar;
