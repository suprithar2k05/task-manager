// src/components/Navbar.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-semibold text-blue-600">Task Manager</Link>

      <div className="space-x-4">
        {!token ? (
          <>
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600 transition font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-gray-600 hover:text-blue-600 transition font-medium"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              className="text-gray-600 hover:text-blue-600 transition font-medium"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 transition font-medium"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
