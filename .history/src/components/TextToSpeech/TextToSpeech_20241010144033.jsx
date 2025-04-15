import React, { useEffect, useState } from 'react';
import { FaVolumeUp } from 'react-icons/fa';
import Te

const TextToSpeech = ({ text, selectedLanguage }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSpeak = () => {
        if (!text) return;

        // Initialize speech synthesis
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        // Set language for speech synthesis
        utterance.lang = selectedLanguage;

        // Set speaking state to true when speaking starts
        utterance.onstart = () => {
            setIsSpeaking(true);
        };

        // Reset speaking state when speaking ends
        utterance.onend = () => {
            setIsSpeaking(false);
        };

        // Cancel any ongoing speech before starting a new one
        if (synth.speaking) {
            synth.cancel();
        }

        // Start speaking
        synth.speak(utterance);
    };

    return (
        <div className="text-to-speech flex items-center justify-center p-4 rounded-lg shadow-md bg-white">
            <button
                onClick={handleSpeak}
                className={`p-3 rounded-full transition-colors duration-200 ${isSpeaking ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                disabled={isSpeaking}
                aria-label="Play Audio" // Added for accessibility
            >
                <FaVolumeUp size={20} />
            </button>
            <p className="ml-3 text-gray-800 font-medium">{isSpeaking ? `Speaking: ${text}` : 'Click the icon to listen.'}</p>
        </div>
    );
};

export default TextToSpeech;


