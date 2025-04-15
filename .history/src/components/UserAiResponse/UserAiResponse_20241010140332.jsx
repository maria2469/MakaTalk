import React, { useState } from 'react';
import UserAiResponse from '../UserAiResponse/UserAiResponse';
import TextToSpeech from '../TextToSpeech/TextToSpeech';

const VoiceToVoiceButton = ({ selectedLanguage }) => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to handle API call to backend
  const handleApiCall = async (inputText) => {
    setIsProcessing(true);

    try {
      const response = await fetch('/api/process-input', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          language: selectedLanguage,
        }),
      });

      const data = await response.json();
      setAiResponse(data.response);
    } catch (error) {
      console.error('API call failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle text input change
  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  // Handle form submit
  const handleSubmit = () => {
    if (userInput.trim()) {
      handleApiCall(userInput);
      setUserInput('');
    }
  };

  // Handle voice input
  const handleVoiceInput = (transcriptedText) => {
    setUserInput(transcriptedText); // Populate input field with the transcribed voice input
    handleApiCall(transcriptedText); // Send the transcribed voice input for processing
  };

  return (
    <div className="voice-to-voice-button">
      <UserAiResponse
        aiResponse={aiResponse}
        userInput={userInput}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        selectedLanguage={selectedLanguage}
        handleVoiceInput={handleVoiceInput} // Pass the voice input handler
      />

      {isProcessing && <p>Processing...</p>}

      {/* TextToSpeech Component to play AI response */}
      {aiResponse && (
        <TextToSpeech text={aiResponse} selectedLanguage={selectedLanguage} />
      )}
    </div>
  );
};

export default VoiceToVoiceButton;
