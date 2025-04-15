import React, { useState } from 'react';
import { FaMicrophone } from 'react-icons/fa'; // Import the microphone icon
import UserAiResponse from '../UserAiResponse/UserAiResponse';

const VoiceToVoiceButton = ({ selectedLanguage }) => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false); // State for listening status

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

  // Function to handle speech recognition (voice input)
  const handleSpeechRecognition = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      console.error('SpeechRecognition is not supported in this browser');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = selectedLanguage; // Set the recognition language
    recognition.interimResults = false; // Final result after user stops talking
    recognition.continuous = false; // Stop automatically after a phrase is recognized

    recognition.onstart = () => {
      setIsListening(true); // Update UI to show that it's listening
    };

    recognition.onresult = (event) => {
      const transcriptedText = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      
      // Send transcriptedText to the API
      handleApiCall(transcriptedText);
    };

    recognition.onend = () => {
      setIsListening(false); // Stop listening
    };

    recognition.onerror = (event) => {
      console.error('SpeechRecognition error:', event.error);
    };

    recognition.start();
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

      <div className="flex mt-4">
        <button
          onClick={handleSpeechRecognition}
          className={`p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-green-500'} text-white`}
          disabled={isProcessing} // Disable if processing
        >
          <FaMicrophone />
        </button>
      </div>

      {isProcessing && <p>Processing...</p>}
    </div>
  );
};

export default VoiceToVoiceButton;

