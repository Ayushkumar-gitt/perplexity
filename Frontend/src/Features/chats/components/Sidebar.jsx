import React from 'react'
import { useAuth } from '../../auth/hooks/useAuth'

/* ── Icons ── */
const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)

const HistoryIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)

const ChatBubbleIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
)

const CollapseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
)

const BellIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
)

const MenuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
)

const UpgradeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)

const NAV_ITEMS = [
    { key: 'new', label: 'New', icon: <PlusIcon />, isNew: true },
]

const LogOutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
)

const Sidebar = ({
    chats,
    currentChatId,
    onOpenChat,
    onNewThread,
    collapsed,
    onToggleCollapse,
    mobileOpen,
    onCloseMobile,
    userName
}) => {
    const { handleLogout } = useAuth()
    return (
        <>
            {/* Mobile overlay backdrop */}
            {mobileOpen && (
                <div className="sb-backdrop" onClick={onCloseMobile} />
            )}

            <aside className={`sb-sidebar ${collapsed ? 'sb-collapsed' : ''} ${mobileOpen ? 'sb-mobile-open' : ''}`}>
                {/* Top row: Logo + Collapse */}
                <div className="sb-header">
                    <div className="sb-logo-icon" onClick={collapsed ? onToggleCollapse : onNewThread}>
                        <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 5 L30 40 L5 50 L30 60 L50 95 L70 60 L95 50 L70 40 Z" fill="currentColor" />
                            <circle cx="50" cy="50" r="8" fill="#191A1A" />
                        </svg>
                    </div>
                    {!collapsed && (
                        <button className="sb-collapse-btn" onClick={onToggleCollapse} aria-label="Collapse sidebar" type="button">
                            <CollapseIcon />
                        </button>
                    )}
                    {collapsed && (
                        <button className="sb-collapse-btn" onClick={onToggleCollapse} aria-label="Expand sidebar" type="button">
                            <CollapseIcon />
                        </button>
                    )}
                </div>

                {/* Primary Nav */}
                <nav className="sb-nav" aria-label="Main navigation">
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.key}
                            className={`sb-nav-item ${item.isNew ? 'sb-nav-new' : ''}`}
                            onClick={item.isNew ? onNewThread : undefined}
                            type="button"
                            title={collapsed ? item.label : undefined}
                        >
                            <span className="sb-nav-icon">{item.icon}</span>
                            {!collapsed && <span className="sb-nav-label">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {/* Divider */}
                <div className="sb-divider"></div>

                {/* History */}
                <div className="sb-history-header">
                    <span className="sb-history-icon"><HistoryIcon /></span>
                    {!collapsed && <span className="sb-history-label">History</span>}
                </div>

                {/* Chat List */}
                <div className="sb-chat-list" aria-label="Recent chats">
                    {Object.values(chats).map(chat => (
                        <button
                            key={chat._id || chat.id}
                            className={`sb-chat-item ${currentChatId === (chat._id || chat.id) ? 'active' : ''}`}
                            onClick={() => onOpenChat(chat.id || chat._id, chats)}
                            aria-current={currentChatId === (chat._id || chat.id) ? 'page' : undefined}
                            aria-label={chat.title}
                            id={`chat-item-${chat.id || chat._id}`}
                            type="button"
                            title={collapsed ? chat.title : undefined}
                        >
                            {collapsed ? (
                                <span className="sb-chat-icon"><ChatBubbleIcon /></span>
                            ) : (
                                <span className="sb-chat-title">{chat.title}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Footer / User */}
                <div className="sb-footer">
                    <div 
                        className="sb-user" 
                        onClick={() => window.location.href = '/profile'}
                        role="button"
                        tabIndex={0}
                        title="View Profile"
                    >
                        <div className="sb-avatar">
                            {userName ? userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        {!collapsed && (
                            <div className="sb-user-info">
                                <span className="sb-user-name">{userName || 'User'}</span>
                            </div>
                        )}
                    </div>
                    {!collapsed && (
                        <button 
                            className="sb-bell-btn" 
                            type="button" 
                            aria-label="Logout"
                            onClick={async () => {
                                await handleLogout()
                                window.location.href = '/login';
                            }}
                            title="Logout"
                        >
                            <LogOutIcon />
                        </button>
                    )}
                </div>
            </aside>
        </>
    )
}

/* Mobile hamburger button */
export const MobileMenuButton = ({ onClick }) => (
    <button className="sb-mobile-menu-btn" onClick={onClick} aria-label="Open menu" type="button">
        <MenuIcon />
    </button>
)

export default Sidebar
