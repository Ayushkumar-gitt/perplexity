import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import Sidebar, { MobileMenuButton } from '../../chats/components/Sidebar'
import '../../chats/style/Homepage.css' // Reuse the same layout classes

const ProfilePage = () => {
    const user = useSelector(state => state.auth.user)
    const navigate = useNavigate()
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

    // Dummy data for chats to pass to Sidebar
    const chats = {}
    
    return (
        <div className="hp-root">
            <MobileMenuButton onClick={() => setMobileMenuOpen(true)} />
            
            <Sidebar
                chats={chats}
                currentChatId={null}
                onOpenChat={() => navigate('/')}
                onNewThread={() => navigate('/')}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                mobileOpen={mobileMenuOpen}
                onCloseMobile={() => setMobileMenuOpen(false)}
                userName={user?.username || user?.name || user?.email || ''}
            />

            <main className="hp-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    background: 'rgba(36,38,38,0.80)',
                    padding: '40px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
                    width: 'min(100%, 500px)',
                    margin: '20px',
                    backdropFilter: 'blur(16px)',
                    animation: 'fadeIn 0.5s ease forwards'
                }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px', color: '#E8EAED' }}>
                        Profile Settings
                    </h1>
                    <p style={{ color: '#9AA0A6', marginBottom: '32px' }}>
                        Manage your account details and preferences.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#9AA0A6', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                                Avatar
                            </label>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #20B8CD, #1490a0)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                fontWeight: '700',
                                color: '#fff',
                                boxShadow: '0 0 20px rgba(32,184,205,0.2)'
                            }}>
                                {(user?.username || user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#9AA0A6', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                                Username
                            </label>
                            <div style={{
                                padding: '14px',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.10)',
                                borderRadius: '12px',
                                color: '#E8EAED',
                                fontSize: '15px'
                            }}>
                                {user?.username || 'Not provided'}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#9AA0A6', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                                Email
                            </label>
                            <div style={{
                                padding: '14px',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.10)',
                                borderRadius: '12px',
                                color: '#E8EAED',
                                fontSize: '15px'
                            }}>
                                {user?.email || 'Not provided'}
                            </div>
                        </div>


                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProfilePage
