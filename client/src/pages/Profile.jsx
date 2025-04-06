// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react'
import api from '../services/api' // Axios instance with auth interceptor
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile')
        setUser(res.data.user)
      } catch (err) {
        console.error(err)
        navigate('/signin')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading profile...</div>
  }

  if (!user) {
    return <div className="text-center mt-10 text-red-500">User not found</div>
  }

  return (
    <div className="max-w-xl mx-auto p-4 mt-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Profile</h2>
      <div className="space-y-2">
        <div>
          <span className="font-semibold">Name:</span> {user.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-semibold">Joined:</span>{' '}
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}

export default Profile
