import React, { useState } from 'react';
import { FaMicrophone } from 'react-icons/fa';

const VoiceToVoiceButton = ({ selectedLanguage }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Added to handle API processing state
  const [apiResponse, setApiResponse] = useState('');
  const [userInput, setUserInput] = useState('');
  const [inputMode, setInputMode] = useState('text'); // Mode: 'text' or 'voice'

  // Function to handle voice recognition (Speech-to-Text)
  const handleSpeechRecognition = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      console.error('SpeechRecognition is not supported in this browser');
      return;
    }

    // Initialize the speech recognition object based on browser compatibility
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = selectedLanguage; // Set the recognition language
    recognition.interimResults = false; // Final result after user stops talking
    recognition.continuous = false; // Stop automatically after a phrase is recognized

    recognition.onstart = () => {
      setIsListening(true); // Update UI to show that it's listening
      setInputMode('voice'); // Set mode to voice when listening starts
    };

    recognition.onresult = (event) => {
      const transcriptedText = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      
      // Send transcriptedText to the backend for processing
      handleApiCall(transcriptedText, 'voice');
    };

    recognition.onend = () => {
      setIsListening(false); // Stop listening
    };

    recognition.onerror = (event) => {
      console.error('SpeechRecognition error:', event.error);
    };

    recognition.start();
  };

  // Function to handle API call to backend
  const handleApiCall = async (inputText, mode = 'text') => {
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

      setApiResponse(data.response); // Set the API response in state

      // If the input was voice, use Text-to-Speech (TTS) to read the response aloud
      if (mode === 'voice') {
        handleTextToSpeech(data.response);
      }
    } catch (error) {
      console.error('API call failed:', error);
    } finally {
      setIsProcessing(false); // Stop processing
    }
  };

  // Function to handle Text-to-Speech (TTS) for voice responses
  const handleTextToSpeech = (text) => {
    if (!window.speechSynthesis) {
      console.error('SpeechSynthesis is not supported in this browser');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage; // Use the selected language for TTS

    utterance.onerror = (event) => {
      console.error('SpeechSynthesis error:', event.error);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Function to handle text input submission
  const handleTextSubmit = (e) => {
    e.preventDefault();
    setInputMode('text'); // Set mode to text when submitting text input
    handleApiCall(userInput, 'text'); // Send text input to API
    setUserInput(''); // Clear input field
  };

  return (
    <div className="voice-to-voice-button">
      {/* Text Input Form */}
      <form onSubmit={handleTextSubmit} className="mb-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your question..."
          className="border border-gray-300 rounded p-2 mr-2"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>

      {/* Voice Input Button */}
      <button
        onClick={handleSpeechRecognition}
        className={`p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-green-500'} text-white`}
        disabled={isProcessing} // Disable the button if it's processing
      >
        <FaMicrophone />
      </button>

      {isProcessing && <p>Processing...</p>}

      {/* Display Response */}
      <div className="mt-2">
        <p><strong>AI Response:</strong> {apiResponse}</p>
      </div>
    </div>
  );
};

export default VoiceToVoiceButton;

