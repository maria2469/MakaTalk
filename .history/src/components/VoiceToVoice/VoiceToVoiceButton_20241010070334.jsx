import React, { useState } from 'react';
import UserAiResponse from '../UserAiResponse/UserAiResponse';

const VoiceToVoiceButton = ({ selectedLanguage }) => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to handle API call to backend
  const handleApiCall = async (inputText) => {
    setIsProcessing(true); // Show the app is processing

    try {
      // Call your backend API to process the inputText
      const response = await fetch('/api/process-input', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          language: selectedLanguage, // Pass the selected language to the backend
        }),
      });

      const data = await response.json();
      setAiResponse(data.response); // Set the AI response
    } catch (error) {
      console.error('API call failed:', error);
    } finally {
      setIsProcessing(false); // Stop processing
    }
  };

  // Handle user input change
  const handleInputChange = (event) => {
    setUserInput(event.target.value); // Update user input state
  };

  // Handle form submit (text input)
  const handleSubmit = () => {
    if (userInput.trim()) {
      handleApiCall(userInput); // Trigger the API call
      setUserInput(''); // Clear the input field after submitting
    }
  };

  return (
    <div className="voice-to-voice-button">
      {/* Using UserAiResponse component */}
      <UserAiResponse
        aiResponse={aiResponse}
        userInput={userInput}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />

      {isProcessing && <p>Processing...</p>}
    </div>
  );
};

export default VoiceToVoiceButton;


