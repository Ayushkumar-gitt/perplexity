import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Protected = ({ children }) => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#191A1A',
                color: '#9AA0A6',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '15px',
                gap: '12px'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '3px solid rgba(32,184,205,0.15)',
                    borderTopColor: '#20B8CD',
                    animation: 'spin 0.8s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                Loading...
            </div>
        )
    }
    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default Protected
