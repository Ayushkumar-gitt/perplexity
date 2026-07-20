import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './Features/auth/pages/Login'
import Register from './Features/auth/pages/Register'
import HomePage from './Features/chats/pages/HomePage'
import { useAuth } from './Features/auth/hooks/useAuth'
import Protected from './Features/auth/components/Protected'

import ProfilePage from './Features/auth/pages/ProfilePage'

const AppRouter = () => {
    const auth = useAuth()

    useEffect(() => {
        auth.handleGetMe()
    }, [])
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/' element={<Protected> <HomePage /> </Protected>}></Route>
                <Route path='/profile' element={<Protected> <ProfilePage /> </Protected>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter
