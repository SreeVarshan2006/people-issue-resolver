import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import BASE_URL from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  // Set axios default auth header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // On mount, restore user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      setToken(savedToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
    }
    setLoading(false)
  }, [])

  const saveAuth = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', jwtToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`
  }

  const register = async (name, mobile, password, email = '') => {
    const res = await axios.post(`${BASE_URL}/api/auth/register`, { name, mobile, password, email })
    saveAuth(res.data.user, res.data.token)
    return res.data
  }

  const login = async (mobile, password) => {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, { mobile, password })
    saveAuth(res.data.user, res.data.token)
    return res.data
  }

  const adminLogin = async (username, password) => {
    const res = await axios.post(`${BASE_URL}/api/auth/admin/login`, { username, password })
    saveAuth(res.data.user, res.data.token)
    return res.data
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const isAdmin = user?.role === 'admin'
  const isCitizen = user?.role === 'citizen'

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, adminLogin, logout, isAdmin, isCitizen }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
