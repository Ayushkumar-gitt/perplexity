import React from 'react'
import SearchInput from './SearchInput'

const WelcomeScreen = ({ message, onMessageChange, onSend }) => {
    return (
        <div className="ws-container">

            <div className="ws-content">
                {/* Logo */}
                <div className="ws-hero">
                    <h1 className="ws-title-serif">perplexity</h1>
                </div>

                {/* Search */}
                <div className="ws-search-wrapper">
                    <SearchInput
                        value={message}
                        onChange={onMessageChange}
                        onSend={(text, file) => onSend(text, file)}
                        placeholder="Type / for search modes"
                        large={true}
                        autoFocus={true}
                    />
                </div>
            </div>
        </div>
    )
}

export default WelcomeScreen
