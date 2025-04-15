import React, { useEffect, useState } from 'react';

const TextToSpeech = ({ text, selectedLanguage }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Function to handle text-to-speech
  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage; // Set the language for the speech
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Text-to-speech is not supported in this browser.');
    }
  };

  // Automatically trigger text-to-speech if text changes and there's a response
  useEffect(() => {
    if (text) {
      handleTextToSpeech();
    }
  }, [text]);

  return (
    <div className="text-to-speech">
      <button
        onClick={handleTextToSpeech}
        className={`p-2 rounded ${isSpeaking ? 'bg-red-500' : 'bg-blue-500'} text-white`}
        disabled={isSpeaking}
      >
        {isSpeaking ? 'Speaking...' : 'Play Response'}
      </button>
    </div>
  );
};

export default TextToSpeech;
