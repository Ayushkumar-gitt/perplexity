import React, { useRef, useEffect, useState } from 'react'

/* ── Icon Components ── */
const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)

const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)

const ComputerIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
)

const ChevronDownIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
)

const MicIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
)

const WaveIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 7v10M7 7v10M22 10v4M2 10v4" />
    </svg>
)

const ArrowUpIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
    </svg>
)

const CloseIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

const SearchInput = ({ value, onChange, onSend, placeholder = 'Type / for search modes', large = false, autoFocus = false }) => {
    const textareaRef = useRef(null)
    const fileInputRef = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null)

    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus()
        }
    }, [autoFocus])

    /* Auto-resize textarea */
    useEffect(() => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, large ? 200 : 150) + 'px'
    }, [value, large])

    const handleSend = () => {
        if (value.trim() || selectedFile) {
            onSend(value, selectedFile)
            setSelectedFile(null)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    return (
        <div className={`si-wrap ${large ? 'si-large' : ''}`}>
            {selectedFile && (
                <div className="si-file-preview">
                    <span className="si-file-name">{selectedFile.name}</span>
                    <button className="si-file-remove" onClick={() => setSelectedFile(null)} aria-label="Remove file">
                        <CloseIcon />
                    </button>
                </div>
            )}
            <textarea
                ref={textareaRef}
                id="chat-input"
                className="si-textarea"
                rows={1}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                aria-label="Type your message"
            />
            
            {/* Bottom Actions Row */}
            <div className="si-bottom-actions">
                <div className="si-actions-left">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleFileSelect}
                    />
                    <button className="si-icon-btn si-plus-btn" aria-label="Add attachment" type="button" onClick={() => fileInputRef.current?.click()}>
                        <PlusIcon />
                    </button>
                </div>
                
                <div className="si-actions-right">
                    <button
                        id="send-message-btn"
                        className={`si-send-btn ${value.trim() || selectedFile ? 'active' : ''}`}
                        onClick={handleSend}
                        aria-label="Send message"
                        type="button"
                        disabled={!value.trim() && !selectedFile}
                    >
                        <ArrowUpIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchInput
