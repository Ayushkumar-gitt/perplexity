import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/* ── Icons ── */
const CopyIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
)

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const ShareIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
)

const RefreshIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
)

const PerplexityLogo = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 8l4 4m0 0l4-4m-4 4v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const getMessageText = (message) => {
    if (typeof message?.content === 'string') return message.content
    if (message?.content && typeof message.content === 'object') {
        return message.content.content ?? message.content.message ?? message.content.text ?? ''
    }
    if (typeof message?.message === 'string') return message.message
    if (typeof message?.text === 'string') return message.text
    return ''
}

const FileIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
)

const isImageUrl = (url) => {
    if (!url) return false
    const cleanUrl = url.split('?')[0].split('#')[0]
    const ext = cleanUrl.substring(cleanUrl.lastIndexOf('.')).toLowerCase()
    return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)
}

const getFileName = (url) => {
    if (!url) return 'Attachment'
    const cleanUrl = url.split('?')[0].split('#')[0]
    const name = cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1)
    try {
        return decodeURIComponent(name)
    } catch (e) {
        return name
    }
}

const AnswerBlock = ({ userMessage, aiMessage }) => {
    const [copied, setCopied] = useState(false)

    const userText = getMessageText(userMessage)
    const aiText = getMessageText(aiMessage)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(aiText)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch { /* fallback */ }
    }

    return (
        <div className="ab-block">
            {/* User Question */}
            {(userText || userMessage?.fileUrl) && (
                <div className="ab-question-bubble">
                    {userMessage?.fileUrl && (
                        <div className="ab-attachment-wrapper">
                            {isImageUrl(userMessage.fileUrl) ? (
                                <img src={userMessage.fileUrl} alt="attachment" className="ab-attachment-img" />
                            ) : (
                                <a 
                                    href={userMessage.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="ab-attachment-file-link"
                                >
                                    <FileIcon />
                                    <span>{getFileName(userMessage.fileUrl)}</span>
                                </a>
                            )}
                        </div>
                    )}
                    {userText && <h2 className="ab-question">{userText}</h2>}
                </div>
            )}

            {/* AI Answer */}
            <div className="ab-answer-section">
                <div className="ab-answer-header">
                    <div className="ab-answer-avatar">
                        <PerplexityLogo />
                    </div>
                    <span className="ab-answer-label">Answer</span>
                </div>

                <div className="ab-answer-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                return inline ? (
                                    <code className="ab-inline-code" {...props}>{children}</code>
                                ) : (
                                    <div className="ab-code-block">
                                        <pre><code className={className} {...props}>{children}</code></pre>
                                    </div>
                                )
                            },
                            a({ children, href, ...props }) {
                                return <a href={href} target="_blank" rel="noopener noreferrer" className="ab-link" {...props}>{children}</a>
                            },
                            table({ children, ...props }) {
                                return <div className="ab-table-wrapper"><table className="ab-table" {...props}>{children}</table></div>
                            },
                            th({ children, ...props }) {
                                return <th className="ab-th" {...props}>{children}</th>
                            },
                            td({ children, ...props }) {
                                return <td className="ab-td" {...props}>{children}</td>
                            }
                        }}
                    >
                        {aiText}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Actions */}
            <div className="ab-actions">
                <button className="ab-action-btn" onClick={handleCopy} aria-label="Copy answer">
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button className="ab-action-btn" aria-label="Share">
                    <ShareIcon />
                    <span>Share</span>
                </button>
                <button className="ab-action-btn" aria-label="Rewrite">
                    <RefreshIcon />
                    <span>Rewrite</span>
                </button>
            </div>
        </div>
    )
}

export default AnswerBlock
