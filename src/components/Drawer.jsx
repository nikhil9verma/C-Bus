import React from 'react';
import { FaBus } from 'react-icons/fa'; // Using react-icons for bus icons
import { Link } from 'react-router-dom';
const Drawer = (props) => {
  return (
    <div 
        className={` fixed z-50 top-16 left-0 h-full w-40 shadow-md  ${props.drawer ? 'translate-x-0' : '-translate-y-full'} transition-transform duration-300`}>
        <div className="p-4">
          
          <ul className="space-y-4 mt-3">
              <li className='flex items-center'>
                  <FaBus className="text-cyan-800 mr-2" />
                  <Link to="/Bus1" className="">Bus-35</Link>
              </li>
              <li className='flex items-center'>
                  <FaBus className="text-cyan-800 mr-2" />
                  <Link to="/Bus2" className="">Bus2</Link>
              </li>
              <li className='flex items-center'>
                  <FaBus className="text-cyan-800 mr-2" />
                  <Link to="/Bus3" className="">Bus3</Link>
              </li>
          </ul>
        </div>
      </div>
  )
}

export default Drawer;
