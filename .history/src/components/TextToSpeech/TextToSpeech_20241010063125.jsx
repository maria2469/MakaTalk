import React, { useState } from 'react';
import { FaMicrophone } from 'react-icons/fa';

const TextToSpeechButton = ({ selectedLanguage }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

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
    recognition.interimResults = true; // Provide real-time feedback
    recognition.continuous = false; // Stop automatically after a phrase is recognized

    recognition.onstart = () => {
      setIsListening(true); // Update UI to show that it's listening
    };

    recognition.onresult = (event) => {
      const transcriptedText = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setTranscript(transcriptedText);
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
    <div className="text-to-speech-button">
      <button
        onClick={handleSpeechRecognition}
        className={`p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-green-500'} text-white`}
      >
        <FaMicrophone />
      </button>
      <div className="mt-2">
        <p><strong>Transcript:</strong> {transcript}</p>
      </div>
    </div>
  );
};

export default TextToSpeechButton;
