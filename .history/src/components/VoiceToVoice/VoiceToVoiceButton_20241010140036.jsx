import React, { useState } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import UserAiResponse from '../UserAiResponse/UserAiResponse';
import TextToSpeech from '../TextToSpeech/TextToSpeech'; // Import the new TextToSpeech component

const VoiceToVoiceButton = ({ selectedLanguage }) => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);

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

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = () => {
    if (userInput.trim()) {
      handleApiCall(userInput);
      setUserInput('');
    }
  };

  const handleSpeechRecognition = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      console.error('SpeechRecognition is not supported in this browser');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = selectedLanguage;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcriptedText = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      handleApiCall(transcriptedText);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => console.error('SpeechRecognition error:', event.error);

    recognition.start();
  };

  return (
    <div className="voice-to-voice-button">
      <UserAiResponse
        aiResponse={aiResponse}
        userInput={userInput}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />

      <div className="flex mt-4">
        <button
          onClick={handleSpeechRecognition}
          className={`p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-green-500'} text-white`}
          disabled={isProcessing}
        >
          <FaMicrophone />
        </button>
      </div>

      {isProcessing && <p>Processing...</p>}

      {/* TextToSpeech Component to play AI response in the selected language */}
      {aiResponse && (
        <TextToSpeech text={aiResponse} selectedLanguage={selectedLanguage} />
      )}
    </div>
  );
};

export default VoiceToVoiceButton;

