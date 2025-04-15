import React, { useEffect, useState } from 'react';

const TextToSpeech = ({ text, selectedLanguage }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Function to handle text-to-speech
  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      // Stop any current utterances before starting a new one
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Set the language for the speech, with a fallback to English if the selected language is not supported
      utterance.lang = selectedLanguage || 'en-US';

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        setIsSpeaking(false);
      };

      // Start speaking the utterance
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Text-to-speech is not supported in this browser.');
    }
  };

  // Automatically trigger text-to-speech when text changes
  useEffect(() => {
    if (text) {
      handleTextToSpeech();
    }
  }, [text]); // Dependency array ensures this runs when text updates

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
