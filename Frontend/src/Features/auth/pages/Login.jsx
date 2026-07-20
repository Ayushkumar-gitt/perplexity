import React, { useState } from 'react'
import './Auth.css'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useSelector } from 'react-redux'

const Login = () => {
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [formError, setFormError] = useState('')
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)
    const navigate = useNavigate()
    const { handleLogin } = useAuth()

    const submitHandler = async (e) => {
        e.preventDefault()
        setFormError('')

        if (!email.trim() || !password) {
            setFormError('Email and password are required')
            return
        }
        try {
            await handleLogin({ email: email, password })
            navigate('/')
        } catch (err) {
            setFormError(err?.response?.data?.message || 'Login failed. Please try again.')
        }
    }

    if (!loading && user) {
        return navigate('/')
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                {/* Logo */}
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="14" cy="14" r="11" stroke="white" strokeWidth="1.5" />
                            <path d="M10 10l4 4m0 0l4-4m-4 4v7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="auth-logo-text">Perplexity</span>
                </div>

                <div className="auth-copy">
                    <p className="auth-eyebrow">Welcome back</p>
                    <h1>Log in to Perplexity</h1>
                    <p className="auth-subtitle">
                        Enter your credentials to access your account.
                    </p>
                </div>

                {formError && (
                    <p className="auth-message auth-message-error">{formError}</p>
                )}

                <form onSubmit={submitHandler} className="auth-form">
                    <label className="auth-field" htmlFor="login-email">
                        <span>Email</span>
                        <input
                            onInput={(e) => setemail(e.target.value)}
                            id="login-email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            required
                        />
                    </label>

                    <label className="auth-field" htmlFor="login-password">
                        <span>Password</span>
                        <input
                            onInput={(e) => setpassword(e.target.value)}
                            id="login-password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            required
                        />
                    </label>

                    <button className="auth-button" type="submit">
                        Log In
                    </button>

                    <p className="auth-link-row">
                        Don't have an account? <Link to="/register">Sign up</Link>
                    </p>
                </form>
            </section>
        </main>
    )
}

export default Login
