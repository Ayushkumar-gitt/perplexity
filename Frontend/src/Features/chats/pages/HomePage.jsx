import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { setCurrentChatId } from '../chat.slice'
import Sidebar, { MobileMenuButton } from '../components/Sidebar'
import WelcomeScreen from '../components/WelcomeScreen'
import ChatView from '../components/ChatView'
import '../style/Homepage.css'

const HomePage = () => {
    const dispatch = useDispatch()
    const chat = useChat()

    const chats = useSelector((state) => state.chat.chats)
    const currentChatId = useSelector((state) => state.chat.currentChatId)
    const isLoading = useSelector((state) => state.chat.isLoading)
    const user = useSelector((state) => state.auth.user)

    const [message, setMessage] = useState('')
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const currentMessages = currentChatId && chats[currentChatId]
        ? chats[currentChatId].messages
        : []

    /* Socket init & load chats */
    useEffect(() => {
        chat.initSocketConnection()
        chat.handleGetChats()
    }, [])

    /* Close mobile menu on chat change */
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [currentChatId])

    /* Send message */
    const handleSend = useCallback((directMessage, file = null) => {
        const text = directMessage || message
        if (!text.trim() && !file) return
        chat.handleSendMessages({ message: text, chatId: currentChatId, file })
        setMessage('')
    }, [message, currentChatId, chat])

    /* Open existing chat */
    const handleOpenChat = useCallback((chatId, chatsObj) => {
        chat.handleOpenChat(chatId, chatsObj)
    }, [chat])

    /* New thread */
    const handleNewThread = useCallback(() => {
        dispatch(setCurrentChatId(null))
        setMessage('')
        setMobileMenuOpen(false)
    }, [dispatch])

    return (
        <div className="hp-root">
            {/* Mobile menu button */}
            <MobileMenuButton onClick={() => setMobileMenuOpen(true)} />

            {/* Sidebar */}
            <Sidebar
                chats={chats}
                currentChatId={currentChatId}
                onOpenChat={handleOpenChat}
                onNewThread={handleNewThread}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                mobileOpen={mobileMenuOpen}
                onCloseMobile={() => setMobileMenuOpen(false)}
                userName={user?.username || user?.name || user?.email || ''}
            />

            {/* Main Content */}
            <main className="hp-main" aria-label="Chat">
                {currentChatId && currentMessages.length > 0 ? (
                    <ChatView
                        messages={currentMessages}
                        message={message}
                        onMessageChange={setMessage}
                        onSend={(directMsg, file) => handleSend(directMsg, file)}
                        isLoading={isLoading}
                    />
                ) : (
                    <WelcomeScreen
                        message={message}
                        onMessageChange={setMessage}
                        onSend={(directMsg, file) => handleSend(directMsg, file)}
                    />
                )}
            </main>
        </div>
    )
}

export default HomePage
