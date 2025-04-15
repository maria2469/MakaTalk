import React from 'react';

const UserAiResponse = ({ aiResponse, userInput, onInputChange, onSubmit }) => {
    return (
        <div className="flex flex-col">
            <div className="ai-response mb-4">
                <p>{aiResponse}</p>
            </div>
            <textarea
                placeholder="Type your message here..."
                rows="4"
                value={userInput}
                onChange={onInputChange}
            />
            <button className="common-button mt-4" onClick={onSubmit}>
                Send
            </button>
        </div>
    );
};

export default UserAiResponse;
