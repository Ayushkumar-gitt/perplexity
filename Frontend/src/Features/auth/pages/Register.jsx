import React, { useState } from 'react'
import './Auth.css'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useSelector } from 'react-redux'

const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [formError, setFormError] = useState('')
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)
    const navigate = useNavigate()
    const { handleRegister } = useAuth()

    const submitHandler = async (e) => {
        e.preventDefault()
        setFormError('')

        if (!username.trim() || !email.trim() || !password) {
            setFormError('All fields are required')
            return
        }
        try {
            await handleRegister({ username, email, password })
            navigate('/login')
        } catch (err) {
            setFormError(err?.response?.data?.message || 'Registration failed. Please try again.')
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
                    <p className="auth-eyebrow">Create account</p>
                    <h1>Join Perplexity</h1>
                    <p className="auth-subtitle">
                        Sign up to start exploring with AI-powered search.
                    </p>
                </div>

                {formError && (
                    <p className="auth-message auth-message-error">{formError}</p>
                )}

                <form onSubmit={submitHandler} className="auth-form">
                    <label className="auth-field" htmlFor="register-username">
                        <span>Username</span>
                        <input
                            onInput={(e) => setUsername(e.target.value)}
                            id="register-username"
                            name="username"
                            type="text"
                            placeholder="Choose a username"
                            required
                        />
                    </label>

                    <label className="auth-field" htmlFor="register-email">
                        <span>Email</span>
                        <input
                            onInput={(e) => setEmail(e.target.value)}
                            id="register-email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            required
                        />
                    </label>

                    <label className="auth-field" htmlFor="register-password">
                        <span>Password</span>
                        <input
                            onInput={(e) => setPassword(e.target.value)}
                            id="register-password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            required
                        />
                    </label>

                    <button className="auth-button" type="submit">
                        Create Account
                    </button>

                    <p className="auth-link-row">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </form>
            </section>
        </main>
    )
}

export default Register
