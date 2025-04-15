import React, { useState } from 'react';
import { FaMicrophone } from 'react-icons/fa';

const VoiceToVoiceButton = ({ selectedLanguage }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Added to handle API processing state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [apiResponse, setApiResponse] = useState('');

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
    };

    recognition.onresult = (event) => {
      const transcriptedText = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      
      // Send transcriptedText to the backend for processing
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

  // Function to handle API call to backend
  const handleApiCall = async (transcriptedText) => {
    setIsProcessing(true); // Show the app is processing

    try {
      // Call your backend API to process the transcriptedText
      const response = await fetch('/api/process-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: transcriptedText,
          language: selectedLanguage, // Pass the selected language to the backend
        }),
      });

      const data = await response.json();

      // Set API response (assuming response text is returned in `data.response`)
      setApiResponse(data.response);

      // Call Text-to-Speech to read the response aloud
      handleTextToSpeech(data.response);
    } catch (error) {
      console.error('API call failed:', error);
    } finally {
      setIsProcessing(false); // Stop processing
    }
  };

  // Function to handle Text-to-Speech (TTS) to speak the API response
  const handleTextToSpeech = (text) => {
    if (!window.speechSynthesis) {
      console.error('SpeechSynthesis is not supported in this browser');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage; // Use the selected language for TTS
    setIsSpeaking(true); // Show that it's speaking

    utterance.onend = () => {
      setIsSpeaking(false); // Finished speaking
    };

    utterance.onerror = (event) => {
      console.error('SpeechSynthesis error:', event.error);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="voice-to-voice-button">
      <button
        onClick={handleSpeechRecognition}
        className={`p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-green-500'} text-white`}
        disabled={isSpeaking || isProcessing} // Disable the button if it's speaking or processing
      >
        <FaMicrophone />
      </button>
      {isProcessing && <p>Processing...</p>}
      <div className="mt-2">
        <p><strong>API Response:</strong> {apiResponse}</p>
      </div>
    </div>
  );
};

export default VoiceToVoiceButton;
