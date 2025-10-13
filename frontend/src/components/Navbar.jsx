import React from 'react'

const Navbar = () => {
  return (
    <div>
        <nav className='flex items-center justify-between p-4 bg-gray-800 h-20 text-white'>
            <div className='text-2xl font-bold'>StreamFusion</div>
            <ul className='flex items-center gap-4'>
            <li className='hover:text-blue-400 cursor-pointer'>Home</li>
            <li className='hover:text-blue-400 cursor-pointer'>About</li>
            <li className='hover:text-blue-400 cursor-pointer'>Contact</li>
            <li className='hover:text-blue-400 cursor-pointer'>Login</li>
            </ul>
        </nav>
    </div>
  )
}

export default Navbar