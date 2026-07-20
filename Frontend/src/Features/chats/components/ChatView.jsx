import React, { useEffect, useRef } from 'react'
import AnswerBlock from './AnswerBlock'
import SearchInput from './SearchInput'

const getMessageText = (message) => {
    if (typeof message?.content === 'string') return message.content
    if (message?.content && typeof message.content === 'object') {
        return message.content.content ?? message.content.message ?? message.content.text ?? ''
    }
    if (typeof message?.message === 'string') return message.message
    if (typeof message?.text === 'string') return message.text
    return ''
}

const ChatView = ({ messages, message, onMessageChange, onSend, isLoading }) => {
    const scrollRef = useRef(null)

    /* Pair user/ai messages together */
    const pairs = []
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].role === 'user') {
            const ai = messages[i + 1]?.role === 'ai' ? messages[i + 1] : null
            pairs.push({ user: messages[i], ai })
            if (ai) i++ // skip the ai message
        } else if (messages[i].role === 'ai') {
            // orphan AI message
            pairs.push({ user: null, ai: messages[i] })
        }
    }

    /* Auto-scroll on new messages */
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [messages.length, isLoading])

    return (
        <div className="cv-container">
            {/* Scrollable content */}
            <div className="cv-scroll" ref={scrollRef}>
                <div className="cv-content">
                    {pairs.map((pair, i) => (
                        <div key={i} className="cv-pair">
                            {pair.user && pair.ai ? (
                                <AnswerBlock
                                    userMessage={pair.user}
                                    aiMessage={pair.ai}
                                />
                            ) : pair.user ? (
                                /* User message waiting for AI response */
                                <div className="cv-pending">
                                    <div className="ab-question-bubble">
                                        <h2 className="ab-question">{getMessageText(pair.user)}</h2>
                                    </div>
                                    {isLoading && (
                                        <div className="cv-thinking">
                                            <div className="cv-thinking-dots">
                                                <span></span><span></span><span></span>
                                            </div>
                                            <span className="cv-thinking-text">Searching the web...</span>
                                        </div>
                                    )}
                                </div>
                            ) : pair.ai ? (
                                /* Orphan AI message */
                                <AnswerBlock
                                    userMessage={{ content: '' }}
                                    aiMessage={pair.ai}
                                />
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom input */}
            <div className="cv-input-area">
                <div className="cv-input-inner">
                    <SearchInput
                        value={message}
                        onChange={onMessageChange}
                        onSend={onSend}
                        placeholder="Ask a follow-up..."
                    />
                </div>
            </div>
        </div>
    )
}

export default ChatView
